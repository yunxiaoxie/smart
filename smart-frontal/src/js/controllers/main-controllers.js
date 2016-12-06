/**主业务模块*/
angular.module('iRestApp.mainControllers', ['xeditable'])
.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme.
})
/**表单示例控制器*/
.controller('FormCtrl', ['$scope','$filter', '$http', 'UtilsService', 'AlertService', '$timeout', 'Upload', function($scope, $filter, $http, UtilsService, AlertService, $timeout, Upload){
  var dateFilter = $filter('date');
  $scope.submitted = false;
  $scope.isShow = function(field) {
    return  $scope.submitted || field.$dirty;
  }; 

  /**提交表单*/
  $scope.submit = function() {
    $scope.submitted = true;
    AlertService.alert("This is a warning.", "warning");
    AlertService.alert("This is an error!", "danger");
  	console.log(dateFilter($scope.formData.birthday, 'yyyy-MM-dd'));
    $http.post('/formSave', $scope.formData).success(function(data){
        alert(JSON.stringify(data));
    }).error(function(data) {
        alert("failure message:" + JSON.stringify({data:data}));
    });
  };

  var data = [{
      name: '浙江',
      id: 10,
      cities: [{
          name: '杭州',
          id: 100
      }, {
          name: '宁波',
          id: 101
      }, {
          name: '温州',
          id: 102
      }]
  }, {
      name: '广东',
      id: 20,
      cities: [{
          name: '广州',
          id: 200
      }, {
          name: '深圳',
          id: 201
      }, {
          name: '佛山',
          id: 202
      }]
  }];

  $scope.getProvinces = function () {
    var provinces = [];
    $.each(data, function (index, province) {
        provinces.push({
            text: province.name,
            value: province.id
        });
    });
    return provinces;
  };

  $scope.getCities = function (values) {
    var citiesLookup = {};
    // 返回[{text: 'some text', value: 'some value'},]的数据格式
    $.each(data, function (index, province) {
        var cities = [];
        $.each(province.cities, function (index, city) {
            cities.push({
                text: city.name,
                value: city.id
            });
        });
        citiesLookup[province.id] = cities;
    });
    return citiesLookup[values.province] || [];
  };

}])

