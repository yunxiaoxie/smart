config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', '$provide'];
function config($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $provide) {
    $locationProvider.html5Mode(false).hashPrefix('');
    //$httpProvider.defaults.useXDomain = true;
    //$httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    /**注册拦截*/
    $httpProvider.interceptors.push('UrlInterceptor');
    $httpProvider.interceptors.push('EncryptInterceptor');
    $httpProvider.interceptors.push('TimestampMarker');
    $httpProvider.interceptors.push('SessionInjector');
    $httpProvider.interceptors.push('HttpInterceptor');


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

    $stateProvider
    .state("login", {
        name: 'login',
        url: '/login',
        template: require("./views/login.html")
    })
    .state("load", {
        name: 'load',
        url: '/load',
        template: require("./views/load.html")
    })
    .state("main", {
        name: 'main',
        url: '/main',
        controller: 'HomeController',
        template: require("./views/main.html")
    })
    .state("main.unauthorized",{
        name: 'unauthorized',
        url: '/unauthorized',
        template: require("./views/unauthorized.html")
    })
    // .state('main.deliverplan', {
    //     name: 'deliverplan',
    //     url: '/deliverplan',
    //     template: require('./views/deliverplanlist.html'),
    //     controller: 'DeliverPlanListController',
    //     permission: 'delivery_page'
    // })
    /*************************业务模块********************************/
    .state('main.overview', {
        url: '/Overview',
        views: {
            'contentView': {
                template: require('./views/module/overview.html')
            }
        }
    })
    .state('main.reports', {
        url: '/Reports',
        views: {
            'contentView': {
                template: require('./views/module/reports.html')
            }
        }
    })
    .state('main.tables', {
        url: '/Tables',
        views: {
            'contentView': {
                template: require('./views/module/table.html')
            }
        }
    })
    .state('main.trees', {
        url: '/Trees',
        views: {
            'contentView': {
                template: require('./views/module/tree.html')
            }
        }
    })
    .state('main.xeditable', {
        url: '/XEditable',
        views: {
            'contentView': {
                template: require('./views/module/xeditable.html')
            }
        }
    })
    .state('main.upload', {
        url: '/Upload',
        views: {
            'contentView': {
                template: require('./views/module/upload.html')
            }
        }
    })
    .state('main.globalexception', {
        url: '/Exception',
        views: {
            'contentView': {
                template: require('./views/module/exception.html')
            }
        }
    })
    .state('main.canvas', {
        url: '/Canvas',
        views: {
            'contentView': {
                template: require('./views/module/canvas.html')
            }
        }
    })

    
    // //默认登录页
    $urlRouterProvider.otherwise("/login");
}

export default config
