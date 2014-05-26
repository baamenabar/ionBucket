var restify = require('restify');
var mongojs = require('mongojs');
var morgan = require('morgan');
var db = mongojs('ionbucketapp', ['usuariosApp', 'listasBucket']);
var server = restify.createServer();

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(morgan('dev')); //logger

// CORS 
server.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

server.listen(process.env.PORT || 9804, function (){
	console.log('server started @', process.env.PORT || 9804);
});

var administraUsuarios = require('./auth/administraUsuarios.js')(server, db);
var administraListas = require('./list/administraLista')(server, db);
