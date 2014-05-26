var contentTypeTipo = {'Content-Type': 'application/json; charset=utf-8'};
var msgs = {
	noauth:'No tienes autorización para acceder a esta aplicación'
};
var esEmailValido = function(db, email, callback) {
	db.usuariosApp.findOne({
		email: email
	}, function(err, user) {
			callback(user);
		});
};

module.exports.validate = function (req, res, db, callback){
	//si el request no tiene un token con email, rechazaremos el request
	if (!req.params.token) {
		res.writeHead(403, contentTypeTipo);
		res.end(JSON.stringify({
			error: msgs.noauth,
			message: 'Un email es obligatorio como parte del header'
		}));
	}

	esEmailValido(db, req.params.token, function(user) {
		if(!user){
			res.writeHead(403, contentTypeTipo);
			res.end(JSON.stringify({
				error: msgs.noauth,
				message: 'Email de usuario inválido'
			}));		
		}else{
			callback();
		}
	});
};
