var app = angular.module('myApp', []);
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
        switch (contentType) {
            case 'text':
                template = templates.textTemplate;
                break;
            case 'submit':
                template = templates.submitTemplate;
                break;
            case 'input':
                template = templates.inputTemplate;
                break;
            case 'textarea':
                template = templates.textareaTemplate;
                break;
            case 'button':
                template = templates.buttonTemplate;
                break;
            case 'select':
                template = templates.selectTemplate;
                break;
            case 'option':
                template = templates.optionTemplate;
                break;
            case 'optgroup':
                template = templates.optgroupTemplate;
                break;
            case 'fieldset':
                template = templates.fieldsetTemplate;
                break;
            case 'label':
                template = templates.labelTemplate;
                break;
            case 'email':
                template = templates.emailTemplate;
                break;
            case 'checkbox':
                template = templates.checkboxTemplate;
                break;
        }
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