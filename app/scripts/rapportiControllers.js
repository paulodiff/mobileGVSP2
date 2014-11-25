'use strict';

/* Controllers */

//angular.module('myApp.controllers', [])
angular.module('myApp.controllers')


// ReportCtrl -------------------------------------------------------------------------------------
// ReportCtrl -------------------------------------------------------------------------------------
// ReportCtrl -------------------------------------------------------------------------------------
// ReportCtrl -------------------------------------------------------------------------------------
// ReportCtrl -------------------------------------------------------------------------------------
.controller('ReportCtrlMobile', ['$scope', '$rootScope', 'Restangular', 'rService', '$filter', '$http', '$sce', 'Session', '$ionicPopup',
                        function( $scope,   $rootScope,   Restangular,   rService,   $filter,   $http,   $sce,   Session,   $ionicPopup ) {

    $scope.timeCalculated = 0;
    $scope.item = {};
    $scope.item.tipo_report = 1;
    $scope.openedPopupDate = false;    
    $scope.showDownloadButton = false;
    $scope.showDownloadUrl = false;
    $scope.showGoogleViewUrl = '';
    
   // fill select utenti
    if(Session.isAdmin) {
        console.log('EditItemCtrl : populate list : isAdmin ');
        var utentiList = Restangular.all('utentiAll');
        utentiList.getList().then(function(accounts) {
            //console.log(accounts);
            $scope.utentiList = accounts;
            $scope.utentiList.push({"id_utenti": 0,"nome_breve_utenti": "TUTTI"});
        });
    } else {
        console.log('EditItemCtrl : populate list : NOT isAdmin ');
        console.log(Session.id_utenti);
        $scope.utentiList = [];
        $scope.utentiList.push({id_utenti: Session.id_utenti,nome_breve_utenti: Session.nome_breve_utenti});
        $scope.item.id_utenti = Session.id_utenti;
    }

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
                      
    $scope.view_pdf = function(item){
        console.log('ReportCtrlMobile: view pdf open window...');
        console.log( $rootScope.base_url +  $scope.showDownloadUrl);
        //TEST:https://docs.google.com/viewer?url=http%3A%2F%2Fresearch.google.com%2Farchive%2Fbigtable-osdi06.pdf
        //$scope.showGoogleViewUrl = 'https://docs.google.com/viewer?url=' + encodeURIComponent($rootScope.base_url +  $scope.showDownloadUrl);
        var browser = window.open($scope.showGoogleViewUrl, '_blank', 'location=no');
    };
                      
    $scope.build_report = function(item){
        
        // validate form
        console.log('ReportCtrlMobile: build_report...');
        console.log(item);
        console.log('ReportCtrlMobile:build report:Start validator : ');

        var msg = '';
        
        if ($scope.item.id_utenti >= 0){
            msg = '';
        } else {
            msg = 'Selezionare una Associazione';
        }
        
        if (!$scope.item.data_servizi){
            msg = 'Selezionare una data!';
        }
    
        if (msg != ''){
            console.log('validate KO');
            var alertPopup = $ionicPopup.alert({
                title: 'Errori di input',
                template: msg
            });
                alertPopup.then(function(res) {
                console.log('XXThank you for not eating my delicious ice cream cone');
            });   
            
        } else {
        
        
            // carica i dati per creare la url
            var new_stampa = {
                id_utenti : $scope.item.id_utenti,
                tipo_report : $scope.item.tipo_report,
                data_servizi : $scope.item.data_servizi,
                relazione_servizio : $scope.item.relazione_servizio,
                utenti_controllati : $scope.item.utenti_controllati,
                dati_auto : $scope.item.dati_auto,
                giorno_servizi : $filter('date')($scope.item.data_servizi,'dd'),
                mese_servizi : $filter('date')($scope.item.data_servizi,'MM'),
                anno_servizi : $filter('date')($scope.item.data_servizi,'yyyy'),
                nome_file : new Date().getTime(),
                mobile : 1
            };

            //Restangular.setBaseUrl($rootScope.base_url + '/');
            //Restangular.allUrl('googlers', 'http://www.google.com/').getList();
            var utentiList = Restangular.allUrl('pdf',$rootScope.base_url + '/pdf');
            //var baseServizi = Restangular.allUrl('servizi', '/api1/servizi');
            utentiList.getList(new_stampa).then(function(accounts) {
                //console.log(accounts);
                console.log(accounts);
                
                if ( accounts[0].report_filename == 'NODATATODISPLAY'){
                      var alertPopup = $ionicPopup.alert({
                                  title: 'Messaggio',
                                  template: 'Nessun dato da visualizzare'
                    });
                    alertPopup.then(function(res) {
                        console.log('XXThank you for not eating my delicious ice cream cone');
                    });   

                } else
                {
                    $scope.showDownloadButton = true;
                    $scope.showDownloadButtonText = "Scarica la stampa pdf (" + accounts[0].report_filename + ")";
                    $scope.showDownloadUrl = $rootScope.base_url + "/pdfget?nomefile=" + accounts[0].report_filename;
                    $scope.showGoogleViewUrl = 'https://docs.google.com/viewer?url=' + encodeURIComponent($rootScope.base_url +  $scope.showDownloadUrl);
                }
                
                
                //var browser = window.open('http://www.google.com', '_blank', 'location=no');
                console.log($scope.showDownloadUrl);
                
                
                //'NODATATODISPLAY'
                
            }, function () {
                console.log('ERRORE');
                //$scope.totalPages = 0;
            });

            

            /*
            var r_array = JSON.stringify(new_stampa);
            console.log(r_array);


            var formString = '', key;
            for (key in new_stampa) {
                    //if (!new_stampa[key]) { return; }
                    if (!new_stampa.hasOwnProperty(key)) { return; }
                    if (formString.length !== 0) { formString += '&'; }
                        formString += key + '=' + encodeURIComponent(new_stampa[key]);
            }
            console.log(formString);

            var url = '/pdf/?' + formString;
            //url = '/pdf?anno_servizi=1&prova=123';
            console.log(url);
            var success = new PDFObject({ url: url }).embed("PDF_DIV_CONTAINER");
            */
        } // ok
        
    }
    


    

}])
    
