angular.module('services')

    .factory('UpLoadService', ['$q', 'UtilsService', 'Upload', function ($q, UtilsService, Upload) {
        return {
            UpLoadFile: function (url, postData) {
                let deferred = $q.defer();
                Upload.upload({
                    headers: {
                        'apiKey': "opc"
                    },
                    url: UtilsService.getIp() + url,
                    data: postData
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }
        };
    }])

    .factory('permissions', ['$rootScope', function ($rootScope) {
        var roleList;
        return {
            setPermissions: function (permissions) {
                angular.forEach(permissions, function (data, index, array) {
                    if (data.code == "openchannel") {
                        roleList = data.roleList;
                    }
                });
                $rootScope.$broadcast('permissionsChanged')
            },
            hasPermission: function (cu, permission) {
                let isShowDom = false;
                permission = permission.trim();
                angular.forEach(cu.permMap, function (data, index, array) {
                    angular.forEach(data, function (pri, index, array) {
                        if (pri === permission) {
                            isShowDom = true;
                        }
                    });
                });

                console.log(permission);
                return isShowDom;
            }
        };
    }])

    // test form&table
.factory('testService', [function() {
    var service = {};
    service.data=[];
    service.add = function(json) {
      this.data.push(json);
    };
    service.clean = function(json) {
      this.data = [];
    };
    service.get = function () {
        return this.data;
    }

    return service;
}])

.factory('MapService', [function () {
    var hashMap = function () {
        var size = 0,
            entry = new Object();

        this.put = function (key, value) {
            if (!this.containsKey(key)) {
                size++;
            }
            entry[key] = value;
        };
        this.get = function (key) {
            if (this.containsKey(key)) {
                return entry[key];
            } else {
                return null;
            }
        };
        this.remove = function (key) {
            if (delete entry[key]) {
                size--;
            }
        };
        this.clear = function () {
            size = 0;
            entry = new Object();
        };
        this.containsKey = function (key) {
            return (key in entry);
        };
        this.containsValue = function (value) {
            for (var prop in entry) {
                if (entry[prop] == value) {
                    return true;
                }
            }
            return false;
        };
        this.values = function () {
            var values = new Array(size);
            for (var prop in entry) {
                values.push(entry[prop]);
            }
            return values;
        };
        this.keys = function () {
            var keys = new Array(size);
            for (var prop in entry) {
                keys.push(prop);
            }
            return keys;
        };
        this.size = function () {
            return size;
        };
    };
    return new hashMap();
}])

/*Create a service for my_user*/
/*设计这个服务，主要是为了一些特殊的数据请求转换*/
/*五种默认行为：
{
　　“get”:{method:“get”},
　　“save”:{method:“post”}
　　“query”:{method:“get”,isArray:true}
　　“remove”:{method:“delete”}
　　“delete”:{method:“delete”}
}*/
.factory('MyUser', ['$resource', function($resource) {
    var Users = $resource('/user/getAllUser', {}, {
        myQuery: {
            method: 'GET',
            isArray: false,
            transformRequest: function(data){
                // transform data before request.
                console.log('transformRequest...');

            },
            transformResponse: function(data, header) {
                // transform data after response.
                var result = {};
                var wrapped = angular.fromJson(data);
                // transform date for angular
                _.each(wrapped.result, function(v){
                  if (v.birthday) {
                    v.birthday = new Date(v.birthday);
                  }
                  if (v.create_time) {
                    v.create_time = new Date(v.create_time);
                  }
                  if (v.intrest) {
                    v.intrest = v.intrest.split(',');
                  }
                });
                /*angular.forEach(wrapped.items, function(item, idx) {
                    wrapped.items[idx] = new Job(item);
                });*/
                return wrapped;
            }
        },
        myQueryForPager: {
            method: 'GET',
            isArray: false,
            url:'/user/getUserForPager',
            transformRequest: function(data){
                // transform data before request.
                console.log('transformRequest...');

            },
            transformResponse: function(data, header) {
                // transform data after response.
                var result = {};
                var wrapped = angular.fromJson(data);
                // transform date for angular
                _.each(wrapped.result.data, function(v){
                  if (v.birthday) {
                    v.birthday = new Date(v.birthday);
                  }
                  if (v.create_time) {
                    v.create_time = new Date(v.create_time);
                  }
                  if (v.intrest) {
                    v.intrest = v.intrest.split(',');
                  }
                });
                /*angular.forEach(wrapped.items, function(item, idx) {
                    wrapped.items[idx] = new Job(item);
                });*/
                return wrapped;
            }
        },
        myPost: {
            method: 'POST',
            isArray: false,
            url:'/user/saveUser',
            headers:{'Content-Type': 'application/json;charset=UTF-8'},
            transformRequest: function(data){
                // transform data before request.
                console.log('transformRequest...');
                var _data = angular.copy(data);
                if (_data.intrest && angular.isArray(_data.intrest)) {
                    _data.intrest = _data.intrest.join(',');
                }
                // transform date to timestamp
                if (_data.birthday) {
                    _data.birthday = parseInt(_data.birthday.getTime());
                }
                if (_data.create_time) {
                    _data.create_time = parseInt(_data.create_time.getTime());
                }
                return angular.toJson(_data);
            },
            transformResponse: function(data, header) {
                // transform data after response.
                /*angular.forEach(wrapped.items, function(item, idx) {
                    wrapped.items[idx] = new Job(item);
                });*/
                return data;
            }
        },
        myPostSelective: {
            method: 'POST',
            isArray: false,
            url:'/user/saveUserSelective',
            headers:{'Content-Type': 'application/json;charset=UTF-8'},
            transformRequest: function(data){
                // transform data before request.
                console.log('transformRequest...');
                var _data = angular.copy(data);
                if (_data.intrest && angular.isArray(_data.intrest)) {
                    _data.intrest = _data.intrest.join(',');
                }
                // transform date to timestamp
                if (_data.birthday) {
                    _data.birthday = parseInt(_data.birthday.getTime());
                }
                if (_data.create_time) {
                    _data.create_time = parseInt(_data.create_time.getTime());
                }
                return angular.toJson(_data);
            },
            transformResponse: function(data, header) {
                // transform data after response.
                /*angular.forEach(wrapped.items, function(item, idx) {
                    wrapped.items[idx] = new Job(item);
                });*/
                return data;
            }
        },
        myPut: {
            method: 'PUT',
            isArray: false,
            url:'/user/updateUser',
            headers:{'Content-Type': 'application/json;charset=UTF-8'},
            transformRequest: function(data){
                // transform data before request.
                console.log('transformRequest...');
                var _data = angular.copy(data);
                if (_data.intrest && angular.isArray(_data.intrest)) {
                    _data.intrest = _data.intrest.join(',');
                }
                // transform date to timestamp
                if (_data.birthday) {
                    _data.birthday = parseInt(_data.birthday.getTime());
                }
                if (_data.create_time) {
                    _data.create_time = parseInt(_data.create_time.getTime());
                }
                return angular.toJson(_data);
            },
            transformResponse: function(data, header) {
                // transform data after response.
                /*angular.forEach(wrapped.items, function(item, idx) {
                    wrapped.items[idx] = new Job(item);
                });*/
                return data;
            }
        },
        myPutSelective: {
            method: 'PUT',
            isArray: false,
            url:'/user/updateUserSelective',
            headers:{'Content-Type': 'application/json;charset=UTF-8'},
            transformRequest: function(data){
                // transform data before request.
                console.log('transformRequest...');
                var _data = angular.copy(data);
                if (_data.intrest && angular.isArray(_data.intrest)) {
                    _data.intrest = _data.intrest.join(',');
                }
                // transform date to timestamp
                if (_data.birthday) {
                    _data.birthday = parseInt(_data.birthday.getTime());
                }
                if (_data.create_time) {
                    _data.create_time = parseInt(_data.create_time.getTime());
                }
                return angular.toJson(_data);
            },
            transformResponse: function(data, header) {
                // transform data after response.
                /*angular.forEach(wrapped.items, function(item, idx) {
                    wrapped.items[idx] = new Job(item);
                });*/
                return data;
            }
        },
        myDelete: {
            method: 'DELETE',
            isArray: false,
            url:'/user/deleteUser',
            headers:{'Content-Type': 'application/json;charset=UTF-8'},
            transformRequest: function(data){
                // transform data before request.
                console.log('transformRequest...');
                return angular.toJson(data);
            },
            transformResponse: function(data, header) {
                // transform data after response.
                /*angular.forEach(wrapped.items, function(item, idx) {
                    wrapped.items[idx] = new Job(item);
                });*/
                return data;
            }
        }
    });
    /*custom method*/
    Users.prototype.getResult = function() {
        if (this.status == 'complete') {
            if (this.passed === null) return"Finished";
            else if (this.passed === true) return"Pass";
            else if (this.passed === false) return"Fail";
        }
        else return"Running";
    };

    return Users;
}])

//Dictionary service
.service("DicService", ['UtilsService',function (UtilsService) {
    this.loadData = function(code){
        var url = '/dataDic/' + code;
        return UtilsService.querySync(url, {});
    }
}])
// for file upload
.service("UploadService", ['$q', 'Upload', function ($q, Upload) {
    this.upLoadFile = function (url, postData) {
        let deferred = $q.defer();
        Upload.upload({
            // headers: {
            //     'apiKey': "opc"
            // },
            url: url,
            data: postData
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }
}])

.factory('LoadingService', ["$rootScope", function ($rootScope) {
    return {
        showLoading: ()=> {
            $rootScope.isShowLoading = true;
        },
        hideLoading: ()=> {
            $rootScope.isShowLoading = false;
        }
    }
}]);