'use strict';

/* Controllers */

//angular.module('myApp.controllers', [])
angular.module('myApp.controllers')



.controller("AppCtrl", 
            [ '$scope',   'USER_ROLES',   'AUTH_EVENTS',   '$rootScope', 'AuthService', 'Session', 'Restangular',  '$state', '$ionicPopup','$ionicSideMenuDelegate', 'ENV',
            function($scope,   USER_ROLES,   AUTH_EVENTS,   $rootScope,   AuthService,   Session,   Restangular,    $state,   $ionicPopup, $ionicSideMenuDelegate, ENV) {

                
        console.log("AppCtrl ... ");
        console.log(ENV);
                
                
        $scope.currentUser = null;
        $scope.userRoles = USER_ROLES;
        $scope.isAuthorized = AuthService.isAuthorized;
    
        $scope.go = function ( path ) {
            $state.go(path);
        };
                
        if(window.ionic){
            console.log('IONIC defined! : ' + window.ionic.version);
        }
                
        $scope.toggleLeft = function() {
             $ionicSideMenuDelegate.toggleLeft($scope.$$childHead);
        };
          
        // CONFIGURAZIONI -----------------------------------------------------------------        
                
        $rootScope.base_url = ENV.apiEndpoint;

        if (ENV.name == 'development') {        
            Session.create(1, 'PROVINCIA', ENV.token,  true);
            $scope.currentUser = ENV.userName;
            $scope.isAuthorized = ENV.isAuthorized;
            Restangular.setDefaultRequestParams({ apiKey: Session.token });
        }
  
                
        console.log('WEB SERVICE WEB URL  : ' + $rootScope.base_url);
        console.log('Restangular set base Url '+ $rootScope.base_url + '/apiQ' );
        Restangular.setBaseUrl($rootScope.base_url + '/apiQ');
                
        
        //AUTH_EVENTS.loginFailed
    
        $rootScope.$on(AUTH_EVENTS.loginSuccess , function (event, next) {
            console.log('AppCtrl: AUTH_EVENTS.loginSuccess ... ');
            console.log(event);
            console.log(next);
            $scope.currentUser = Session.nome_breve_utenti;
            Restangular.setDefaultRequestParams({ apiKey: Session.token });
            $state.go('menu.list');
        });
                
                
        $rootScope.$on(AUTH_EVENTS.logoutSuccess , function (event, next) {
            console.log('AppCtrl: AUTH_EVENTS.logourSuccess ... ');
            console.log(event);
            console.log(next);
            $scope.currentUser = '';
            Restangular.setDefaultRequestParams({ apiKey: '' });
            $state.go('menu.home');
        });        
                
   
        $rootScope.$on(AUTH_EVENTS.loginFailed, function (event, next) {
            console.log('AppCtrl: AUTH_EVENTS.loginFailed ... ');
            console.log(event);
            console.log(next);
             
            
            var alertPopup = $ionicPopup.alert({
                title: 'Login errato',
                template: 'Immettere nome utente e password corrette'
            });
           alertPopup.then(function(res) {
                console.log('AppCtrl : Login errato OK');
                $state.go('menu.home');
           });
        }); 

    
    
         $rootScope.$on(AUTH_EVENTS.notAuthenticated, function (event, next) {
            console.log('AUTH_EVENTS.notAuthenticated ... ');
            console.log(event);
            console.log(next);
            $scope.currentUser = Session.nome_breve_utenti;
            
             var alertPopup = $ionicPopup.alert({
                title: 'Utente non autenticato',
                template: 'Immettere nome utente e password'
                });
            alertPopup.then(function(res) {
             console.log('AppCtrl: alertPopup : OK');
                $state.go('menu.home');
           });
           
           
            
        }); 
    
        $rootScope.$on('$stateChangeStart', function (event, next) {
            console.log('$stateChangeStart: ' + next.accessLogged);
                        
            if(next.accessLogged){
                console.log('$stateChangeStart: check if isAuthenticated : ' + AuthService.isAuthenticated());
                if(!AuthService.isAuthenticated()){
                    event.preventDefault();    
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                }
            } else {
                console.log('$stateChangeStart: PATH free');
            }
            
            /*
            if (!AuthService.isAuthorized(authorizedRoles)) {
                event.preventDefault();
                if (AuthService.isAuthenticated()) {
                        // user is not allowed
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                } else {
                    // user is not logged in
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                }
            }
            */
        });
}])

