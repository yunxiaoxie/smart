/**主业务模块*/
angular.module('iRestApp.mainControllers', [])
/**表单示例控制器*/
.controller('FormCtrl', ['$scope','$filter', '$http', 'UtilsService', 'AlertService', function($scope, $filter, $http, UtilsService, AlertService){
  var dateFilter = $filter('date');
  $scope.submitted = false;
  $scope.isShow = function(field) {
    return  $scope.submitted || field.$dirty;
  };

  $scope.slt = '请选择';
  $scope.select = function(item, event) {
    console.log(item,event);
    $scope.slt = item;
  }

  /**提交表单*/
  $scope.submit = function() {
    $scope.submitted = true;
    AlertService.alert("This is a warning.", "warning");
    AlertService.alert("This is an error!", "danger");
  	console.log(dateFilter($scope.formData.birthday, 'yyyy-MM-dd'));
    $http.post('/formSave', $scope.formData).success(function(data){
        alert(JSON.stringify(data));
    }).error(function(data) {
        alert("failure message:" + JSON.stringify({data:data}));
    });

  };

}])
;