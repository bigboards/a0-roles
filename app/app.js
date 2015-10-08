var app = angular.module( 'auth0-admin', [
    'ngRoute',
    'ngResource',
    'ngMaterial',
    'webStorageModule',

    'angular-storage',
    'angular-jwt',

    'auth0.token',
    'auth0.users'
]);

app.factory('settings', ['webStorage', function(webStorage) {
    return webStorage.session.get('settings');
}]);

app.config(['$routeProvider', '$sceProvider', '$mdThemingProvider', '$httpProvider',
    function($routeProvider, $sceProvider, $mdThemingProvider, $httpProvider) {

    $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey')
        .accentPalette('teal');

    $routeProvider
        .otherwise({
            redirectTo: '/'
        });
}]);

app.run(function($rootScope, $http, store, jwtHelper, $location) {
    $rootScope.$on('token:changed', function(event, token) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + token;
    });

    // -- This event gets triggered on refresh or URL change
    $rootScope.$on('$locationChangeStart', function() {
        if (store.get('token')) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + store.get('token');
            $rootScope.$emit('token:changed', store.get('token'));
        }

        if (! $http.defaults.headers.common.Authorization) {
            $location.path('/');
        }
    });
});

app.controller('ApplicationController', ['$rootScope', '$scope', '$location', '$mdSidenav', '$http', 'store',
    function($rootScope, $scope, $location, $mdSidenav, $http, store) {
        $scope.hasToken = $http.defaults.headers.common.Authorization != null;

        $rootScope.$on('token:changed', function(event, token) {
            $scope.hasToken = $http.defaults.headers.common.Authorization != null;
        });

        $scope.goto = function(path) {
            $location.path(path);
        };
}]);