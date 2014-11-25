'use strict';

/* Controllers */

//angular.module('myApp.controllers', [])
angular.module('myApp.controllers')



//EditItemCtrl--------------------------------------------------------------------------------------
//EditItemCtrl--------------------------------------------------------------------------------------
//EditItemCtrl--------------------------------------------------------------------------------------
//EditItemCtrl--------------------------------------------------------------------------------------
//EditItemCtrl--------------------------------------------------------------------------------------
.controller('EditItemCtrl', ['$scope', '$filter', '$state', '$stateParams', 'Restangular',  'rService', 'Session', '$ionicPopup',   
                    function( $scope,   $filter,   $state,   $stateParams,   Restangular, rService, Session, $ionicPopup) {

    // azione deriva dalla configurazione del controller new/edit
    console.log('EditItemCtrl:  configAction :' +  $state.current.configAction);
    console.log($state);
    console.log($stateParams);
            
    var configAction = $state.current.configAction;
    $scope.configAction = configAction;
    $scope.item = {};
    $scope.openedPopupDate = false;   
                            
    console.log(  'EditItemCtrl:  load button action :');      
                        
    $scope.toggleRight = function() {
        $state.go('menu.list');
    };                                 
 
    $scope.rightButtons =  [{
        type: 'button-icon button-clear ion-email',
        tap: function(e) {
                alert('EditItemCtrl : rightButton fired!');
        }
    }];    
                                     
                        
    if (( configAction == 'edit') || ( configAction == 'view') || ( configAction == 'new'))  {
        console.log('EditItemCtrl : get data from serviziAll : ' +  $stateParams.id + ' ACTION ' + configAction );

        
        if ( configAction == 'new') {
            console.log('EditItemCtrl : NEW : set ID === 0');
            $stateParams.id = 0;
        }
        
        var baseAccounts = Restangular.all('serviziAll');
        // This will query /accounts and return a promise.
        baseAccounts.getList({limit: 50, id_servizi_selezione : $stateParams.id}).then(function(accounts) {
            //$scope.projects = accounts;
            //console.log(accounts);
            $scope.item = accounts[0];

            console.log('EditItemCtrl : load data ....');
            // patch date object
            console.log('EditItemCtrl : patch time object - 1');
            console.log(accounts[0].da_ora_servizi);
            console.log(accounts[0].a_ora_servizi);
            console.log(accounts[0].data_servizi);
            console.log('EditItemCtrl : patch time object - 2 - change format');
            $scope.item.data_servizi = $filter('date')(accounts[0].data_servizi, "yyyy-MM-dd"); 
            //$scope.item.a_ora_servizi = $filter('date')(($filter('asDate')(accounts[0].a_ora_servizi)), "HH:mm"); 
            $scope.item.a_ora_servizi = accounts[0].a_ora_servizi.substr(11,5);
            //$scope.item.da_ora_servizi = $filter('date')(accounts[0].da_ora_servizi, "HH:mm"); 
            $scope.item.da_ora_servizi = accounts[0].da_ora_servizi.substr(11,5);
            console.log($scope.item.data_servizi);
            console.log($scope.item.a_ora_servizi);
            console.log($scope.item.da_ora_servizi);
            
            console.log('EditItemCtrl : elenco_id_volontari');
            console.log(accounts[0].elenco_id_volontari);
            console.log(accounts[0].elenco_id_volontari.split(','));

            $scope.item.id_utenti = accounts[0].id_utenti;
            $scope.item.lista_volontari_servizi = accounts[0].elenco_id_volontari.split(',');
            $scope.timeCalculated = rService.time_diff($scope.item.da_ora_servizi, $scope.item.a_ora_servizi);
            $scope.elenco_id_rapporti_servizio = accounts[0].elenco_id_rapporti_servizio;
            $scope.id_rapporto_valido_servizio = accounts[0].id_rapporto_valido_servizio;
            $scope.item.annullato_servizi = accounts[0].annullato_servizi;

            if ( configAction == 'new') {
                console.log('EditItemCtrl : NEW : INIT DATA');
                $scope.item = [];
                $scope.item.id_utenti = null;
                $scope.item.lista_volontari_servizi = [];
                $scope.item.data_servizi = $filter('date')(new Date(), "yyyy-MM-dd"); 
                $scope.item.a_ora_servizi = $filter('date')(new Date(), "HH:mm"); 
                $scope.item.da_ora_servizi = $filter('date')(new Date(), "HH:mm"); 
                $scope.item.annullato_servizi = 0;
            }
            
            
            
            // fill volontari --------------------------------
            
            //##check null data
            if ( (!(typeof $scope.item.id_utenti === "undefined")) && ($scope.item.id_utenti != null)) {
                        
            console.log('EditItemCtrl : populate volontariList per : ' + $scope.item.id_utenti);
            var volontariList = Restangular.all('volontariAll');
            volontariList.getList({id_volontari_utenti : $scope.item.id_utenti }).then(function(users) {
                    
            console.log('EditItemCtrl : patch accounts');
        
            var fancyArray = [];
            var arrayLength = users.length;
            console.log('EditItemCtrl : patch accounts for ' + arrayLength );
            // build array per la lista di controllo fatta secondo il suo template    
            for (var i = 0; i < arrayLength; i++) {
                //users[i].id = users[i].id_;
                var more = {
                            id : users[i].id,
                            checked :  (accounts[0].elenco_id_volontari.indexOf(users[i].id) > -1)  ?  true : false ,
                            text : users[i].nome_completo_volontari
                        };
                console.log(more);
                fancyArray.push(more);
                //Do something
            }
        
            console.log(users);
            $scope.volontariList = fancyArray;
            console.log($scope.volontariList);
        
            //$scope.volontariList = users;
            });
   
            }//##check null data
                
            //fill utenti ------------------------------------------------------------------------------------
            if(Session.isAdmin) {
                console.log('EditItemCtrl : populate list : isAdmin ' + Session.id_utenti + ' ' + Session.nome_breve_utenti);
                var utentiList = Restangular.all('utentiAll');
                    utentiList.getList().then(function(accounts) {
                    //console.log(accounts);
                    $scope.utentiList = accounts;
                        
                    var fancyArray = [];
                    var arrayLength = accounts.length;
                    console.log('EditItemCtrl : patch accounts for UTENTI LIST FANCY ' + arrayLength );
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
                console.log('EditItemCtrl : populate list : NOT isAdmin ');
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
            }
        });
    }
                        
    
    $scope.master = {};
    $scope.timeCalculated = 0;
    
 
    // time change event
    $scope.timechanged = function () {
        console.log('EditItemCtrl : Time changed to: ' + $scope.item.da_ora_servizi);
        console.log('EditItemCtrl : Time changed to: ' + $scope.item.a_ora_servizi);
        $scope.timeCalculated = rService.time_diff($scope.item.da_ora_servizi, $scope.item.a_ora_servizi);
        if ( $scope.timeCalculated < 1 ) {
            $scope.timeCalculated = $scope.timeCalculated + 24;
        }
    };
    
    //#### DELETE ACTION
    $scope.cancel_action = function(item){
        
        console.log('EditItemCtrl : cancel_action....');
        var confirmPopup = $ionicPopup.confirm({
                title: 'Messaggio',
                template: 'Annullare il presente elemento?'
        });
            
        confirmPopup.then(function(res) {
             if(res) {
                   console.log('EditItemCtrl : Deleting....');
                   console.log(item.id_servizi);
                   Restangular.oneUrl('servizi', '/api1/servizi/' + item.id ).get().then(
                     function(account){
                            console.log('get!');
                            console.log(account);
                            account.annullato_servizi = 1;
                            console.log('put!');
                            //Restangular.setBaseUrl('/api1/servizi/' + item.id_servizi);
                            Restangular.setBaseUrl('/api1');
                            account.customPUT({annullato_servizi : 1},item.id, {}, {});
                            //account.put();
                            Restangular.setBaseUrl('/apiQ');
                            $state.go('menu.list');
                   });     
                 } else {
                   console.log('EditItemCtrl : Canceled....');
                 }
        });
    }

    
    
    
    //#### SAVE ACTION
    $scope.save_action = function(item){
        
        // validate form
        console.log('EditItemCtrl:save_action:Start validator : ');
        
        var msg = '';
    
        if (typeof $scope.item.elenco_id_volontari === "undefined"){
            msg = 'Selezionare un volontario!';
        }
        
        if ($scope.item.elenco_id_volontari == ''){
            msg = 'Selezionare un volontario!';
        }
        
        console.log('EditItemCtrl:save_action:Start validator :data_servizi :' + $scope.item.data_servizi);
        console.log('EditItemCtrl:save_action:Start validator :data_servizi :' + new Date());
        
        if ( (!Session.isAdmin) && ($scope.item.data_servizi < new Date())  ){
            msg = 'Non è possibile selezionare date del servizio precedenti a quelle odierna.';
        }
    
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
        
            var new_servizio = {
                //id_volontari_servizi :  $scope.item.id_volontari_servizi,
                id_utenti : $scope.item.id_utenti,
                data_servizi : $scope.item.data_servizi,
                da_ora_servizi : '1900-01-01T' + $scope.item.da_ora_servizi + ':00.000Z',
                a_ora_servizi : '1900-01-01T' + $scope.item.a_ora_servizi + ':00.000Z',
                note_servizi : $scope.item.note_servizi,
                //lista_volontari : $scope.item.lista_volontari_servizi,
                // split to array
                lista_volontari : $scope.item.elenco_id_volontari.split(','),
                rapporto_servizi :  $scope.item.rapporto_servizi
            };
            
            console.log('Posting ... ');
            console.log(new_servizio);
            
            var baseServizi = Restangular.allUrl('servizi', '/api1/servizi');
            baseServizi.post(new_servizio).then(
            function(msg){
                console.log("Object saved OK");
                console.log(msg.id);
                
                
                console.log('Saving detail....data ');
                
            
                var alertPopup = $ionicPopup.alert({
                    title: 'Messaggio',
                    template: 'Dato inserito con successo!'
                });
                    alertPopup.then(function(res) {
                    console.log('ok redirect to id: ' + msg.id);
                    $state.go('menu.edit', { id: msg.id });
                });

            }, 
            function(msg) {
                console.log("There was an error saving ... ");
                console.log(msg);
            }
            );
        }
       
    }
    
    // action new relazione
    $scope.new_relazione_action = function($id) {
        console.log('Route to newRelazioni con id : ' + $id);
        $state.go('menu.newRelazioni', { id: $id });
    };

    // action goto relazione
    $scope.goto_relazione_action = function($id) {
        console.log('Route to editRelazioni con id : ' + $id);
        $state.go('menu.editRelazioni', { id: $id });
    };
                        
    
    // click on date field
    $scope.popupDate = function($event) {
        console.log('EditItemCtrl : popupDate');
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
                        
                        
    console.log('EditItemCtrl : watching item.id_utenti');
    // on change id_utenti 
    $scope.$watch('item.id_utenti', function(newValue, oldValue) {
        console.log('EditItemCtrl : WATCH! id_utenti changed!' + newValue + ' ' +  oldValue);
        
        if ( (configAction == 'new') &&  (!(typeof newValue === "undefined")) && (newValue != null)) {
            
            var volontariList = Restangular.all('volontariAll');
            volontariList.getList({id_volontari_utenti : newValue }).then(function(users) {
                    
            console.log('EditItemCtrl : WATCH! get list for value ' + newValue);
        
            var fancyArray = [];
            var arrayLength = users.length;
            console.log('EditItemCtrl : WATCH! patch accounts for ' + arrayLength );
            // build array per la lista di controllo fatta secondo il suo template    
            for (var i = 0; i < arrayLength; i++) {
                //users[i].id = users[i].id_;
                var more = {
                            id : users[i].id,
                            //checked :  (accounts[0].elenco_id_volontari.indexOf(users[i].id) > -1)  ?  true : false ,
                            checked :   false ,
                            text : users[i].nome_completo_volontari
                        };
                console.log(more);
                fancyArray.push(more);
                //Do something
            }
        
            console.log(users);
            $scope.item.elenco_volontari = '';
            $scope.item.elenco_id_volontari = '';
            $scope.volontariList = fancyArray;
            console.log($scope.volontariList);
        
            //$scope.volontariList = users;
            });

            
            /*
            var volontariList = Restangular.all('volontariAll');
            volontariList.getList({id_volontari_utenti : newValue }).then(function(accounts) {
                console.log('EditItemCtrl: RESET volontariList e list_volontari_servizi');
                $scope.volontariList = accounts;
                $scope.item.lista_volontari_servizi = [];
            });
            */
        }
        
    });
                        
    $scope.$watch('item.volontariList1', function(newValue, oldValue){
        console.log('EditItemCtrl : DA_item.lista_volontari_servizi' + newValue + ' ' +  oldValue);
    });                    
                        
                        
}])



// InfiniteCtrl ---------------------------------------------------------------------------------
// InfiniteCtrl ---------------------------------------------------------------------------------
// InfiniteCtrl ---------------------------------------------------------------------------------
// InfiniteCtrl ---------------------------------------------------------------------------------
// InfiniteCtrl ---------------------------------------------------------------------------------
// InfiniteCtrl ---------------------------------------------------------------------------------
.controller('InfiniteCtrl', ['$scope', '$state', '$location', 'Restangular', '$filter', 'Session', '$ionicModal','$ionicSideMenuDelegate','$ionicPopover', '$ionicLoading', 
                             function($scope,  $state, $location, Restangular, $filter, Session, $ionicModal,   $ionicSideMenuDelegate,  $ionicPopover, $ionicLoading) {
    
  console.log('SERVIZI>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');                                 
  console.log('InfiniteCtrl start...');
  
  $scope.totalPages = 0;
  $scope.itemsCount = 0;
  $scope.currentPage = 1; 
  $scope.currentItemDetail = null;
  $scope.totalItems = 0;
  $scope.pageSize = 100; // impostato al massimo numero di elementi
  $scope.startPage = 0;         
  $scope.openedPopupDate = false;    
  $scope.utentiList = [];
  $scope.id_utenti_selezione = 0;        
  $scope.items = [];
  $scope.loadMoreDataCanBeLoaded = true;
  
  // gestione modal popup slide per i filtri --------------------------------------------------
  $ionicModal.fromTemplateUrl('templates/sortModal.html', 
        function(sortModal) {
            $scope.sortModal = sortModal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });
           
  $ionicModal.fromTemplateUrl('templates/detailModal.html', 
        function(detailModal) {
            $scope.detailModal = detailModal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });
                                 
                                 
                                 
  $scope.openSortModal = function() {
        console.log('InfiniteCtrl Sort Modal ...');    
        $scope.sortModal.show();
  };
                                 
  $scope.openDetailModal = function(item) {
        console.log('InfiniteCtrl Detail Modal ... :');    
        console.log(item);
        item.data_servizi = $filter('date')(item.data_servizi, "dd/MM/yyyy"); 
        item.a_ora_servizi = item.a_ora_servizi.substr(11,5);
        item.da_ora_servizi = item.da_ora_servizi.substr(11,5);
        $scope.currentItemDetail = item;
        $scope.detailModal.show();
  };
                                 
                                 
  $scope.closeSortModal = function() {$scope.sortModal.hide();};
  $scope.closeDetailModal = function() {$scope.detailModal.hide();};
                                 
  $scope.saveSort = function() {
    console.log("SORT MODAL " + this.filterTerm + " sort " + this.sortBy + ' id_selezione :' + this.id_utenti_selezione);
    $scope.filterCriteria.id_utenti_selezione = this.id_utenti_selezione;
    console.log($scope.filterCriteria);
    $scope.filterTerm = this.filterTerm;
    $scope.sortBy = this.sortBy;
    $scope.sortModal.hide();
    $scope.fetchResult();
  }
  
  $scope.OpenFilter = function() {
       console.log("OpenFilter .. sortModal.show()");
        $scope.sortModal.show();
  };                                 
                               
                                 
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
    
    console.log('InfiniteCtrl SERVIZI INIT filterCriteria');
    console.log($scope.filterCriteria);
    
    // popola la lista utenti
    var volontariList = Restangular.all('utentiAll');
                                 
    console.log('InfiniteCtrl #VolontariListURL ' + volontariList.getRestangularUrl());                              
                                 
    volontariList.getList().then(function(accounts) {
        console.log(accounts);
        if(Session.isAdmin) {
            console.log('InfiniteCtrl : populate list : isAdmin ');
            $scope.utentiList = accounts;
            $scope.utentiList.push({"id_utenti": 0,"nome_breve_utenti": "TUTTI"});
            $scope.id_utenti_selezione = 0;
        } else {
            console.log('InfiniteCtrl : populate list : NOT isAdmin ');
            console.log(Session.id_utenti);
            $scope.id_utenti_selezione = Session.id_utenti;
            $scope.filterCriteria.id_utenti_selezione = Session.id_utenti;
            $scope.utentiList = [];
            $scope.utentiList.push({id_utenti: Session.id_utenti,nome_breve_utenti: Session.nome_breve_utenti});
        }
    });    
 

 
  //The function that is responsible of fetching the result from the server and setting the grid to the new result
  $scope.fetchResult = function () {
      console.log('InfiniteCtrl: fetchResult');
      console.log('InfiniteCtrl: impostazione criteri di filtro');

      var offset_page =  ( $scope.currentPage - 1 ) * $scope.pageSize;
      $scope.filterCriteria.start = offset_page;
      console.log($scope.filterCriteria);
      
    
      var serviziList = Restangular.all('serviziAll');
      
      console.log('InfiniteCtrl...fetchResult - GET Count');
      
      // Get items count 
      /*
      $scope.filterCriteria.count = 1; // imposta il conteggio sul server
      serviziList.getList($scope.filterCriteria).then(function(data) {
            console.log('COUNT: data[0].totalItems:' + data[0].totalItems);
            console.log(data);
          
            if (data.length > 0) {
                $scope.totalItems = data[0].totalItems;
            } else {
                $scope.totalItems = 0;
            }
        // Error get count
        }, function () {
            $scope.totalItems = 0;
            //$scope.totalPages = 0;
      }); // items count
      */      
          // Get items ...  
      console.log('InfiniteCtrl...fetchResult - GET data');
      $scope.filterCriteria.count = 0; // imposta la selezione standard sul server
      $ionicLoading.show({template: 'Dati in arrivo!' });
      return serviziList.getList($scope.filterCriteria).then(function(data) {
               console.log(data);
          
                var fast_array = [];
          
                console.log('InfiniteCtrl .. preparing data...');
                data.forEach(function (idata) {
                    //console.log(idata);
                    //$scope.items.push(idata);
                    if(idata.annullato_servizi == 1) idata.image_class="icon ion-close-circled assertive";
                    if((idata.id_rapporto_valido_servizio != null) && (idata.annullato_servizi == 0)) idata.image_class="icon ion-share balanced";
                    if((idata.id_rapporto_valido_servizio == null) && (idata.annullato_servizi == 0)) idata.image_class="icon ion-checkmark balanced";
                    
                    /*
                    fast_array.push(
                        {
                            id: idata.id,
                            data_servizi: idata.data_servizi,
                            image_class: idata.image_class,
                            nome_breve_utenti: idata.nome_breve_utenti,
                            elenco_volontari: idata.elenco_volontari
                        }
                    
                    );
                    */
                    
                });
                
                console.log(fast_array);
          
                $scope.items = data;
                //$scope.items = fast_array;
            
                console.log(' .. data loaded!');
                $ionicLoading.hide();  
              
          // in caso di errore azzera la lista...      
          }, function () {
                $scope.items = [];
      });
          
      /*
      $scope.items = serviziList.getList($scope.filterCriteria).$object;
      console.log('@@@@@@@@@@@@@@@@@@ dati ritornati @@@@@@@@@@@@@@@@@@@');
      console.log($scope.items);
      */
          
 };
      
 
  //called when navigate to another page in the pagination
  $scope.selectPage = function () {
    var page = $scope.currentPage;
    console.log('SELECT PAGE ...');  
    console.log('Page changed to: ' + $scope.currentPage);  
    console.log('InfiniteCtrl...selectPage:' + page);
    $scope.currentPage = page;
    $scope.filterCriteria.pageNumber = page;
    $scope.fetchResult();
      
  };
                  
 
 
  //manually select a page to trigger an ajax request to populate the grid on page load
  console.log('InfiniteCtrl : selectPage 1');
  $scope.selectPage();
    
  // COLLECTION REPEAT TEST                               
  $scope.getItemHeight = function(item) {
    return item.isLetter ? 40 : 100;
  };
  $scope.getItemWidth = function(item) {
    return '100%';
  };                                 
                                 
                         
     // action new relazione
    $scope.new_relazione_action = function($id) {
        console.log('Route to newRelazioni con id : ' + $id);
        $scope.detailModal.hide();
        $state.go('menu.newRelazioni', { id: $id });
    };

    // action goto relazione
    $scope.goto_relazione_action = function($id) {
        console.log('Route to editRelazioni con id : ' + $id);
        $scope.detailModal.hide();
        $state.go('menu.editRelazioni', { id: $id });
    };                                 
                                 
                                 

  /*
                                 
  // watch change selection    
  $scope.$watch("id_utenti_selezione", function(newValue, oldValue) {
        console.log('id_utenti changed! New ' + newValue + ' Old ' +  oldValue);
        
        if(Session.isAdmin) {
            $scope.filterCriteria.id_utenti_selezione = newValue;
            $scope.currentPage = 1;
            $scope.filterCriteria.pageNumber = $scope.currentPage;
            $scope.fetchResult();
        } else {
            console.log('id_utenti changed! New NO ADMIN NO ACTION');
        }
        
    });    
    
    //watch on change data_servizi NON SERVE
    
                                 
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
    
    */
                                 
    // callback for ng-click 'editUser':
    $scope.editItem = function (itemId) {
        console.log('editItem : change state');
        console.log(itemId);
        $location.path('/menu/edit/' + itemId);
    };
    
    // callback for ng-click 'editUser':
    $scope.editItem = function (itemId) {
        console.log('viewItem : change state');
        console.log(itemId);
        $location.path('/menu/view/' + itemId);
    };    
                                 
                                 
    // callback for ng-click 'editUser':
    $scope.editRelazioni = function (itemId) {
        console.log('/menu/editItem');
        $location.path('/menu/editRelazioni/' + itemId);
    };
    
    
     // callback for ng-click 'editUser':
    $scope.newRelazioni = function () {
        console.log('/menu/new');
        $location.path('/menu/new');
    };
    
    $scope.debug_action = function(item){
        console.log('DEBUG_ACTION');
        console.log($scope);
    };
                                 
    $scope.newRelazioniFromPopover = function () {
        console.log('/menu/new');
        $scope.popover.remove();
        $location.path('/menu/new');
    };
                        
    $scope.OpenFilterFromPopover = function() {
        console.log('OpenFilterFromPopover');
        $scope.popover.hide();
        $scope.sortModal.show();
    };                                   
                                 
                                 
                                 
    var templatePopover = '<ion-popover-view>';
    //templatePopover +=    '<ion-header-bar><h1 class="title">Azioni possibili</h1></ion-header-bar>';                                          
    templatePopover +=    '<ion-content>';                                      
    templatePopover +=    '<div class="list">';
    templatePopover +=    '<a class="item item-icon-left" ng-click="newRelazioniFromPopover()" ><i class="icon ion-plus-circled"></i> Nuovo elemento</a>';
    templatePopover +=    '<a class="item item-icon-left" ng-click="OpenFilterFromPopover()"><i class="icon ion-funnel"></i>Filtro</a>';
    //templatePopover +=    '<a class="item item-icon-left" ng-click="ShowItemDetailFromPopover()"><i class="icon ion-funnel"></i>Item</a>';
    //templatePopover +=    '<button class="button button-clear button-positive" ng-click="debug_action()">Chiudi</button>';
    templatePopover +=    '</div>';
    templatePopover +=    '</ion-content>';                                      
    templatePopover +=    '</ion-popover-view>';

    //<ion-nav-buttons side="right" >
    //<button class="button button-icon button-clear ion-plus-circled" ng-click="newRelazioni()"></button>
    //</ion-nav-buttons>
                                 
    console.log(templatePopover);                                          
                             
    $scope.popover = $ionicPopover.fromTemplate(templatePopover,{ scope: $scope });                                     
                                          
    $scope.$on('$destroy', function() {
        $scope.popover.remove();
    });

                                 
                                 
}]);

