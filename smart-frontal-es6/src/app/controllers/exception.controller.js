ExceptionCtrl.$inject = ['$scope','$http'];
function ExceptionCtrl($scope, $http){
  
$scope.getExce = function(){
  $.ajax({
        type:"post",
        url:"http://127.0.0.1/execption",
        async:false,
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

}

angular.module('controller').controller('ExceptionCtrl', ExceptionCtrl);