/**主业务模块*/
angular.module('iRestApp.mainServices', [])
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
	var Users = $resource('/getAllUser', {}, {
		myQuery: {
			method: 'GET',
			isArray: true,
			transformRequest: function(data){
				// transform data before request.
				console.log('transformRequest...');

			},
			transformResponse: function(data, header) {
				// transform data after response.
				var result = {};
				var wrapped = angular.fromJson(data);
				// transform date for angular
		        _.each(wrapped, function(v){
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
			url:'/saveUser',
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
			url:'/saveUserSelective',
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
			url:'/updateUser',
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
			url:'/updateUserSelective',
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
			url:'/deleteUser',
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
;