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
}])
/** 新分页指令*/
.directive('pageControl', ['MyUser', function(MyUser) {
    return {
        restrict: 'EA',
        scope: {
            record: '='
        },
        templateUrl: 'html/share/module/page-control.html',
        controller: ['$window','$rootScope','$scope', '$timeout', function($window, $rootScope, $scope, $timeout){
            var setPages = function (changedPageSize) {
                // 提交后更新操作的当前的页面和分页大小
                var dataPage = $scope.$parent.dataPage;
                if (dataPage && dataPage.totalRecord && dataPage.data) {
                    $scope.pgs = {};
                    $scope.pgs.currentPg = dataPage.pageNo;
                    // only for watch
                    $scope.pgs.pageNo = dataPage.pageNo;
                    $scope.pgs.currentSize = changedPageSize || 3;
                    $scope.pgs.pageSize = $scope.$parent.dataPage.pageSize;
                    //$scope.record.page.page > 1 ? $scope.previousPg = $scope.record.page.page - 1 : $scope.previousPg = 1;
                    $scope.lastPg = dataPage.totalPage;
                    //$scope.record.page.page < $scope.lastPg ? $scope.nextPg = $scope.record.page.page + 1 : $scope.nextPg = $scope.lastPg;
                    // 页面上从开始到那页结尾
                    //$scope.pgFrom = $rootScope.configures.pageDefaultSize * ($scope.record.page.page - 1) + 1;
                    //$scope.pgTo = $rootScope.configures.pageDefaultSize * $scope.record.page.page;
                    //$scope.pgTo > $scope.total ? $scope.pgTo = $scope.total : $scope.pgTo;

                    $scope.jumpList = [];
                    for (var i = 1; i <= $scope.lastPg; i++) {
                        $scope.jumpList.push({num: i});
                    }
                    //每页可选择的条数
                    $scope.selectList = [{"num": 3}, {"num": 10}, {"num": 25}, {"num": 50}, {"num": 75}, {"num": 100}];

                }
            };
            $scope.first = function() {
                if($scope.pgs.currentPg === 1) return;
                $scope.pgs.currentPg = 1;
            };
            $scope.prev = function() {
                if($scope.pgs.currentPg === 1) return;
                $scope.pgs.currentPg -=1;
            };
            $scope.next = function() {
                if($scope.pgs.currentPg >= $scope.lastPg) return;
                $scope.pgs.currentPg +=1;
            };
            $scope.last = function() {
                if($scope.pgs.currentPg === $scope.lastPg) return;
                $scope.pgs.currentPg = $scope.lastPg;
            };
            $scope.$watch('pgs.currentPg', function(newValue, oldValue){
              if (newValue) {
                MyUser.myQueryForPager({pageNo:newValue, pageSize:$scope.pgs.pageSize}, function(result){
                    $scope.$parent.dataPage = result;
                });
              }
            });
            $scope.$watch('pgs.pageNo', function(newValue, oldValue){
              if (newValue) {
                $scope.pgs.currentPg = newValue;
              }
            });

            $scope.$watch('pgs.currentSize', function(newValue, oldValue) {
              if (newValue) {
                if ($scope.pgs.currentPg === 1){
                  MyUser.myQueryForPager({pageNo:1, pageSize:newValue}, function(result){
                    $scope.$parent.dataPage = result;
                    $timeout(function(){
                      setPages(newValue);
                    },500);
                  });
                } else {
                  $scope.pgs.pageSize = newValue;
                  $scope.pgs.currentPg = 1;
                }
              }
            });
            //监听模型初始化,完成后计算页面
            $scope.$on('modelInitialized', function(event,param){
                setPages();
            })

        }]
    };
}])
// 鼠标导航线
.directive('myCanvas', [function() {
    return {
        restrict: 'EA',
        controller: ['$scope', '$element', '$attrs', '$parse', function ($scope, $element, $attrs, $parse) {
          //获得cvs元素相对于浏览器圆点的坐标
          this.winPos2CvsPos = function(cvs,_x,_y){
            var _box = cvs.getBoundingClientRect();
            return {
              x:_x-_box.left*(cvs.width/_box.width),
              y:_y-_box.top*(cvs.height/_box.height)
            }
          },
          //画导航线
          this.drawGuideLines = function(ctx, x, y, w, h){
            ctx.strokeStyle='lightblue';
            ctx.lineWidth=1;
            ctx.clearRect(0, 0, w, h);
            this.drawVerticalLine(ctx, x, h);
            this.drawHorizontalLine(ctx, y, w);
          },
          //画水平线
          this.drawHorizontalLine = function(ctx, y, w){
            ctx.beginPath();
            ctx.moveTo(0,y+.5);
            ctx.lineTo(w,y+.5);
            ctx.stroke();
          },
          //画垂直线
          this.drawVerticalLine = function (ctx, x, h) {
            ctx.beginPath();
            ctx.moveTo(x +.5, 0)
            ctx.lineTo(x +.5, h);
            ctx.stroke();
          },

          //更新显示结果
          this.updateReadout = function (x,y, el) {
            el.innerText = '('+ x.toFixed(0)+','+ y.toFixed(0)+')';
          },
          this.lines=[];
          this.drawLine = function(ctx) {
            ctx.beginPath();
            ctx.strokeStyle='black';
            ctx.lineWidth=3;
            var self = this;
            _.each(this.lines, function(line) {
              _.each(line.points, function(p, i) {
                if (i == 0) {
                  ctx.moveTo(p.x, p.y);
                }
                ctx.lineTo(p.x, p.y);
              })

            })
            ctx.stroke();
          },
          this.createLine = function(ctx,point) {
            if (this.hasNotActiveTrue()) {
              var line = {active: true, points: []}
              line.points.push(point);
              this.lines.push(line);
            } else {
              _.each(this.lines, function(line) {
                if (line.active) {
                  if (Math.abs(point.x - line.points[0].x) <= 5 && Math.abs(point.y - line.points[0].y) <= 5) {
                    line.points.push(point);
                    ctx.closePath();
                    ctx.stroke();
                    line.active = false;
                  } else {
                    line.points.push(point);
                  }
                }
              })
            }
          },
          this.hasNotActiveTrue = function(){
            var result = true;
            _.each(this.lines, function(line){
              if (line.active) {
                result = false;
              }
            });
            return result;
          }
        }],
        link: function (scope, elem, attrs, ctrl) {
            var cvs = elem[0],
                ctx = cvs.getContext("2d"),
                width = attrs.width, // or cvs.width
                height = attrs.height,
                imgsheet = new Image(),
                readoutel = elem.context.parentNode.children[0];
            cvs.onmousemove = function(e){
              var _loc = ctrl.winPos2CvsPos.call(ctrl, cvs, e.clientX, e.clientY);
              ctrl.drawGuideLines.call(ctrl, ctx, _loc.x, _loc.y, width, height);
              ctrl.updateReadout.call(ctrl,_loc.x,_loc.y, readoutel);
              ctrl.drawLine(ctx);
            }
            cvs.onclick = function(e){
              var _loc = ctrl.winPos2CvsPos.call(ctrl, cvs, e.clientX, e.clientY);
              ctrl.createLine(ctx, {x:_loc.x.toFixed(0), y:_loc.y.toFixed(0)});
              ctrl.drawLine(ctx);

            }
        }
    };
}])
//画多边形
.directive('paintCanvas', [function() {
    return {
        restrict: 'EA',
        controller: ['$scope', '$element', '$attrs', '$parse', function ($scope, $element, $attrs, $parse) {
          
        }],
        link: function (scope, elem, attrs, ctrl) {
            var Point = function (x, y) {
                this.x = x;
                this.y = y;
            };
            var Polygon = function (centerX, centerY, radius, sides, startAngle, strokeStyle, fillStyle, filled) {
                this.x = centerX;//外接圆心x坐标
                this.y = centerY;
                this.radius = radius;//外接圆半径
                this.sides = sides;//边数
                this.startAngle = startAngle;//开始角度
                this.strokeStyle = strokeStyle;
                this.fillStyle = fillStyle;
                this.filled = filled;
            };
            Polygon.prototype = {
                getPoints: function () {//获取多边形所有顶点
                    var points = [],
                            angle = this.startAngle || 0;
                    for (var i=0; i < this.sides; ++i) {
                        points.push(new Point(this.x + this.radius * Math.sin(angle),
                                this.y - this.radius * Math.cos(angle)));
                        angle += 2*Math.PI/this.sides;
                    }
                    return points;
                },
                createPath: function (context) {//创建多边形路径
                    var points = this.getPoints();
                    context.beginPath();
                    context.moveTo(points[0].x, points[0].y);
                    for (var i=1; i < this.sides; ++i) {
                        context.lineTo(points[i].x, points[i].y);
                    }
                    context.closePath();
                },
                stroke: function (context) {//对多边形描边
                    context.save();
                    this.createPath(context);
                    context.strokeStyle = this.strokeStyle;
                    context.stroke();
                    context.restore();
                },
                fill: function (context) {//填充
                    context.save();
                    this.createPath(context);
                    context.fillStyle = this.fillStyle;
                    context.fill();
                    context.restore();
                },
                move: function (x, y) {
                    this.x = x;
                    this.y = y;
                },
            };
            var canvas = document.getElementById('paintCvs'),
                  context = canvas.getContext('2d'),
          //清除按钮
                  eraseAllButton = document.getElementById('eraseAllButton'),
          //描边颜色
                  strokeStyleSelect = document.getElementById('strokeStyleSelect'),
          //画多边形的开始角度
                  startAngleSelect = document.getElementById('startAngleSelect'),
          //填充颜色
                  fillStyleSelect = document.getElementById('fillStyleSelect'),
          //不否填充
                  fillCheckbox = document.getElementById('fillCheckbox'),
          //进入编辑
                  editCheckbox = document.getElementById('editCheckbox'),
          //边数
                  sidesSelect = document.getElementById('sidesSelect'),
          //canvas位图数据
                  drawingSurfaceImageData,

          //记录鼠标按下的位置
                  mousedown = {},
          //橡皮筋矩形框
                  rubberbandRect = {},
                  dragging = false,//是否在拖动状态
                  draggingOffsetX,
                  draggingOffsetY,
                  sides = 8,
                  startAngle = 0,
                  guidewires = true,
                  editing = false,
          //保存已绘制的多边形
                  polygons = [];
          // Functions..........................................................
          //画网络线
          function drawGrid(color, stepx, stepy) {
              context.save();
              context.shadowColor = undefined;
              context.shadowBlur = 0;
              context.shadowOffsetX = 0;
              context.shadowOffsetY = 0;

              context.strokeStyle = color;
              context.fillStyle = '#ffffff';
              //context2.lineCap = "round";//连接处为圆形
              context.lineWidth = 1;
              context.fillRect(0, 0, context.canvas.width, context.canvas.height);
              context.beginPath();
              for (var i = stepx + 0.5; i < context.canvas.width; i += stepx) {
                  context.moveTo(i, 0);
                  context.lineTo(i, context.canvas.height);
              }
              context.stroke();
              context.beginPath();
              for (var i = stepy + 0.5; i < context.canvas.height; i += stepy) {
                  context.moveTo(0, i);
                  context.lineTo(context.canvas.width, i);
              }
              context.stroke();
              context.restore();
          }
          //窗口坐标转canvas坐标
          function windowToCanvas(x, y) {
              var bbox = canvas.getBoundingClientRect();
              return {
                  x: x - bbox.left * (canvas.width  / bbox.width),
                  y: y - bbox.top  * (canvas.height / bbox.height)
              };
          }
          // 保存或恢复已绘制的画面...................................
          function saveDrawingSurface() {
              drawingSurfaceImageData = context.getImageData(0, 0,canvas.width,canvas.height);
          }
          function restoreDrawingSurface() {
              context.putImageData(drawingSurfaceImageData, 0, 0);
          }
          // 画多边形.....................................................
          function drawPolygon(polygon) {
              context.beginPath();
              polygon.createPath(context);
              polygon.stroke(context);
              if (fillCheckbox.checked) {
                  polygon.fill(context);
              }
          }
          // 更新橡皮筋矩形框...................................................
          function updateRubberbandRectangle(loc) {
              rubberbandRect.width = Math.abs(loc.x - mousedown.x);
              rubberbandRect.height = Math.abs(loc.y - mousedown.y);
              if (loc.x > mousedown.x) rubberbandRect.left = mousedown.x;
              else   rubberbandRect.left = loc.x;
              if (loc.y > mousedown.y) rubberbandRect.top = mousedown.y;
              else   rubberbandRect.top = loc.y;
          }
          //以鼠标按下点为圆心，橡皮筋框宽为半径创建多边形
          function drawRubberbandShape(loc, sides, startAngle) {
              var polygon = new Polygon(mousedown.x, mousedown.y,
                      rubberbandRect.width,
                      parseInt(sidesSelect.value),
                      (Math.PI / 180) * parseInt(startAngleSelect.value),
                      context.strokeStyle,
                      context.fillStyle,
                      fillCheckbox.checked);
              drawPolygon(polygon);//画多边形

              if (!dragging) {//保存这个多边形
                  polygons.push(polygon);
              }
          }
          //更新橡皮筋
          function updateRubberband(loc, sides, startAngle) {
              updateRubberbandRectangle(loc);
              drawRubberbandShape(loc, sides, startAngle);
          }
          // 网络线.................................................
          function drawHorizontalLine (y) {
              context.beginPath();
              context.moveTo(0,y+0.5);
              context.lineTo(context.canvas.width,y+0.5);
              context.stroke();
          }
          function drawVerticalLine (x) {
              context.beginPath();
              context.moveTo(x+0.5,0);
              context.lineTo(x+0.5,context.canvas.height);
              context.stroke();
          }
          function drawGuidewires(x, y) {
              context.save();
              context.strokeStyle = 'rgba(0,0,230,0.4)';
              context.lineWidth = 0.5;
              drawVerticalLine(x);
              drawHorizontalLine(y);
              context.restore();
          }
          //绘制保存的所有多边形
          function drawPolygons() {
              polygons.forEach( function (polygon) {
                  drawPolygon(polygon);
              });
          }
          // 开始拖动...........................................................
          function startDragging(loc) {
              saveDrawingSurface();
              mousedown.x = loc.x;
              mousedown.y = loc.y;
          }
          //进入编辑状态
          function startEditing() {
              canvas.style.cursor = 'pointer';
              editing = true;
          }
          //退出编辑状态
          function stopEditing() {
              canvas.style.cursor = 'crosshair';
              editing = false;
          }
          //事件处理，鼠标按下...................................................
          canvas.onmousedown = function (e){
              //窗口坐标转canvas坐标
              var loc = windowToCanvas(e.clientX, e.clientY);
              e.preventDefault(); // prevent cursor change
              if(editing){//在编辑状态时，检查鼠标按下的点在哪个多边形路径中
                  polygons.forEach( function (polygon) {
                      polygon.createPath(context);
                      if (context.isPointInPath(loc.x, loc.y)) {
                          startDragging(loc);
                          dragging = polygon;//要拖动的多边形
                          draggingOffsetX = loc.x - polygon.x;
                          draggingOffsetY = loc.y - polygon.y;
                          return;
                      }
                  });
              }
              else {
                  startDragging(loc);
                  dragging = true;
              }
          };
          //鼠标移动
          canvas.onmousemove = function (e) {
              var loc = windowToCanvas(e.clientX, e.clientY);
              e.preventDefault(); // prevent selections
              if (editing && dragging) {//有一个要拖动的多边形
                  dragging.x = loc.x - draggingOffsetX;
                  dragging.y = loc.y - draggingOffsetY;
                  context.clearRect(0, 0, canvas.width, canvas.height);
                  drawGrid('lightgray', 10, 10);
                  drawPolygons();//重画所有多边形
              }
              else {
                  if (dragging) {
                      restoreDrawingSurface();
                      updateRubberband(loc, sides, startAngle);
                      if (guidewires) {
                          drawGuidewires(mousedown.x, mousedown.y);
                      }
                  }
              }
          };
          canvas.onmouseup = function (e) {
              var loc = windowToCanvas(e.clientX, e.clientY);
              dragging = false;
              if (editing) {
              }
              else {
                  restoreDrawingSurface();
                  updateRubberband(loc);
              }
          };
          eraseAllButton.onclick = function (e) {
              context.clearRect(0, 0, canvas.width, canvas.height);
              drawGrid('lightgray', 10, 10);
              saveDrawingSurface();
          };
          strokeStyleSelect.onchange = function (e) {
              context.strokeStyle = strokeStyleSelect.value;
          };
          fillStyleSelect.onchange = function (e) {
              context.fillStyle = fillStyleSelect.value;
          };
          editCheckbox.onchange = function (e) {
              if (editCheckbox.checked) {
                  startEditing();
              }
              else {
                  stopEditing();
              }
          };
          // Initialization.....................................................
          context.strokeStyle = strokeStyleSelect.value;
          context.fillStyle = fillStyleSelect.value;
          drawGrid('lightgray', 10, 10);
          if (navigator.userAgent.indexOf('Opera') === -1)
              context.shadowColor = 'rgba(0, 0, 0, 0.4)';
          context.shadowOffsetX = 2;
          context.shadowOffsetY = 2;
          context.shadowBlur = 4;
        }
    };
}])
/*拖动层*/
.directive('dragLayer', [function() {
    return {
        restrict: 'EA',
        controller: ['$scope', '$element', '$attrs', '$parse', function ($scope, $element, $attrs, $parse) {
          
          this.drawDragArea = function(ctx,data){
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.strokeStyle = 'lightgray';
            ctx.beginPath();
            ctx.lineWidth="10";
            ctx.moveTo(data.x, data.y);
            ctx.lineTo(data.x, data.y+data.cvsHeight);
            ctx.lineTo(data.x+data.cvsWidth, data.y+data.cvsHeight);
            ctx.lineTo(data.x+data.cvsWidth, data.y);
            ctx.closePath();
            ctx.stroke();
          }
        }],
        link: function ($scope, elem, attrs, ctrl) {
          var cvs = elem[0],
              dragging = false,
              self = this,
              plusBtn = document.querySelector('plusBtn'),
              minusBtn = document.querySelector('minusBtn'),
              
              offsetX = 0,
              offsetY = 0,
              ctx = cvs.getContext("2d");

          $scope.$on('bgImgOk', function(e){
            ctrl.drawDragArea(ctx, $scope.bgImg);
          });
          function windowToCanvas(x, y) {
              var bbox = cvs.getBoundingClientRect();
              return {
                x: x - bbox.left * (cvs.width  / bbox.width),
                y: y - bbox.top  * (cvs.height / bbox.height)
              };
          }
          cvs.onmousedown = function(e){
              var loc = windowToCanvas(e.clientX, e.clientY);
              if (ctx.isPointInPath(loc.x, loc.y)){
                  offsetX = loc.x - $scope.bgImg.x;
                  offsetY = loc.y - $scope.bgImg.y;
                  dragging=true;
              }
          }
          cvs.onmousemove = function(e){
              cvs.style.cursor='pointer';
              var loc = windowToCanvas(e.clientX, e.clientY);
              if (dragging){
                  $scope.bgImg.x = loc.x-offsetX;
                  $scope.bgImg.y = loc.y-offsetY;
                  $scope.drawBgImg();
                  //ctrl.drawDragArea(ctx, $scope.bgImg);
                  
              }
          }
          cvs.onmouseup = function(e){
              dragging = false;
          }
          cvs.onmouseout = function(){
            cvs.style.cursor='normal';
          }
          plusBtn.onclick = function(e){
            $scope.bgImg.imgScale += 0.2;
            if ($scope.bgImg.imgScale>=2) {
              $scope.bgImg.imgScale = 2;
            }
            $scope.drawBgImg();
          }
          minusBtn.onclick = function(e){
            $scope.bgImg.imgScale -= 0.2;
            if ($scope.bgImg.imgScale<=0) {
              $scope.bgImg.imgScale = 0.1;
            }
            $scope.drawBgImg();
          }
        }
    };
}])
/*
支持：拖动，缩放（中心缩放）; 
若图片大于等于画布，拖动区域为画布; 若图片小于画布，拖动区域为图片大小.
注意：有一个窗口缩放比例，一个图片缩放比例。
*/
.directive('bgCanvas', [function() {
    return {
        restrict: 'EA',
        controller: ['$scope', '$element', '$attrs', '$parse', function ($scope, $element, $attrs, $parse) {
          //draw bg
          $scope.drawBgImg = function () {
            $scope.bgctx.clearRect(0, 0, $scope.bgctx.canvas.width, $scope.bgctx.canvas.height);
            $scope.bgctx.globalAlpha=0.5;
            $scope.bgctx.drawImage($scope._img, 
              $scope.bgImg.x, $scope.bgImg.y, 
              $scope.bgImg.imgWidth*$scope.bgImg.imgScale, 
              $scope.bgImg.imgHeight*$scope.bgImg.imgScale);
          }
        }],
        link: function ($scope, elem, attrs, ctrl) {
            $scope.bgImg = {
              x: 0,
              y: 0,
              imgScale: 1, //图片缩放比例
              winScale: 1, //窗口缩放比例
              cvsWidth: attrs.width ? parseInt(attrs.width) : 800,
              cvsHeight: attrs.height ? parseInt(attrs.height) : 600
            }
            var cvs = elem[0];
            $scope.bgctx = cvs.getContext("2d");
            $scope._img = new Image();

            function calcImgScale() {
              if ($scope._img.width <= $scope.bgImg.cvsWidth && $scope._img.height <= $scope.bgImg.cvsHeight) {
                $scope.bgImg.imgScale = 1;
              }
            }

            $scope._img.src = "img/canvasbg.jpg";
            $scope._img.onload = function(){
              $scope.drawBgImg.call($scope);
              $scope.bgImg.imgWidth = $scope._img.width;
              $scope.bgImg.imgHeight = $scope._img.height;
              $scope.$emit('bgImgOk', null);
            }
        }
    };
}])

;

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