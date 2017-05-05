/**
* App主模块。
* author: yunxiaoxie
* date: 2016-7-28
*/

'use strict';
angular.module('iRestApp', [
	'ngMessages',
	'ngResource',
	'ui.router',
	'ngFileUpload',
	'oc.lazyLoad',
	'ngTable',
	'smart-table',
	'toastr',
	'ui.bootstrap',
	'ui.bootstrap.datetimepicker',
	'iRestApp.basicServer'
]);
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
        var url = "/sys/Login" + "/" + $scope.formData.uname + "/" + $scope.formData.pwd
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
                //headers: {'apiKey': "opc"},
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
          //return $http.get(url,{headers: {'apiKey': "opc"}});
          return $http.get(url);
        },
        post: function(url, data){
          //return $http.post(url, data,{headers: {'apiKey': "opc"}});
          return $http.post(url, data);
        },
        put: function(url){
          //return $http.put(url,{headers: {'apiKey': "opc"}});
          return $http.put(url);
        },
        delete: function(url){
          //return $http.delete(url,{headers: {'apiKey': "opc"}});
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
/**
 * 作者: Xie Y.X.
 * 创建: 2016/8/18
 * 修改: 2016/8/21
 * 版本: 1.0.1
 * 描述: Lazyload模块配置
 * */

'use strict';
angular.module('iRestApp')
    .config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            debug:  false,
            events: true,
            modules: [
                {
                    name: 'mainModule',
                    files: [
                        'js/components/main-components.js',
                        'js/controllers/main-controllers.js',
                        'js/services/main-services.js',
                        'js/directives/main-directives.js',
                        'js/filters/main-filters.js',
                        'js/interceptors/main-interceptors.js'
                    ]
                },
            ]
        });
    }])

/**
 * 作者: xie Y.X.
 * 创建: 2016/8/18
 * 修改: 2016/8/19
 * 版本: 1.0.2
 * 描述: 状态路由配置
 * */
'use strict';
angular.module('iRestApp')
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('Login', {
                url: '/Login',
                views: {
                    'rootView': {
                        templateUrl: 'html/login.html'
                    }
                }
            })
            .state('Main', {
                url: '/Main',
                views: {
                    'rootView': {
                        templateUrl: 'html/account/main.html'
                    }
                },
                abstract: true,
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['mainModule']);
                    }]
                }
            })
            .state('Menu', {
                url: '/',
                views: {
                    'rootView': {
                        templateUrl: 'html/account/menu.html',
                    }
                }
            })
            
            /*************************业务模块********************************/
            .state('Main.Overview', {
                url: '/Overview',
                views: {
                    'contentView': {
                        templateUrl: 'html/share/module/overview.html'
                    }
                }
            })
            .state('Main.Reports', {
                url: '/Reports',
                views: {
                    'contentView': {
                        templateUrl: 'html/share/module/reports.html'
                    }
                }
            })
            .state('Main.Tables', {
                url: '/Tables',
                views: {
                    'contentView': {
                        templateUrl: 'html/share/module/table.html'
                    }
                }
            })
            .state('Main.Trees', {
                url: '/Trees',
                views: {
                    'contentView': {
                        templateUrl: 'html/share/module/tree.html'
                    }
                }
            })
            .state('Main.XEditable', {
                url: '/XEditable',
                views: {
                    'contentView': {
                        templateUrl: 'html/share/module/xeditable.html'
                    }
                }
            })
            .state('Main.Upload', {
                url: '/Upload',
                views: {
                    'contentView': {
                        templateUrl: 'html/share/module/upload.html'
                    }
                }
            })
            .state('Main.GlobalException', {
                url: '/Exception',
                views: {
                    'contentView': {
                        templateUrl: 'html/share/module/exception.html'
                    }
                }
            })
            .state('Main.Canvas', {
                url: '/Canvas',
                views: {
                    'contentView': {
                        templateUrl: 'html/share/module/canvas.html'
                    }
                }
            })

        $urlRouterProvider.otherwise('/Login');
    }])

/**
 * 作者: xie Y.X.
 * 创建: 2016/3/18
 * 修改: 2016/3/18
 * 版本: 1.0.0
 * 描述: 服务配置模块
 * */

'use strict';
angular.module('iRestApp')
    .config(['$httpProvider', 'uibDatepickerConfig', '$provide', function ($httpProvider, uibDatepickerConfig, $provide) {
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
        //$httpProvider.defaults.headers.get['Pragma'] = 'no-cache';


        //跨域设置
        //form形式post
        //$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;';

        //注册拦截器
        $httpProvider.interceptors.push('UrlInterceptor');
        $httpProvider.interceptors.push('EncryptInterceptor');
        $httpProvider.interceptors.push('TimestampMarker');
        $httpProvider.interceptors.push('SessionInjector');
        $httpProvider.interceptors.push('HttpInterceptor');

        //set default content-type
        //$httpProvider.defaults.headers.post = {'Content-Type': 'application/json'};


        /*
         * Add $onRootScope method for $rootScope.
         * $scope销毁时，在它注册的事件均销毁；但$rootScope则不会，使用$onRootScope则会自动清除。
         */
        $provide.decorator('$rootScope', ['$delegate', function($delegate){
            $delegate.constructor.prototype.$onRootScope = function(name, listener){
                var unsubscribe = $delegate.$on(name, listener);
                this.$on('$destroy', unsubscribe);
            };
            return $delegate;
        }]);
    }])

