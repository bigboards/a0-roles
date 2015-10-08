angular.module('auth0.users', ['auth0.services'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/users', {
                templateUrl: 'app/users/list.html',
                controller: 'UserListController',
                resolve: {
                    users: ['Users', function(Users) {
                        return Users.query();
                    }]
                }
            })
            .when('/users/:id', {
                templateUrl: 'app/users/detail.html',
                controller: 'UserDetailController',
                resolve: {
                    user: ['Users', '$route', function(Users, $route) {
                        var id = $route.current.params.id;
                        return Users.get({id: id});
                    }]
                }
            });
    }])
    .controller('UserListController', ['$scope', '$location', 'users',
        function($scope, $location, users) {
            users.$promise.then(function(data) {
                $scope.users = data;
            });

            $scope.goto = function(user) {
                $location.path('/users/' + user.user_id);
            };
        }
    ])
    .controller('UserDetailController', ['$scope', '$location', '$mdDialog', 'Users', 'user',
        function($scope, $location, $mdDialog, Users, user) {
            user.$promise.then(function(data) {
                $scope.user = data;
            });

            $scope.removeRealm = function(realm) {
                delete $scope.user.app_metadata.stores[realm];

                persistChanges($scope.user);
            };

            $scope.save = function() {

            };

            $scope.showRealmEditDialog = function(ev, realmName, realm) {
                $mdDialog.show({
                    controller: 'UserRealmEditDialogController',
                    templateUrl: 'app/users/realm-edit-dialog.part.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true,
                    locals: {
                        realmName: realmName,
                        realm: realm
                    }
                })
                .then(function(realm) {
                        $scope.user.app_metadata.stores[realmName] = realm;

                        persistChanges($scope.user);
                }, function() { });
            };

            $scope.showRealmCreateDialog = function(ev) {
                $mdDialog.show({
                    controller: 'UserRealmCreateDialogController',
                    templateUrl: 'app/users/realm-create-dialog.part.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true
                })
                .then(function(realmInfo) {
                    $scope.user.app_metadata.stores[realmInfo.name] = realmInfo.details;

                    persistChanges($scope.user);
                }, function() { });
            };

            function persistChanges(user) {
                Users.update({id: user.user_id}, {app_metadata: user.app_metadata});
            }
        }
    ])
    .controller('UserRealmEditDialogController', ['$scope', '$mdDialog', 'realmName', 'realm',
        function($scope, $mdDialog, realmName, realm) {
            $scope.realm = realm;
            $scope.realmName = realmName;

            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.save = function() {
                $mdDialog.hide($scope.realm);
            };
        }
    ])
    .controller('UserRealmCreateDialogController', ['$scope', '$mdDialog',
        function($scope, $mdDialog) {
            $scope.details = { roles: [] };
            $scope.name = '';

            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.save = function() {
                $mdDialog.hide({
                    name: $scope.name,
                    details: $scope.details
                });
            };
        }
    ]);