const DJANGO_END_POINT = "http://127.0.0.1:8000/";
const DB_END_POINT = "http://127.0.0.1:5984/";
const POUCH_FORM_DATA_DB_NAME = "formdata";
const POUCH_SCHEMA_DB_NAME = "formschema2";
const POST_END_POINT= DB_END_POINT + POUCH_FORM_DATA_DB_NAME;

const LOGIN_POST_ENDPOINT= DJANGO_END_POINT + 'api/v1/auth/login/';
const FORMS_LIST_ENDPOINT= DJANGO_END_POINT + 'api/v1/forms/';
const FORM_SCHEMA_ENDPOINT= DJANGO_END_POINT + 'api/all';
const FORM_SCHEMA_API= DJANGO_END_POINT + 'api/';


// todo can do as myApp.value('DBNAME', 'forms');

var formdata_db = new PouchDB(POUCH_FORM_DATA_DB_NAME);
var formschema_db = new PouchDB(POUCH_SCHEMA_DB_NAME);

formschema_db.createIndex({
  index: {fields: ['name']}
});

var app = angular.module('starter', ['ionic', 'formlyIonic', 'ngAnimate']);
app.factory('DataSingleton', DataSingleton);
app.factory('formdataService', formdataService);
app.factory('formschemaService', formschemaService);

app.run(function ($ionicPlatform, $state, formdataService, formschemaService) {
  //initialise
  $ionicPlatform.ready(function () {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  //  custom initializations
      $ionicPlatform.ready(function () {
    formdataService.initDB();
    // Get all formdata records from the database.
  });
    formschemaService.initDB();
  //  redirect and init
    $state.go('login');
  });
});


app.controller('FormChooserCtrl', function ($scope, $state, $stateParams, $q,formschemaService,
                                            formdataService, $ionicHistory, $http) {
  var ctrl = this;
  ctrl.fetchContent = function () {
     //try to get form data (especially names) from server
    //TODO : find out how scope works with services
    formschemaService.getallformnames();
    $http.get(FORM_SCHEMA_ENDPOINT)
      .success(function (data, status, headers, config) {
        console.log('got from server');
        $scope.formnames = data;
        $scope.servererror = false;
        console.log('upsert to local store');
        _.map(data, function(form){
          console.log('upsert');
            upsert(formschema_db, form);
          });
      }).error(
        function (error, status, headers, config) {
          console.log('start fetch from local store');
          data = formschema_db.find({
            selector: {
              _id: {'$gt': null}
            },
              include_docs: true,
              sort: [{_id: 'desc'}]
        }).then(function(data){
            //got from local store, populate
            console.log('fetch from local store, populate view');
            $scope.formnames = data.docs;
          });
      }
    ).then(function(){
    //  done after
      console.log('fetch content done');
    })
  };
  ctrl.fetchContent();
  $scope.chooseForm = function (n) {
    $state.go('form', {formid: n});
  };
  $scope.viewData = function (n) {
    $state.go('formdata', {formid: n});
  };
});

app.controller('FormDataCtrl', function ($scope, $state, $stateParams,
                                         formdataService, $ionicHistory, $http) {
  // show table of previously entered data
  var ctrl = this;
  var formid = $stateParams.formid;
  $scope.formid = formid;
  $scope.goBack = function () {
    $state.go('formchooser');
  };
  $scope.delete= function(item_id, item_rev){
    console.log("del");
    console.log(item_id);
    console.log(item_rev);
    formdata_db.remove(
      item_id, item_rev
    ).then(function (result) {
      console.log(result);
       ctrl.fetchFormData();
    }).catch(function (err) {
      // ouch, an error
      console.log(err);
    });
  };
  $scope.edit= function(form_id, item_id){
    console.log("edit");
    console.log(item_id);
    $state.go('formedit', {formid: form_id, item_id: item_id});
  };
  $scope.show_on_listview = function(item) {
    return item.custom.show_on_listview;
};
  $scope.viewdata= function(form_id, item_id){
    console.log("view data");
    console.log(item_id);
    $state.go('formview', {formid: form_id, item_id: item_id, viewonly:true});
  };

  ctrl.fetchFormElements = function (formid) {
    // get the empty elements from API
    // todo turn this to a service
    $http.get('http://127.0.0.1:8000/api/' + formid)
      .success(function (data, status, headers, config) {
        $scope.fields = data.elements;
        $scope.formname = data.meta.formname;
      })
      .error(function (error, status, headers, config) {
        console.log(status);
        console.log("Error occured");
      });

  };

  // populate $scope.fields:
  ctrl.fetchFormElements($stateParams.formid);
  ctrl.fetchFormData = function(){
      // see http://nolanlawson.github.io/pouchdb-find/
  //https://github.com/nolanlawson/pouchdb-find
  // Available selectors are $gt, $gte, $lt, $lte,
  // $eq, $ne, $exists, $type, and more
    formdata_db.find({
      selector: {formid: {$eq: formid}}
    }).then(function (result) {
      ctrl.formdata = result.docs;
      $scope.formdata = result.docs;
      console.log($scope.formdata);
      $scope.$apply();
    }).catch(function (err) {
      // ouch, an error
      console.log(err);
    });
  };
  ctrl.fetchFormData();
});