/**
 * 作者: Goodwin
 * 创建: 2016/3/18
 * 修改: 2016/3/18
 * 版本: 1.0.0
 * 描述: 全局参数配置,菜单状态配置,程序初始化监听等
 * */

'use strict';
angular.module('iRestApp')
    .run(['$rootScope', '$location', '$state', '$window', '$injector', function ($rootScope, $location, $state, $window, $injector) {
        //参数配置
        $rootScope.configures = {
            baseUrl: '/',
            backgound: false, //是否有背景图片
            pageDefaultSize: parseInt($window.localStorage.page_size) || 10, //默认列表加载条数
            //pageDefaultSize:5, //默认列表加载条数
            pageAllSize: 10000,
            asideMenu: true, //是否有侧菜单
            asideMenuShow: true, //是否显示侧菜单
            username: $window.sessionStorage.topName || '',//登录用户名
            account: {
                user_id: $window.sessionStorage.user_id,
                role_id: $window.sessionStorage.role_id,
                username: $window.sessionStorage.username
            }, //当前账号信息
            buttonSub: true,
            sysPage: 'page-login',
            lang: $window.localStorage.i18n_key || 'zh_CN.UTF-8',
            accessToken: $window.sessionStorage.accessToken, //读取token记录
            macAddress: $window.sessionStorage.macAddress, //读取mac记录
            macStatus: true // 默认设备在线，不出提示
        };

        //存路径,方便面包屑调用
        $rootScope.location = $location;
        //监听登录事件
        $rootScope.$on('relogin', function () {
            $state.go('Login');
        });


        //配置子状态过滤列表
        var menuConfig = $rootScope.menuConfig = {
            //以下状态为主状态
            mainState: ['Account', 'Wifi', 'Login', 'Menu', 'Vds', 'Ad', 'Cms'],
            //以下包含状态为编辑状态,不更新菜单
            subMenuFilter: ['Add', 'Edit', 'Clone', 'Add1', 'Edit1', 'Add2', 'Edit2', 'RightsSet', 'View',
                'DevicePortsShow', 'DomainAdd', 'StaticAdd', 'StaticEdit', 'DomainEdit' ],
            //以下状态没有左侧列表
            asideMenuFilter: [
                'Device', 'Video', 'Book', 'Ad', 'Model'],
            //业务模块
            mainWorks: ['Account', 'Wifi', 'Vds', 'Ad', 'Cms'],

        };

        //监听状态,切换菜单
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            //判断平台
            var toMainState = toState.name.split('.')[0],
                fromMainState = fromState.name.split('.')[0],
            //获取子级状态值
                toSubState = _.last(toState.url.split('/'), _.keys(toParams).length + 1)[0],
                toMainSubStateArray = _.initial(toState.url.split('/'), _.keys(toParams).length + (_.indexOf(menuConfig.subMenuFilter, toSubState) >= 0?1:0)),
            //记录当期子状态(排除edit,add等状态,共cms使用)
                toMainSubstate = _.last(toMainSubStateArray),
                toSubStateUrl = '/' + toMainState + toMainSubStateArray.join('/'),
                fromSubState = _.last(fromState.url.split('/'), _.keys(fromParams).length + 1)[0],
                edit = false;

            //检验有无token值,没有则定向到登录页
            if (!$rootScope.configures.accessToken && toState.name != 'Login') {
                //阻止模板解析,直接跳转
                event.preventDefault();
                //保存状态名,登录后继续该状态操作
                $rootScope.configures.toState = toState.name;
                $state.go('Login');
                return;
            }

            //当页面切换时，清空alert.
            var alertService = $injector.get('AlertService');
            if (alertService) {
                alertService.clean();
            }

            // 清空mac跳转标记
            

            //判断页面模块,login,导航或内容页(控制body样式)
            

            //判断是否为主菜单
           

            //判断是否显示左侧菜单
            


            //判处新增与编辑状态
            

            
            // 获取登录用户对应的权限
            // menuServer.getMenuIdByUrl(toMainState, toSubStateUrl)
            //     .then(function(data) {
            //        // name  toSubState  改成 返回的id
            //         return fetchAccConfigure.get(data)
            //     })
            //     .then(function (data) {
            //         $rootScope.CurrentConfigure = data;
            //     });
            

        })
    }])


