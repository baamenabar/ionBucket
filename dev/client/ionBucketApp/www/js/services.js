angular.module('ionBucket.services', [])
.factory('API', function ($rootScope, $http, $ionicLoading, $window) {
	var base = 'http://localhost:9804';

	$rootScope.show = function (text) {
		console.log('$rootscope.show llamado en services.js');
		$ionicLoading.show({
			content : text ? text : 'Loading',
			animation: 'fade-in',
			showBackdrop:true,
			maxWidth: 200,
			showDelay: 0
		});
	};

	$rootScope.hide = function() {
		$ionicLoading.hide();
	};

	$rootScope.logout = function () {
		$rootScope.setToken('');
		$window.location.href = '#/auth/signin';
	};

	$rootScope.notify = function (text) {
		console.log('llamado notify en services.js');
		$rootScope.show(text);
		$window.setTimeout(function () {
			$rootScope.hide();
		}, 2299);
	};

	$rootScope.doRefresh = function (tab) {
		if(tab == 1){
			$rootScope.$broadcast('fetchAll');
		}else{
			$rootScope.$broadcast('fectchCompleted');
		}
		$rootScope.$broadcast('scroll.refreshComplete');
	};

	$rootScope.setToken = function (token) {
		return $window.localStorage.token = token;
	};

	$rootScope.getToken = function (token) {
		return $window.localStorage.token;
	};

	$rootScope.isSessionActive = function () {
		return $window.localStorage.token ? true :false;
	};

	return {
		signin: function (form) {
			console.log('llamando a signin dentro de services.js');
			return $http.post(base+'/api/v1/ionBucket/auth/login', form);// esto devolverá una promise que contiene 2 métodos successs y error
		},
		signup: function (form) {
			return $http.post(base+'/api/v1/ionBucket/auth/register', form);
		},
		getAll: function (email) {
			return $http.get(base+'/api/v1/ionBucket/data/list', {
				method: 'GET',
				params: {
					token: email
				}
			});
		},
		getOne: function (id, email) {
			return $http.get(base+'/api/v1/ionBucket/data/item/'+id, {
				method: 'GET',
				params: {
					token: email
				}
			});
		},
		saveItem: function (form, email) {
			return $http.post(base+'/api/v1/ionBucket/data/item', form, {
				method: 'POST',
				params: {
					token: email
				}
			});
		},
		putItem: function (id, form, email) {
			return $http.put(base+'/api/v1/ionBucket/data/item/' + id, form, {
				method: 'PUT',
				params: {
					token: email
				}
			});
		},
		deleteItem: function (id, email) {
			return $http.delete(base+'/api/v1/ionBucket/data/item/' + id, {
				method: 'DELETE',
				params: {
					token: email
				}
			});
		},
	};
});
