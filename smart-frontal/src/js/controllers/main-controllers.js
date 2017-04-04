/**主业务模块*/
angular.module('iRestApp.mainControllers', ['xeditable'])
.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme.
})
/**表单示例控制器*/
.controller('FormCtrl', ['$scope','$filter', '$http', 'UtilsService', 'AlertService', '$timeout', 'Upload', 'toastr', '$uibModal', function($scope, $filter, $http, UtilsService, AlertService, $timeout, Upload, toastr, $uibModal){
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

  // 下拉菜单
  $scope.dropMenu = [{
    name:"myAction1"
  },{
    name:"myAction2"
  },{
    name:"herAction3"
  },{
    name:"herAction4"
  }];
  $scope.clickMenuItem = function(row){
    $scope.searchContent = row.name;
    toastr.success('点击成功');
  }
  $scope.clickMenuItem2 = function(row){
    $scope.searchContent2 = row.name;
    toastr.success('点击成功');
  }

  /*打开一个弹层*/
  $scope.openModal = function() {
    openLandingPageModal();
  }

  /*初始LandingPage*/
    var openLandingPageModal = function (obj, parent, cancel) {
        var tpl = '<div class="modal-header">\
                    <h3 class="modal-title">初始LandingPage</h3>\
                </div>\
                <div class="modal-body">\
                    <div>\
                        <input class="form-control" ng-model="address" type="text">\
                    </div>\
                    <div>在活动系统或CMS中创建页面，并获取URL</div>\
                </div>\
                <div class="modal-footer">\
                    <button class="btn btn-sm btn-primary" type="button" ng-click="ok()">确定</button>\
                    <button class="btn btn-sm btn-warning" type="button" ng-click="cancel()">取消</button>\
                </div>';
        var modalInstance = $uibModal.open({
            size: 'ml',// sm ml lg
            animation: true,
            template: tpl,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                $scope.ok = function () {
                    $uibModalInstance.close();
                };

                $scope.cancel = function () {
                    if (cancel) {
                        cancel();
                    }
                    $uibModalInstance.dismiss('cancel');
                };

            }]
        });
        modalInstance.opened.then(function () {
            console.log('modal is opened');

        });

        modalInstance.result.then(function (result) {
            console.log(result); //result关闭是回传的值   
        }, function (reason) {
            console.log(reason);//点击空白区域，总会输出backdrop click，点击取消，则会暑促cancel
        });
    }

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
            filename: "Tulips.jpg"
        }, {responseType: "blob"})
        .then(function (data, status, headers, config) {
            //var blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
            var blob = new Blob([data.data], {type: "image/jpeg"});
            if (data.config.data.filename) {
              var fileName = data.config.data.filename;
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
.controller('ToroidalCtrl', ['$scope','testService', 'AlertService', function($scope, testService, AlertService){
  
  $scope.percent=33.33;


}])
.controller('TableCtrl', ['$scope','$rootScope','$timeout', 'UtilsService', 'MyUser', 'MapService', '$filter', 'NgTableParams', function($scope, $rootScope, $timeout, UtilsService, MyUser, MapService, $filter, NgTableParams){
  
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
      $scope.tableParams = new NgTableParams({
      }, {
          dataset: result
      });
      $scope.tableParams.settings().counts=[];
    });
  }
  $scope.load();

  $scope.loadForPager = function(no, size) {
    MyUser.myQueryForPager({pageNo: no ? no : 1, pageSize: size ? size : 3}, function(result){
      $scope.dataPage = result;
      $timeout(function(){
        $rootScope.$broadcast('modelInitialized', this);
      },500);
  });
  }
  $scope.loadForPager();

  $scope.$on("reloadPagination", function(scope, no, size){
    $scope.loadForPager(no, size);
  });

  $scope.callServer = function (tableState) {

    //ctrl.isLoading = true;

    var pagination = tableState.pagination;

    var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
    var number = pagination.number || 10;  // Number of entries showed per page.
    var curPage = start/number + 1;

    // 分页排序：需传入排序的column和order
    MyUser.myQueryForPager({
        pageNo:curPage, pageSize: 3, 
        orderCol: tableState.sort.predicate,
        order: tableState.sort.reverse ? 'desc' : 'asc'}, function(result){
      $scope.dataPage2 = result.data;
      tableState.pagination.numberOfPages = result.totalPage;
      tableState.pagination.totalItemCount = result.totalRecord;
    });
    /*service.getPage(start, number, tableState).then(function (result) {
      ctrl.displayed = result.data;
      tableState.pagination.numberOfPages = result.numberOfPages;//set the number of pages so the pagination can update
      ctrl.isLoading = false;
    });*/
  };

  $scope.$on('sortEvent', function(scope, column, sort){
    console.log(column, sort);
    MyUser.myQueryForPager({pageNo:1, pageSize: 3, sortCol: column, sortName: sort}, function(result){
        $scope.dataPage = result;
        $timeout(function(){
          $rootScope.$broadcast('modelInitialized', this);
        },500);
    });
  })

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
.controller('CanvasCtrl', ['$scope','$http', function($scope, $http){
  


}])
.controller('ExceptionCtrl', ['$scope','$http', function($scope, $http){
  
$scope.getExce = function(){
  $.ajax({
        type:"post",
        url:"http://127.0.0.1/execption",
        async:true,
        contentType: false,    //这个一定要写
        processData: false, //这个也一定要写，不然会报错
        data:{},
        dataType:'json',    //返回类型，有json，text，HTML。这里并没有jsonp格式，所以别妄想能用jsonp做跨域了。
        success:function(data){
            console.log(data);
            // \r\t to <br>
            $scope.message = data.message;
            $scope.data = data.data.replace(new RegExp(/(\r\t)/g),'<br>');
        },
        error:function(XMLHttpRequest, textStatus, errorThrown, data){
            console.log(errorThrown);
        }
    });
}
$scope.getExce();

}])
;