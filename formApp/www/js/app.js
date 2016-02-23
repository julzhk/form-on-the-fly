var db = new PouchDB('formdatas');
db.createIndex({
  index: {
    fields: ['formid']
  }
}).then(function (result) {
  // yo, a result
  console.log('rses');
  console.log(result);
}).catch(function (err) {
  // ouch, an error
    console.log('err');
  console.log(result);
});

function formdataService($q) {
    //pouchdb CRUD
    var _db;
    // We'll need this later.
    var _pouchdb_rows;
    return {
        initDB: initDB,
        getAllformdatas: getAllformdatas,
        addformdata: addformdata,
        updateformdata: updateformdata,
        deleteformdata: deleteformdata,
        deleteallformdata: deleteallformdata
    };
    function initDB() {
        // Creates the database or opens if it already exists
        _db = new PouchDB('formdatas', {adapter: 'websql'});
    }

    function addformdata(formdata) {
          return $q.when(_db.post(formdata));
    };

    function deleteallformdata() {
          console.log('deleteallformdata formdata');
          return $q.when(
            _db.destroy()
          );
    };

    function updateformdata(formdata) {
        return $q.when(_db.put(formdata));
    };

    function deleteformdata(formdata) {
        return $q.when(_db.remove(formdata));
    };

    function getAllformdatas() {
        if (!_pouchdb_rows) {
           return $q.when(_db.allDocs({ include_docs: true}))
                .then(function(docs) {
                    // Each row has a .doc object and we just want to send an
                    // array of pouchdb objects back to the calling controller,
                    // so let's map the array to contain just the .doc objects.
                    _pouchdb_rows = docs.rows.map(function(row) {
                        // pre-process (date format etc)
                        // Dates are not automatically converted from a string.
                        // ie: row.doc.Date = new Date(row.doc.Date);
                        return row.doc;
                    });
                    // Listen for changes on the database.
                    _db.changes({ live: true, since: 'now', include_docs: true})
                       .on('change', onDatabaseChange);
                    return _pouchdb_rows;
                });
        } else {
            // Return cached data as a promise
            return $q.when(_pouchdb_rows);
        }
    };

    function onDatabaseChange(change) {
        var index = findIndex(_pouchdb_rows, change.id);
        var formdata = _pouchdb_rows[index];
        if (change.deleted) {
            if (formdata) {
                _pouchdb_rows.splice(index, 1); // delete
            }
        } else {
            if (formdata && formdata._id === change.id) {
                _pouchdb_rows[index] = change.doc; // update
            } else {
                _pouchdb_rows.splice(index, 0, change.doc);// insert
            }
        }
    }

    function findIndex(array, id) {
      var low = 0, high = array.length, mid;
      while (low < high) {
        mid = (low + high) >>> 1;
        array[mid]._id < id ? low = mid + 1 : high = mid
      }
      return low;
    }
}

var app = angular.module('starter', ['ionic', 'formlyIonic']);
app.factory('formdataService', formdataService);
app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

app.constant('URL', 'data/');
app.factory('DataService', function ($http, URL) {
    var getData = function () {
        return $http.get(URL + 'content.json');
    };
    return {
        getData: getData
    };
});


app.controller('FormListCtrl', function ($scope, $state, $stateParams,formdataService,
                                     $ionicHistory, $http, $ionicPlatform) {
  var ctrl = this;
  var vm = this;
    ctrl.fetchContent = function () {
      $http.get('http://127.0.0.1:8000/api/v1/forms/')
      .success(function(data, status, headers, config) {
          $scope.formnames = data;
      })
      .error(function(error, status, headers, config) {
        console.log(status);
        console.log("Error occured");
      });
    };
    ctrl.fetchContent();
    $scope.chooseForm= function(n){
      $state.go('form', {formid: n});
    };
    $scope.goBack = function(){
      $ionicHistory.goBack();
    };
    $scope.viewData= function(n){
      $state.go('formdata', {formid: n});
  };
});

app.controller('FormDataCtrl', function ($scope, $state, $stateParams,formdataService,
                                     $ionicHistory, $http, $ionicPlatform) {
  var ctrl = this;
  var vm = this;
  var formid = $stateParams.formid;
  formdataService.initDB();
  $scope.goBack = function(){
      $ionicHistory.goBack();
  };
  //formdatas = formdataService.findformdatas(formid);
  //ctrl.formdata = formdatas;
  //$scope.formdata = formdatas;

  // see http://nolanlawson.github.io/pouchdb-find/
  //https://github.com/nolanlawson/pouchdb-find

  // Available selectors are $gt, $gte, $lt, $lte,
  // $eq, $ne, $exists, $type, and more
  db.createIndex({
    index: {fields: ['formid']}
  }).then(function () {
    db.find({
      selector: {formid: {$eq: formid }}
    }).then(function(result){
      console.log(result);
      ctrl.formdata = result.docs;
      $scope.formdata = result.docs;
      $scope.firstrow = result.docs.slice(0,1)[0]
      console.log($scope.formdata);
    }).catch(function (err) {
          // ouch, an error
          console.log(err);
      });
    });
  });

app.controller('FormCtrl', function ($scope, $state, $stateParams,
                                     $ionicHistory, $http, $ionicPlatform,
                                     DataService, formdataService) {
  var ctrl = this;
  var vm = this;
  vm.model = {};

  $scope.formsubmit = function() {
    //todo : cannnot have form ele starting with _
    vm.model['formid'] = $stateParams.formid;
    console.log(vm.model);

    formdataService.addformdata(vm.model);
    post_data_server(vm.model);
  };

  $scope.clear= function() {
    console.log('clear..');
    formdataService.deleteallformdata();
    console.log('cleared');
    formdataService.initDB();
    console.log('restart');
    $ionicHistory.goBack();
  };
    $scope.goBack = function(){
    $ionicHistory.goBack();
  };


  post_data_server= function (data) {
      var promise = $http({method: 'POST', url: 'http://127.0.0.1:8000/api/1', data: data});
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
    $ionicPlatform.ready(function() {
        formdataService.initDB();
        // Get all formdata records from the database.
        formdataService.getAllformdatas().then(function(formdatas) {
        ctrl.formdatas = formdatas;
        $scope.formdatas = formdatas;
      });
    });

    //render content
    ctrl.content = [];
    ctrl.fetchContent = function (formid) {
      $http.get('http://127.0.0.1:8000/api/' + formid)
      .success(function(data, status, headers, config) {
          console.log(data);
          vm.fields = data.elements;
          vm.formname= data.meta.formname;
        console.log(vm.fields);
      })
      .error(function(error, status, headers, config) {
        console.log(status);
        console.log("Error occured");
      });
    };
  console.log($stateParams.formid);
    ctrl.fetchContent($stateParams.formid);
});



app.config(function($stateProvider, $urlRouterProvider) {
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


app.controller('LoginCtrl', function($scope, $state, $http, $stateParams, $ionicHistory) {
  $scope.goBack = function(){
    $ionicHistory.goBack();
  };
  $scope.chooseForm= function(n){
    $state.go('form', {formid: n});
  };

  $scope.login = function login(email, password) {

    console.log(this.email);
    console.log(this.password);
    $http.post('http://127.0.0.1:8000/api/v1/auth/login/',{'email':this.email,'password':this.password})
      .success(function(data, status, headers, config) {
        $state.go('formchooser');
      })
      .error(function(error, status, headers, config) {
        console.log(status);
        console.log("Error occured");
        $scope.error = 'Login error!';
      });
  }
});
