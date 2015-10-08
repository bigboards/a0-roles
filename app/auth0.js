angular.module('auth0.services', [])
    .factory('Users', ['$resource', 'settings', function($resource, settings) {

        return $resource('https://blonde.auth0.com/api/v2/users/:id', { id: '@id' },
            {
                'update': { method: 'PATCH'}
            }
        );
    }]);
