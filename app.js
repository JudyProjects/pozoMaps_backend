var express = require('express');
var app = express();
const path = require('path');
var db = require('./db');
var cookieParser = require('cookie-parser');
global.__root = __dirname + '/';
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var cors = require('cors');

app.use(cors());
app.use(cookieParser());
app.use('/socket', express.static(path.join(__dirname, 'node_modules/socket.io')));

app.get('/', function (req, res) {
    res.status(200).send('Conexión con server funcionando');
});
module.exports = { server, express };
var socket = require('./socket.js');
