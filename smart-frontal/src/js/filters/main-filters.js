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
    .filter("trueFilter", [function(){
        return function(input){
            switch (input) {
                case 'Y':
                    return "是";
                    break;
                case 'N':
                    return "否";
                    break;
            }
        }
    }])
    .filter("selectFilter", ['MapService', function(MapService){
        return function(input, key){
            if (input) {
                var data = MapService.get(key);
                if (data) {
                    var result = [];
                    for (var i=0; i<input.length; i++) {
                        var obj = _.findWhere(data, {'value':input[i]});
                        if (obj) {
                            result.push(obj.text);
                        }
                    }
                    return result.join(',');
                } else {
                    if (input) {
                        return input.join(',');
                    }
                    return input;
                }
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
    
