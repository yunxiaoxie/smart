//import * as constant from '../../constant';
import * as constant from '../constant';

class BaseApiMethod {
    constructor(utilsService, toastr) {
        this.utilsService = utilsService;
        this.toastr = toastr;
    }
    
    get(name, urlPara = "", data = null, def = []) {
        let util = this.utilsService;
        var url = util.getIp() + constant[name] + urlPara;
        return util.get(url, data).then(
            function (data) {
                var result = data.data;
                if (result && result.code == '200') {
                    return result;
                }
                else {
                    //TODO 这里需要做数据处理 抛出异常
                    return def;
                }
            }
        );
    }

    post(name, data = {}, urlPara = "", def = []) {
        let util = this.utilsService;
        let tip = this.toastr;
        var url = util.getIp() + constant[name] + urlPara;
        return util.post(url, data).then(
            (data)=> {
                var result = data.data;
                if (result && result.code == '200') {
                    return result;
                }
                else {
                    throw new Error(result.msg);
                }
            }
        ).catch((e)=>{
            tip.warning(e.message);
        });
    }

    delete(name, data = {}, urlPara = "", def = []) {
        let util = this.utilsService;
        var url = util.getIp() + constant[name] + urlPara;
        return util.delete(url, data).then(
            (data)=> {
                var result = data.data;
                if (result && result.code == '200') {
                    return result;
                }
                else if (result && result.code == '400') {// for error info
                    return result;
                }
                else {
                    //TODO 这里需要做数据处理 抛出异常
                    return def;
                }
            }
        );
    }

    postBlob(name, data = {}, urlPara = "", def = []) {
        let util = this.utilsService;
        var url = util.getIp() + constant[name] + urlPara;
        return util.postBlob(url, data).then(
            (data)=> {
                return data;
                
            }
        );
    }

    downLoad(name, data = {}, urlPara = "", def = []) {
        let util = this.utilsService;
        var url = util.getIp() + constant[name] + urlPara;
        return util.downLoad(url, data).then(
            (data)=> {
                return data;
                
            }
        );
    }

    query(name, data, urlPara = "", def = [], method) {
        let util = this.utilsService;
        var url = util.getIp() + constant[name] + urlPara;
        return util.query(url, data, method).then(
            (data)=> {
                var result = data.data;
                if (result && result.code == '200') {
                    return result.result;
                }
                else {
                    //TODO 这里需要做数据处理 抛出异常
                    return def;
                }
            }
        );
    }

}

class BaseService {
    constructor(utilsService, uploadService) {
        this.utilsService = utilsService;
        this.uploadService = uploadService;
    }

    /**
     * 文件上传
     * */
    upload(name, data = {}, urlPara = "", def = []) {
        // let util = this.utilsService;
        let uploadService = this.uploadService;
        return uploadService.UpLoadFile(constant[name], data).then(
            (data)=> {
                if (data && data.code == '200') {
                    return data.result;
                }
                else {
                    //TODO 这里需要做数据处理 抛出异常
                    throw new Error(data.msg);
                    //return def;
                }
            }
        );
    }
}
export {BaseApiMethod, BaseService};