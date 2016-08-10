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
.directive('qkSelectSex', FormDirectiveFactory('MW'))
.directive('qkSelectYn', FormDirectiveFactory('YN'))
.directive('qkRadio', FormDirectiveFactory('radio'))
.directive('qkCheckbox', FormDirectiveFactory('checkbox'))
// .directive('qkRadio', [function(){
//   return {
//     restrict: 'EA',
//     templateUrl: 'html/qk-radio.html',
//     bindToController: {
//       model : '@'
//     },
//     controllerAs: 'vm',
//     controller: [function () {

//       // you could get data by $http too.
//       this.radioData = [{id:1,label:'显示'}, {id:0,label:'隐藏'}];

//     }]
//   };
// }])
// .directive('qkCheckbox', [function(){
//   return {
//     restrict: 'EA',
//     templateUrl: 'html/qk-checkbox.html',
//     controller: ['$scope', function ($scope) {
//       // you could get data by $http too.
//       $scope.data = [{id:1, name:'看书', model:"formData.intrest.book"},
//                      {id:2, name:'跑步', model:"formData.intrest.play"},
//                      {id:3, name:'打球', model:"formData.intrest.ball"}];
//     }]
//   };
// }])
.directive('qkDatePicker', function(){
  return {
    restrict: 'EA',
    replace: true,
    scope: false,
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
/**dynamic model*/
.directive('qkModel', ['$compile',  function($compile) {
    var model = 'qk-model';
    return {
        restrict: 'A',
        terminal: true,
        priority: 100000,
        controller: ['$scope', '$element', '$attrs', '$parse', function ($scope, $element, $attrs, $parse) {
          this.getData = function() {
            /**
             * 判断是否有subscope
             * ng-repeat有subscope，所以，动态生成的表单修改后不会看到数据。
             */
            if ($attrs.hassubscope && $attrs.hassubscope == 'true') {
              return '$parent.' + $parse($element.attr(model))($scope);
            } else {
              return $parse($element.attr(model))($scope);
            }
          };
        }],
        link: function (scope, elem, attrs, ctrl) {
            var data = ctrl.getData();
            var name = data ? data : elem.attr(model);
            elem.removeAttr(model);
            elem.attr('ng-model', name);
            $compile(elem)(scope);
        }
    };
}])

/**
 * 表单创建工厂。
 * key--控件数据
 * type--控件类型
 */
function FormDirectiveFactory(key) {
  return ['$log', function($log){
  return {
    restrict: 'EA',
    replace: true,
    scope: false,                           //继承并不隔离
    templateUrl: function(el, attrs){
      var url = '',
          type = el.context.localName;
      if (type && type.indexOf('select') !== -1) {
        return 'html/qk-select.html';
      } else if (type && type.indexOf('radio') !== -1) {
        return 'html/qk-radio.html';
      } else if (type && type.indexOf('checkbox') !== -1) {
        return 'html/qk-checkbox.html';
      } else {
        $log.error('Not supported type:', type);
        return '';
      }
    },
    controllerAs: '$ctrl',
    bindToController: {                     //bind to Controller only，not scope.
      required : '@',
      model: '@'
    },
    controller: ['$log', function ($log) {
      // you could get data by $http too.
      this.getData = function() {
        if ('YN' === key) {
          return [{id:'Y',label:'是'}, {id:'N',label:'否'}];
        } else if ('MW' === key) {
          return [{id:'M',label:'男'}, {id:'W',label:'女'}];
        } else if ('radio' === key) {
          return [{id:1,label:'显示'}, {id:0,label:'隐藏'}];
        } else if ('checkbox' === key) {
          return [{id:1, name:'看书', model:"formData.intrest.book"},
                  {id:2, name:'跑步', model:"formData.intrest.play"},
                  {id:3, name:'打球', model:"formData.intrest.ball"}];
        } else {
          $log.error('Not supported key:', key);
          return null;
        }
      }
    }]
  };
}];
}
;