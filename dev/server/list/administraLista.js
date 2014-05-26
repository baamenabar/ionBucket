var contentTypeTipo = {'Content-Type': 'application/json; charset=utf-8'};

module.exports = function (server, db) {
	var validateRequest = require('../auth/validateRequest');

	server.get('/api/v1/ionBucket/data/list', function (req, res, next) {
		validateRequest.validate(req, res, db, function () {
			db.listasBucket.find({
				user : req.params.token
			}, function (err, lista) {
				res.writeHead(200, contentTypeTipo);
				res.end(JSON.stringify(lista));
			});
		} );
		return next();
	});

	server.get('/api/v1/ionBucket/data/item/:id', function (req, res, next) {
		validateRequest.validate(req, res, db, function () {
			db.listasBucket.find({
				_id: db.ObjectId(req.params.id)
			}, function (err, data) {
				res.writeHead(200, contentTypeTipo);
				res.end(JSON.stringify(data));
			});
		});
		return next();
	});

	server.post('/api/v1/ionBucket/data/item', function (req, res, next) {
		validateRequest.validate(req, res, db, function () {
			var item = req.params;
			db.listasBucket.save(item,
				function (err, data) {
					res.writeHead(200, contentTypeTipo);
					res.end(JSON.stringify(data));
			});
		});
		return next();
	});

	server.put('/api/v1/ionBucket/data/item/:id', function (req, res, next) {
		validateRequest.validate(req, res, db, function () {
			db.listasBucket.findOne({
				_id: db.ObjectId(req.params.id)
			}, function (err, data) {
				//unimos los re.paramos con el objeto en el servidor
				var prodAactualizar = {};
				for (var n in data){
					prodAactualizar[n] = data[n];
				}
				for (n in req.params){
					if(n != 'id'){
						prodAactualizar[n] = req.params[n];
					}
				}
				db.listasBucket.update({
					_id: db.ObjectId(req.params.id)
				}, prodAactualizar,{
					multi:false
				}, function (err, data) {
					res.writeHead(200, contentTypeTipo);
					res.end(JSON.stringify(data));
				});
				
			});
		});
		return next();
	});	

	server.del('/api/v1/ionBucket/data/item/:id', function (req, res, next) {
		validateRequest.validate(req, res, db, function () {
			db.listasBucket.remove({
				_id: db.ObjectId(req.params.id)
			}, function (err, data) {
				res.writeHead(200, contentTypeTipo);
				res.end(JSON.stringify(data));
			});
		});
		return next();
	});	
};