/** http://stackoverflow.com/a/14015883/1015046 **/
var bcrypt = require('bcrypt-nodejs');

module.exports.cryptPassword = function (password, callback) {
	//console.log('tratando de generar salt');
	/*
	console.log('modosync:'+bcrypt.genSaltSync());
	bcrypt.genSalt(10, function(err, salt) {
		if(err){
			console.log('hubo un error al generar la sal');
			return callback(err);
		}

		bcrypt.hash(password, salt, function (err, hash){
			return callback(err, hash);
		});
	});
	//*/
	//*
	return callback(null, bcrypt.hashSync(password, bcrypt.genSaltSync()));
	//*/
};

module.exports.comparePasswords = function (password, userPassword, callback) {
	return callback(null, bcrypt.compareSync(password, userPassword));
};
