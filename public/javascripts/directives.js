app.directive('modalClockout',  function() {
  return{
    restrict: 'E',
    scope: {
      personal: '='
      , report: '='
      , session: '='
      , show: '='
    },
    replace: true, // Replace with the template below
    transclude: true, // custom content inside the directive
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      if (attrs.width)
        scope.dialogStyle.width = attrs.width;
      if (attrs.height)
        scope.dialogStyle.height = attrs.height;
      scope.hideModal = function() {
        scope.show = false;
      };
    },
   templateUrl:'partials/modals/clockout.html'
  };
});

app.directive('fileModel', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
});

app.directive('toFocus', function ($timeout) {
    return function (scope, elem, attrs) {
        scope.$watch(attrs.toFocus, function (newval) {
            if (newval) {
                $timeout(function () {
                    elem[0].focus();
                }, 0, false);
            }
        });
    };
});