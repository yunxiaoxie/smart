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
