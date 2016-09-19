/**主业务模块*/
angular.module('iRestApp.mainControllers', [])
/**表单示例控制器*/
.controller('FormCtrl', ['$scope','$filter', '$http', 'UtilsService', 'AlertService', function($scope, $filter, $http, UtilsService, AlertService){
  var dateFilter = $filter('date');
  $scope.submitted = false;
  $scope.isShow = function(field) {
    return  $scope.submitted || field.$dirty;
  };

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
.controller('Form2Ctrl', ['$scope','testService', 'AlertService', function($scope, testService, AlertService){
  
  $scope.isShow = function(field) {
    return  field.$dirty;
  };

  $scope.submit = function() {
    var data = _.clone($scope.formData);
    testService.add(data);
    // 通知表格刷新
    $scope.$emit('submitted', testService.get());
  };

}])
.controller('TableCtrl', ['$scope','$rootScope','testService', 'AlertService', function($scope, $rootScope, testService, AlertService){
  
  $rootScope.$on('submitted', function(event, data) {
    $scope.data = data;
  })

}])
;