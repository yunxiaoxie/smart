HomeController.$inject = ['$scope', '$location', 'permissions', '$rootScope', '$http', '$q'];

function HomeController($scope, $location, permissions, $rootScope, $http, $q) {
    $scope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        /*let permission = toState.permission;
        $rootScope.curentuser.then(function (cu) {
            if (_.isString(permission) && !permissions.hasPermission(cu, permission))
                if (!IsDebug) {
                    $location.path('/main/unauthorized');
                }

            // console.log("无权限");
        });*/
    });
    $scope.get_currentuser = function () {
        var deferred = $q.defer();
        $rootScope.curentuser = deferred.promise;
        $http({
            method: 'GET',
            url: '/currentuser'
        }).then(function successCallback(response) {
            deferred.resolve(response.data);
            $scope.set_currentuser_name(response.data);
        }, function errorCallback(response) {
            deferred.resolve({});
        });
        return $rootScope.curentuser;
    };
    $scope.set_currentuser_name = function (d) {
        $rootScope.currentuser_name = d.name;
        $rootScope.currentuser_email = d.email;
    };
    //$scope.get_currentuser();

}

angular.module('controller').controller("HomeController", HomeController);