import angular from 'angular';
import sanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';
import ngMessage from 'angular-messages';
import ngResource from 'angular-resource';
import 'angular-xeditable';
import 'angular-ui-bootstrap';
import uiBootstrap from 'angular-ui-bootstrap';
import toastr from 'angular-toastr';
import fileUpload from 'ng-file-upload';
import 'angular-bootstrap-datetimepicker';
import 'lodash';
import 'moment';
import 'bootstrap';
import 'holderjs';
import 'ztree';


import '../lib/isteven-multi-select.js';
import '../../node_modules/metismenu/dist/metisMenu.min';


import UtilsService from './basic.server';
import './controllers';
import './services';
import './filter/main.filter';
import './directives';

//app js
import config from './config';
import run from './run';

//angular chart
import angularchart from "angular-chart.js"


//css
import '../styles/main.css';
//import '../styles/golbal.css';
//import '../styles/font.css';
import "../../node_modules/ztree/css/zTreeStyle/zTreeStyle.css";
import '../styles/loader.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../node_modules/angular-toastr/dist/angular-toastr.css';
import '../../node_modules/metismenu/dist/metisMenu.min.css';
import '../../node_modules/isteven-angular-multiselect/isteven-multi-select.css';
import '../../node_modules/angular-bootstrap-datetimepicker/src/css/datetimepicker.css';


let homeModule = angular.module('starapp',
    [
    uiRouter, uiBootstrap, toastr, sanitize, angularchart, fileUpload, ngMessage,ngResource,'xeditable',     // dependency feature widget
    'controller', 'services', 'directive', 'main.filter',                          // dependency system feature
    'ui.bootstrap.datetimepicker', 'isteven-multi-select'                               // dependency plugin
    ]);

//权限

homeModule.factory('UtilsService', UtilsService);
homeModule.config(config);
homeModule.run(run);

/**
 * 程序run时，请求uiauth接口，获取权限数据
 * */
// homeModule.run(function (permissions) {
//     //permissions.setPermissions({});
// });

angular.element(document).ready(function () {
    // $.get('/api/getPermissions', function(data) {
    //     permissionList = data;
    //     angular.bootstrap(document, ['opchannelapp']);
    // });
    angular.bootstrap(document, ['starapp']);
});
