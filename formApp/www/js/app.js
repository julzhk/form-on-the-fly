var db = new PouchDB('formdatas');

function formdataService($q) {
    //pouchdb CRUD
    var _db;
    // We'll need this later.
    var _formdatas;
    return {
        initDB: initDB,
        getAllformdatas: getAllformdatas,
        addformdata: addformdata,
        updateformdata: updateformdata,
        deleteformdata: deleteformdata
    };
    function initDB() {
        // Creates the database or opens if it already exists
        _db = new PouchDB('formdatas', {adapter: 'websql'});
    }

    function addformdata(formdata) {
          console.log('clik add formdata');
          console.log(formdata);
          return $q.when(_db.post(formdata));
    };

    function updateformdata(formdata) {
        return $q.when(_db.put(formdata));
    };

    function deleteformdata(formdata) {
        return $q.when(_db.remove(formdata));
    };

    function getAllformdatas() {
        if (!_formdatas) {
           return $q.when(_db.allDocs({ include_docs: true}))
                .then(function(docs) {
                    // Each row has a .doc object and we just want to send an
                    // array of formdata objects back to the calling controller,
                    // so let's map the array to contain just the .doc objects.
                    _formdatas = docs.rows.map(function(row) {
                        // pre-process (date format etc)
                        // Dates are not automatically converted from a string.
                        //row.doc.Date = new Date(row.doc.Date);
                        return row.doc;
                    });
                    // Listen for changes on the database.
                    _db.changes({ live: true, since: 'now', include_docs: true})
                       .on('change', onDatabaseChange);
                    return _formdatas;
                });
        } else {
            // Return cached data as a promise
            return $q.when(_formdatas);
        }
    };

    function onDatabaseChange(change) {
        var index = findIndex(_formdatas, change.id);
        var formdata = _formdatas[index];
        if (change.deleted) {
            if (formdata) {
                _formdatas.splice(index, 1); // delete
            }
        } else {
            if (formdata && formdata._id === change.id) {
                _formdatas[index] = change.doc; // update
            } else {
                _formdatas.splice(index, 0, change.doc);// insert
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


app.controller('ContentCtrl', function ($scope, $ionicPlatform, DataService, formdataService) {
  var ctrl = this;
  var vm = this;
  vm.model = {};
  $scope.submit = function() {
    console.log($scope.model);
  };
  // Initialize the database.
    $ionicPlatform.ready(function() {
        formdataService.initDB();
        // Get all formdata records from the database.
        formdataService.getAllformdatas().then(function(formdatas) {
        ctrl.formdatas = formdatas;
      });
    });
    //render content
    ctrl.content = [];
    ctrl.fetchContent = function () {
        DataService.getData().then(function (result) {
            vm.fields = result.data;
        });
    };
    ctrl.fetchContent();
    // save button action
  $scope.xxsaveformdata = function() {
      formdataService.addformdata({'new':'mew'});
      //formdataService.updateformdata($scope.formdata);
    };
});
