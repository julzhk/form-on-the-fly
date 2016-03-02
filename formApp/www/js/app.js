const POUCH_DB_NAME = "formdata";
const POST_END_POINT= 'http://127.0.0.1:8000/api/post/';
const GET_ENDPOINT= 'http://127.0.0.1:8000/api/';
const LOGIN_POST_ENDPOINT= 'http://127.0.0.1:8000/api/v1/auth/login/';

var db = new PouchDB(POUCH_DB_NAME);
db.createIndex({
  index: {
    fields: ['formid']
  }
}).then(function (result) {
  // yo, a result
  console.log('formid index');
  console.log(result);
}).catch(function (err) {
  // ouch, an error
  console.log('err');
  console.log(result);
});

db.getIndexes().then(function (result) {
  console.log('get indexes');
  console.log(result);
}).catch(function (err) {
  // ouch, an error
  console.log('get indexes err');
});

db.find({
  selector: {formid: {$eq: '1'}}
}).then(function (result) {
  // yo, a result
  console.log('finded');
  console.log(result);
}).catch(function (err) {
  // ouch, an error
  console.log(err);
});

var app = angular.module('starter', ['ionic', 'formlyIonic', 'ngAnimate']);
app.factory('DataSingleton', DataSingleton);
app.factory('formdataService', formdataService);

app.run(function ($ionicPlatform) {
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
  });
});


app.controller('FormListCtrl', function ($scope, $state, $stateParams,
                                         formdataService, $ionicHistory, $http) {
  var ctrl = this;
  var vm = this;

  ctrl.fetchContent = function () {
    $http.get('http://127.0.0.1:8000/api/v1/forms/')
      .success(function (data, status, headers, config) {
        $scope.formnames = data;
      })
      .error(function (error, status, headers, config) {
        console.log(status);
        console.log("Error occured");
      });
  };
  ctrl.fetchContent();
  $scope.chooseForm = function (n) {
    $state.go('form', {formid: n});
  };
  $scope.goBack = function () {
    $ionicHistory.goBack();
  };
  $scope.viewData = function (n) {
    $state.go('formdata', {formid: n});
  };
});

app.controller('FormDataCtrl', function ($scope, $state, $stateParams,
                                         formdataService, $ionicHistory, $http) {
  var ctrl = this;
  var formid = $stateParams.formid;
  formdataService.initDB();
  $scope.goBack = function () {
    $ionicHistory.goBack();
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
  console.log($stateParams.formid);
  // populate $scope.fields:
  ctrl.fetchFormElements($stateParams.formid);

  // see http://nolanlawson.github.io/pouchdb-find/
  //https://github.com/nolanlawson/pouchdb-find

  // Available selectors are $gt, $gte, $lt, $lte,
  // $eq, $ne, $exists, $type, and more
  db.createIndex({
    index: {fields: ['formid']}
  }).then(function () {
    db.find({
      selector: {formid: {$eq: formid}}
    }).then(function (result) {
      console.log(result);
      ctrl.formdata = result.docs;
      $scope.formdata = result.docs;
      $scope.firstrow = result.docs.slice(0, 1)[0]
      console.log($scope.formdata);
    }).catch(function (err) {
      // ouch, an error
      console.log(err);
    });
  });
});

app.controller('FormCtrl', function ($scope, $state, $stateParams,
                                     $ionicHistory, $http, $ionicPlatform,
                                     formdataService, DataSingleton) {
  var ctrl = this;
  ctrl.model = {};

  $scope.formsubmit = function () {
    ctrl.model['formid'] = $stateParams.formid;
    ctrl.model['user_email'] = DataSingleton.user_email;
    console.log(ctrl.model);
    r = formdataService.addformdata(ctrl.model);
    console.log(r);
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

  // Initialize the database.
  $ionicPlatform.ready(function () {
    formdataService.initDB();
    // Get all formdata records from the database.
    formdataService.getAllformdatas().then(function (formdatas) {
      ctrl.formdatas = formdatas;
      $scope.formdatas = formdatas;
    });
  });

  //render content
  ctrl.content = [];
  ctrl.fetchContent = function (formid) {
    // get the empty elements from API
    // todo turn this to a service
    $http.get(GET_ENDPOINT + formid)
      .success(function (data, status, headers, config) {
        console.log(data);
        ctrl.fields = data.elements;
        ctrl.formname = data.meta.formname;
        console.log(ctrl.fields);
      })
      .error(function (error, status, headers, config) {
        console.log(status);
        console.log("Error occured");
      });
  };
  console.log($stateParams.formid);
  ctrl.fetchContent($stateParams.formid);
});


app.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('login', {
      url: '/',
      templateUrl: 'login.html',
      controller: 'LoginCtrl'
    })
    .state('formchooser', {
      url: '/formchooser/',
      templateUrl: 'formchooser.html',
      controller: 'FormListCtrl'
    })
    .state('formdata', {
      url: '/formdata/:formid',
      templateUrl: 'formdata.html',
      controller: 'FormDataCtrl'
    })
    .state('form', {
      url: '/form/:formid',
      templateUrl: 'form.html',
      controller: 'FormCtrl'
    });
  $urlRouterProvider.otherwise("/");
});


app.controller('LoginCtrl', function ($scope, $state, $http,
                                      $stateParams, $ionicHistory,
                                      DataSingleton) {
  $scope.goBack = function () {
    $ionicHistory.goBack();
  };

  $scope.chooseForm = function (n) {
    $state.go('form', {formid: n});
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
});
