UploadCtrl.$inject = ['$scope','$filter', '$http', 'UtilsService', '$timeout', 'Upload'];

function UploadCtrl($scope, $filter, $http, UtilsService, $timeout, Upload){

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
      console.log("progress:", progress);
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

  $scope.uploadLarge = function(file){
    $scope.upload = Upload.upload({
      url: '/uploadLarge',
      data: {name: 'largefile', file: file},
      resumeChunkSize: '1024KB',
      resumeSizeUrl: '/getFilePos?fileName='+file.name
    });

    /*$scope.upload.then(function (response) {
      $timeout(function () {
        $scope.upload.result = response.data;
      });
    }, function (response) {
      if (response.status > 0)
        $scope.errorMsg = response.status + ': ' + response.data;
    }, function (evt) {
      // Math.min is to fix IE which reports 200% sometimes
      $scope.upload.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      $scope.progress = $scope.upload.progress;
      console.log("progress:", $scope.upload.progress);
    });*/

    // two way
    $scope.upload.success(function (response) {
      $timeout(function () {
        $scope.upload.result = response.data;
      });
    })

    $scope.upload.progress(function (evt) {
      // Math.min is to fix IE which reports 200% sometimes
      $scope.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      $scope.progress = $scope.progress;
      console.log("progress:", $scope.progress);
    });
  }
  $scope.abort = function(){
    $scope.upload.abort();
  }


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
            if(window.navigator.msSaveOrOpenBlob) {
              // for ie only
              window.navigator.msSaveOrOpenBlob(blob, fileName);
            } else {
              var a = document.createElement("a");
              a.download = fileName;
              a.href = URL.createObjectURL(blob);
              //a.click();
              var evt = document.createEvent("MouseEvents");
              evt.initEvent("click", true, true);
              a.dispatchEvent(evt);
            }

        })
    }
  

}

angular.module('controller').controller('UploadCtrl', UploadCtrl);
