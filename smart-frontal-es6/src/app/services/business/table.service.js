/**
 * Created by yunxiaoxie on 17/4/25.
 * 主数据 sevice
 */

import autotipMixin from '../mixin/autotip.mixin';
import autoloadingMixin from '../mixin/autoloading.mixin';

import autotip from '../decorator/autotip.decorator';
import autotipClass from '../decorator/autotipClass.decorator'
import autoloading from '../decorator/autoloading.decorator';
import { traits }  from 'traits-decorator';

import {BaseApiMethod, BaseService} from './business.service';
class ApiMethod extends BaseApiMethod {

    //查询子数据
    getDicData(code) {
        return this.getSync("GET_DATA_DIC", code);
    }

}

@autotipClass("${error}")
@traits(autotipMixin, autoloadingMixin)
class TableService extends BaseService {
    constructor(UtilsService, toastr, LoadingService) {
        super();
        this.api = new ApiMethod(UtilsService, toastr);
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }

    @autoloading
    getDicData(code) {
        this.showLoading();
        return this.api.getDicData(code);
    }

}

angular.module('biz-services').factory("TableService", ["UtilsService", 'toastr', 'LoadingService', function (UtilsService, toastr, LoadingService) {
    return new TableService(UtilsService, toastr, LoadingService);
}]);
