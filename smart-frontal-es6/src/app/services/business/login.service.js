/**
 * login service
 */
import {BaseApiMethod, BaseService} from './business.service';
class ApiMethod extends BaseApiMethod {
    login(str) {
        return this.post("REST_LOGIN", null, str);
    }

}


class AdService extends BaseService {
    constructor(UtilsService) {
        super();
        this.api = new ApiMethod(UtilsService)
    }

    login(str) {
        return this.api.login(str);
    }

}

angular.module('biz-services').factory("LoginService", ["UtilsService", function (UtilsService) {
    return new AdService(UtilsService);
}]);
