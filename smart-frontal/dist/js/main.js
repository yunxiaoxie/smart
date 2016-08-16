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
.controller('FormCtrl', ['$scope','$filter', '$http', 'UtilsService', function($scope, $filter, $http, UtilsService){
  var dateFilter = $filter('date');
  $scope.submitted = false;
  $scope.isShow = function(field) {
    return  $scope.submitted || field.$dirty;
  };

  /**提交表单*/
  $scope.submit = function() {
    $scope.submitted = true;
  	console.log(dateFilter($scope.formData.birthday, 'yyyy-MM-dd'));
    $http.post('http://127.0.0.1:3000/formSave', $scope.formData).success(function(data){
        alert(JSON.stringify(data));
    }).error(function(data) {
        alert("failure message:" + JSON.stringify({data:data}));
    });

  };

}])
/*============================directives================================*/
.directive('qkSelect', FormDirectiveFactory())
.directive('qkRadio', FormDirectiveFactory())
.directive('qkCheckbox', FormDirectiveFactory())
.directive('qkDatePicker', FormDirectiveFactory())
// .directive('qkDatePicker', [function(){
//   return {
//     require: 'ngModel',
//     templateUrl: "html/qk-date-picker.html",
//     controllerAs: '$ctrl',
//     scope:{},
//       bindToController: {                     //bind to Controller only，not scope.
//         required : '@',
//         model: '@'
//       },
//       controller: ['$log', function ($log) {
//         this.format = "yyyy-MM-dd";
//         this.popup = {
//           opened: false
//         };
//         this.open = function () {
//           this.popup.opened = true;
//         };
//         this.disabled = function(date , mode){ 
//           return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
//         };
//       }],
//     link: function (scope, elem, attrs, ngModel) {      
//       var toView = function (modelValue) {
        
//       };
      
//       var toModel = function (viewValue) {
//         return viewValue.test;
//       };
//       scope.$watch('test', function() {
//                 ngModel.$setViewValue({ test: scope.test});
//             });
      
