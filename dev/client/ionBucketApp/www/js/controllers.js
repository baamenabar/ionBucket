angular.module('ionBucket.controllers', ['ionBucket.services'])

.controller('signInCtrl',function ($rootScope, $scope, API, $window) {
	// si el usuario tiene una sesión activa, llevarlo directamente a su bucket list
	if ($rootScope.isSessionActive()) {
		$window.location.href = ('#/bucket/list');//tengo que ver si puedo hacer esto con alguna directiva de "state"
	}

	$scope.user = {
		email: '',
		password: ''
	};

	$scope.validateUser = function() {
		var email = this.user.email;
		var password = this.user.password;
		if (!email || !password) {
			$rootScope.notify('Por favor, escriba cerenciales válidas');
			return false;
		}
		$rootScope.show('Por favor espere, verificando ...');
		console.log('pasamos la primera funcion');
		API.signin({
			email: email,
			password: password
		}).success(function (data) {
			$rootScope.setToken(email); //creamos la sesión localmente
			$rootScope.hide();
		}).error(function (error) {
			console.log('recibimos respuesta negativa');
			$rootScope.hide();
			$rootScope.notify('Nombre de usuario o clave inválidos');
		});
	};
})

.controller('signUpCtrl',function ($rootScope, $scope, API, $window) {
	//OHHHH! $scope is what is going to be accessible to view.
	$scope.user = {
		email: '',
		password: '',
		name: ''
	};

	$scope.createUser = function () {
		console.log('createUser llamado');
		var email = this.user.email;
		var password = this.user.password;
		var uName = this.user.name;
		if (!email || !password || !uName) {
			$rootScope.notify('Por favor, escriba infomación válida');
			return false;
		}
		$rootScope.show('Por favor espere, Registrando al usuario ...');
		API.signup({
			email: email,
			password: password,
			name: uName
		}).success(function (data) {
			$rootScope.setToken(email);
			$rootScope.hide();
		}).error(function (error) {
			$rootScope.hide();
			if (error.error && error.error.code == 11000) {
				$rootScope.notify('Un usuario con este email ya está registrado.');
			}else{
				$rootScope.notify('oops, algo anda mal, por favor, inténtalos de nuevo!');
			}
		});
	};
	
})

.controller('myListCtrl',function ($rootScope, $scope, API, $timeout, $ionicModal, $window) {
	$rootScope.$on('fetchAll', function () {
		API.getAll($rootScope.getToken()).success(function (data, status, headers, config) {
			$rootScope.show('Procesando... Por favor espere');
			$scope.list = [];
			for (var i = 0; i < data.length; i++) {
				if(data[i].isCompleted == false) {
					$scope.list.push(data[i]);
				}
			}
			$scope.noData = !Boolean($scope.list.length);

			$ionicModal.fromTemplateUrl('templates/newItem.html', function (modal) {
				$scope.newTemplate = modal;
			});

			$scope.newTask = function () {
				$scope.newTemplate.show();
			};
			$rootScope.hide();
		}).error(function (data, status, headers, config) {
			$rootScope.hide();
			$rootScope.notify('Oh! algo ha salido mal!! por favor inténtalo de nuevo');
		});
	});

	$rootScope.$broadcast('fetchAll');

	$scope.markCompleted = function (id) {
		$rootScope.show('Please wait... updating list');
		API.putItem(id, {
			isCompleted:true
		}, $rootScope.getToken())
		.success(function (data, status, headers, config) {
			$rootScope.hide();
			$rootScope.doRefresh(1);
		})
		.error(function (data, status, headers, config) {
			$rootScope.hide();
			$rootScope.notify('Oh! algo ha salido mal!! por favor inténtalo de nuevo');
		});
	};
})

.controller('completedCtrl',function ($rootScope, $scope, API, $window) {
	$rootScope.$on('fetchCompleted', function () {
		API.getAll($rootScope.getToken()).success(function (data, status, headers, config) {
			$scope.list = [];
			for (var i = 0; i < data.length; i++) {
				if(data[i].isCompleted == true) {
					$scope.list.push(data[i]);
				}
			}
			if (data.length > 0 && $scope.list.length == 0) {
				$scope.incomplete = true;
			}else{
				$scope.incomplete = false;
			}
			$scope.noData = !Boolean($scope.list.length);
		}).error(function (data, status, headers, config) {
			$rootScope.notify('Oh! algo ha salido mal!! por favor inténtalo de nuevo');
		});
	});

	$rootScope.$broadcast('fetchCompleted');
	$scope.deleteItem = function(id){
		$rootScope.show('Borrando elemento... Por favor espere');
		API.deleteItem(id)
		.success(function (data, status, headers, config) {
			$rootScope.hide();
            $rootScope.doRefresh(2);
		})
		.error(function (data, status, headers, config) {
			$rootScope.hide();
			$rootScope.notify('Oh! algo ha salido mal!! por favor inténtalo de nuevo');
		});
	};
})

.controller('newCtrl',function ($rootScope, $scope, API, $window) {
	$scope.data = {
		item: ""
	};

	$scope.close = function () {
		$scope.modal.hide();
	};

	$scope.createNew = function () {
		var item = $scope.data.item;
		if (!item) return;
		$scope.modal.hide();
		$rootScope.show();

		$rootScope.show('Creando nuevo... por favor espere');

		var form = {
			item: item,
			isCompleted: false,
			user: $rootScope.getToken(),
			created: Date.now(),
			updated: Date.now()
		};

		API.saveItem(form, form.user)
		.success(function (data, status, headers, config) {
			$rootScope.hide();
            $rootScope.doRefresh(1);
		})
		.error(function (data, status, headers, config) {
			$rootScope.hide();
			$rootScope.notify('Oh! algo ha salido mal!! por favor inténtalo de nuevo');
		});
	};
});