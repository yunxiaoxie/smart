/**主业务模块*/
angular.module('iRestApp.mainDirectives', [])
/*============================ui directives================================*/
.directive('qkSelect', FormDirectiveFactory())
.directive('qkRadio', FormDirectiveFactory())
.directive('qkCheckbox', FormDirectiveFactory())
.directive('qkDatePicker', FormDirectiveFactory())

/*============================custom ui directives==========================*/
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
/*============================validation ui directives==========================*/
//非法字符校验
.directive('charValid', [function () {
    return {
        restrict: 'A',
        require: "?ngModel",
        link: function (scope, element, attr, ngModelCtrl) {
            if (!ngModelCtrl) return;

            ngModelCtrl.$validators.charValid = function(modelValue, viewValue) {
              var pattern = /[`~!@#$%^&*()+<>?:"{},.\/;\='[\]]/im;
              return !pattern.test(modelValue);
            }
        }
    };
}])
.directive('noDuplicate', [function () {
    return {
        restrict: 'A',
        require: "?ngModel",
        link: function (scope, element, attr, ctrl) {
            if (!ctrl) return;

            ctrl.$validators.noDuplicate = function(modelValue, viewValue) {
              if (scope['formData']) {
                var list = scope.formData['list'], tmp = [], curname = attr.name;
                if (list) {
                  var keys = _.keys(list);
                  _.each(keys, function(item,idx){
                    if (item === curname) {
                      tmp.push(modelValue);
                    } else {
                      tmp.push(list[item])
                    }
                  });
                }
                if (tmp.length !== _.uniq(tmp).length) {
                  return false;
                }
              }
              return true;
            }
        }
    };
}])
//动态表单不能重复
.directive('noRepeat',  [function () {
    return {
        require: "ngModel",
        link: function (scope, element, attr, ngModel) {
            var items = [];
            scope.$watch(attr.ngModel, function (n) {
                if (scope.formData.domain_addr_pairs && scope.formData.domain_addr_pairs.length <=1) return;
                //萃取对象数组中某属性值,转为数组
                items = _.pluck(scope.formData.domain_addr_pairs, 'domain');
                //当前数组的长度与去重后数组的长度比较
                if(items.length == _.uniq(items).length) {
                    ngModel.$setValidity("noRepeat", true);
                    return;
                } else {
                    ngModel.$setValidity("noRepeat", false);
                    return;
                }
            });
        }
    };
}])
.directive('myMinLength', function() {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function(scope, elm, attr, ctrl) {
      if (!ctrl) return;

      var minlength = 0;
      attr.$observe('myminlength', function(value) {
        minlength = parseInt(value) || 0;
        ctrl.$validate();
      });
      ctrl.$validators.myminlength = function(modelValue, viewValue) {
        return ctrl.$isEmpty(viewValue) || viewValue.length >= minlength;
      };
    }
  };
})
//ip验证
.directive('ipMatch',  [function () {
    return {
        restrict: 'A',
        require: "?ngModel",
        link: function (scope, element, attr, ctrl) {
            if (!ctrl) return;

            ctrl.$validators.ipmatch = function(modelValue, viewValue) {
              var patrn = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
              return ctrl.$isEmpty(viewValue) || patrn.test(modelValue);
            };
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
          return 'html/share/qk-select.html';
        } else if (type && type.indexOf('radio') !== -1) {
          return 'html/share/qk-radio.html';
        } else if (type && type.indexOf('checkbox') !== -1) {
          return 'html/share/qk-checkbox.html';
        } else if (type && type.indexOf('date') !== -1) {
          return 'html/share/qk-date-picker.html';
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
            UtilsService.querySync('/getDataByCode', {code:$attrs.code}).then(function (data) {
                $scope.data = data;
            }, function () {
                $log.error('Not supported code:', $attrs.code);
            });
          }
          
        };

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