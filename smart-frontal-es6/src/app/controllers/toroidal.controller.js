
/*
 * ToroidalCtrl controller
 */
ToroidalCtrl.$inject = ['$scope'];

function ToroidalCtrl($scope) {
    
    $scope.percent = 33.33;
}


angular.module('controller')
    .controller("ToroidalCtrl", ToroidalCtrl);
