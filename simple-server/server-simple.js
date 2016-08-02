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
        res.setHeader('Content-Type', 'text/plain');
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
// parse application/x-www-form-urlencoded 
.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
.use(bodyParser.json())
.use(function (req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.write('you posted:\n')
  res.end(JSON.stringify(req.body, null, 2))
})
.listen(3000);
console.log('Server started on port 3000.');*/
