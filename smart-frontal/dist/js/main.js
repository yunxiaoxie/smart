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
.controller('FormCtrl', ['$scope','$filter', '$http', 'UtilsService', 'alertService', function($scope, $filter, $http, UtilsService, alertService){
  var dateFilter = $filter('date');
  $scope.submitted = false;
  $scope.isShow = function(field) {
    return  $scope.submitted || field.$dirty;
  };

  /**提交表单*/
  $scope.submit = function() {
    $scope.submitted = true;
    alertService.add("warning", "This is a warning.");
    alertService.add("danger", "This is an error!");
  	console.log(dateFilter($scope.formData.birthday, 'yyyy-MM-dd'));
    $http.post('/formSave', $scope.formData).success(function(data){
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
 * level: success、info、warning、danger
 */
.factory('alertService', function($rootScope) {
    var alertService = {};

    // create an array of alerts available globally
    $rootScope.alerts = [];

    alertService.add = function(type, msg) {
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
/**
 *
 * 基础拦截器
 *
 * */
.factory('errorInterceptor', ['$rootScope','$window','$q', '$log' ,function ($rootScope,$window,$q,$log) {
    //定义拦截器(拦截所有请求，修改“../”为域名)
    return {
        'request': function(request){
            if (request.url && request.url.substr(0,1) === '/') {
              $log.info(request.url);
              request.url = 'http://127.0.0.1:3000/' + request.url;
            }
            return request;
        },
        'response': function (response) {
            if(!response.data) return response;
            //广播post完成事件
            if(response.config.method == ('POST')) {
                $rootScope.$broadcast('formPosted',response.config.url);
            } 
            var exception = [12001,12002,12003];
            if(response.data.msgNo){
                var erroCode = parseInt(response.data.msgNo);
                var errMsg=response.data.msg;
            } else
                var erroCode = 10000;

            switch (erroCode) {
                case 10000:
                    if(response.config.method.toUpperCase() == 'DELETE' && response.status == 200)
                        $rootScope.$broadcast('msgError', 900001);
                    //else if(response.config.method.toUpperCase() == 'POST' || response.config.method.toUpperCase() == 'PUT')
                    //    $rootScope.$broadcast('msgError', 900002);
                    break;
                case 10005:
                    $rootScope.$broadcast('relogin');
                    $rootScope.$broadcast('msgError', erroCode,errMsg);

                    break;
                case 10006:
                    $rootScope.$broadcast('relogin');
                    $rootScope.$broadcast('msgError', erroCode,errMsg);

                    break;
                case 10007:
                    $rootScope.$broadcast('relogin');
                    $rootScope.$broadcast('msgError', erroCode,errMsg);

                    break;
                default :
                    if(_.indexOf(exception,erroCode) < 0) {
                        $rootScope.$broadcast('msgError', erroCode,errMsg);
                    }
            };
            return response;

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
                $log('Not supported code:', $attrs.code);
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
/**
 * 作者: xie Y.X.
 * 创建: 2016/3/18
 * 修改: 2016/3/18
 * 版本: 1.0.0
 * 描述: 服务配置模块
 * */

'use strict';
angular.module('iRestApp')
    .config(['$httpProvider', 'uibDatepickerConfig', function ($httpProvider, uibDatepickerConfig) {
        uibDatepickerConfig.showWeeks = false;

        //加载进度条
        // cfpLoadingBarProvider.latencyThreshold = 100;
        // cfpLoadingBarProvider.includeSpinner = true;

        // Initialize get if not there
        if (!$httpProvider.defaults.headers.get) {
            $httpProvider.defaults.headers.get = {};
        }

        // Enables Request.IsAjaxRequest() in ASP.NET MVC
        $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

        // Disable IE ajax request caching
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';


        //跨域设置
        //form形式post
        //$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;';

        //注册拦截器
        $httpProvider.interceptors.push('errorInterceptor');
        //$httpProvider.interceptors.push('personlizeTranslateErrorHandler');


        
    }])

/**
*iRestApp拦截器。
*author: yunxiaoxie
*date: 2016-7-28
*/

'use strict';
angular.module('iRestApp.mainInterceptors', [])
/**
 *
 * 基础拦截器
 *
 * */
.factory('errorInterceptor', ['$rootScope','$window','$q',function ($rootScope,$window,$q) {
    //定义拦截器(拦截所有请求，修改“../”为域名)
    return {
        'request': function(request){
            // var aUrl = request.url.split('/');
            // if(request.method == ('POST') && aUrl[4] !== 'security') {
            //     $rootScope.$broadcast('formPosting',request.url);
            // }
            request.url += 'http://127.0.0.1:3000';
            return request;
        },
        'response': function (response) {
            if(!response.data) return response;
            //广播post完成事件
            if(response.config.method == ('POST')) {
                $rootScope.$broadcast('formPosted',response.config.url);
            } 
            var exception = [12001,12002,12003];
            if(response.data.msgNo){
                var erroCode = parseInt(response.data.msgNo);
                var errMsg=response.data.msg;
            } else
                var erroCode = 10000;

            switch (erroCode) {
                case 10000:
                    if(response.config.method.toUpperCase() == 'DELETE' && response.status == 200)
                        $rootScope.$broadcast('msgError', 900001);
                    //else if(response.config.method.toUpperCase() == 'POST' || response.config.method.toUpperCase() == 'PUT')
                    //    $rootScope.$broadcast('msgError', 900002);
                    break;
                case 10005:
                    $rootScope.$broadcast('relogin');
                    $rootScope.$broadcast('msgError', erroCode,errMsg);

                    break;
                case 10006:
                    $rootScope.$broadcast('relogin');
                    $rootScope.$broadcast('msgError', erroCode,errMsg);

                    break;
                case 10007:
                    $rootScope.$broadcast('relogin');
                    $rootScope.$broadcast('msgError', erroCode,errMsg);

                    break;
                default :
                    if(_.indexOf(exception,erroCode) < 0) {
                        $rootScope.$broadcast('msgError', erroCode,errMsg);
                    }
            };
            return response;

        }
    };
}])
;