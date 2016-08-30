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
            .state('Wifi', {    // 点击外面的menu 进来后默认会取  wifi 默认有的第1个菜单和链接
                url: '/Wifi',
                views: {
                    'rootView': {
                        templateUrl: 'html/wifi/frame.html',
                        controller: 'PlatformCtrl'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['mainModule','fileUpload','wifiModule']);
                    }]
                }
            })
            .state('Account', {   // 点击外面的menu 进来后默认会取  account 默认有的第1个菜单和链接
                url: '/Account',
                views: {
                    'rootView': {
                        templateUrl: 'html/account/frame.html',
                        controller: 'PlatformCtrl'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['mainModule','fileUpload','accountModule']);
                    }]
                }
            })

            .state('Account.account_system_platformserver', { // 云账号/系统管理/平台
                url: '/AccountSystem/AccountPlatform',
                views: {
                    'contentView': {
                        templateUrl: 'html/account/configure/platform/PlatServer.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('accSystemMgControllers');
                    }]
                }
            })
            .state('Account.account_system_platformserver_edit', {
                url: '/AccountSystem/AccountPlatform/Edit/:id/:name/:menu/:link',
                views: {
                    'contentView': {
                        templateUrl: 'html/account/configure/platform/PlatServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('accSystemMgControllers');
                    }]
                }
            })
            .state('Account.account_system_platformserver_add', {
                url: '/AccountSystem/AccountPlatform/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/account/configure/platform/PlatServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('accSystemMgControllers');
                    }]
                }
            })
            .state('Account.account_system_resourceserver', { // 云账号/系统管理/资源
                url: '/AccountSystem/AccountResource',
                views: {
                    'contentView': {
                        templateUrl: 'html/account/configure/resource/ResourceServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('accSystemMgControllers');
                    }]
                }
            })
            .state('Account.account_system_resourceserver_edit', {
                url: '/AccountSystem/AccountResource/Edit/:id/:platform_id/:name/:rights/:link/:pid/:allpid/:seq/:create_enable/:delete_enable/:update_enable/:retrieve_enable',
                views: {
                    'contentView': {
                        templateUrl: 'html/account/configure/resource/ResourceServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('accSystemMgControllers');
                    }]
                }
            })
            .state('Account.account_system_resourceserver_add', {
                url: '/AccountSystem/AccountResource/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/account/configure/resource/ResourceServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('accSystemMgControllers');
                    }]
                }
            })

            .state('Account.account_configure_roleserver', { // 云账号/帐号管理/角色
                url: '/AccountConfigure/AccountRole',
                views: {
                    'contentView': {
                        templateUrl: 'html/account/configure/role/RoleServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('accAccountMgControllers');
                    }]
                }
            })
            .state('Account.account_configure_roleserver_edit', {
                url: '/AccountConfigure/AccountRole/Edit/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/account/configure/role/RoleServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('accAccountMgControllers');
                    }]
                }
            })
            .state('Account.account_configure_roleserver_add', {
                url: '/AccountConfigure/AccountRole/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/account/configure/role/RoleServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('accAccountMgControllers');
                    }]
                }
            })

            .state('Account.account_configure_role_configure', {   // 云账号/帐号管理/角色/权限分配
                url: '/AccountConfigure/AccountRole/RightsSet/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/account/configure/rights/Configure.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('accAccountMgControllers');
                    }]
                }
            })

            .state('Account.account_configure_userserver', { // 云账号/帐号管理/云帐户
                url: '/AccountConfigure/AccountUser',
                views: {
                    'contentView': {
                        templateUrl: 'html/account/configure/user/UserServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('accAccountMgControllers');
                    }]
                }
            })
            .state('Account.account_configure_userserver_edit', {
                url: '/AccountConfigure/AccountUser/Edit/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/account/configure/user/UserServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('accAccountMgControllers');
                    }]
                }
            })
            .state('Account.account_configure_userserver_add', {
                url: '/AccountConfigure/AccountUser/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/account/configure/user/UserServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('accAccountMgControllers');
                    }]
                }
            })

            .state('Account.account_configure_personserver', { // 云账号/帐号管理/个性化
                url: '/AccountConfigure/AccountPersonalize',
                views: {
                    'contentView': {
                        templateUrl: 'html/account/configure/personalize/PersonServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('accAccountMgControllers');
                    }]
                }
            })
            .state('Account.account_configure_personserver_edit', {
                url: '/AccountConfigure/AccountPersonalize/Edit/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/account/configure/personalize/PersonServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('accAccountMgControllers');
                    }]
                }
            })
            .state('Account.account_configure_personserver_add', {
                url: '/AccountConfigure/AccountPersonalize/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/account/configure/personalize/PersonServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('accAccountMgControllers');
                    }]
                }
            })

            .state('Wifi.wifi_configure_authservice', { // 配置/策略配置/认证服务
                url: '/Configure/Policy/AuthService',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/authservice/AuthServiceWrap.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigurePolicyAuthControllers');
                    }]
                }
            })
            .state('Wifi.wifi_configure_authservice_edit1', {
                url: '/Configure/Policy/AuthService/Edit1/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/authservice/AuthServiceWrapEdit1.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigurePolicyAuthControllers');
                    }]
                }
            })
            .state('Wifi.wifi_configure_authservice_edit2', {
                url: '/Configure/Policy/AuthService/Edit2/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/authservice/AuthServiceWrapEdit2.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigurePolicyAuthControllers');
                    }]
                }
            })
            .state('Wifi.wifi_configure_authservice_add1', {
                url: '/Configure/Policy/AuthService/Add1',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/authservice/AuthServiceWrapEdit1.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigurePolicyAuthControllers');
                    }]
                }
            })
            .state('Wifi.wifi_configure_authservice_add2', {
                url: '/Configure/Policy/AuthService/Add2',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/authservice/AuthServiceWrapEdit2.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigurePolicyAuthControllers');
                    }]
                }
            })

            .state('Wifi.wifi_configure_authrules', { // 配置/策略配置/认证策略
                url: '/Configure/Policy/AuthRules',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/authrule/AuthRuleServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigurePolicyAuthControllers');
                    }]
                }
            })
            .state('Wifi.wifi_configure_authrulesedit', {
                url: '/Configure/Policy/AuthRules/Edit/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/authrule/AuthRuleServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigurePolicyAuthControllers');
                    }]
                }
            })
            .state('Wifi.wifi_configure_authrulesadd', {
                url: '/Configure/Policy/AuthRules/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/authrule/AuthRuleServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigurePolicyAuthControllers');
                    }]
                }
            })

            .state('Wifi.wifi_configure_wlansecurityrule', { // 配置/策略配置/WLAN安全资源
                url: '/Configure/Policy/WlanSecurityRule',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/wlansecurity/WlanSecurityServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigurePolicyLanControllers');
                    }]
                }
            })
            .state('Wifi.wifi_configure_wlansecurityruleedit', {
                url: '/Configure/Policy/WlanSecurityRule/Edit/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/wlansecurity/WlanSecurityServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigurePolicyLanControllers');
                    }]
                }
            })
            .state('Wifi.wifi_configure_wlansecurityruleadd', {
                url: '/Configure/Policy/WlanSecurityRule/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/wlansecurity/WlanSecurityServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigurePolicyLanControllers');
                    }]
                }
            })

            .state('Wifi.wifi_configure_wlanlanrule', { // 配置/策略配置/WLAN/LAN策略资源
                url: '/Configure/Policy/WlanRule',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/wlanlan/WlanLanServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigurePolicyLanControllers');
                    }]
                }
            })
            .state('Wifi.wifi_configure_wlanlanruleedit', {
                url: '/Configure/Policy/WlanRule/Edit/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/wlanlan/WlanLanServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigurePolicyLanControllers');
                    }]
                }
            })
            .state('Wifi.wifi_configure_wlanlanruleadd', {
                url: '/Configure/Policy/WlanRule/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/wlanlan/WlanLanServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigurePolicyLanControllers');
                    }]
                }
            })

            .state('Wifi.wifi_configure_vslanlanrule', { // 配置/策略配置/VSLAN策略资源
                url: '/Configure/Policy/VslanRule',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/vslan/VslanServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigurePolicyLanControllers');
                    }]
                }
            })
            .state('Wifi.wifi_configure_vslanlanruleedit', {
                url: '/Configure/Policy/VslanRule/Edit/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/vslan/VslanServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigurePolicyLanControllers');
                    }]
                }
            })
            .state('Wifi.wifi_configure_vslanlanruleadd', {
                url: '/Configure/Policy/VslanRule/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/vslan/VslanServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigurePolicyLanControllers');
                    }]
                }
            })

            .state('Wifi.wifi_configure_portalrule', { // 配置/策略配置/PORTAL资源
                url: '/Configure/Policy/PortalRule',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/portalargs/PortalRuleServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigurePolicyAuthControllers');
                    }]
                }
            })
            .state('Wifi.wifi_configure_portalruleedit', {
                url: '/Configure/Policy/PortalRule/Edit/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/portalargs/PortalRuleServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigurePolicyAuthControllers');
                    }]
                }
            })
            .state('Wifi.wifi_configure_portalruleadd', {
                url: '/Configure/Policy/PortalRule/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/portalargs/PortalRuleServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigurePolicyAuthControllers');
                    }]
                }
            })

            .state('Wifi.wifi_configure_portalcustom', { // 配置/内置PORTAL/PORTAL定制
                url: '/Configure/Portal/PortalCustomize',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/portallist/PortalCustomServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureMaintainControllers');
                    }]
                }
            })
            .state('Wifi.wifi_configure_portalcustomedit', {
                url: '/Configure/Portal/PortalCustomize/Edit/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/portallist/PortalCustomServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureMaintainControllers');
                    }]
                }
            })
            .state('Wifi.wifi_configure_portalcustomadd', {
                url: '/Configure/Portal/PortalCustomize/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/portallist/PortalCustomServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureMaintainControllers');
                    }]
                }
            })

            .state('Wifi.wifi_configure_portaldefine', { // 配置/内置PORTAL/PORTAL自定义
                url: '/Configure/Portal/PortalDefine',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/defineportal/PortalDefineServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureMaintainControllers');
                    }]
                }
            })
            .state('Wifi.wifi_configure_portaldefineedit', {
                url: '/Configure/Portal/PortalDefine/Edit/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/defineportal/PortalDefineServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureMaintainControllers');
                    }]
                }
            })
            .state('Wifi.wifi_configure_portaldefineadd', {
                url: '/Configure/Portal/PortalDefine/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/defineportal/PortalDefineServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureMaintainControllers');
                    }]
                }
            })

            .state('Wifi.wifi_configure_maintupgradepolicy', { // 设备升级策略
                url: '/Configure/Maintain/DeviceUpgradePolicy',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/device/upgradepolicy/upgrade-policy.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiDeviceBasicControllers');
                    }]
                }
            })

            .state('Wifi.wifi_configure_maintupgradepolicy_add', {
                url: '/Configure/Maintain/DeviceUpgradePolicy/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/device/upgradepolicy/upgrade-policy-edit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiDeviceBasicControllers');
                    }]
                }
            })
            .state('Wifi.wifi_configure_maintupgradepolicy_edit', {
                url: '/Configure/Maintain/DeviceUpgradePolicy/Edit/:id/:name/:rule_seq/:type/:mac/:fw_ver/:location/:sel_fw_ver/:url/:is_save/:is_reboot/:enable/:edit_icon_enable',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/device/upgradepolicy/upgrade-policy-edit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiDeviceBasicControllers');
                    }]
                }
            })

            .state('Wifi.wifi_configure_maintlogserver', { // 配置/设备维护/日志服务器
                url: '/Configure/Maintain/MaintLogServer',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/logserver/MaintLogServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureMaintainControllers');
                    }]
                }
            })
            .state('Wifi.wifi_configure_maintlogserver_edit', {
                url: '/Configure/Maintain/MaintLogServer/Edit/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/logserver/MaintLogServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureMaintainControllers');
                    }]
                }
            })
            .state('Wifi.wifi_configure_maintlogserver_add', {
                url: '/Configure/Maintain/MaintLogServer/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/logserver/MaintLogServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureMaintainControllers');
                    }]
                }
            })


            .state('Wifi.wifi_configure_location_locationbaseserver', { // 配置/位置/位置定义
                url: '/Configure/Location/LocationBasic',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/location/LocationBaseServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['ztree','wifiLocationBasicControllers']);
                    }]
                }
            })

            .state('Wifi.wifi_monitor_status_proclient', { // 监控/状态/探针用户
                url: '/Monitor/Status/ProbeClient',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/monitor/probe/ProbeClientServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiMonitorStatusControllers');
                    }]
                }
            })
            .state('Wifi.wifi_monitor_status_devicestatus', { // 监控/状态/设备状态
                url: '/Monitor/Status/DeviceStatus',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/monitor/devicestatuslists/DeviceStatusServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['ztree','wifiMonitorStatusControllers']);
                    }]
                }
            })
            .state('Wifi.wifi_monitor_logs_operaationlog', { // 监控/日志/操作日志
                url: '/Monitor/Logs/OperationLog',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/monitor/logs/OperationLogServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiMonitorLogsControllers');
                    }]
                }
            })

            .state('Wifi.wifi_monitor_logs_clientlog', { // 监控/日志/用户日志
                url: '/Monitor/Logs/ClientLog',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/monitor/logs/ClientLogServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiMonitorLogsControllers');
                    }]
                }
            })
            .state('Wifi.wifi_monitor_logs_devicelog', { // 监控/日志/设备日志
                url: '/Monitor/Logs/DeviceLog',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/monitor/logs/DeviceLogServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiMonitorLogsControllers');
                    }]
                }
            })


            .state('Wifi.wifi_monitor_status_clientstatus', { // 监控/状态/Client状态
                url: '/Monitor/Status/ClientStatus',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/monitor/clientstatuslists/ClientStatusServer.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiMonitorStatusControllers');
                    }]
                }
            })
            .state('Wifi.wifi_monitor_status_apstatus', { // 监控/状态/AP状态资源
                url: '/Monitor/Status/ApStatus',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/monitor/apstatuslists/ApStatusServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiMonitorStatusControllers');
                    }]
                }
            })
            .state('Wifi.wifi_monitor_status_apstatus_edit', {  // 监控/状态/AP状态资源  查看明细
                url: '/Monitor/Status/ApStatus/Edit/:mac',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/monitor/apstatuslists/ApStatusServerView.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiMonitorStatusControllers');
                    }]
                }
            })

            .state('Wifi.wifi_users_identity_userroleidengtity', {  // 用户/角色/角色
                url: '/Users/UserRole/UserRoleIdentityProfiles',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/users/identity/UserRoleServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiUsersRoleControllers');
                    }]
                }
            })
            .state('Wifi.wifi_users_identity_userroleidengtity_edit', {
                url: '/Users/UserRole/UserRoleIdentityProfiles/Edit/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/users/identity/UserRoleServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiUsersRoleControllers');
                    }]
                }
            })
            .state('Wifi.wifi_users_identity_userroleidengtity_add', {
                url: '/Users/UserRole/UserRoleIdentityProfiles/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/users/identity/UserRoleServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiUsersRoleControllers');
                    }]
                }
            })
            .state('Wifi.wifi_users_builtin_userroleusers', {  // 用户/角色/本地用户
                url: '/Users/UserRole/UserRoleUsers',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/users/builtin/UserRoleUsersServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiUsersRoleControllers');
                    }]
                }
            })
            .state('Wifi.wifi_users_builtin_userroleusers_edit', {
                url: '/Users/UserRole/UserRoleUsers/Edit/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/users/builtin/UserRoleUsersServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiUsersRoleControllers');
                    }]
                }
            })
            .state('Wifi.wifi_users_builtin_userroleusers_add', {
                url: '/Users/UserRole/UserRoleUsers/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/users/builtin/UserRoleUsersServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiUsersRoleControllers');
                    }]
                }
            })
            .state('Wifi.wifi_users_applink', {  // 用户/角色/APP联动
                url: '/Users/UserRole/AppLink',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/users/applink/AppLinkServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiUsersRoleControllers');
                    }]
                }
            })
            .state('Wifi.wifi_users_applink_edit', {
                url: '/Users/UserRole/AppLink/Edit/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/users/applink/AppLinkServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiUsersRoleControllers');
                    }]
                }
            })
            .state('Wifi.wifi_users_applink_add', {
                url: '/Users/UserRole/AppLink/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/users/applink/AppLinkServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiUsersRoleControllers');
                    }]
                }
            })

            .state('Wifi.wifi_users_admission_time', {  // 用户/接入/时间
                url: '/Users/Admission/AdmissionTime',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/users/whens/AdmissionTimeServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiUsersAdminssionControllers');
                    }]
                }
            })
            .state('Wifi.wifi_users_admission_time_edit', {
                url: '/Users/Admission/AdmissionTime/Edit/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/users/whens/AdmissionTimeServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiUsersAdminssionControllers');
                    }]
                }
            })
            .state('Wifi.wifi_users_admission_time_add', {
                url: '/Users/Admission/AdmissionTime/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/users/whens/AdmissionTimeServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiUsersAdminssionControllers');
                    }]
                }
            })

            .state('Wifi.wifi_users_admission_locations', {  // 用户/接入/位置接入
                url: '/Users/Admission/AdmissionLocations',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/users/wheres/AdmissionLocationsServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiUsersAdminssionControllers');
                    }]
                }
            })
            .state('Wifi.wifi_users_admission_locations_edit', {
                url: '/Users/Admission/AdmissionLocations/Edit/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/users/wheres/AdmissionLocationsServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiUsersAdminssionControllers');
                    }]
                }
            })
            .state('Wifi.wifi_users_admission_locations_add', {
                url: '/Users/Admission/AdmissionLocations/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/users/wheres/AdmissionLocationsServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiUsersAdminssionControllers');
                    }]
                }
            })

            .state('Wifi.wifi_users_admissin_policy', {  // 用户/接入/接入策略
                url: '/Users/Admission/AdmissionPolicy',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/users/conn/AdmissionPolicyServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiUsersAdminssionControllers');
                    }]
                }
            })
            .state('Wifi.wifi_users_admissin_policy_edit', {
                url: '/Users/Admission/AdmissionPolicy/Edit/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/users/conn/AdmissionPolicyServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiUsersAdminssionControllers');
                    }]
                }
            })
            .state('Wifi.wifi_users_admissin_policy_add', {
                url: '/Users/Admission/AdmissionPolicy/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/users/conn/AdmissionPolicyServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiUsersAdminssionControllers');
                    }]
                }
            })

            .state('Wifi.wifi_users_rights_accesspolicy', { // 用户/权限/访问策略
                url: '/Users/Rights/AccessPolicy',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/users/accesspolicy/AccessPolicyWrap.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiUsersRightsControllers');
                    }]
                }
            })
            .state('Wifi.wifi_users_rights_accesspolicy_edit', {
                url: '/Users/Rights/AccessPolicy/Edit/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/users/accesspolicy/AccessPolicyWrapEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiUsersRightsControllers');
                    }]
                }
            })
            .state('Wifi.wifi_users_rights_accesspolicy_add', {
                url: '/Users/Rights/AccessPolicy/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/users/accesspolicy/AccessPolicyWrapEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiUsersRightsControllers');
                    }]
                }
            })
            .state('Wifi.wifi_users_rights_rightspolicy', { // 用户/权限/权限策略
                url: '/Users/Rights/RightsPolicy',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/users/rights/RightsPolicyWrap.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiUsersRightsControllers');
                    }]
                }
            })
            .state('Wifi.wifi_users_rights_rightspolicy_edit', {
                url: '/Users/Rights/RightsPolicy/Edit/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/users/rights/RightsPolicyWrapEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiUsersRightsControllers');
                    }]
                }
            })
            .state('Wifi.wifi_users_rights_rightspolicy_add', {
                url: '/Users/Rights/RightsPolicy/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/users/rights/RightsPolicyWrapEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiUsersRightsControllers');
                    }]
                }
            })

            .state('Wifi.wifi_users_accessrule_accrule', { // 用户/权限/访问规则
                url: '/Users/Rights/AccessRules',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/users/accessrule/AccessRulesWrap.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiUsersRightsControllers');
                    }]
                }
            })
            .state('Wifi.wifi_users_accessrule_accrule_edit', {
                url: '/Users/Rights/AccessRules/Edit/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/users/accessrule/AccessRulesWrapEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiUsersRightsControllers');
                    }]
                }
            })
            .state('Wifi.wifi_users_accessrule_accrule_add', {
                url: '/Users/Rights/AccessRules/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/users/accessrule/AccessRulesWrapEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiUsersRightsControllers');
                    }]
                }
            })

            .state('Wifi.wifi_security_firewallrule', { // 安全/防火墙
                url: '/Security/Firewall',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/security/firewall/FirewallServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiSecurityControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })

            .state('Wifi.wifi_security_firewallrule_edit', {
                url: '/Security/Firewall/Edit/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/security/firewall/FirewallServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiSecurityControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })
            .state('Wifi.wifi_security_firewallrule_add', {
                url: '/Security/Firewall/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/security/firewall/FirewallServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiSecurityControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })

            .state('Wifi.wifi_security_nat_snatrule', { // 安全/源Nat规则
                url: '/Security/Nat/SnatRule',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/security/snat/SnatServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiSecurityControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })

            .state('Wifi.wifi_security_nat_snatruleshow_edit', {
                url: '/Security/Nat/SnatRule/Edit/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/security/snat/SnatServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiSecurityControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })
            .state('Wifi.wifi_security_nat_snatruleshow_add', {
                url: '/Security/Nat/SnatRule/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/security/snat/SnatServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiSecurityControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })
            .state('Wifi.wifi_security_nat_dnatrule', { // 安全/目的Nat规则
                url: '/Security/Nat/DnatRule',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/security/dnat/DnatServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiSecurityControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })

            .state('Wifi.wifi_security_nat_dnatruleshow_edit', {
                url: '/Security/Nat/DnatRule/Edit/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/security/dnat/DnatServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiSecurityControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })
            .state('Wifi.wifi_security_nat_dnatruleshow_add', {
                url: '/Security/Nat/DnatRule/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/security/dnat/DnatServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiSecurityControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })

            .state('Wifi.wifi_configure_blacklist', { // 黑白名单检索
                url: '/Configure/Policy/BlackWhiteRules',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/blackwhitelist/BlackServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigurePolicyAuthControllers');
                    }]
                }
            })
            .state('Wifi.wifi_configure_blacklist_edit', { // 黑名单编辑
                url: '/Configure/Policy/BlackWhiteRules/Edit/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/blackwhitelist/BlackServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigurePolicyAuthControllers');
                    }]
                }
            })
            .state('Wifi.wifi_configure_blacklist_add', {// 黑名单添加
                url: '/Configure/Policy/BlackWhiteRules/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/blackwhitelist/BlackServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigurePolicyAuthControllers');
                    }]
                }
            })

            .state('Wifi.wifi_configure_devices', { // 外面套的设备列表
                url: '/Configure/Device',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/device/DevicesServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiDeviceBasicControllers');
                    }]
                }
            })

            .state('Wifi.wifi_configure_devices_add', {  //  配置/设备配置/设备资源 的新增
                url: '/Configure/Device/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/device/DeviceAdd.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiDeviceBasicControllers');
                    }]
                }
            })

            .state('Wifi.wifi_configure_devicebasicserver', { // 配置/设备配置/设备资源  就1个编辑页
                url: '/Configure/Device/DeviceBasic',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/device/vsm/DeviceBasicServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['ztree','wifiDeviceBasicControllers']);
                    }]
                },
                access: {
                    requireMac: true
                }
            })

            .state('Wifi.wifi_configure_devicednsserver', { // 配置/设备配置/DNS配置   就1个编辑页
                url: '/Configure/Device/DeviceDns',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/device/dns/DeviceDnsServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiDeviceBasicControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })

            .state('Wifi.wifi_configure_deviceportshowserver', { // 配置/设备配置/物理接口
                url: '/Configure/Device/DevicePorts',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/device/phyports/DevicePhyPortsServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiDevicePortsControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })
            .state('Wifi.wifi_configure_deviceportshowserver_edit', {
                url: '/Configure/Device/DevicePorts/Edit/:slot/:port',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/device/phyports/DevicePhyPortsServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiDevicePortsControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })

            .state('Wifi.wifi_configure_devicebridgeshowserver', { // 配置/设备配置/桥接口
                url: '/Configure/Device/DevicePorts/DeviceBridge',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/device/bridge/DeviceBridgeServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiDevicePortsControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })
            .state('Wifi.wifi_configure_devicebridgeshowserver_edit', {
                url: '/Configure/Device/DevicePorts/DeviceBridge/Edit/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/device/bridge/DeviceBridgeServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiDevicePortsControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })
            .state('Wifi.wifi_configure_devicebridgeshowserver_add', {
                url: '/Configure/Device/DevicePorts/DeviceBridge/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/device/bridge/DeviceBridgeServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiDevicePortsControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })

            .state('Wifi.wifi_configure_devicevslanshowserver', { // 配置/设备配置/VSLAN接口
                url: '/Configure/Device/DevicePorts/DeviceVslan',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/device/vslan/DeviceVslanServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiDevicePortsControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })
            .state('Wifi.wifi_configure_devicevslanshowserver_edit', {
                url: '/Configure/Device/DevicePorts/DeviceVslan/Edit/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/device/vslan/DeviceVslanServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiDevicePortsControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })
            .state('Wifi.wifi_configure_devicevslanshowserver_add', {
                url: '/Configure/Device/DevicePorts/DeviceVslan/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/device/vslan/DeviceVslanServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiDevicePortsControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })

            .state('Wifi.wifi_configure_devicevlanshowserver', { // 配置/设备配置/VLAN接口
                url: '/Configure/Device/DevicePorts/DeviceVlan',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/device/vlan/DeviceVlanServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiDevicePortsControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })
            .state('Wifi.wifi_configure_devicevlanshowserver_edit', {
                url: '/Configure/Device/DevicePorts/DeviceVlan/Edit/:id/:phy',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/device/vlan/DeviceVlanServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiDevicePortsControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })
            .state('Wifi.wifi_configure_devicevlanshowserver_add', {
                url: '/Configure/Device/DevicePorts/DeviceVlan/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/device/vlan/DeviceVlanServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiDevicePortsControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })

            .state('Wifi.wifi_configure_devicevpnshowserver', { // 配置/设备配置/VPN接口
                url: '/Configure/Device/DevicePorts/DeviceVpn',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/device/vpn/DeviceVpnServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiDevicePortsControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })
            .state('Wifi.wifi_configure_devicevpnshowserver_edit', {
                url: '/Configure/Device/DevicePorts/DeviceVpn/Edit/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/device/vpn/DeviceVpnServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiDevicePortsControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })
            .state('Wifi.wifi_configure_devicevpnshowserver_add', {
                url: '/Configure/Device/DevicePorts/DeviceVpn/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/device/vpn/DeviceVpnServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiDevicePortsControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })

            .state('Wifi.wifi_configure_apradio', { // 配置/AP配置/Radio策略
                url: '/Configure/Ap/ApRadio',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/apradio/ApRadioServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureApSrpControllers');
                    }]
                }
            })
            .state('Wifi.wifi_configure_apradioedit', {
                url: '/Configure/Ap/ApRadio/Edit/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/apradio/ApRadioServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureApSrpControllers');
                    }]
                }
            })
            .state('Wifi.wifi_configure_apradioadd', {
                url: '/Configure/Ap/ApRadio/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/apradio/ApRadioServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureApSrpControllers');
                    }]
                }
            })

            .state('Wifi.wifi_configure_apsecurity', { // 配置/AP配置/Ap安全
                url: '/Configure/Ap/ApSecurity',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/apsecurity/ApSecurityServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureApSrpControllers');
                    }]
                }
            })


            .state('Wifi.wifi_configure_aprule', { // 配置/AP配置/Ap策略
                url: '/Configure/Ap/ApRule',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/aprule/ap-rule-server.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureApSrpControllers');
                    }]
                }
            })

            .state('Wifi.wifi_configure_aprule_add', {
                url: '/Configure/Ap/ApRule/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/aprule/ap-rule-server-edit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureApSrpControllers');
                    }]
                }
            })

            .state('Wifi.wifi_configure_aprule_edit', {
                url: '/Configure/Ap/ApRule/Edit/:id/:rule_type/:location',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/aprule/ap-rule-server-edit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureApSrpControllers');
                    }]
                }
            })



            .state('Wifi.wifi_configure_devicemaintrebootserver', { // 配置/设备维护/设备重启  外面要套个列表 1个页面
                url: '/Configure/Maintain/MaintShutdownRestart',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/device/reboot/RebootServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiDeviceBasicControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })

            .state('Wifi.wifi_configure_devicemaintcfgserver', { // 配置/设备维护/保存 导出 恢复  1个页面
                url: '/Configure/Maintain/MaintSaveCfg',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/device/cfgsave/CfgSaveServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiDeviceBasicControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })

            .state('Wifi.wifi_configure_devicelicense', { // 配置/设备维护/License列表
                url: '/Configure/Maintain/DeviceLicense',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/device/license/device-license-list.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiDeviceBasicControllers');
                    }]
                }
            })

            .state('Wifi.wifi_configure_devicelicense_edit', { // 配置/设备维护/License展示
                url: '/Configure/Maintain/DeviceLicense/Edit/:id/:mac/:name',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/device/license/device-license.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiDeviceBasicControllers');
                    }]
                }
            })


            .state('Wifi.wifi_configure_devicedateserver', { // 配置/设备配置/设备时间  外面要套个列表 1个页面
                url: '/Configure/Device/DeviceDateTime',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/device/deviceDateTime.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })


            .state('Wifi.wifi_configure_approbe', { // 配置/AP配置/AP探针策略
                url: '/Configure/Ap/ApProbe',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/proberule/ApProbeServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureApSrpControllers');
                    }]
                }
            })
            .state('Wifi.wifi_configure_approbe_edit', {
                url: '/Configure/Ap/ApProbe/Edit/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/proberule/ApProbeServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureApSrpControllers');
                    }]
                }
            })
            .state('Wifi.wifi_configure_approbeadd', {
                url: '/Configure/Ap/ApProbe/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/proberule/ApProbeServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureApSrpControllers');
                    }]
                }
            })


            .state('Wifi.wifi_configure_apbasicserver', { // 配置/AP配置/基本配置
                url: '/Configure/Ap/ApBasic',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/ap/ApServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['ztree','wifiConfigureApBasicControllers']);
                    }]
                }
            })
            .state('Wifi.wifi_configure_apbasicserver_edit', {
                url: '/Configure/Ap/ApBasic/Edit/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/ap/ApServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureApBasicControllers');
                    }]
                }
            })
            .state('Wifi.wifi_configure_apbasicserver_add', {
                url: '/Configure/Ap/ApBasic/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/ap/ApServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureApBasicControllers');
                    }]
                }
            })

            .state('Wifi.wifi_configure_apgroupserver', { //  配置/AP配置/ AP分组
                url: '/Configure/Ap/ApGroup',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/group/ApGroupServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['ztree','wifiConfigureApBasicControllers']);
                    }]
                }
            })
            .state('Wifi.wifi_configure_apgroupserveredit', {
                url: '/Configure/Ap/ApGroup/Edit/:id/:pid',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/group/ApGroupServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureApBasicControllers');
                    }]
                }
            })
            //.state('wifi.monitor', {
            //    url: '/Monitor',
            //    //abstract: true,
            //    resolve: {
            //        authenticated: function ($q, $location, $auth) {
            //
            //        }
            //    }
            //})
            //.state('wifi.monitor.status', {
            //    url: '/Status',
            //    //abstract: true,
            //    resolve: {
            //        authenticated: function ($q, $location, $auth) {
            //
            //        }
            //    }
            //})
            //监控图路由
            .state('Wifi.wifi_monitor_status_overview', {
                url: '/Monitor/Status/Overview',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/monitor/status/overview.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['highcharts','wifiMonitorControllers']);
                    }]
                }
            })
            //IP配置
            .state('Wifi.wifi_configure_device_deviceIp', {
                url: '/Configure/Device/DeviceIp',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/device/deviceIp.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })
            //IP配置——添加
            .state('Wifi.wifi_configure_device_deviceIp_add', {
                url: '/Configure/Device/DeviceIp/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/device/deviceIpAddAndEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })
            //IP配置——编辑
            .state('Wifi.wifi_configure_device_deviceIp_edit', {
                url: '/Configure/Device/DeviceIp/Edit/:id/:if_id/:type/:ip/:netmask/:is_control/:is_mange/:is_wanip',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/device/deviceIpAddAndEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })
            //目的路由
            .state('Wifi.wifi_configure_device_route', {
                url: '/Configure/Device/DeviceRoute',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/device/device-route.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })
            //目的路由——添加
            .state('Wifi.wifi_configure_device_route_add', {
                url: '/Configure/Device/DeviceRoute/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/device/routeAddAndEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })
            //目的路由——编辑
            .state('Wifi.wifi_configure_device_route_edit', {
                url: '/Configure/Device/DeviceRoute/Edit/:id/:destip/:netmask/:gw/:metric',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/device/routeAddAndEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })
            //策略路由
            .state('Wifi.wifi_configure_device_policyRoute', {
                url: '/Configure/Device/DevicePolicyRoute',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/device/policyRoute.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })
            //策略路由——添加
            .state('Wifi.wifi_configure_device_policyRoute_add', {
                url: '/Configure/Device/DevicePolicyRoute/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/device/policyRouteAddAndEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })
            //策略路由——编辑
            .state('Wifi.wifi_configure_device_policyRoute_edit', {
                url: '/Configure/Device/DevicePolicyRoute/Edit/:id/:name/:iif/:saddr/:smask/:daddr/:dmask/:metric/:gw',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/device/policyRouteAddAndEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })
            //DHCP配置
            .state('Wifi.wifi_configure_device_deviceDhcp', {
                url: '/Configure/Device/DeviceDhcp',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/device/deviceDhcp.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })
            //DHCP配置——域——添加
            .state('Wifi.wifi_configure_device_deviceDhcp_domainAdd', {
                url: '/Configure/Device/DeviceDhcp/DomainAdd',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/device/deviceDhcpDomainAddAndEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })
            //DHCP配置——域——编辑
            .state('Wifi.wifi_configure_device_deviceDhcp_domainEdit', {
                url: '/Configure/Device/DeviceDhcp/DomainEdit/:ip/:mask',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/device/deviceDhcpDomainAddAndEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })
            //DHCP配置——静态IP——添加
            .state('Wifi.wifi_configure_device_deviceDhcp_staticAdd', {
                url: '/Configure/Device/DeviceDhcp/StaticAdd',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/device/deviceDhcpStaticAddAndEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })
            //DHCP配置——静态IP——编辑
            .state('Wifi.wifi_configure_device_deviceDhcp_staticEdit', {
                url: '/Configure/Device/DeviceDhcp/StaticEdit/:hostname/:ip/:mac',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/device/deviceDhcpStaticAddAndEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })
            //定位服务器
            .state('Wifi.wifi_configure_device_deviceStaserver', {
                url: '/Configure/Device/ReServer',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/device/deviceStaserver.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })
            // 设备版本
            .state('Wifi.wifi_configure_deviceversion', { // 配置/设备维护/保存 导出 恢复
                url: '/Configure/Device/Version',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/maintain/device-version.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiDeviceBasicControllers');
                    }]
                },
                access: {
                    requireMac: true
                }
            })

            //AP升级策略
            .state('Wifi.wifi_configure_ap_upgrade', {
                url: '/Configure/Ap/Upgrade',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/ap/ApUpgrade.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureControllers');
                    }]
                }
            })
            .state('Wifi.wifi_configure_ap_upgrade_add', {
                url: '/Configure/Ap/Upgrade/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/ap/ApUpgradeAddAndEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureControllers');
                    }]
                }
            })
            .state('Wifi.wifi_configure_ap_upgrade_edit', {
                url: '/Configure/Ap/Upgrade/Edit/:id/:name/:rule_seq/:hw_ver/:ap_mac/:fw_ver/:location/:firware_filename/:enable',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/ap/ApUpgradeAddAndEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiConfigureControllers');
                    }]
                }
            })
            //AP版本
            .state('Wifi.wifi_configure_apversion', {
                url: '/Configure/Ap/ApVersion',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/ap/ApUpgradeMaintain.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['angular-ui-tree','wifiConfigureControllers']);
                    }]
                }
            })
            //设备版本
            .state('Wifi.wifi_configure_maintain_deviceversion',{
                url: '/Configure/Maintain/DeviceVersion',
                views: {
                    'contentView': {
                        templateUrl: 'html/wifi/configure/maintain/maintain-device-version.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('wifiDeviceBasicControllers');
                    }]
                }
            })
            //====================vds====================
            .state('Vds', {   // 点击外面的menu 进来后默认会取  dataPlat 默认有的第1个菜单和链接
                url: '/Vds',
                views: {
                    'rootView': {
                        templateUrl: 'html/vds/frame.html',
                        controller: 'PlatformCtrl'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['mainModule','fileUpload','highcharts','vdsModule']);
                    }]
                }
            })
            //系统设置,维度设置
            .state('Vds.vds_systemManager_dimension', {
                url: '/SystemManager/Dimension',
                views: {
                    'contentView': {
                        templateUrl: 'html/vds/systemManager/dimension.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('vdsSystemControllers');
                    }]
                }
            })
            .state('Vds.vds_systemManager_dimension_add', {
                url: '/SystemManager/Dimension/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/vds/systemManager/dimensionAddandEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('vdsSystemControllers');
                    }]
                }
            })
            .state('Vds.vds_systemManager_dimension_edit', {
                url: '/SystemManager/Dimension/Edit/:id/:pid/:name/:description',
                views: {
                    'contentView': {
                        templateUrl: 'html/vds/systemManager/dimensionAddandEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('vdsSystemControllers');
                    }]
                }
            })
            //维度设置结束
            //系统设置,资源设置
            .state('Vds.vds_systemManager_resourceManager', {
                url: '/SystemManager/ResourceManager',
                views: {
                    'contentView': {
                        templateUrl: 'html/vds/systemManager/resourceManager.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('vdsSystemControllers');
                    }]
                }
            })
            .state('Vds.vds_systemManager_resourceManager_add', {
                url: '/SystemManager/ResourceManager/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/vds/systemManager/resourceAddandEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('vdsSystemControllers');
                    }]
                }
            })
            .state('Vds.vds_systemManager_resourceManager_edit', {
                url: '/SystemManager/ResourceManager/Edit/:id/:name/:mac/:type',
                views: {
                    'contentView': {
                        templateUrl: 'html/vds/systemManager/resourceAddandEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('vdsSystemControllers');
                    }]
                }
            })
            //资源设置结束
            //系统设置,设备部署
            .state('Vds.vds_systemManager_deviceSetup', {
                url: '/SystemManager/DeviceSetup',
                views: {
                    'contentView': {
                        templateUrl: 'html/vds/systemManager/deviceSetup.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['infiniteScroll','vdsSystemControllers']);
                    }]
                }
            })

            //设备部署结束
            //实时监控开始
            .state('Vds.vds_realMonitor_clientMonitor', {
                url: '/RealMonitor/ClientMonitor',
                views: {
                    'contentView': {
                        templateUrl: 'html/vds/realMonitor/clientMonitor.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('vdsRealMonitorControllers');
                    }]
                }
            })
            //实时监控结束
            //实时热图开始
            .state('Vds.vds_realMonitor_heatMap', {
                url: '/RealMonitor/HeatMap',
                views: {
                    'contentView': {
                        templateUrl: 'html/vds/realMonitor/heatMap.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['heatmap','vdsRealMonitorControllers']);
                    }]
                }
            })
            //实时热图结束
            //历史热图开始
            .state('Vds.vds_statistics_historyHeatMap', {
                url: '/Statistics/HistoryHeatMap',
                views: {
                    'contentView': {
                        templateUrl: 'html/vds/statistics/historyHeatMap.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['heatmap','vdsStatisticsControllers']);
                    }]
                }
            })
            //历史热图结束


            //统计首页
            .state('Vds.dataplat_market_homepage', {
                url: '/Statistics/HomePage',
                views: {
                    'contentView': {
                        templateUrl: 'html/vds/statistics/homepage.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['genPdf','vdsStatisticsControllers']);
                    }]
                }
            })


            //进店人数
            .state('Vds.dataplat_market_loginCounts', {
                url: '/Statistics/LoginCounts',
                views: {
                    'contentView': {
                        templateUrl: 'html/vds/statistics/logincounts.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('vdsStatisticsControllers');
                    }]
                }
            })

            //驻留时间
            .state('Vds.dataplat_market_staytime', {
                url: '/Statistics/StayTime',
                views: {
                    'contentView': {
                        templateUrl: 'html/vds/statistics/staytime.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('vdsStatisticsControllers');
                    }]
                }
            })

            //新老顾客
            .state('Vds.dataplat_market_newoldclients', {
                url: '/Statistics/NewOldClients',
                views: {
                    'contentView': {
                        templateUrl: 'html/vds/statistics/newoldclients.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('vdsStatisticsControllers');
                    }]
                }
            })

            //峰谷图
            .state('Vds.dataplat_market_peakvalley', {
                url: '/Statistics/PeakValley',
                views: {
                    'contentView': {
                        templateUrl: 'html/vds/statistics/peakvalley.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('vdsStatisticsControllers');
                    }]
                }
            })

            //到店频率
            .state('Vds.dataplat_market_visitcounts', {
                url: '/Statistics/VisitCounts',
                views: {
                    'contentView': {
                        templateUrl: 'html/vds/statistics/visitcounts.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('vdsStatisticsControllers');
                    }]
                }
            })

            //手机品牌
            .state('Vds.dataplat_market_phonebrand', {
                url: '/Statistics/PhoneBrand',
                views: {
                    'contentView': {
                        templateUrl: 'html/vds/statistics/phonebrand.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('vdsStatisticsControllers');
                    }]
                }
            })


            .state('Vds.vds_systemmanager_accountuser', { // Vds 下的用户
                url: '/SystemManager/AccountUser',
                views: {
                    'contentView': {
                        templateUrl: 'html/vds/user/UserServer.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('vdsAccountVdsControllers');
                    }]
                }
            })
            .state('Vds.vds_systemmanager_accountuser_edit', {
                url: '/SystemManager/AccountUser/Edit/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/vds/user/UserServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('vdsAccountVdsControllers');
                    }]
                }
            })
            .state('Vds.vds_systemmanager_accountuser_add', {
                url: '/SystemManager/AccountUser/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/vds/user/UserServerEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('vdsAccountVdsControllers');
                    }]
                }
            })
            /**
             *
             * ====================广告平台====================
             *
             */
            .state('Ad', {   // 点击外面的menu 进来后默认会取  dataPlat 默认有的第1个菜单和链接
                url: '/Ad',
                views: {
                    'rootView': {
                        templateUrl: 'html/ad/frame.html',
                        controller: 'PlatformCtrl'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['mainModule','fileUpload','adModule']);
                    }]
                }
            })
            //模板管理
            //模板库
            .state('Ad.ad_admonitor_templates', {
                url: '/AdMonitor/Templates',
                views: {
                    'contentView': {
                        templateUrl: 'html/ad/tmplmgr/templates.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['infiniteScroll','adTmplmgrControllers']);
                    }]
                }
            })
            //模板定义
            .state('Ad.ad_tmplmgr_tmpldefines', {
                url: '/TmplMgr/TmplDefines',
                views: {
                    'contentView': {
                        templateUrl: 'html/ad/tmplmgr/tmpldefines.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('adTmplmgrControllers');
                    }]
                }
            })
            //模板定义新增编辑
            .state('Ad.ad_tmplmgr_tmpldefines_add', {
                url: '/TmplMgr/TmplDefines/Add/:template_id',
                views: {
                    'contentView': {
                        templateUrl: 'html/ad/tmplmgr/tmplAddandEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('adTmplmgrControllers');
                    }]
                }
            })

            .state('Ad.ad_tmplmgr_tmpldefines_edit', {
                url: '/TmplMgr/TmplDefines/Edit/:id/:name/:dirname/:template_id/:href',
                views: {
                    'contentView': {
                        templateUrl: 'html/ad/tmplmgr/tmplAddandEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('adTmplmgrControllers');
                    }]
                }
            })
            .state('Ad.ad_tmplmgr_tmpldefines_clone', {
                url: '/TmplMgr/TmplDefines/Clone/:id/:template_id/:href',
                views: {
                    'contentView': {
                        templateUrl: 'html/ad/tmplmgr/tmplAddandEdit.html',
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('adTmplmgrControllers');
                    }]
                }
            })
            //统计数据
            .state('Ad.ad_admonitor_tmplreport', {   // 点击外面的menu 进来后默认会取  dataPlat 默认有的第1个菜单和链接
                url: '/AdMonitor/TmplReport',
                views: {
                    'contentView': {
                        templateUrl: 'html/ad/monitor/tmplreport.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('adTmplreportControllers');
                    }]
                }
            })
            //短信报表
            .state('Ad.ad_admonitor_smsreport', {
                url: '/AdMonitor/SmsReport',
                views: {
                    'contentView': {
                        templateUrl: 'html/ad/monitor/smsreport.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('adSmsReportControllers');
                    }]
                }
            })
            //日志数据
            .state('Ad.ad_admonitor_adlogs', {
                url: '/AdMonitor/AdLogs',
                views: {
                    'contentView': {
                        templateUrl: 'html/ad/monitor/adlogs.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('adOperateLog');
                    }]
                }
            })
            .state('Ad.ad_admonitor_smsreport_view', {
                url: '/AdMonitor/SmsReport/View/:id/:mobile/:mac/:ssid/:operator/:province/:city/:content/:sta_os/:state/:create_time',
                views: {
                    'contentView': {
                        templateUrl: 'html/ad/monitor/smsview.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('adSmsReportControllers');
                    }]
                }
            })

            .state('Ad.ad_smsmgr_smssp', {   //  服务商
                url: '/SmsMgr/SmsSp',
                views: {
                    'contentView': {
                        templateUrl: 'html/ad/configure/smsSp/smsSp.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('adSmsMgrControllers');
                    }]
                }
            })
            .state('Ad.ad_smsmgr_smssp_edit', {   //  服务商编辑
                url: '/SmsMgr/SmsSp/Edit/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/ad/configure/smsSp/smsSpEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('adSmsMgrControllers');
                    }]
                }
            })
            .state('Ad.ad_smsmgr_smssp_add', {   //  服务商新增
                url: '/SmsMgr/SmsSp/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/ad/configure/smsSp/smsSpEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('adSmsMgrControllers');
                    }]
                }
            })

            .state('Ad.ad_smsmgr_smsacct', {   //  公众号
                url: '/SmsMgr/SmsAcct',
                views: {
                    'contentView': {
                        templateUrl: 'html/ad/configure/smsAcct/smsAccount.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('adSmsMgrControllers');
                    }]
                }
            })
            .state('Ad.ad_smsmgr_smsacct_edit', {   //  公众号编辑
                url: '/SmsMgr/SmsAcct/Edit/:id',
                views: {
                    'contentView': {
                        templateUrl: 'html/ad/configure/smsAcct/smsAccountEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('adSmsMgrControllers');
                    }]
                }
            })
            .state('Ad.ad_smsmgr_smsacct_add', {   //  公众号新增
                url: '/SmsMgr/SmsAcct/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/ad/configure/smsAcct/smsAccountEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('adSmsMgrControllers');
                    }]
                }
            })

            .state('Ad.ad_smsmgr_debugtool', {   //  调试工具 发送短信
                url: '/SmsMgr/DebugTool',
                views: {
                    'contentView': {
                        templateUrl: 'html/ad/configure/smsTest/smsPost.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('adSmsMgrControllers');
                    }]
                }
            })

            //广告管理
            //项目
            .state('Ad.ad_admgr_campaign', {
                url: '/AdMgr/Campaign',
                views: {
                    'contentView': {
                        templateUrl: 'html/ad/admgr/campaign.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('adAdmgrControllers');
                    }]
                }
            })

            //广告
            .state('Ad.ad_admgr_banners', {
                url: '/AdMgr/Banners',
                views: {
                    'contentView': {
                        templateUrl: 'html/ad/admgr/banners.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('adAdmgrControllers');
                    }]
                }
            })

            //项目新增编辑
            .state('Ad.ad_admgr_Campaign_add', {
                url: '/AdMgr/Campaign/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/ad/admgr/campaignAddandEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('adAdmgrControllers');
                    }]
                }
            })

            .state('Ad.ad_admgr_Campaign_edit', {
                url: '/AdMgr/Campaign/Edit/:id/:name/:weight/:views_cnt/:clicks_cnt/:activate/:expire/:active',
                views: {
                    'contentView': {
                        templateUrl: 'html/ad/admgr/campaignAddandEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('adAdmgrControllers');
                    }]
                }
            })

            //广告新增编辑
            .state('Ad.ad_admgr_Banners_add', {
                url: '/AdMgr/Banners/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/ad/admgr/bannerAddandEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('adAdmgrControllers');
                    }]
                }
            })

            .state('Ad.ad_admgr_Banners_edit', {
                url: '/AdMgr/Banners/Edit/:id/:name/:storagetype/:weight/:filedata/:imageurl/:width/:height/:url/:bannertext/:campaign_id/:active',
                views: {
                    'contentView': {
                        templateUrl: 'html/ad/admgr/bannerAddandEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('adAdmgrControllers');
                    }]
                }
            })


            /**
             *
             * ===================内容平台====================
             *
             */
            .state('Cms', {   // 点击外面的menu 进来后默认会取  dataPlat 默认有的第1个菜单和链接
                url: '/Cms',
                views: {
                    'rootView': {
                        templateUrl: 'html/cms/frame.html',
                        controller: 'PlatformCtrl'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(['mainModule','fileUpload','cmsModule']);
                    }]
                }
            })
            .state('Cms.cms_cmsmonitor_cmslog', {
                url: '/CmsMonitor/Log',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/monitor/adlogs.html'
                    }
                }
            })
            /** 资源*/
            //阅读模块
            .state('Cms.cms_cmsresource_book', {
                url: '/CmsResource/Book',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/resource/book/book.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsResourceControllers');
                    }]
                }
            })
            //阅读模块新增
            .state('Cms.cms_cmsresource_book_add', {
                url: '/CmsResource/Book/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/resource/book/bookAddandEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsResourceControllers');
                    }]
                }
            })
            //阅读模块编辑
            .state('Cms.cms_cmsresource_book_edit', {
                url: '/CmsResource/Book/Edit/:id/:name/:author/:views/:words/:bookimgs/:type_id/:start/:source/:summary/:uplocalurl/:remoteurl',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/resource/book/bookAddandEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsResourceControllers');
                    }]
                }
            })
            //广告模块
            .state('Cms.cms_cmsresource_ad', {
                url: '/CmsResource/Ad',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/resource/ad/ad.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsResourceControllers');
                    }]
                }
            })
            //广告模块新增
            .state('Cms.cms_cmsresource_ad_add', {
                url: '/CmsResource/Ad/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/resource/ad/adAddandEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsResourceControllers');
                    }]
                }
            })
            //广告模块编辑
            .state('Cms.cms_cmsresource_ad_edit', {
                url: '/CmsResource/Ad/Edit/:id/:bannerid/:img/:href/:alt',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/resource/ad/adAddandEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsResourceControllers');
                    }]
                }
            })
            /** 资源*/
            /** 应用android模块*/
            .state('Cms.cms_cmsresource_appandroid', {
                url: '/CmsResource/App/AppAndroid',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/resource/app/resourceapp.html',
                        data: {
                            type: 'android'
                        }
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsResourceControllers');
                    }]
                }
            })
            /** 应用iphone模块*/
            .state('Cms.cms_cmsresource_appiphone', {
                url: '/CmsResource/App/AppIphone',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/resource/app/resourceapp.html',
                        data: {
                            type: 'iphone'
                        }
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsResourceControllers');
                    }]
                }
            })

            /** 应用android模块新增、编辑 */
            .state('Cms.cms_cmsresource_appandroid_add', {
                url: '/CmsResource/App/AppAndroid/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/resource/app/androidAddandEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsResourceControllers');
                    }]
                }
            })
            .state('Cms.cms_cmsresource_appandroid_edit', {
                url: '/CmsResource/App/AppAndroid/Edit/:id/:name/:imglogo/:type_id/:remoteurl/:uploadurl/:summary/:detail/:start/:downloads/:tag/:type',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/resource/app/androidAddandEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsResourceControllers');
                    }]
                }
            })

            /** 应用iphone模块新增、编辑 */
            .state('Cms.cms_cmsresource_appiphone_add', {
                url: '/CmsResource/App/AppIphone/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/resource/app/iphoneAddandEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsResourceControllers');
                    }]
                }
            })
            .state('Cms.cms_cmsresource_appiphone_edit', {
                url: '/CmsResource/App/AppIphone/Edit/:id/:name/:imglogo/:type_id/:remoteurl/:uploadurl/:summary/:detail/:start/:downloads/:tag/:type',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/resource/app/iphoneAddandEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsResourceControllers');
                    }]
                }
            })

            /** 游戏android模块*/
            .state('Cms.cms_cmsresource_gameandroid', {
                url: '/CmsResource/Game/GameAndroid',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/resource/game/resourcegame.html',
                        data: {
                            type: 'android'
                        }
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsResourceControllers');
                    }]
                }
            })
            /** 游戏iphone模块*/
            .state('Cms.cms_cmsresource_gameiphone', {
                url: '/CmsResource/Game/GameIphone',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/resource/game/resourcegame.html',

                        data: {
                            type: 'iphone'
                        }
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsResourceControllers');
                    }]
                }
            })
            /** 游戏android模块新增、编辑 */
            .state('Cms.cms_cmsresource_gameandroid_add', {
                url: '/CmsResource/Game/GameAndroid/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/resource/game/androidAddandEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsResourceControllers');
                    }]
                }
            })
            .state('Cms.cms_cmsresource_gameandroid_edit', {
                url: '/CmsResource/Game/GameAndroid/Edit/:id/:name/:imglogo/:type_id/:remoteurl/:uploadurl/:summary/:detail/:start/:downloads/:tag/:type',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/resource/game/androidAddandEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsResourceControllers');
                    }]
                }
            })

            /** 游戏phone模块新增、编辑 */
            .state('Cms.cms_cmsresource_gameiphone_add', {
                url: '/CmsResource/Game/GameIphone/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/resource/game/iphoneAddandEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsResourceControllers');
                    }]
                }
            })
            .state('Cms.cms_cmsresource_gameiphone_edit', {
                url: '/CmsResource/Game/GameIphone/Edit/:id/:name/:imglogo/:type_id/:remoteurl/:uploadurl/:summary/:detail/:start/:downloads/:tag/:type',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/resource/game/iphoneAddandEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsResourceControllers');
                    }]
                }
            })
            /** 视频模块*/
            .state('Cms.cms_cmsresource_video', {
                url: '/CmsResource/Video',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/resource/video.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsResourceControllers');
                    }]
                }
            })

            /** 视频模块新增、编辑 */
            .state('Cms.cms_cmsresource_video_add', {
                url: '/CmsResource/Video/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/resource/videoAddandEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsResourceControllers');
                    }]
                }
            })
            .state('Cms.cms_cmsresource_video_edit', {
                url: '/CmsResource/Video/Edit/:id/:name/:type_id/:views/:start/:source/:duration/:summary/:remoteurl/:tag/:imglogo/:uploadurl',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/resource/videoAddandEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsResourceControllers');
                    }]
                }
            })

            /** 配置-标签-列表 */
            .state('Cms.cms_cmsconfig_configtype_typeapp', {
                url: '/CmsConfig/ConfigType/TypeApp',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/cmsconfig/configtype.html',
                        data: {
                            type: 1
                        }
                    }

                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsConfigControllers');
                    }]
                }
            })
            .state('Cms.cms_cmsconfig_configtype_typegame', {
                url: '/CmsConfig/ConfigType/TypeGame',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/cmsconfig/configtype.html',
                        data: {
                            type: 2
                        }
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsConfigControllers');
                    }]
                }
            })
            .state('Cms.cms_cmsconfig_configtype_typevideo', {
                url: '/CmsConfig/ConfigType/TypeVideo',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/cmsconfig/configtype.html',
                        data: {
                            type: 3
                        }
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsConfigControllers');
                    }]
                }
            })
            .state('Cms.cms_cmsconfig_configtype_typebook', {
                url: '/CmsConfig/ConfigType/TypeBook',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/cmsconfig/configtype.html',
                        data: {
                            type: 4
                        }
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsConfigControllers');
                    }]
                }
            })
            .state('Cms.cms_cmsconfig_configtype_typead', {
                url: '/CmsConfig/ConfigType/TypeAd',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/cmsconfig/configtype.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsConfigControllers');
                    }]
                }
            })
            /** 配置-标签-新增与编辑 */
            .state('Cms.cms_cmsconfig_configtype_typeapp_add', {
                url: '/CmsConfig/ConfigType/TypeApp/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/cmsconfig/configtypeAddAndEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsConfigControllers');
                    }]
                }
            })
            .state('Cms.cms_cmsconfig_configtype_typeapp_edit', {
                url: '/CmsConfig/ConfigType/TypeApp/Edit/:id/:name/:order/:type/:showtype',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/cmsconfig/configtypeAddAndEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsConfigControllers');
                    }]
                }
            })
            .state('Cms.cms_cmsconfig_configtype_typegame_add', {
                url: '/CmsConfig/ConfigType/TypeGame/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/cmsconfig/configtypeAddAndEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsConfigControllers');
                    }]
                }
            })
            .state('Cms.cms_cmsconfig_configtype_typegame_edit', {
                url: '/CmsConfig/ConfigType/TypeGame/Edit/:id/:name/:order/:type/:showtype',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/cmsconfig/configtypeAddAndEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsConfigControllers');
                    }]
                }
            })
            .state('Cms.cms_cmsconfig_configtype_typevideo_add', {
                url: '/CmsConfig/ConfigType/TypeVideo/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/cmsconfig/configtypeAddAndEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsConfigControllers');
                    }]
                }
            })
            .state('Cms.cms_cmsconfig_configtype_typevideo_edit', {
                url: '/CmsConfig/ConfigType/TypeVideo/Edit/:id/:name/:order/:type/:showtype',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/cmsconfig/configtypeAddAndEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsConfigControllers');
                    }]
                }
            })
            .state('Cms.cms_cmsconfig_configtype_typebook_add', {
                url: '/CmsConfig/ConfigType/TypeBook/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/cmsconfig/configtypeAddAndEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsConfigControllers');
                    }]
                }
            })
            .state('Cms.cms_cmsconfig_configtype_typebook_edit', {
                url: '/CmsConfig/ConfigType/TypeBook/Edit/:id/:name/:order/:type/:showtype',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/cmsconfig/configtypeAddAndEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsConfigControllers');
                    }]
                }
            })
            .state('Cms.cms_cmsconfig_configtype_typead_add', {
                url: '/CmsConfig/ConfigType/TypeAd/Add',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/cmsconfig/configtypeAddAndEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsConfigControllers');
                    }]
                }
            })
            .state('Cms.cms_cmsconfig_configtype_typead_edit', {
                url: '/CmsConfig/ConfigType/TypeAd/Edit/:id/:name/:order/:type/:showtype',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/cmsconfig/configtypeAddAndEdit.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsConfigControllers');
                    }]
                }
            })
            /** 配置-模板 */
            .state('Cms.cms_cmsconfig_model', {
                url: '/CmsConfig/Model',
                views: {
                    'contentView': {
                        templateUrl: 'html/cms/cmsconfig/model.html'
                    }
                },
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load('cmsConfigControllers');
                    }]
                }
            })

        $urlRouterProvider.otherwise('/Login');   //其他的都转到登录页
    }])
