angular.module('auth0.token', ['angular-storage'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/token/view.html',
                controller: 'TokenController'
            });
    }])
    .controller('TokenController', ['$rootScope', '$scope', '$location', 'store', function($rootScope, $scope, $location, store) {
        $scope.model = {
            token: store.get('token')
        };

        $scope.hasToken = (store.get('token') != null);

        $scope.useToken = function() {
            store.set('token', $scope.model.token);
            $rootScope.$emit('token:changed', $scope.model.token);
            $location.path('/users');
        };

        $scope.eraseToken = function() {
            store.remove('token');
            $scope.hasToken = false;
            $rootScope.$emit('token:changed', null);
        };
    }]);