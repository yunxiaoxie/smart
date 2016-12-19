/**主业务模块*/
angular.module('iRestApp.mainDirectives', [])
/*============================ui directives================================*/
.directive('qkSelect', FormDirectiveFactory())
.directive('qkRadio', FormDirectiveFactory())
.directive('qkCheckbox', FormDirectiveFactory())
.directive('qkDatePicker', FormDirectiveFactory())

// test form&table
.factory('testService', [function() {
    var service = {};
    service.data=[];
    service.add = function(json) {
      this.data.push(json);
    };
    service.clean = function(json) {
      this.data = [];
    };
    service.get = function () {
        return this.data;
    }

    return service;
  }])

/*============================custom ui directives==========================*/
.directive('multiLevelSelect', ['$parse', '$timeout', function ($parse, $timeout) {
    // 利用闭包，保存父级scope中的所有多级联动菜单，便于取值
    var selects = {};
    return {
        restrict: 'EA',
        scope: {
            name: '@name',
            dependents: '@dependents',
            // 提供具体option值的函数，在父级change时被调用，允许同步/异步的返回结果
            // 无论同步还是异步，数据应该是[{text: 'text', value: 'value'},]的结构
            source: '=source',
            empty: '@empty',
            modelName: '@ngModel'
        },

        template: ''
            + '<option ng-show="empty" value="">{{empty}}</option>'
            + '<option ng-repeat="item in items" value="{{item.value}}">{{item.text}}</option>',
        require: 'ngModel',
        link: function (scope, elem, attr, model) {
            var dependents = scope.dependents ? scope.dependents.split(',') : false;
            var parentScope = scope.$parent;
            scope.name = scope.name || 'multi-select-' + Math.floor(Math.random() * 900000 + 100000);
            // 将当前菜单的getValue函数封装起来，放在闭包中的selects对象中方便调用
            selects[scope.name] = {
                getValue: function () {
                    return $parse(scope.modelName)(parentScope);
                }
            };
 
            // 保存初始值，原因上文已经提到
            var initValue = selects[scope.name].getValue();
            var inited = !initValue;
            model.$setViewValue('');

            // 父改变就把子且有依赖的改变empty
            function onParentChange() {
                var values = {};
                // 获取所有依赖的菜单的当前值
                if (dependents) {
                    $.each(dependents, function (index, dependent) {
                        values[dependent] = selects[dependent].getValue();
                    });
                }
 
                // 利用闭包判断io造成的异步过期
                (function (thenValues) {
                    // 调用source函数，取新的option数据
                    var returned = scope.source ? scope.source(values) : false;
                    // 利用多层闭包，将同步结果包装为有then方法的对象
                    !returned || (returned = returned.then ? returned : {
                        then: (function (data) {
                            return function (callback) {
                                callback.call(window, data);
                            };
                        })(returned)
                    }).then(function (items) {
                        // 防止由异步造成的过期
                        for (var name in thenValues) {
                            if (thenValues[name] !== selects[name].getValue()) {
                                return;
                            }
                        }
                        scope.items = items;
                        $timeout(function () {
                            // 防止由同步（严格的说也是异步，注意事件队列）造成的过期
                            if (scope.items !== items) return;
                            // 如果有空值，选择空值，否则选择第一个选项
                            if (scope.empty) {
                                model.$setViewValue('');
                            } else {
                                model.$setViewValue(scope.items[0].value);
                            }
                            // 判断恢复初始值的条件是否成熟
                            var initValueIncluded = !inited && (function () {
                                for (var i = 0; i < scope.items.length; i++) {
                                    if (scope.items[i].value === initValue) {
                                        return true;
                                    }
                                }
                                return false;
                            })();
                            // 恢复初始值
                            if (initValueIncluded) {
                                inited = true;
                                model.$setViewValue(initValue);
                            }
                            model.$render();
                        });
                    });
                })(values);
            }

            // 是否有依赖，如果没有，直接触发onParentChange以还原初始值
            !dependents ? onParentChange() : scope.$on('selectUpdate', function (e, data) {
                if ($.inArray(data.name, dependents) >= 0) {
                    onParentChange();
                }
            });

            parentScope.$watch(scope.modelName, function (newValue, oldValue) {
                if (newValue || '' !== oldValue || '') {
                    scope.$root.$broadcast('selectUpdate', {
                        name: scope.name
                    });
                }
            });
 
        }
    };
}])
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
.directive('qkSelectUi', function () {  
    var tpl = "<div class='btn-group' uib-dropdown ng-init='dropdownItems=vm.getData()' ng-model='vm.model'> \
                     <button id='single-button' type='button' class='btn btn-primary' uib-dropdown-toggle> \
                         <span ng-bind='vm.view'></span><span class='caret'></span>\
                     </button>\
                     <ul class='dropdown-menu' uib-dropdown-menu>\
                         <li ng-repeat='item in dropdownItems'>\
                             <a href='' ng-click='vm.select(item, $event)' >{{item.value}}</a>\
                         </li>\
                         <li class='divider'></li>\
                         <li><a href='other'>其他</a></li>\
                     </ul>\
                  </div>";

    return {
        restrict: 'E',
        template: tpl,
        //require: 'ngModel',
        scope: true,
        controllerAs: 'vm',
        bindToController: {
            view : '=',
            model: '='
        },
        link: function(scope, iElement, iAttrs, ngModelCtrl) {
            
        },
        controller: ['$scope', '$element', '$attrs', '$log', 'UtilsService', function ($scope, $element, $attrs, $log, UtilsService) {
            // you could get data by $http too.
            this.getData = function() {
              return [{key:1, value:"第一项"},{key:2,value:"第二项"},{key:3,value:"第三项"}];
            };
            this.view = '请选择';
            this.select = function(item, event) {
                console.log(item,event);
                this.model = item.key;
                this.view = item.value;
            }
        }]
    };
})
// 必须填一项
.directive('qkMustOne', function () {  
    var tpl = '<div class="col-xs-2"> \
                    <input type="text"  \
                           class="form-control"  \
                           ng-required="vm.required" \
                           name="vm.name1"  \
                           ng-model="vm.model1" /> \
                </div> \
                <div class="col-xs-2"> \
                    <input type="text"  \
                           class="form-control"  \
                           ng-required="vm.required" \
                           name="vm.name2" \
                           ng-model="vm.model2" /> \
                </div>';

    return {
        restrict: 'E',
        template: tpl,
        //require: '^ngModel',
        scope: true,
        controllerAs: 'vm',
        bindToController: {
            name1 : '=',
            name2 : '=',
            model1: '=',
            model2: '=',
            required: '='
        },
        link: function($scope, $element, $attrs, ctrl) {
            $scope.$watchGroup([$attrs.model1, $attrs.model2], function(newValue, oldValue){
                if (ctrl.model1 || ctrl.model2) {
                    ctrl.required = false;
                } else {
                    ctrl.required = true;
                }
            })
        },
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
            // get data from server.
        }]
    };
})
/*============================ztree for angular&ui-router==========================*/
.directive('qkTree', ['UtilsService', '$log', function(UtilsService, $log) {
    return {
        require: '?ngModel',
        restrict: 'EA',
        link: function($scope, element, attrs, ngModel) {
            // for detail info, please open /lib/ztree/api/API_cn.html.
            var setting = {
                view: {  
                    selectedMulti: false,
                    dblClickExpand: false
                },
                data: {
                    key: {
                        title: "title",
                        uiSref:"ui-sref" // for ui-router (ui-sref)
                    },
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "pId",
                        rootPId: null
                    }
                },
                callback: {
                    beforeClick:function(treeId, treeNode) {
                        var zTree = $.fn.zTree.getZTreeObj("tree");// dom id
                        if (treeNode.isParent) {  
                            zTree.expandNode(treeNode);  
                            return false;  
                        } else {  
                            //window.location.href=treeNode.url;
                            alert(treeNode);
                            return true;  
                        }  
                    },
                    onClick: function(event, treeId, treeNode, clickFlag) {
                        $scope.$apply(function() {
                            ngModel.$setViewValue(treeNode);
                        });
                    }
                }
            };
            UtilsService.querySync('/dataDic/1006').then(function (data) {
                if (data) {
                    $.fn.zTree.init(element, setting, data);
                } else {
                    $log.info('tree data is empty:', data);
                }
            }, function () {
                $log.error('get tree data error.');
            });
        }
    };
}])


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
                var list = scope.formData['list'], tmp=[], names=[], curname=attr.name, formName=attr.formName;
                // Do not get model value to compare, because when validation is false, then model value is undefined.
                // Otherwise, to get viewValue to compare by element.
                var inputs = element.parent().parent().find('input');
                _.each(inputs, function(item,idx){
                    if ($(item).val()) tmp.push($(item).val());
                });
                // get names of input
                var keys = _.keys(list);
                _.each(keys, function(item,idx){
                    names.push(item);
                });
                if (tmp.length !== _.uniq(tmp).length) {
                  // if return false, angular will remove current form value from model, then the model value is undefined.
                  return false;
                } else {
                    // if has no duplication, need to clear other errors, rather then current form.
                    // trigger ng-message directive when clean error.
                    _.each(_.uniq(names), function(item, idx){
                        scope[formName][item]['$error'] = {};
                    });
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
/*
you also could build a plugin like this:
(function(window, angular, undefined) {
    'use strict';
    var module = angular.module('ngHolder', []);
    module.directive('holder', [ 
        function() {
            return {
              link: function(scope, element, attrs) {
                if(attrs.holder)
                  attrs.$set('data-src', attrs.holder);
                Holder.run({images:element[0]});
              }
            };
        }]);
})(window, window.angular);
*/
.directive('ngHolder', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            attrs.$set('data-src', attrs.ngHolder);
            Holder.run({images:element.get(0), nocss:true});
        }
    };
})
.directive('editableMultiselect', ['editableDirectiveFactory', function (editableDirectiveFactory) {
      return editableDirectiveFactory({
          directiveName: 'editableMultiselect',
          inputTpl: '<select size="6" multiple></select>',
          autosubmit: function () {
              var self = this;
              self.inputEl.bind('change', function () {
                  self.scope.$apply(function () {
                      self.scope.$form.$submit();
                  });
              });
          }             
      });
}])
.directive('toroidalProgress', ['$rootScope', function($rootScope) {
  return {
    restrict: 'EA',
    scope: {
      datainfo: '='
    },
    templateUrl: 'html/share/module/toroidalProgress.html',
    link: function(scope, element, atttr) {
      scope.$watch('datainfo', function() {
        scope.percent=parseFloat(scope.datainfo) || 0;
        scope.deg = 360*scope.percent/100;
      })
    }
  }
}]);

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
      require: "?ngModel",
      templateUrl: function(el, attrs){
        var type = el[0].localName;
        if (type && type.indexOf('select') !== -1) {
          return 'html/share/widgets/qk-select.html';
        } else if (type && type.indexOf('radio') !== -1) {
          return 'html/share/widgets/qk-radio.html';
        } else if (type && type.indexOf('checkbox') !== -1) {
          return 'html/share/widgets/qk-checkbox.html';
        } else if (type && type.indexOf('date') !== -1) {
          return 'html/share/widgets/qk-date-picker.html';
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
      link: function (scope, element, attr, ngModel) {
        /*
         *The listener is passed as an array with the new and old values for the watched variables.
         *$scope.$watchGroup([$attrs.model, $attrs.model2], function(newValue, oldValue){
         *   $scope.$emit('dateChange3', newValue[0], newValue[1]);
         *})
        */
        // watch form by attr named model
        scope.$watch(attr.model, function (n) {
            console.log("form watch:", scope.formData);
        });
      },
      controller: ['$scope', '$element', '$attrs', '$log', 'UtilsService', function ($scope, $element, $attrs, $log, UtilsService) {
        // you could get data by $http too.
        this.getData = function() {
          if ($attrs.code) {
            var url = '/dataDic/' + $attrs.code;
            UtilsService.querySync(url, {}).then(function (data) {
                $scope.data = data;
            }, function () {
                $log.error('Not supported code:', $attrs.code);
            });
          }
          
        };

        this.setDate = function() {
            this.model = new Date();
        };

        this.format = "yyyy-MM-dd";
        this.popup = {
          opened: false
        };
        this.open = function () {
          this.popup.opened = true;
        };
        this.disabled = function(date , mode) {
          //return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
        };
      }]
    };
  }];
}
;