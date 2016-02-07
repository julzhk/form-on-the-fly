(function() {
  'use strict';

  angular.module('experimentation', [])
    .controller('ExperimentDataController', Data)
    .directive('exerciseDataItem', DataItem)
    .filter('html', rawHtml);


  Data.$inject = ['$scope'];
  function Data($scope) {

    $scope.dataItems = [
      {"content_type": "text", "prompt": "Is this your favorite exercise?", "response" : "Maybe"},
      {"content_type": "text", "prompt": "What did you have for breakfast?", "response" : ""},
      {"content_type": "image", "prompt": "Upload a picture", "name" : "selfie", "path": ""},
      {"content_type": "table", "name": "dragonfly-table", "header": ["Unknown Dragonfly","Family","Description"], "data" : [["#1","<textarea></textarea>","<textarea></textarea>"],["#2","<textarea>Manning</textarea>","<textarea>Excellent at football</textarea>"],["#3","<textarea></textarea>","<textarea></textarea>"],["#4","<textarea></textarea>","<textarea></textarea>"]]}
    ];

    $scope.saveData = function() {
      console.log($scope.dataItems);
    }

  }

  // Custom directive to collect different types of data from user
    DataItem.$inject = ['$compile'];
    function DataItem($compile) {

      var imageTemplate      = '<p ng-bind-html="content.prompt | html"></p><input type="file" name="{{ content.name }}" accept="image/*">';
      var videoTemplate      = '<div class="entry-video"><h2>&nbsp;</h2><div class="entry-vid"><iframe ng-src="{{content.data}}" width="280" height="200" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe></div><div class="entry-text"><div class="entry-title">{{content.title}}</div><div class="entry-copy">{{content.description}}</div></div></div>';
      var textTemplate       = '<p ng-bind-html="content.prompt | html"></p><textarea ng-bind-html="content.response | html"></textarea>';
      var tableTemplate      = '<table id="{{ content.name }}"><thead><tr><th ng-repeat="head in content.header" ng-bind-html="head | html"></th></tr></thead><tbody><tr ng-repeat="row in content.data track by $index"><td ng-repeat="cell in row track by $index" ng-bind-html="cell | html"></td></tr></tbody></table>';

      var getTemplate = function(contentType) {
          var template = '';

          switch(contentType) {
              case 'image':
                  template = imageTemplate;
                  break;
              case 'video':
                  template = videoTemplate;
                  break;
              case 'text':
                  template = textTemplate;
                  break;
              case 'table':
                  template = tableTemplate;
                  break;
          }

          return template;
      }

      var linker = function(scope, element, attrs) {

        element.html(getTemplate(scope.content.content_type));

        $compile(element.contents())(scope);
      }

      return {
          restrict: "E",
          transclude: true,
          link: linker,
          scope: {
              content:'='
        }
      };
    }

  // Custom filter to allow raw html in templates so we can display richly formatted text
    rawHtml.$inject = ['$sce'];
    function rawHtml($sce) {
        return function(val) {
            return $sce.trustAsHtml(val);
        }
    }

})();