app.controller('FormCtrl', function ($scope, $state, $stateParams,
                                     $ionicHistory, $http, $ionicPlatform,
                                     formdataService, DataSingleton) {
  // show a form from API and allow data to be entered & saved locally
  var ctrl = this;
  ctrl.model = {};
  var formdata_id = $stateParams.formid;
  formdataService.getAllformdatas().then(function (formdatas) {
      ctrl.formdatas = formdatas;
      $scope.formdatas = formdatas;
    });

  function is_view_only(){
    if (typeof $stateParams.viewonly == 'undefined') {
        return false;
    } else {
        return ($stateParams.viewonly == 'true');
    }
  }

  $scope.viewonly = is_view_only();

  function is_edit_previous_data(){
      if (typeof $stateParams.item_id !== 'undefined') {
        var item_id = $stateParams.item_id;
        formdata_db.find({
          selector: {_id: {$eq: item_id}}
        }).then(function (result) {
          console.log(result);
          ctrl.model = result.docs[0];
        }).catch(function (err) {
                  // ouch, an error
                  console.log(err);
              });
          }
      }

  is_edit_previous_data();
  console.log(formdata_id);
  $scope.formsubmit = function () {
    ctrl.model['formid'] = $stateParams.formid;
    ctrl.model['user_email'] = DataSingleton.user_email;
    console.log(ctrl.model);
    r = formdataService.addformdata(ctrl.model);
    post_data_server(ctrl.model);
    $scope.datasubmitted = true;
  };
  $scope.clear = function () {
    console.log('clear..');
    formdataService.deleteallformdata();
    console.log('cleared');
    formdataService.initDB();
    console.log('restart');
    $ionicHistory.goBack();
  };

  $scope.goBack = function () {
    $ionicHistory.goBack();
  };

  post_data_server = function (data) {
    var promise = $http({method: 'POST', url: POST_END_POINT, data: data});
    promise.success(function (data, status, headers, config, statusText) {
      // this callback will be called asynchronously
      // when the response is available
      $scope.success = statusText;
    });
    promise.error(function (data, status, headers, config, statusText) {
      // called asynchronously if an error occurs
      console.log(data);
      console.log(status);
      console.log(headers);
      console.log(config);
      console.log(statusText);
      // or server returns response with an error status.
      $scope.success = statusText;
    });
  };

  //render content
  ctrl.content = [];
  ctrl.fetchContent = function (formid) {
    // get the empty elements from API
    // todo turn this to a service
    $http.get(FORM_SCHEMA_API + formid)
      .success(function (data, status, headers, config) {
        console.log(data);
        ctrl.fields = data.elements;
        _.map(ctrl.fields, function (f) {
          delete f.custom
        });
        ctrl.formname = data.meta.formname;
        console.log(ctrl.fields);
      })
      .error(function (error, status, headers, config) {
        console.log("REST FORM Error occured");
        data = formschema_db.find({
          selector: {
            _id: {'$eq': formid}
          },
          include_docs: true
        }).then(function (data) {
          //got from local store, populate
          console.log('fetched schema from local ');
          ctrl.fields = data.docs[0].elements;
          _.map(ctrl.fields, function (f) {
            delete f.custom
          });
          ctrl.formname = data.docs[0].meta.formname;
        });
      });
  }
  console.log($stateParams.formid);
  ctrl.fetchContent($stateParams.formid);
});


app.controller('LoginCtrl', function ($scope, $state, $http,
                                      $stateParams, $ionicHistory,formdataService,
                                      DataSingleton) {
  //  initialization of database
  formdataService.initDB();

  $scope.goBack = function () {
    $ionicHistory.goBack();
  };

  $scope.chooseForm = function (n) {
    $state.go('form', {formid: n});
  };

  $scope.forgotlogin= function() {
    DataSingleton.user_email = 'fake user';
    $state.go('formchooser');
  };
  $scope.login = function login(email, password) {
    console.log(this.email);
    console.log(this.password);
    $http.post(LOGIN_POST_ENDPOINT, {'email': this.email, 'password': this.password})
      .success(function (data, status, headers, config) {
        DataSingleton.user_email = data.email;
        $state.go('formchooser');
      })
      .error(function (error, status, headers, config) {
        console.log(status);
        console.log("Error occured");
        $scope.error = 'Login error!';
      });
  }
  $scope.forgotlogin();
});


app.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('login', {
      url: '/login/',
      templateUrl: 'login.html',
      controller: 'LoginCtrl'
    })
    .state('formchooser', {
      url: '/formchooser/',
      templateUrl: 'formchooser.html',
      controller: 'FormChooserCtrl'
    })
    .state('formdata', {
      url: '/formdata/:formid',
      templateUrl: 'formdata.html',
      cache: false,
      controller: 'FormDataCtrl'
    })
    .state('form', {
      url: '/form/:formid',
      templateUrl: 'form.html',
      controller: 'FormCtrl'
    })
    .state('formedit', {
      url: '/formedit/:formid/:item_id',
      templateUrl: 'form.html',
      controller: 'FormCtrl'
    })
    .state('formview', {
      url: '/formedit/:formid/:item_id/:viewonly',
      templateUrl: 'form.html',
      controller: 'FormCtrl'
    });
  $urlRouterProvider.otherwise("/err/");
});
