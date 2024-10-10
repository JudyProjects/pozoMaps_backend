var express = require('express');
var app = express();
const path = require('path');
var db = require('./db');
var cookieParser = require('cookie-parser');
global.__root = __dirname + '/';
var server = require("http").createServer(app);
var io = require("socket.io")(server);

app.use(cookieParser());
app.use('/socket', express.static(path.join(__dirname, 'node_modules/socket.io')));

module.exports = { server, express };
var socket = require('./socket.js');
