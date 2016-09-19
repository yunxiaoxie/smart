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
                        'dist/js/components/main-components.min.js',
                        'dist/js/controllers/main-controllers.js',
                        //'dist/js/services/main-services.min.js',
                        'dist/js/directives/main-directives.js',
                        //'dist/js/filters/main-filters.min.js',
                        'dist/js/interceptors/main-interceptors.min.js'
                    ]
                },
            ]
        });
    }])
