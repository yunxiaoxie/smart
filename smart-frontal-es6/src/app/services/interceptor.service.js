angular.module('services')

.factory('HttpInterceptor2', ["$q", "$rootScope", function ($q, $rootScope) {
    var httpInterceptor = {
        request: function (config) {
            config.headers = config.headers || {};
            if (!(typeof ($rootScope.currentuser_name) == "undefined")) {
                //config.headers["userCode"] = encodeURI($rootScope.currentuser_name);
                config.headers.userCode = encodeURI($rootScope.currentuser_name);
                config.headers.userName = encodeURI($rootScope.currentuser_name);
                config.headers.email = $rootScope.currentuser_email;
            }
            return config;
        },
        // response: function (response) {
        //     //if (response.status === 401) {
        //     //    // handle the case where the user is not authenticated
        //     //}
        //     //return response || $q.when(response);
        // },
        // responseError: function (response) {
        //    //return $q.reject(response);
        // }
    };
    return httpInterceptor;
}])

/*全局错误处理*/
.factory('HttpInterceptor', ['$q', 'toastr', function ($q, toastr) {
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
        toastr.warning('远程服务器无响应');
        // 或$rootScope.$broadcast
      } else if(500 === err.status) {
        // 处理各类自定义错误
        toastr.warning('500');
      } else if(501 === err.status) {
        // ...
        toastr.warning('501');
      } else {
        toastr.warning('未知系统故障！');
      }
      return $q.reject(err);
    }
  };
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