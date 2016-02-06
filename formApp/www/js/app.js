// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic']);

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

app.controller('ContentCtrl', function (DataService) {
    var ctrl = this;
    ctrl.content = [];
    ctrl.fetchContent = function () {
        DataService.getData().then(function (result) {
            ctrl.content = result.data;
        });
    };
    ctrl.fetchContent();
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