//TestController --------------------------------------------------------------------------------------
//TestController --------------------------------------------------------------------------------------
//TestController --------------------------------------------------------------------------------------
//TestController --------------------------------------------------------------------------------------
//TestController --------------------------------------------------------------------------------------
.controller('TestController', 
            [ '$scope', 'Session', 'Restangular', '$rootScope', '$modal', '$filter', '$location',
            function ($scope, Session, Restangular, $rootScope, $modal, $filter, $location) {
  console.log('TestController... START!');
  
  $scope.totalPages = 0;
  $scope.itemsCount = 0;
  $scope.currentPage = 1;    
  $scope.totalItems = 0;
  $scope.pageSize = 3;
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
    id_utenti_selezione : 0,
    mese_selezione : 0,
    anno_selezione: 0
  };
    
    // popola la lista utenti
    var volontariList = Restangular.all('utentiAll');
    volontariList.getList().then(function(accounts) {
        console.log(accounts);
        if(Session.isAdmin) {
            console.log('TestController : populate list : isAdmin ');
            $scope.utentiList = accounts;
            $scope.utentiList.push({"id_utenti": 0,"nome_breve_utenti": "TUTTI"});
            $scope.id_utenti_selezione = 0;
        } else {
            console.log('TestController : populate list : NOT isAdmin ');
            console.log(Session.id_utenti);
            $scope.id_utenti_selezione = Session.id_utenti;
            $scope.utentiList = [];
            $scope.utentiList.push({id_utenti: Session.id_utenti,nome_breve_utenti: Session.nome_breve_utenti});
        }
    });    
 

 
  //The function that is responsible of fetching the result from the server and setting the grid to the new result
  $scope.fetchResult = function () {
      console.log('TestController...fetchResult');
      console.log($scope.filterCriteria);
    
      var serviziList = Restangular.all('serviziAll');
      
      console.log('TestController...fetchResult - count');
      $scope.filterCriteria.count = 1;
      serviziList.getList($scope.filterCriteria).then(function(data) {
            console.log('COUNT: data[0].totalItems:');
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

      console.log('TestController...fetchResult - get data');
      
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
    console.log('TestController...selectPage:' + page);
    $scope.currentPage = page;
    $scope.filterCriteria.pageNumber = page;
    $scope.fetchResult();
  };
 
  
 
  //manually select a page to trigger an ajax request to populate the grid on page load
  $scope.selectPage(1);
    

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
        $location.path('/edit/' + itemId);
    };
    
    // callback for ng-click 'viewUser':
    $scope.viewItem = function (itemId) {
        console.log('viewItem');
        $location.path('/view/' + itemId);
    };    
    
  // --------------------------------------------------- modal test    
    
    
  $scope.items = ['item1', 'item2', 'item3'];

var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};    
    
    
    
  $scope.open = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: ModalInstanceCtrl,
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  };
   
      
}]);

