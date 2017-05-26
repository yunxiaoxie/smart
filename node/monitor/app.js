
var express = require('express')
  , path = require('path')
  , app = express()
  , bodyParser = require('body-parser')
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , worker = require('child_process')
  , router = express.Router()
  , favicon = require('serve-favicon')
  , logger = require('morgan')
  , methodOverride = require('method-override')
  , errorHandler = require('errorhandler')
  , multer = require('multer')
;

//设置日志级别
// io.set('log level', 1); 


var sysstat = function(callback){
  var cpu ="sar -u 1 1 | grep Average | awk '{print $8}'"; 
  var mem ="sar -r 1 1 | grep Average | awk '{print $4}'";
  worker.exec(cpu, function (error1, stdout1, stderr1) {      
      worker.exec(mem, function (error2, stdout2, stderr2) {
        //console.log('CPU: ' + stdout1+',MEM: ' + stdout2);
        callback({cpu:stdout1,mem:stdout2});
      });    
  });
}
//Cross-Origin Request Blocked on socket io
io.set('origins', '*:*');
//WebSocket连接监听
io.sockets.on('connection', function (socket) {
  //socket.emit('open');//通知客户端已连接

  // 打印握手信息
  //console.log(socket.handshake);

  function send(obj){
    var sys = {
      time:(new Date()).getTime(),
      cpu:(100-parseFloat(obj.cpu)),
      mem:parseFloat(obj.mem)
    }
    socket.emit('system', sys);
  }

  setInterval(function(){
    sysstat(send);
  },1000);
  
  // 对message事件的监听
  socket.on('message', function(msg){
    //console.log(msg);
  });

  //监听出退事件
  socket.on('disconnect', function (data) {  
    //console.log(data);
  });
});



//express basic config
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.use(favicon(__dirname + '/public/dr-favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
//app.use(multer());
app.use(express.static(path.join(__dirname, 'public')));


if ('development' == app.get('env')) {
  app.use(errorHandler());
}

// 指定webscoket的客户端的html文件
router.get('/', function(req, res){
  res.sendFile(__dirname + '/views/alert.html');
});
app.get('/*', router);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


