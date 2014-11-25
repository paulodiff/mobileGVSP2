'use strict';

/* Controllers */

angular.module('myApp.controllers')


//EditItemCtrl--------------------------------------------------------------------------------------
//EditItemCtrl--------------------------------------------------------------------------------------
//EditItemCtrl--------------------------------------------------------------------------------------
//EditItemCtrl--------------------------------------------------------------------------------------
//EditItemCtrl--------------------------------------------------------------------------------------
.controller('EditItemCtrlRelazioni', 
                           ['$scope','$filter', '$state', '$stateParams', 'Restangular','rService', 'Session', '$ionicPopup',  
                    function($scope,  $filter,   $state,   $stateParams,   Restangular,  rService ,  Session, $ionicPopup) {

    // azione deriva dalla configurazione del controller new/edit
    console.log('EditItemCtrlRelazioni:  configAction :' +  $state.current.configAction);
    console.log($state);
    console.log($stateParams);
            
    var configAction = $state.current.configAction;
    $scope.configAction = configAction;
    $scope.item = {};
    $scope.openedPopupDate = false;   
    
    //if (( configAction == 'edit') || ( configAction == 'view') || ( configAction == 'new') )  {
        
    console.log('EditItemCtrlRelazioni : get data from rapportiAll : ' + $stateParams.id + ' Action ' + configAction);

    if (( configAction == 'edit') || ( configAction == 'view')  )  {
        var baseAccounts = Restangular.all('rapportiAll');
        var queryOptions =  {
                                limit : 50,
                                id_rapporti_selezione :  $stateParams.id
                            };
    } else { // new action
        var baseAccounts = Restangular.all('serviziAll');
        var queryOptions =  {
                                limit: 50, 
                                id_servizi_selezione : $stateParams.id
                            };
    }
        //var baseAccounts = Restangular.all('rapportiAll');
        //baseAccounts.getList({limit: 50, id_rapporti_selezione : $stateParams.id}).then(function(accounts) {
                
    baseAccounts.getList(queryOptions).then(function(accounts) {
        console.log(accounts);
        if (( configAction == 'edit') || ( configAction == 'view')  )  {

            console.log('EditItemCtrlRelazioni : load data for ....' + configAction);
            $scope.item.id = $stateParams.id;
            $scope.item.id_servizi = accounts[0].id_servizi;
            $scope.item.id_utenti = accounts[0].id_utenti;
            $scope.item.nome_breve_utenti = accounts[0].nome_breve_utenti;
            $scope.item.elenco_id_volontari = accounts[0].elenco_id_volontari;
            $scope.item.elenco_volontari = accounts[0].elenco_volontari;
            $scope.item.lista_volontari_relazioni = accounts[0].elenco_id_volontari.split(',');
            $scope.item.data_relazioni = $filter('date')(accounts[0].data_relazioni, "yyyy-MM-dd");
            $scope.item.a_ora_relazioni = $filter('date')(accounts[0].a_ora_relazioni, "HH:mm");
            $scope.item.da_ora_relazioni = $filter('date')(accounts[0].da_ora_relazioni, "HH:mm");
            $scope.timeCalculated = rService.time_diff($scope.item.da_ora_relazioni, $scope.item.a_ora_relazioni);
            $scope.item.auto_relazioni = accounts[0].auto_relazioni;
            $scope.item.note_relazioni = accounts[0].note_relazioni;
            $scope.item.rapporto_relazioni = accounts[0].rapporto_relazioni;
            $scope.item.annullato_relazioni = accounts[0].annullato_relazioni;
        } else {
            console.log('EditItemCtrlRelazioni : load data for ....' + configAction);
            $scope.item.id_servizi = $stateParams.id;
            $scope.item.id_utenti = accounts[0].id_utenti;
            $scope.item.nome_breve_utenti = accounts[0].nome_breve_utenti;
            $scope.item.elenco_id_volontari = accounts[0].elenco_id_volontari;
            $scope.item.elenco_volontari = accounts[0].elenco_volontari;
            $scope.item.lista_volontari_relazioni = accounts[0].elenco_id_volontari.split(',');
            $scope.item.elenco_id_volontari = accounts[0].elenco_id_volontari;
            $scope.item.data_relazioni = $filter('date')(accounts[0].data_servizi, "yyyy-MM-dd");
            $scope.item.a_ora_relazioni = $filter('date')(accounts[0].a_ora_servizi, "HH:mm");
            $scope.item.da_ora_relazioni = $filter('date')(accounts[0].da_ora_servizi, "HH:mm");
            $scope.timeCalculated = rService.time_diff($scope.item.da_ora_relazioni, $scope.item.a_ora_relazioni);
            $scope.item.auto_relazioni = ' -- NEW AUTO --';
            $scope.item.note_relazioni = ' -- NEW NOTE --';
            $scope.item.rapporto_relazioni = ' -- NEW RAPPORTO --';
            $scope.item.annullato_relazioni = 0;
        }
         
            
        // fill volontari --------------------------------
        if ( (!(typeof $scope.item.id_utenti === "undefined")) && ($scope.item.id_utenti != null)) {
                        
            console.log('EditItemCtrlRelazioni : fill volontariList per : ' + $scope.item.id_utenti);
            var volontariList = Restangular.all('volontariAll');
            volontariList.getList({id_volontari_utenti : $scope.item.id_utenti }).then(function(users) {

                var fancyArray = [];
                var arrayLength = users.length;
                console.log('EditItemCtrlRelazioni : patch accounts for n. ' + arrayLength );
                // build array per la lista di controllo fatta secondo il suo template    
                for (var i = 0; i < arrayLength; i++) {
                    var more = {
                                id : users[i].id,
                                checked :  (accounts[0].elenco_id_volontari.indexOf(users[i].id) > -1)  ?  true : false ,
                                text : users[i].nome_completo_volontari
                            };
                    //console.log(more);
                    fancyArray.push(more);
                }

                //console.log(users);
                $scope.volontariList = fancyArray;
                console.log($scope.volontariList);
        
            });
   
        }//##check null data
            
 
        //fill utenti ------------------------------------------------------------------------------------
        if(Session.isAdmin) {
                console.log('EditItemCtrlRelazioni : populate list : isAdmin ' + Session.id_utenti + ' ' + Session.nome_breve_utenti);
                var utentiList = Restangular.all('utentiAll');
                    utentiList.getList().then(function(accounts) {
                    //console.log(accounts);
                    $scope.utentiList = accounts;
                        
                    var fancyArray = [];
                    var arrayLength = accounts.length;
                    console.log('EditItemCtrlRelazioni : patch accounts for UTENTI LIST FANCY ' + arrayLength );
                    for (var i = 0; i < arrayLength; i++) {
                        //accounts[i].id = accounts[i].id_;
                        var more = {
                                    id : accounts[i].id_utenti,
                                    checked : (accounts[i].id_utenti === $scope.item.id_utenti)  ?  true : false ,
                                    text : accounts[i].nome_breve_utenti
                                };
                        console.log(more);
                        fancyArray.push(more);
                        //Do something
                    }   
                    $scope.utentiList = fancyArray;    
                        
                });
            } else {
                console.log('EditItemCtrlRelazioni : populate list : NOT isAdmin ');
                console.log(Session.id_utenti);
                $scope.utentiList = [];
                var fancyArray = [];
                var more = {
                                    id : Session.id_utenti,
                                    checked : true,
                                    text : Session.nome_breve_utenti
                                };
                fancyArray.push(more);
                $scope.utentiList = fancyArray;
                //$scope.utentiList.push({id_utenti: Session.id_utenti,nome_breve_utenti: Session.nome_breve_utenti});
                $scope.item.id_utenti = Session.id_utenti;
                $scope.item.nome_breve_utenti = Session.nome_breve_utenti;
            } // end fill utenti
            
    });
    

    $scope.toggleRight = function() {
        $state.go('menu.listRelazioni');
        /*
        var alertPopup = $ionicPopup.alert({
                title: '*TODO*',
                template: 'TODO'
        });
                alertPopup.then(function(res) {
                console.log('EditItemCtrlRelazioni: toggleRight');
        });
        */
    };                           
                        
                        
    /*    
    if ( configAction == 'new') {
        
        // fare get dal servizio ed inizializzare i dati
        console.log('EditItemCtrlRelazioni : new from id_servizi' + $stateParams.id);
        
        
        var baseAccounts = Restangular.all('serviziAll');
        // This will query /accounts and return a promise.
        baseAccounts.getList({limit: 50, id_servizi_selezione : $stateParams.id}).then(function(accounts) {
            //$scope.projects = accounts;
            //console.log(accounts);
            console.log('EditItemCtrlRelazioni : load data ....');
            
            //$scope.item = accounts[0];
            //   patch date object
            //console.log('EditItemCtrl : patch time object');
            //console.log(accounts[0].da_ora_rapporti);
            //console.log(accounts[0].a_ora_rapporti);
            
       
            console.log(accounts[0].elenco_id_volontari.split(','));

            $scope.item.id_servizi = $stateParams.id;
            $scope.item.id_utenti = accounts[0].id_utenti;
            $scope.item.lista_volontari_relazioni = accounts[0].elenco_id_volontari.split(',');
            $scope.item.a_ora_relazioni = new Date(accounts[0].a_ora_servizi);
            $scope.item.da_ora_relazioni = new Date(accounts[0].da_ora_servizi);
            $scope.timeCalculated = rService.time_diff($scope.item.da_ora_relazioni, $scope.item.a_ora_relazioni);
            $scope.item.data_relazioni = accounts[0].data_servizi;
            $scope.item.auto_relazioni = ' -- NEW AUTO --';
            $scope.item.note_relazioni = ' -- NEW NOTE --';
            $scope.item.rapporto_relazioni = ' -- NEW RAPPORTO --';
            
        });
    }
    */
    
    
    $scope.master = {};
    $scope.timeCalculated = 0;
    
 
    // time change event
    $scope.timechanged = function () {
        console.log('EditItemCtrlRelazioni : Time changed to: ' + $scope.item.da_ora_relazioni);
        console.log('EditItemCtrlRelazioni : Time changed to: ' + $scope.item.a_ora_relazioni);
        $scope.timeCalculated = rService.time_diff($scope.item.da_ora_relazioni, $scope.item.a_ora_relazioni);
        if ( $scope.timeCalculated < 1 ) {
            $scope.timeCalculated = $scope.timeCalculated + 24;
        }
    };
    
    // ### CANCEL ACTION -------------------------------------------------------------------
    $scope.cancel_action = function(item){
        
        console.log('EditItemCtrl : cancel_action....');
        var confirmPopup = $ionicPopup.confirm({
                title: 'Messaggio',
                template: 'Annullare il presente elemento?'
        });
        
        confirmPopup.then(function(res) {
             if(res) 
             {
                    console.log('EditItemCtrlRelazioni : Deleting....');
                    console.log(item.id);
                    Restangular.oneUrl('relazioni', '/api1/relazioni/' + item.id ).get().then(
                            function(account){
                                console.log('get!');
                                console.log(account);
                                account.annullato_relazioni = 1;
                                console.log('put!');
                                //Restangular.setBaseUrl('/api1/servizi/' + item.id_servizi);
                                Restangular.setBaseUrl('/api1');
                                account.customPUT({annullato_relazioni : 1},item.id, {}, {});
                                //account.put();
                                Restangular.setBaseUrl('/apiQ');
                                $state.go('menu.listRelazioni');
                              });
                    console.log('EditItemCtrlRelazioni : ANNULLATO ' + item.id);         
                 
             } else {
                   console.log('EditItemCtrl : Canceled....');
             }
        });
    } // END CANCEL DELETE ACTION ---------------------------------------------------
    
    
    // #### SAVE ACTION -------------------------------------------------------------
    $scope.save_action = function(item){
        
        // validate form
        console.log('EditItemCtrlRelazioni:save_action:Start validator : ');
        
        var msg = '';
    
        if (typeof $scope.item.elenco_id_volontari === "undefined"){
            msg = 'Selezionare un volontario!';
        }
        
        if ($scope.item.elenco_id_volontari == ''){
            msg = 'Selezionare un volontario!';
        }

        if ($scope.item.lista_volontari_relazioni.length == 0){
            msg = 'Selezionare un volontario!';
        }
        
               
        /*
        if ( (!Session.isAdmin) && ($scope.item.data_relazioni < new Date())  ){
            msg = 'Non è possibile selezionare date del servizio precedenti a quelle odierna.';
        }
        */
    
        if (msg != ''){
            console.log('validate KO');
            var alertPopup = $ionicPopup.alert({
                title: 'Errori di input',
                template: msg
            });
                alertPopup.then(function(res) {
                console.log('Thank you for not eating my delicious ice cream cone');
            });
        } else {
            
            console.log('validate OK ... saving data ...');
        
            var new_relazione = {
                //id_volontari_servizi :  $scope.item.id_volontari_servizi,
                id_utenti : $scope.item.id_utenti,
                id_servizi : $scope.item.id_servizi,
                data_relazioni : $scope.item.data_relazioni,
                da_ora_relazioni : '1900-01-01T' +  $scope.item.da_ora_relazioni + ':00.000Z',
                a_ora_relazioni : '1900-01-01T' +  $scope.item.a_ora_relazioni + ':00.000Z',
                note_relazioni : $scope.item.note_relazioni,
                auto_relazioni : $scope.item.auto_relazioni,
                rapporto_relazioni : $scope.item.rapporto_relazioni,
                lista_volontari : $scope.item.lista_volontari_relazioni
            };
            
            console.log('POST ... ');
            console.log(new_relazione);
            console.log(new_relazione);
            
            var baseServizi = Restangular.allUrl('relazioni', '/api1/relazioni');
            baseServizi.post(new_relazione).then(
                function(msg){
                    console.log("Object saved OK");
                    console.log(msg.id);
       

                   var alertPopup = $ionicPopup.alert({
                        title: 'Messaggio',
                        template: 'Dato inserito con successo!'
                    });
                    alertPopup.then(function(res) {
                        console.log('ok redirect to id: ' + msg.id);
                        $state.go('menu.viewRelazioni', { id: msg.id });
                    });
                }, 
                function(msg) {
                    console.log("There was an error saving ... ");
                    console.log(msg);
                }
            );
        }
       
    }
    
    // click on date field
    $scope.popupDate = function($event) {
        console.log('EditItemCtrlRelazioni : popupDate');
        $event.preventDefault();
        $event.stopPropagation();
        if($scope.openedPopupDate) {
            $scope.openedPopupDate = false;
        } else {
            $scope.openedPopupDate = true;
        }
    }; 
    
    $scope.debug_action = function(item){
        console.log('DEBUG_ACTION');
        console.log(item);
    }                        
    
    console.log('EditItemCtrlRelazioni : watching item.id_utenti');
    // on change id_utenti 
    $scope.$watch('item.id_utenti', function(newValue, oldValue) {
        console.log('EditItemCtrlRelazioni : id_utenti changed!' + newValue + ' ' +  oldValue + ' NO ACTION ');
        /*
        if ( configAction == 'new') {
        
            var volontariList = Restangular.all('volontariAll');
            volontariList.getList({id_volontari_utenti : newValue }).then(function(accounts) {
                console.log('EditItemCtrlRelazioni: RESET volontariList e list_volontari_servizi');
                $scope.volontariList = accounts;
                $scope.item.lista_volontari_servizi = [];
            });
        }
        */
        
    });
}])



