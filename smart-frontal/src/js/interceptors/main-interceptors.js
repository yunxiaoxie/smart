/**
*iRestApp拦截器。
*author: yunxiaoxie
*date: 2016-7-28
*/

'use strict';
angular.module('iRestApp.mainInterceptors', [])
/**
 *
 * 基础拦截器
 *
 * */
.factory('errorInterceptor', ['$rootScope','$window','$q',function ($rootScope,$window,$q) {
    //定义拦截器(拦截所有请求，修改“../”为域名)
    return {
        'request': function(request){
            // var aUrl = request.url.split('/');
            // if(request.method == ('POST') && aUrl[4] !== 'security') {
            //     $rootScope.$broadcast('formPosting',request.url);
            // }
            request.url += 'http://127.0.0.1:3000';
            return request;
        },
        'response': function (response) {
            if(!response.data) return response;
            //广播post完成事件
            if(response.config.method == ('POST')) {
                $rootScope.$broadcast('formPosted',response.config.url);
            } 
            var exception = [12001,12002,12003];
            if(response.data.msgNo){
                var erroCode = parseInt(response.data.msgNo);
                var errMsg=response.data.msg;
            } else
                var erroCode = 10000;

            switch (erroCode) {
                case 10000:
                    if(response.config.method.toUpperCase() == 'DELETE' && response.status == 200)
                        $rootScope.$broadcast('msgError', 900001);
                    //else if(response.config.method.toUpperCase() == 'POST' || response.config.method.toUpperCase() == 'PUT')
                    //    $rootScope.$broadcast('msgError', 900002);
                    break;
                case 10005:
                    $rootScope.$broadcast('relogin');
                    $rootScope.$broadcast('msgError', erroCode,errMsg);

                    break;
                case 10006:
                    $rootScope.$broadcast('relogin');
                    $rootScope.$broadcast('msgError', erroCode,errMsg);

                    break;
                case 10007:
                    $rootScope.$broadcast('relogin');
                    $rootScope.$broadcast('msgError', erroCode,errMsg);

                    break;
                default :
                    if(_.indexOf(exception,erroCode) < 0) {
                        $rootScope.$broadcast('msgError', erroCode,errMsg);
                    }
            };
            return response;

        }
    };
}])
;