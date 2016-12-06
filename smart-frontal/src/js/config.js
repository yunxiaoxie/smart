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
