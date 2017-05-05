Form2Ctrl.$inject = ['$scope','testService'];
function Form2Ctrl($scope, testService){
  
  $scope.isShow = function(field) {
    return  field.$dirty;
  };

  $scope.submit = function() {
    var data = _.clone($scope.formData);
    testService.add(data);
    // 通知表格刷新
    $scope.$emit('submitted', testService.get());
  };

}

angular.module('controller').controller("Form2Ctrl", Form2Ctrl);