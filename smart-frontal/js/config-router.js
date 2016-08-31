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
                templateUrl: 'html/login.html',
                views: {
                    'rootView': {
                        templateUrl: 'html/login.html'
                    }
                }
            })
            .state('Main', {
                url: '/Main',
                templateUrl: 'html/account/main.html',
                views: {
                    'rootView': {
                        templateUrl: 'html/account/main.html'
                    }
                },
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
            

        $urlRouterProvider.otherwise('/Login');   //其他的都转到登录页
    }])
