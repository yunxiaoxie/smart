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
