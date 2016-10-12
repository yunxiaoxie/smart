/**
 * 作者: xie Y.X.
 * 创建: 2016/3/18
 * 修改: 2016/3/18
 * 版本: 1.0.0
 * 描述: 主过滤器模块,为各业务模块依赖
 * */

'use strict';
angular.module('iRestApp.mainFilters', [])
    .filter("sexFilter", [function(){
        return function(input){
            switch (input) {
                case 'M':
                    return "男";
                    break;
                case 'W':
                    return "女";
                    break;
            }
        }
    }])
    .filter("toString", [function(){
        return function(input){
            return input.toString();
        }
    }])
    .filter("toNumber", [function(){
        return function(input){
            return parseInt(input);
        }
    }])
    