//       ngModel.$formatters.unshift(toView);
//       ngModel.$parsers.unshift(toModel);
//     }
//   };
// }])
/*============================custom directives==========================*/
.directive('timeDuration', function () {  
    var tpl = "<div class='input-inline'> \
            <input class='form-control' type='text' ng-model='num' /> \
            <select class='form-control' ng-model='unit'> \
                <option value='seconds'>Seconds</option> \
                <option value='minutes'>Minutes</option> \
                <option value='hours'>Hours</option> \
                <option value='days'>Days</option> \
            </select> \
           </div>";

    return {
        restrict: 'E',
        template: tpl,
        require: 'ngModel',
        replace: true,
        link: function(scope, iElement, iAttrs, ngModelCtrl) {
            // Units of time
            var multiplierMap = {seconds: 1, minutes: 60, hours: 3600, days: 86400},
                multiplierTypes = ['seconds', 'minutes', 'hours', 'days'];

            ngModelCtrl.$formatters.push(function toView(modelValue) {
                var unit = 'minutes', num = 0, i, unitName;

                modelValue = parseInt(modelValue || 0);

                // Figure out the largest unit of time the model value
                // fits into. For example, 3600 is 1 hour, but 1800 is 30 minutes.
                for (i = multiplierTypes.length-1; i >= 0; i--) {
                    unitName = multiplierTypes[i];
                    if (modelValue % multiplierMap[unitName] === 0) {
                        unit = unitName;
                        break;
                    }
                }
                if (modelValue) {
                    num = modelValue / multiplierMap[unit];
                }
                return {
                    unit: unit,
                    num:  num
                };
            });

            ngModelCtrl.$parsers.push(function toModel(viewValue) {
                var unit = viewValue.unit, num = viewValue.num, multiplier;
                multiplier = multiplierMap[unit];
                return num * multiplier;
            });

            scope.$watch('unit + num', function() {
                ngModelCtrl.$setViewValue({ unit: scope.unit, num: scope.num });
            });

            ngModelCtrl.$render = function() {
                if (!ngModelCtrl.$viewValue) {
                    ngModelCtrl.$viewValue = { unit: 'hours', num: 1 };
                }
                scope.unit = ngModelCtrl.$viewValue.unit;
                scope.num  = ngModelCtrl.$viewValue.num;
            };
        }
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
                }, 300);
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
            if ($attrs.hassubscope && $attrs.hassubscope === 'true') {
              console.log($parse($element.attr(model))($scope))
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

/******************************************************services*************************************************/
/**
 *
 * 基础服务
 *
 * */
.factory('UtilsService', ['$http', '$q', function($http, $q) {
    return {
        query : function (sUrl, sData, sMethod) {
            sMethod ? sMethod : sMethod = "post";
            return $http({
                method: sMethod,
                url: sUrl,
                data: sData,
                cache: false,
                ignoreLoadingBar: false
            });
        },
        querySync : function(sUrl, sData, sMethod) {
          sMethod ? sMethod : sMethod = "post";
          var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行  
          $http({
              method: sMethod,
              url: sUrl,
              data: sData,
              cache: false,
              ignoreLoadingBar: false
          }).
          success(function(data, status, headers, config) {
            deferred.resolve(data);
          }).
          error(function(data, status, headers, config) {
            deferred.reject(data);
          });
          return deferred.promise;
        }
    }
}])

/**
 * 表单创建工厂。
 * type--控件类型
 */
function FormDirectiveFactory() {
  return ['$log', function($log){
    return {
      restrict: 'EA',
      scope: true,
      replace: true,
      templateUrl: function(el, attrs){
        var type = el[0].localName;
        if (type && type.indexOf('select') !== -1) {
          return 'html/qk-select.html';
        } else if (type && type.indexOf('radio') !== -1) {
          return 'html/qk-radio.html';
        } else if (type && type.indexOf('checkbox') !== -1) {
          return 'html/qk-checkbox.html';
        } else if (type && type.indexOf('date') !== -1) {
          return 'html/qk-date-picker.html';
        } else {
          $log.error('Not supported type:', type);
          return '';
        }
      },
      controllerAs: 'vm',
      bindToController: {                     //bind to Controller only，not scope.
        required : '=',
        model: '='                           //for dynamic model.
      },
      controller: ['$scope', '$element', '$attrs', '$log', 'UtilsService', function ($scope, $element, $attrs, $log, UtilsService) {
        // you could get data by $http too.
        this.getData = function() {
          if ($attrs.code) {
            console.log(UtilsService, $attrs.code)
            UtilsService.querySync('http://127.0.0.1:3000/getDataByCode', {code:$attrs.code}).then(function (data) {
                $log.info('code:', $attrs.code);
                $scope.data = data;
            }, function () {
                $log('Not supported code:', $attrs.code);
            });
          }
          
          // if ('YN' === key) {
          //   return [{id:'Y',label:'是'}, {id:'N',label:'否'}];
          // } else if ('MW' === key) {
          //   return [{id:'M',label:'男'}, {id:'W',label:'女'}];
          // } else if ('radio' === key) {
          //   return [{id:1,label:'显示'}, {id:0,label:'隐藏'}];
          // } else if ('checkbox' === key) {
          //   return [{id:1, name:'看书', model:"formData.intrest.book"},
          //           {id:2, name:'跑步', model:"formData.intrest.play"},
          //           {id:3, name:'打球', model:"formData.intrest.ball"}];
          // } else {
          //   $log.error('Not supported key:', key);
          //   return null;
          // }
        };

        this.test={};

        this.format = "yyyy-MM-dd";
        this.popup = {
          opened: false
        };
        this.open = function () {
          this.popup.opened = true;
        };
        this.disabled = function(date , mode){ 
          return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
        };
      }]
    };
  }];
};