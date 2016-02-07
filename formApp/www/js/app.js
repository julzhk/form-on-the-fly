// Ionic Starter App
//
// http://onehungrymind.com/angularjs-dynamic-templates/
//
var db = new PouchDB('birthdays');
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

function BirthdayService($q) {
    var _db;
    // We'll need this later.
    var _birthdays;
    return {
        initDB: initDB,
        getAllBirthdays: getAllBirthdays,
        addBirthday: addBirthday,
        updateBirthday: updateBirthday,
        deleteBirthday: deleteBirthday
    };
    function initDB() {
        // Creates the database or opens if it already exists
        _db = new PouchDB('birthdays', {adapter: 'websql'});
    };

    function addBirthday(birthday) {
          console.log('clik add birthday');
          console.log(birthday);
          return $q.when(_db.post(birthday));
    };

    function updateBirthday(birthday) {
        return $q.when(_db.put(birthday));
    };

    function deleteBirthday(birthday) {
        return $q.when(_db.remove(birthday));
    };

    function getAllBirthdays() {
        if (!_birthdays) {
           return $q.when(_db.allDocs({ include_docs: true}))
                .then(function(docs) {

                    // Each row has a .doc object and we just want to send an
                    // array of birthday objects back to the calling controller,
                    // so let's map the array to contain just the .doc objects.
                    _birthdays = docs.rows.map(function(row) {
                        // Dates are not automatically converted from a string.
                        row.doc.Date = new Date(row.doc.Date);
                        return row.doc;
                    });
                    // Listen for changes on the database.
                    _db.changes({ live: true, since: 'now', include_docs: true})
                       .on('change', onDatabaseChange);

                    return _birthdays;
                });
        } else {
            // Return cached data as a promise
            return $q.when(_birthdays);
        }
    };

    function onDatabaseChange(change) {
        var index = findIndex(_birthdays, change.id);
        var birthday = _birthdays[index];

        if (change.deleted) {
            if (birthday) {
                _birthdays.splice(index, 1); // delete
            }
        } else {
            if (birthday && birthday._id === change.id) {
                _birthdays[index] = change.doc; // update
            } else {
                _birthdays.splice(index, 0, change.doc) // insert
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

var app = angular.module('starter', ['ionic']);
app.factory('BirthdayService', BirthdayService);


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


app.config(function ($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['self', '**']);
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

app.factory('TemplateService', function ($http, URL) {
    var getTemplates = function () {
        return $http.get(URL + 'templates.json');
    };
    return {
        getTemplates: getTemplates
    };
});

// template handling:

app.controller('ContentCtrl', function ($scope, $ionicPlatform, DataService, BirthdayService) {
    var ctrl = this;
    var vm = this;
    // Initialize the database.
    $ionicPlatform.ready(function() {
        BirthdayService.initDB();
        // Get all birthday records from the database.
        BirthdayService.getAllBirthdays().then(function(birthdays) {
        vm.birthdays = birthdays;
      });
    });
    ctrl.content = [];
    ctrl.fetchContent = function () {
        DataService.getData().then(function (result) {
            ctrl.content = result.data;
        });
    };
    ctrl.fetchContent();
      // save button action
    $scope.saveBirthday = function() {
        BirthdayService.addBirthday({'new':'mew'});
        //BirthdayService.updateBirthday($scope.birthday);
    };
});

app.directive('contentItem', function ($compile, TemplateService) {
    var getTemplate = function (templates, contentType) {
        var template = '';
        template += templates.formgroupstartTemplate;
        switch (contentType) {
            case 'text':
                template += templates.textTemplate;
                break;
            case 'submit':
                template += templates.submitTemplate;
                break;
            case 'input':
                template += templates.inputTemplate;
                break;
            case 'textarea':
                template += templates.textareaTemplate;
                break;
            case 'button':
                template += templates.buttonTemplate;
                break;
            case 'select':
                template += templates.selectTemplate;
                break;
            case 'option':
                template += templates.optionTemplate;
                break;
            case 'optgroup':
                template += templates.optgroupTemplate;
                break;
            case 'fieldset':
                template += templates.fieldsetTemplate;
                break;
            case 'label':
                template += templates.labelTemplate;
                break;
            case 'email':
                template += templates.emailTemplate;
                break;
            case 'checkbox':
                template += templates.checkboxTemplate;
                break;
            case 'password':
                template += templates.passwordTemplate;
                break;
        }
        template += templates.formgroupendTemplate;
        return template;
    };
    var linker = function (scope, element, attrs) {
        scope.rootDirectory = 'images/';
        TemplateService.getTemplates().then(function (response) {
            var templates = response.data;
            element.html(getTemplate(templates, scope.content.content_type));
            $compile(element.contents())(scope);
        });
    };
    return {
        restrict: 'E',
        link: linker,
        scope: {
            content: '='
        }
    };
});