// InfiniteCtrl ---------------------------------------------------------------------------------
// InfiniteCtrl ---------------------------------------------------------------------------------
// InfiniteCtrl ---------------------------------------------------------------------------------
// InfiniteCtrl ---------------------------------------------------------------------------------
// InfiniteCtrl ---------------------------------------------------------------------------------
// InfiniteCtrl ---------------------------------------------------------------------------------

// Lista elementi delle relazioni

.controller('InfiniteCtrlRelazioni', ['$scope', '$location', 'Restangular', '$filter', 'Session' , '$ionicPopup', '$ionicPopover',
                                      function($scope,  $location, Restangular, $filter, Session, $ionicPopup, $ionicPopover) {
    
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  console.log('InfiniteCtrlRelazioni START!');
  
  $scope.totalPages = 0;
  $scope.itemsCount = 0;
  $scope.currentPage = 1;    
  $scope.totalItems = 0;
  $scope.pageSize = 8;
  $scope.startPage = 0;         
  $scope.openedPopupDate = false;    
  $scope.utentiList = [];
    


    
  //default criteria that will be sent to the server
  $scope.filterCriteria = {
    pageNumber: 1,
    count: 0,
    limit: $scope.pageSize,
    start: 0,
    sortDir: 'asc',
    sortedBy: 'id',
    id_utenti_selezione : Session.isAdmin ? 0 : Session.id_utenti,
    mese_selezione : 0,
    anno_selezione: 0
  };
    
    console.log('InfiniteCtrlRapporti INIT filterCriteria:');
    console.log($scope.filterCriteria);
    
    // popola la lista utenti
    var volontariList = Restangular.all('utentiAll');
    volontariList.getList().then(function(accounts) {
        console.log(accounts);
        if(Session.isAdmin) {
            console.log('InfiniteCtrlRapporti : populate list : isAdmin ');
            $scope.utentiList = accounts;
            $scope.utentiList.push({"id_utenti": 0,"nome_breve_utenti": "TUTTI"});
            $scope.id_utenti_selezione = 0;
        } else {
            console.log('InfiniteCtrlRapporti : populate list : NOT isAdmin ');
            console.log(Session.id_utenti);
            $scope.id_utenti_selezione = Session.id_utenti;
            $scope.filterCriteria.id_utenti_selezione = Session.id_utenti;
            $scope.utentiList = [];
            $scope.utentiList.push({id_utenti: Session.id_utenti,nome_breve_utenti: Session.nome_breve_utenti});
        }
    });    
 

 
  //The function that is responsible of fetching the result from the server and setting the grid to the new result
  $scope.fetchResult = function () {
      console.log('InfiniteCtrlRapporti...fetchResult');
      console.log($scope.filterCriteria);
    
      var serviziList = Restangular.all('rapportiAll');
      
      console.log('InfiniteCtrlRapporti...fetchResult - count');
      $scope.filterCriteria.count = 1;
      serviziList.getList($scope.filterCriteria).then(function(data) {
            console.log('COUNT: data[0].totalItems:' + data[0].totalItems);
            console.log(data);
          
            if (data.length > 0) {
                $scope.totalItems = data[0].totalItems;
            } else {
                $scope.totalItems = 0;
            }
            //$scope.totalPages = data[0].totalItems;
        }, function () {
            $scope.totalItems = 0;
            //$scope.totalPages = 0;
        });

      console.log('InfiniteCtrlRapporti...fetchResult - get data');
      
      var offset_page =  ( $scope.currentPage - 1 ) * $scope.pageSize;
      $scope.filterCriteria.count = 0;
      $scope.filterCriteria.start = offset_page;
      return serviziList.getList($scope.filterCriteria).then(function(data) {
            console.log(data);
            $scope.items = data;
        }, function () {
            $scope.items = [];
        });
    };
      
 
  //called when navigate to another page in the pagination
  $scope.selectPage = function () {
    var page = $scope.currentPage;
    console.log('Page changed to: ' + $scope.currentPage);  
    console.log('InfiniteCtrl...selectPage:' + page);
    $scope.currentPage = page;
    $scope.filterCriteria.pageNumber = page;
    $scope.fetchResult();
  };
 
  
 
  //manually select a page to trigger an ajax request to populate the grid on page load
  console.log('InfiniteCtrl : selectPage 1');
                                          
  $scope.selectPage(1);
    

  /* watch change selection    
    $scope.$watch("id_utenti_selezione", function(newValue, oldValue) {
        console.log('id_utenti changed! New ' + newValue + ' Old ' +  oldValue + ' NO ACTION');
    });    
    
    //watch on change
    
    $scope.$watch("data_servizi_selezione", function(newValue, oldValue) {
        console.log('data_servizi changed!' + newValue + ' ' +  oldValue);
        
        if(newValue){
            console.log($filter('date')(newValue,'MM'));
            console.log($filter('date')(newValue,'yyyy'));
            $scope.filterCriteria.mese_selezione = $filter('date')(newValue,'MM');
            $scope.filterCriteria.anno_selezione = $filter('date')(newValue,'yyyy');
        } else {
            $scope.filterCriteria.mese_selezione = 0;
            $scope.filterCriteria.anno_selezione = 0;
        }
        $scope.currentPage = 1;
        $scope.filterCriteria.pageNumber = $scope.currentPage;
        $scope.fetchResult();
        
    });    
    */
    
    
    $scope.popupDate = function($event) {
        console.log('popupDate');
        $event.preventDefault();
        $event.stopPropagation();
        if($scope.openedPopupDate) {
            $scope.openedPopupDate = false;
        } else {
            $scope.openedPopupDate = true;
        }
    };
    
    
    // callback for ng-click 'editUser':
    $scope.editItem = function (itemId) {
        console.log('editItem');
        $location.path('/menu/editRelazioni/' + itemId);
    };
    
    
    // callback for ng-click 'editUser':
    $scope.viewItem = function (itemId) {
        console.log('viewItem');
        $location.path('/menu/viewRelazioni/' + itemId);
    };    
    
    $scope.toggleRight = function() {
        var alertPopup = $ionicPopup.alert({
                title: '*TODO*',
                template: 'TODO'
        });
                alertPopup.then(function(res) {
                console.log('EditItemCtrlRelazioni: toggleRight');
        });
    }; 
                                          
    $scope.OpenFilterFromPopover = function() {
        $scope.popover.hide();
        //$scope.sortModal.show();
    };
    
    // Gestione popover                                      
                                          
    var templatePopover = '<ion-popover-view>';
    //templatePopover +=    '<ion-header-bar><h1 class="title">Azioni possibili</h1></ion-header-bar>';                                          
    templatePopover +=    '<ion-content>';                                      
    templatePopover +=    '<div class="list">';
    templatePopover +=    '<a class="item item-icon-left" ng-click="OpenFilterFromPopover()"><i class="icon ion-funnel"></i>Filtro</a>';
    //templatePopover +=    '<button class="button button-clear button-positive" ng-click="debug_action()">Chiudi</button>';
    templatePopover +=    '</div>';
    templatePopover +=    '</ion-content>';                                      
    templatePopover +=    '</ion-popover-view>';


                                       
                                          
    console.log(templatePopover);                                          
                                          
    //$ionicPopover.fromTemplateUrl('popover.html', function(popover) {
     //$scope.popover = popover;
    //});              
                             
    $scope.popover = $ionicPopover.fromTemplate(templatePopover, { scope: $scope });                                     
                                          
                                          
    $scope.$on('$destroy', function() {
        $scope.popover.remove();
    });                                          
                                          
                                          
    
    
}]);

