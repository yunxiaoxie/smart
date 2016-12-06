/**
*iRestApp基础服务。
*author: yunxiaoxie
*date: 2016-7-28
*/

'use strict';
angular.module('iRestApp.basicServer', [])
/**
 *
 * 登录与导航块controller
 *
 * */
.controller('LoginCtrl', ['$scope','$rootScope','$window','UtilsService','$location', '$log', 'AlertService', '$state', function ($scope, $rootScope, $window, UtilsService, $location, $log, AlertService, $state) {
    // 验证码
    $scope.loadLoginCode = function () {
        $scope.LogincodeData = {};
        var sUrl= 'test/checkcode.json';  // Test
        UtilsService.queryService(sUrl, "get", "").success(function (result) {
            if (result.code === 10000) {
                //$scope.LogincodeData = result.data[0];
                //$ocLazyLoad.load(['mainModule','fileUpload','highcharts','wifiModule','accountModule','vdsModule','adModule','cmsModule']);

            }

        }).error(function () {
            console.log('LoadLogincode   failed');
        });
    };

    $scope.login = function () {
        var url = "/Login" + "/" + $scope.formData.uname + "/" + $scope.formData.pwd
        UtilsService.query(url, {}).then(function (result) {
            //  校验数据中的返回数据的 错误码和提示
            if (result.data.code === 10000) {
              $log.info('Login successed.');
              AlertService.clean();
              $state.go('Main.Overview');
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
/******************************************************directives*************************************************/
.directive('qkAlert', ['AlertService', function (AlertService) {
    var tpl = '<div uib-alert ng-repeat="alert in alerts" type="{{alert.type}}" close="alert.close()">{{ alert.msg }}</div>';
    return {
        restrict: 'EA',
        replace: true,
        template: tpl
    };
}])

/******************************************************services*************************************************/
/**
 *
 * 基础服务
 * $http.get,$http.head,$http.post,$http.put,$http.delete,$http.jsonp,$http.patch
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
          })
          .success(function(data, status, headers, config) {
            deferred.resolve(data);
          })
          .error(function(data, status, headers, config) {
            deferred.reject(data);
          });
          return deferred.promise;
        },
        get: function(url){
          return $http.get(url);
        },
        post: function(url, data){ 
          return $http.post(url, data);
        },
        put: function(url){
          return $http.put(url);
        },
        delete: function(url){
          return $http.delete(url);
        },
    }
}])
/**
 * level: success、info、warning、danger
 */
.factory('AlertService', ['$rootScope', function($rootScope) {
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

    alertService.clean = function() {
      $rootScope.alerts = [];
    }

    return alertService;
  }])
.factory('SessionService', ['$rootScope', '$window', function($rootScope, $window) {
    var service = {};

    //service.token = "afasfdasfd";

    service.isAnonymus = function() {
      // 检查用户是否有效。
      $rootScope.configures.accessToken = service.token = $window.sessionStorage.accessToken= 'afasfdasfd';
      return false;
    };

    return service;
  }])
.factory('MapService', [function () {
    var hashMap = function () {
        var size = 0,
            entry = new Object();

        this.put = function (key, value) {
            if (!this.containsKey(key)) {
                size++;
            }
            entry[key] = value;
        };
        this.get = function (key) {
            if (this.containsKey(key)) {
                return entry[key];
            } else {
                return null;
            }
        };
        this.remove = function (key) {
            if (delete entry[key]) {
                size--;
            }
        };
        this.clear = function () {
            size = 0;
            entry = new Object();
        };
        this.containsKey = function (key) {
            return (key in entry);
        };
        this.containsValue = function (value) {
            for (var prop in entry) {
                if (entry[prop] == value) {
                    return true;
                }
            }
            return false;
        };
        this.values = function () {
            var values = new Array(size);
            for (var prop in entry) {
                values.push(entry[prop]);
            }
            return values;
        };
        this.keys = function () {
            var keys = new Array(size);
            for (var prop in entry) {
                keys.push(prop);
            }
            return keys;
        };
        this.size = function () {
            return size;
        };
    };
    return new hashMap();
}])
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
                // need to add this attr into Access-Control-Allow-Headers of server first
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
              config.url = 'http://127.0.0.1/' + config.url;
            }
            return config;
        }
    };
}])

;