.controller('UploadCtrl', ['$scope','$filter', '$http', 'UtilsService', 'AlertService', '$timeout', 'Upload', function($scope, $filter, $http, UtilsService, AlertService, $timeout, Upload){

  $scope.uploadPic = function(file) {
    file.upload = Upload.upload({
      url: '/upload',
      data: {name: $scope.username, file: file},
    });

    file.upload.then(function (response) {
      $timeout(function () {
        file.result = response.data;
      });
    }, function (response) {
      if (response.status > 0)
        $scope.errorMsg = response.status + ': ' + response.data;
    }, function (evt) {
      // Math.min is to fix IE which reports 200% sometimes
      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    });
  }

  //使用formData可以减少手动拼接string
  $scope.uploadPic2 = function(file) {
    var formData = new FormData();
    formData.append('name', 'file');
    formData.append('file', file);    //将文件转成二进制形式
    $.ajax({
        type:"post",
        url:"http://127.0.0.1/upload2",
        async:false,
        contentType: false,    //这个一定要写
        processData: false, //这个也一定要写，不然会报错
        data:formData,
        dataType:'text',    //返回类型，有json，text，HTML。这里并没有jsonp格式，所以别妄想能用jsonp做跨域了。
        success:function(data){
            console.log(data);
        },
        error:function(XMLHttpRequest, textStatus, errorThrown, data){
            console.log(errorThrown);
        }
    });
  }

  $scope.upload = function () {
      if (!$scope.data && !$scope.files) {
          return;
      }
      if ($scope.data) {
        Upload.upload({
            url: '/upload',
            data: {name: 'test', file: $scope.data.file},
        }).success(function (data) {
            //$scope.hide(data);
        }).error(function () {
            //logger.log('error');
        });
      }
      if ($scope.files) {
        Upload.upload({
            url: '/upload',
            data: {name: 'test', file: $scope.files},
        }).success(function (data) {
            //logger.log('success');
        }).error(function () {
            //logger.log('error');
        });
      }
  };

  $scope.mulImages = [];

  $scope.$watch('files', function () {
      $scope.selectImage($scope.files);
  });

  //根据选择的图片来判断 是否为一下子选择了多张
  //一下子选择多张的数据格式为一个数组中有多个对象，而一次只选择一张的数据格式为一个数组中有一个对象
  $scope.selectImage = function (files) {
      if (!files || !files.length) {
          return;
      }
      if (files.length > 1) {
          angular.forEach(files, function (item) {
              var image = [];
              image.push(item);
              $scope.mulImages.push(image);
          })
      } else {
          $scope.mulImages.push(files);
      }
  };


  /*
  无刷新文件下载。
  Media Types
  http://www.iana.org/assignments/media-types/media-types.xhtml
  "type":"text/html","application/octet-binary", image/png
  */
  $scope.download = function () {
        $http.post("/download", {
            filepath: "d:/images/",
            filename: "工号.xlsx"
        }, {responseType: "blob"})
        .success(function (data, status, headers, config) {
            var blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
            if (config.data.filename) {
              var fileName = config.data.filename;
            } else {
              var fileName = 'unknow';  
            }
            
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.download = fileName;
            a.href = URL.createObjectURL(blob);
            a.click();
        })
    }
  

}])
.controller('Form2Ctrl', ['$scope','testService', 'AlertService', function($scope, testService, AlertService){
  
  $scope.isShow = function(field) {
    return  field.$dirty;
  };

  $scope.submit = function() {
    var data = _.clone($scope.formData);
    testService.add(data);
    // 通知表格刷新
    $scope.$emit('submitted', testService.get());
  };

}])
.controller('TableCtrl', ['$scope','$rootScope','testService', 'UtilsService', 'MyUser', 'MapService', function($scope, $rootScope, testService, UtilsService, MyUser, MapService){
  
  $scope.checkName = function(data, id) {
    if (id === 2 && data !== 'awesome') {
      return "Username 2 should be `awesome`";
    }
  };

  $scope.checkAndSubmit = function(obj) {
    if (!obj.id) {
      return "Not empty";
    }
    if (obj.tel && obj.tel.length != 11) {
      return "error telephone";
    }
    $scope.saveUser2(obj);
  };

  $scope.showIntrest = function(intrest) {
    if (intrest && intrest.length>0) {
      var selected = [], data = intrest.join(',');
      angular.forEach($scope.intrests, function(s) { 
        if (data.indexOf(s.value) >= 0) {
          selected.push(s.text);
        }
      });
      return selected.length ? selected.join(', ') : 'Not set';
    }
  };

  $scope.loadData = function(key, code) {
    //return $scope.groups.length ? null : $http.get('/groups').success(function(data) {
      //$scope.groups = data;
    //});
    var url = '/dataDic/' + code;
    UtilsService.querySync(url, {}).then(function (data) {
        MapService.put(key, data);
        $scope[key] = data;
    }, function () {
        $log.error('Not supported code:', code);
    });
  };

  $scope.addUser = function() {
    var _row = {
      id: '',
      name: '',
      age: '',
      addr: '' 
    };
    $scope.data.push(_row);
  };

  $scope.saveUser2 = function(obj) {
    //$scope.user not updated yet
    if (obj.id) {
      MyUser.myPutSelective(obj);
    } else {
      MyUser.myPostSelective(obj);
    }
    //UtilsService.post('/saveUser',data);
  };

  $scope.saveUser = function(data, id) {
    //$scope.user not updated yet
    if (id) {
      angular.extend(data, {id: id});
      MyUser.myPut(data);
    } else {
      MyUser.myPost(data);
    }
    //UtilsService.post('/saveUser',data);
  };

  // remove user
  $scope.removeUser = function(index, id) {
    $scope.data.splice(index, 1);
    if (id) {
      MyUser.myDelete({"id":id});
    }
  };

  $scope.load = function() {
    var users = MyUser.myQuery({}, function(result){
      $scope.data = result;
    });
  }
  $scope.load();

}])
.controller('XEditTableCtrl', ['$scope','$filter','$http', 'AlertService', function($scope, $filter, $http, AlertService){
  
  $scope.users = [
    {id: 1, name: 'awesome user1', status: 2, group: 4, groupName: 'admin'},
    {id: 2, name: 'awesome user2', status: undefined, group: 3, groupName: 'vip'},
    {id: 3, name: 'awesome user3', status: 2, group: null}
  ]; 

  $scope.statuses = [
    {value: 1, text: 'status1'},
    {value: 2, text: 'status2'},
    {value: 3, text: 'status3'},
    {value: 4, text: 'status4'}
  ]; 

  $scope.groups = [];
  $scope.loadGroups = function() {
    //return $scope.groups.length ? null : $http.get('/groups').success(function(data) {
      //$scope.groups = data;
    //});
  };

  $scope.showGroup = function(user) {
    if(user.group && $scope.groups.length) {
      var selected = $filter('filter')($scope.groups, {id: user.group});
      return selected.length ? selected[0].text : 'Not set';
    } else {
      return user.groupName || 'Not set';
    }
  };

  $scope.showStatus = function(user) {
    var selected = [];
    if(user.status) {
      selected = $filter('filter')($scope.statuses, {value: user.status});
    }
    return selected.length ? selected[0].text : 'Not set';
  };

  $scope.checkName = function(data, id) {
    if (id === 2 && data !== 'awesome') {
      return "Username 2 should be `awesome`";
    }
  };

  $scope.saveUser = function(data, id) {
    //$scope.user not updated yet
    angular.extend(data, {id: id});
    //return $http.post('/saveUser', data);
  };

  // remove user
  $scope.removeUser = function(index) {
    $scope.users.splice(index, 1);
  };

  // add user
  $scope.addUser = function() {
    $scope.inserted = {
      id: $scope.users.length+1,
      name: '',
      status: null,
      group: null 
    };
    $scope.users.push($scope.inserted);
  };

}])
;