// LoginController ------------------------------------------------------------------------------------
// LoginController ------------------------------------------------------------------------------------
// LoginController ------------------------------------------------------------------------------------
// LoginController ------------------------------------------------------------------------------------
// LoginController ------------------------------------------------------------------------------------
.controller('LoginController', 
            [ '$scope', '$rootScope', 'AUTH_EVENTS', 'AuthService','$state',
            function ($scope, $rootScope, AUTH_EVENTS, AuthService,$state) {
                
    console.log('LoginController...');
    console.log('LoginController...currentUser:' + $scope.currentUser );
                
  
 $scope.credentials = {
    username: '',
    password: ''
  };
    
    
  
  /*
  $scope.leftButtons = [{
            type: 'button-icon button-clear ion-navicon',
            tap: function(e) {
                $ionicSideMenuDelegate.toggleLeft($scope.$$childHead);
            }
  }];                     
    
  */    
    
  // title ion-view
  $scope.navTitle = '<span class="item-calm">Gestione Volontari</span>';
  //$scope.navTitle = '<img style="height:100px; width:auto;" src="img/logo2.jpg" />';
             
 $scope.goto_help = function($id) {
        console.log('HelpController : Route to login');
        $state.go('menu.help');
    };     
                
    $scope.fullscreenOn = function(){
        console.log('AboutController : fullscreen');
        console.log('AboutController : fullscreen enabled? : ' + screenfull.enabled);
        screenfull.request();
    };

    $scope.fullscreenOff = function(){
        console.log('AboutController : fullscreen');
        console.log('AboutController : fullscreen enabled? : ' + screenfull.enabled);
        screenfull.exit();
    };            
                
                
                
  $scope.login = function (credentials) {
      console.log('login:calling .. AuthService. ..');
      console.log(credentials);
    AuthService.login(credentials).then(function () {
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
    }, function () {
      $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
    });
  };

    $scope.logout = function (credentials) {
      console.log('logout:calling .. AuthService. ..');
      console.log(credentials);
    AuthService.logout(credentials).then(function () {
      $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
    }, function () {
      $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
    });
  };

    
}])

// AboutController ------------------------------------------------------------------------------------
.controller('AboutController', 
            [ '$scope', '$rootScope', 'AUTH_EVENTS', 'AuthService','Session','$location','$ionicLoading','$http', '$ionicPopup',
            function ($scope, $rootScope, AUTH_EVENTS, AuthService, Session, $location, $ionicLoading, $http, $ionicPopup ) {
    console.log('AboutController...');
    console.log(Session);
    $scope.navTitle = Session.nome_breve_utenti;
    $scope.base_url = $rootScope.base_url;
                
    $scope.$location = {};
    //$ionicLoading.show({   template: 'Loading...'   });         
    angular.forEach("protocol host port path search hash".split(" "), function(method){
        $scope.$location[method] = function(){
        var result = $location[method].call($location);
        return angular.isObject(result) ? angular.toJson(result) : result;
        };
    });
    //$ionicLoading.hide();
               
                
    $scope.fullscreenOn = function(){
        console.log('AboutController : fullscreen');
        console.log('AboutController : fullscreen enabled? : ' + screenfull.enabled);
        screenfull.request();
    };

    $scope.fullscreenOff = function(){
        console.log('AboutController : fullscreen');
        console.log('AboutController : fullscreen enabled? : ' + screenfull.enabled);
        screenfull.exit();
    };
                
    $scope.test_connection = function(){
        console.log('AboutController : test_connection');
        $ionicLoading.show({   template: 'Loading...'   }); 
      
        $http({method: 'GET', url: $rootScope.base_url + '/mv/testconnection'}).
        success(function(data, status, headers, config) {
                console.log($rootScope.base_url + '/mv/testconnection');
                console.log(data);
                console.log(status);
                console.log(headers);
                console.log(config);
            
                var alertPopup = $ionicPopup.alert({
                title: 'OK!',
                template: 'Test di connessione ok'
                });
                    alertPopup.then(function(res) {
                    console.log('Quit popup');
                });
        }).
        error(function(data, status, headers, config) {
                console.log($rootScope.base_url + '/mv/testconnection');
                console.log(data);
                console.log(status);
                console.log(headers);
                console.log(config);
                var alertPopup = $ionicPopup.alert({
                title: 'Errori!',
                template: 'Test di connessione FALLITO'
                });
                    alertPopup.then(function(res) {
                    console.log('Quit popup');
                });
        });
        
        
        
        
        $ionicLoading.hide();
        
    };
                
                
    
}])

// HelpController ------------------------------------------------------------------------------------
.controller('HelpController', 
            [ '$scope', '$rootScope', 'AUTH_EVENTS', 'AuthService','Session','$location','$ionicLoading','$http', '$ionicPopup','$ionicSlideBoxDelegate','$state',
            function ($scope, $rootScope, AUTH_EVENTS, AuthService, Session, $location, $ionicLoading, $http, $ionicPopup,$ionicSlideBoxDelegate,$state ) {
    console.log('HelpController...');
    
                
        // action new relazione
    $scope.goto_login = function($id) {
        console.log('HelpController : Route to login');
        $state.go('menu.login');
    };            
    
        
    
                
                
    
}]);


