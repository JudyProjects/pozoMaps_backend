var obj = require("./app");
var io = require("socket.io")(obj.server);
var router = obj.express.Router();
var bodyParser = require("body-parser");
var session = require("express-session");
var sharedsession = require("express-socket.io-session");
const funciones = require("./funciones");
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var FileStore = require("session-file-store")(session);
var fileStoreOptions = {};

var sessionMiddleware = session({
  store: new FileStore(fileStoreOptions),
  secret: "ultrasecreto",
  resave: true,
  saveUninitialized: true,
});

router.use(sessionMiddleware);

io.use(sharedsession(sessionMiddleware));

io.sockets.on("connection", function (socket) {
  console.log("connection " + socket.id);
  socket.on("disconnect", function () {
    console.log("Connection closed ", socket.id);
  });
});
