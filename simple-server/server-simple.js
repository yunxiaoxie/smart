/**
Simple Server for web api test.
*/


var connect = require('connect');
var bodyParser = require('body-parser');
var logger = require('morgan');
var serveStatic = require('serve-static');

var app = connect()
    .use(logger('dev'))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: true}))
    .use(serveStatic(__dirname))
    .use(function (req, res) {
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,X-Session-Token');
        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        //res.setHeader('Access-Control-Allow-Credentials', true);
        console.log('req.body', req.body);
        if (req.originalUrl === '/') {
            res.end('Hello Guy!');
        }
        if (req.originalUrl.indexOf('/formSave') !== -1) {
            res.end(JSON.stringify(req.body));
        }
        if (req.originalUrl.indexOf('/verifyUser') !== -1) {
            if (req.body.uname === 'test' && req.body.pwd === '1234') {
                var result = {msgNo: 10000};
                res.end(JSON.stringify(result));
            } else {
                var result = {msgNo: 10001};
                res.end(JSON.stringify(result));
            }
            
        }
        if (req.originalUrl.indexOf('/getTree') !== -1) {
            var zNodes = [{
                id: 1,
                pId: 0,
                name: "普通的父节点",
                title: "我很普通，随便点我吧",
                open: true
            },
            {
                id: 11,
                pId: 1,
                name: "叶子节点 - 1",
                title: "我很普通，随便点我吧",
                "ui-sref":"user"
            },
            {
                id: 2,
                pId: 0,
                name: "NB的父节点",
                title: "点我可以，但是不能点我的子节点，有本事点一个你试试看？",
                open: true
            },
            {
                id: 21,
                pId: 2,
                name: "叶子节点2 - 1",
                title: "你哪个单位的？敢随便点我？小心点儿..",
                click: false,
                "ui-sref":"user"
            },
            {
                id: 3,
                pId: 0,
                name: "郁闷的父节点",
                title: "别点我，我好害怕...我的子节点随便点吧...",
                open: true,
                click: false
            },
            {
                id: 31,
                pId: 3,
                name: "叶子节点3 - 1",
                title: "唉，随便点我吧",
                "ui-sref":"user"
            }];
            res.end(JSON.stringify(zNodes));
        }
        if (req.originalUrl.indexOf('/getDataByCode') !== -1) {
          var data = null;
          switch(String(req.body.code)) {
              case '1001':
                data = [{id:'Y',label:'是'}, {id:'N',label:'否'}];break;
              case '1002':
                data = [{id:'M',label:'男'}, {id:'W',label:'女'}];break;
              case '1003':
                data = [{id:1,label:'显示'}, {id:0,label:'隐藏'}];break;
              case '1004':
                data = [{id:1, name:'看书', model:"book"},
                        {id:2, name:'跑步', model:"play"},
                        {id:3, name:'打球', model:"ball"}];break;
              case '1005':
                data = [{id:'wc',label:'已完成'}, {id:'wwc',label:'未完成'}];break;
              case '1006':
                data = [{id:1, name:'语文', model:"yw"},
                        {id:2, name:'数学', model:"sx"},
                        {id:3, name:'英语', model:"english"}];break;
              default:
                data = null;
          }
          res.end(JSON.stringify(data));
        }
    })
    .listen(3000);
console.log('Server started on port 3000.');


/*
var express = require('express');
var bodyParser = require('body-parser');
 
var app = express()
//设置跨域访问
.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,content-type");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
})
// parse application/x-www-form-urlencoded 
.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
.use(bodyParser.json())
.use(function (req, res) {
  console.log('you posted:\n', JSON.stringify(req.body))
  res.end(JSON.stringify(req.body));
})
.listen(3000);
console.log('Server started on port 3000.');
*/