TableCtrl.$inject = ['$scope','$rootScope','$timeout', 'UtilsService', 'MyUser', 'MapService', '$filter', 'TableService'];
function TableCtrl($scope, $rootScope, $timeout, UtilsService, MyUser, MapService, $filter, TableService){
  
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
    TableService.getDicData(code).then(function (data) {
        MapService.put(key, data.result);
        $scope[key] = data.result;
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
      $scope.data = result.result;
      
    });
  }
  $scope.load();

  $scope.loadForPager = function(no, size) {
    MyUser.myQueryForPager({pageNo: no ? no : 1, pageSize: size ? size : 3}, function(result){
      $scope.dataPage = result.result;
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

}

angular.module('controller').controller('TableCtrl', TableCtrl);
