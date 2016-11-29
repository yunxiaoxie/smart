/**主业务模块*/
angular.module('iRestApp.mainControllers', ['xeditable'])
.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme.
})
/**表单示例控制器*/
.controller('FormCtrl', ['$scope','$filter', '$http', 'UtilsService', 'AlertService', '$timeout', function($scope, $filter, $http, UtilsService, AlertService, $timeout){
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