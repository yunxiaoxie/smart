run.$inject = ['$rootScope', '$location', '$state', '$window', '$injector', '$templateCache'];
function run($rootScope, $location, $state, $window, $injector, $templateCache) {

    // for global message template cache.
    $templateCache.put('error-messages', require('./views/error-messages.html'));
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
        $state.go('login');
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
    /*$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
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
            $state.go('login');
            return;
        }
        

    })*/
}

export default run
