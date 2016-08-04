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
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
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