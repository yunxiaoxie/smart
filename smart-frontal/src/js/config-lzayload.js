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
                        //'js/services/main-services.min.js',
                        'js/directives/main-directives.js',
                        'js/filters/main-filters.js',
                        'js/interceptors/main-interceptors.js'
                    ]
                },
            ]
        });
    }])
