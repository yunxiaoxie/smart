
/*
 * login controller
 */
LoginController.$inject = ['$rootScope', '$scope', 'LoginService', '$stateParams', '$state'];

function LoginController($rootScope, $scope, LoginService, $stateParams, $state) {
    
    $scope.login = function () {
        if ($scope.formData.uname && $scope.formData.pwd) {
            let arg = $scope.formData.uname + "/" + $scope.formData.pwd;
            LoginService.login(arg).then(function (data) {
                //$scope.mainData = data.result;
                $scope.goMain();
            });
        }
    }

    $scope.goMain = function () {
        $state.go('main');
    }
}


angular.module('controller')
    .controller("LoginController", LoginController);



