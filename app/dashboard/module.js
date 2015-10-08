angular.module('auth0.dashboard', [])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/dashboard/view.html',
                controller: 'DashboardController'
            });
    }])
    .controller('DashboardController', ['$scope', function($scope) {
    
    }]);