var pwdMngr = require('./administraPasswords');
var contentTypeTipo = {'Content-Type': 'application/json; charset=utf-8'};

module.exports = function (server, db) {
	//unique index//aquí fuerza a que todo lo de dentro de esta función quede exportado como un solo objeto, para más tarde importarlo en ../server.js
	db.usuariosApp.ensureIndex({
		email:1
	},{
		unique: true
	});

	server.post('api/v1/ionBucket/auth/register', function (req, res, next) {
		var user = req.params;
		console.log('recibido:',req.params);
		pwdMngr.cryptPassword(user.password, function (err, hash){
			user.password = hash;
			console.log('n', hash);
			db.usuariosApp.insert(user, function(err, dbUser) {
				if(err){ //probablemente duplicate key error
					if(err.code == 11000){//http://www.mongodb.org/about/contributors/error-codes/
						res.writeHead(400, contentTypeTipo);
						res.end(JSON.stringify({
							error: err,
							message: 'Un usuario con este email ya existe, inténtelo con otro emil.'
						}));
					}
					//si hay otro error fellará catastróficamente
				}else{
					res.writeHead(200, contentTypeTipo);
					dbUser.password = '';
					res.end(JSON.stringify(dbUser));
				}
			});
		});
		return next();
	});

	server.post('api/v1/ionBucket/auth/login', function (req, res, next) {
		var user = req.params;
		if (user.email.trim().length < 3 || user.password.trim().length === 0) {
			res.writeHead(403, contentTypeTipo);
			res.end(JSON.stringify({
				error: 'Credenciales inválidas.'
			}));
		}
		console.log('in');
		db.usuariosApp.findOne({email:user.email},
			function(err, dbUser){
				console.log('encontramos el email');
				console.log('queremos comparar:'+user.password+' con: '+dbUser.password);
				pwdMngr.comparePasswords(user.password, dbUser.password, function (err, isMatch) {

					if (isMatch) {
						res.writeHead(200, contentTypeTipo);
						//eliminar el hash del objeto antes de devolver
						dbUser.password = '';
						res.end(JSON.stringify(dbUser));
					}else{
						res.writeHead(403, contentTypeTipo);
						res.end(JSON.stringify({
							error: 'Credenciales inválidas.'
						}));	
					}
				});
			});
		return next();	
	});
};
