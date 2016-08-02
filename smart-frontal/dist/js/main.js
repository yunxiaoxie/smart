/**
* App主模块。
* author: yunxiaoxie
* date: 2016-7-28
*/

'use strict';
angular.module('iRestApp', [
	'ngMessages',
	'ui.bootstrap',
	'iRestApp.basicServer'
]);
/**
*iRestApp基础服务。
*author: yunxiaoxie
*date: 2016-7-28
*/

'use strict';
angular.module('iRestApp.basicServer', [])
/**表单示例控制器*/
.controller('FormCtrl', ['$scope','$filter', function($scope, $filter){
  
  $scope.dat = new Date();
  $scope.format = "yyyy-MM-dd hh:mm:ss";
  //$scope.altInputFormats = ['yyyy/M!/d!'];
  var dateFilter = $filter('date');

  $scope.popup1 = {
    opened: false
  };
  $scope.open1 = function () {
    $scope.popup1.opened = true;
  };
  $scope.disabled = function(date , mode){ 
	return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
  };

  /**提交表单*/
  $scope.submit = function() {
  	console.log($scope.formData);
  	console.log(dateFilter($scope.formData.dat, 'yyyy-MM-dd'));
  };




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
  };

}]);