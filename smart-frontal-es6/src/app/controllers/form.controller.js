
/*
 * form controller
 */
FormController.$inject = ['$scope','$filter', '$http', 'UtilsService', '$timeout', 'Upload', 'toastr', '$uibModal'];

function FormController($scope, $filter, $http, UtilsService, $timeout, Upload, toastr, $uibModal) {
  var dateFilter = $filter('date');
  $scope.submitted = false;
  $scope.isShow = function(field) {
    return  $scope.submitted || field.$dirty;
  }; 

  /**提交表单*/
  $scope.submit = function() {
    $scope.submitted = true;
    //console.log(dateFilter($scope.formData.birthday, 'yyyy-MM-dd'));
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
    // set checkbox/radio default value
    $scope.formData.complete = 'Y';
    $scope.formData.intrest = {book: 'book'};
    $scope.formData.favoriteColors = {red: 'red'}
    $scope.formData.chickenEgg = 'egg';
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

}

angular.module('controller')
    .controller("FormController", FormController);



