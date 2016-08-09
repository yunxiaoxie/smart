/**
*iRestApp基础服务。
*author: yunxiaoxie
*date: 2016-7-28
*/

'use strict';
angular.module('iRestApp.basicServer', [])
/**表单示例控制器*/
.controller('FormCtrl', ['$scope','$filter', '$http', function($scope, $filter, $http){
  //var dateFilter = $filter('date');
  $scope.submitted = false;
  $scope.isShow = function(field) {
    return  $scope.submitted || field.$dirty;
  };

  /**提交表单*/
  $scope.submit = function() {
    $scope.submitted = true;
  	//console.log(dateFilter($scope.formData.dat, 'yyyy-MM-dd'));
    $http.post('http://127.0.0.1:3000/formSave', $scope.formData).success(function(data){
        alert(JSON.stringify(data));
    }).error(function(data) {
        alert("failure message:" + JSON.stringify({data:data}));
    });
  };

}])
/*============================directives================================*/
.directive('qkSelectSex', [function(){
	return {
		restrict: 'EA',
    replace: true,
    scope: true,
		templateUrl: 'html/qk-select-sex.html',
    controller: ['$scope', function ($scope) {
      $scope.required = false;

      // you could get data by $http too.
      $scope.dataOptions = [{id:'M',label:'男'}, {id:'W',label:'女'}];
    }]
	};
}])
.directive('qkSelectYn', [function(){
  return {
    restrict: 'EA',
    replace: true,
    templateUrl: 'html/qk-select-yn.html'
  };
}])
.directive('qkRadio', [function(){
  return {
    restrict: 'EA',
    replace: true,
    scope: true,
    templateUrl: 'html/qk-radio.html',
    controller: ['$scope', function ($scope) {
      $scope.required = false;

      // you could get data by $http too.
      $scope.data = [{id:'true',label:'显示'}, {id:'false',label:'隐藏'}];
    }]
  };
}])
.directive('qkCheckbox', [function(){
  return {
    restrict: 'EA',
    replace: true,
    scope: true,
    templateUrl: 'html/qk-checkbox.html',
    controller: ['$scope', function ($scope) {
      // you could get data by $http too.
      $scope.data = [{id:1, name:'看书'},{id:2, name:'跑步'},{id:3, name:'打球'}];
      $scope.selected = [];
      $scope.selectedTags = [];

      $scope.isSelected = function(id){
        return $scope.selected.indexOf(id)>=0;
      };

      $scope.updateSelection = function($event, id){
        var checkbox = $event.target;
        var action = (checkbox.checked?'add':'remove');
        updateSelected(action,id,checkbox.name);
      };

      var updateSelected = function(action,id,name) {
        if(action === 'add' && $scope.selected.indexOf(id) === -1){
          $scope.selected.push(id);
          $scope.selectedTags.push(name);
        }
        if(action === 'remove' && $scope.selected.indexOf(id) !== -1){
          var idx = $scope.selected.indexOf(id);
          $scope.selected.splice(idx,1);
          $scope.selectedTags.splice(idx,1);
        }
        if ($scope.formData) {
          $scope.formData.selected = $scope.selected;
        }
      };
    }]
  };
}])
.directive('qkDatePicker', function(){
  return {
    restrict: 'EA',
    replace: true,
    templateUrl: 'html/qk-date-picker.html',
    controller: ['$scope', function ($scope){
      $scope.dat = new Date();
      $scope.format = "yyyy-MM-dd";

      $scope.popup = {
        opened: false
      };
      $scope.open = function () {
        $scope.popup.opened = true;
      };
      $scope.disabled = function(date , mode){ 
        return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
      };
    }]
  };
})
//非法字符校验
.directive('chaValid', ['$timeout', function ($timeout) {
    return {
        require: "ngModel",
        link: function (scope, element, attr, ngModel) {
            var timer;
            scope.$watch(attr.ngModel, function (n) {
                if (!n){
                    // fix 1个字符错误，输入空，错误展示不消失
                    ngModel.$setValidity("chaValid", true);
                    return;
                }
                $timeout.cancel(timer);
                timer = $timeout(function () {
                    var patrn = /[`~!@#$%^&*()+<>?:"{},.\/;\='[\]]/im, validity;
                    if (patrn.test(n)) {
                        validity = false;
                    } else {
                        validity = true;
                    }
                    ngModel.$setValidity("chaValid", validity);
                    return validity ? n : undefined;
                }, 300)
            });

        }
    };
}])
;