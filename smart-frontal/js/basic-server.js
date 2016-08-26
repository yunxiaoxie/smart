/**
*iRestApp基础服务。
*author: yunxiaoxie
*date: 2016-7-28
*/

'use strict';
angular.module('iRestApp.basicServer', [])
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
/**
 *
 * 登录与导航块controller
 *
 * */
.controller('LoginCtrl', ['$scope','$rootScope','$window','UtilsService','$location', '$log', 'AlertService', function ($scope, $rootScope, $window, UtilsService, $location, $log, AlertService) {
    // 验证码
    $scope.loadLoginCode = function () {
        $scope.LogincodeData = {};
        var sUrl= 'test/checkcode.json';  // Test
        UtilsService.queryService(sUrl, "get", "").success(function (result) {
            if (result.msgNo === 10000) {
                //$scope.LogincodeData = result.data[0];
                //$ocLazyLoad.load(['mainModule','fileUpload','highcharts','wifiModule','accountModule','vdsModule','adModule','cmsModule']);
            }

        }).error(function () {
            console.log('LoadLogincode   failed');
        });
    };

    $scope.login = function () {
        UtilsService.query("/verifyUser", $scope.formData).then(function (result) {
            //  校验数据中的返回数据的 错误码和提示
            if (result.msgNo === 10000) {
              $log.info('Login successed.');
            //     $window.sessionStorage.systemType = result.data[0].link;
            //     $window.sessionStorage.accessToken = result.data[0].accesstoken;
            //     $rootScope.configures.accessToken = result.data[0].accesstoken;

            //     //用户信息存值
            //     $rootScope.configures.account.role_id = $window.sessionStorage.role_id = parseInt(result.data[0].login_role_id);
            //     $rootScope.configures.account.hash = $window.sessionStorage.hash = result.data[0].login_hash;
            //     $rootScope.configures.account.user_id = $window.sessionStorage.user_id = parseInt(result.data[0].login_user_id);
            //     $rootScope.configures.account.username = $window.sessionStorage.username = result.data[0].login_user_name;
            //     $rootScope.configures.account.tpl_id = parseInt(result.data[0].login_tpl_id);

            //     $rootScope.configures.username = $window.sessionStorage.topName = $scope.formData.username;

            //     //判断是否irest系统(有无导航模块)
            //     result.data[0].link != '/'?$rootScope.configures.irest = false:$rootScope.configures.irest = true;
            //     //成功跳转到 登录后的页面
            //     if($rootScope.configures.toState) {
            //         $state.go($rootScope.configures.toState);
            //     } else {
            //         $location.url(result.data[0].link);

            //     }
            } else {
              $log.info('Login failed.');
              AlertService.alert('用户名或密码错误');
            }
        }, function () {
            $log.error('Request failed.');
        });
    };

}])
/*============================directives================================*/
.directive('qkSelect', FormDirectiveFactory())
.directive('qkRadio', FormDirectiveFactory())
.directive('qkCheckbox', FormDirectiveFactory())
.directive('qkDatePicker', FormDirectiveFactory())

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
                url: sUrl,
                data: sData,
                cache: false,
                method: sMethod,
                ignoreLoadingBar: false
            });
        },
        querySync : function(sUrl, sData, sMethod) {
          sMethod ? sMethod : sMethod = "post";
          var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
          $http({
              url: sUrl,
              data: sData,
              cache: false,
              method: sMethod,
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
 * level: success、info、warning、danger
 */
.factory('AlertService', function($rootScope) {
    var alertService = {};

    // create an array of alerts available globally
    $rootScope.alerts = [];

    alertService.alert = function(msg, type) {
      if (!type) type = 'info';
      $rootScope.alerts.push({'type': type, 'msg': msg, 'close': function(){alertService.closeAlert(this);}});
    };

    alertService.closeAlert = function(alert) {
      alertService.closeAlertIdx($rootScope.alerts.indexOf(alert));
    };
 
    alertService.closeAlertIdx = function(index) {
      $rootScope.alerts.splice(index, 1);
    };

    return alertService;
  })
.factory('SessionService', function($rootScope) {
    var service = {};

    service.token = "afasfdasfd";

    service.isAnonymus = function() {
      return false;
    };

    return service;
  })
/******************************************************interceptors*************************************************/

/*全局错误处理*/
.factory('HttpInterceptor', ['$q', 'AlertService', function ($q, AlertService) {
  return {
    request: function(config){
      return config;
    },
    requestError: function(err){
      return $q.reject(err);
    },
    response: function(res){
      return res;
    },
    responseError: function(err){
      if(-1 === err.status) {
        AlertService.alert('远程服务器无响应', 'warning');
        // 或$rootScope.$broadcast
      } else if(500 === err.status) {
        // 处理各类自定义错误
        AlertService.alert('500', 'warning');
      } else if(501 === err.status) {
        // ...
        AlertService.alert('501', 'warning');
      } else {
        AlertService.alert('未知系统故障！', 'warning');
      }
      return $q.reject(err);
    }
  };
}])

.factory('SessionInjector', ['SessionService', function(SessionService) {
    var sessionInjector = {
        request: function(config) {
            if (!SessionService.isAnonymus()) {
                config.headers['X-Session-Token'] = SessionService.token;
            }
            return config;
        }
    };
    return sessionInjector;
}])
/*时间戳*/
.factory('TimestampMarker', [function() {
    var timestampMarker = {
        request: function(config) {
            config.requestTimestamp = new Date().getTime();
            return config;
        },
        response: function(response) {
            response.config.responseTimestamp = new Date().getTime();
            return response;
        }
    };
    return timestampMarker;
}])

/*全局ajax数据加解密encryption and decryption*/
.factory('EncryptInterceptor', ['$log' ,function ($log) {
    return {
        request: function(config){
          $log.info('encryption...');
          return config;
        },
        response: function(res){
          $log.info('decryption...');
          return res;
        },
    };
}])

/*全局url加前缀*/
.factory('UrlInterceptor', ['$log' ,function ($log) {
    //定义拦截器(拦截所有请求，修改“../”为域名)
    return {
        request: function(config){
            if (config.url && config.url.substr(0,1) === '/') {
              $log.info('request url:' + config.url);
              config.url = 'http://127.0.0.1:3000/' + config.url;
            }
            return config;
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