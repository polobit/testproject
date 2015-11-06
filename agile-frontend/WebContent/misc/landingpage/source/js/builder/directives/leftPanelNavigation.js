angular.module('builder.directives').directive('leftPanelNavigation', ['panels', function(panels) {
    return {
        restrict: 'A',
        link: function($scope, el) {
            el.on('click', '.nav-item', function(e) {

                console.log(e.currentTarget.dataset.name);
                var subNavDataName = e.currentTarget.dataset.name;

                $(".agile-top-menu").hide();
                $("#"+subNavDataName).show();


                $(".agile-sub-nav").hide();
                $("#"+subNavDataName+"-sub-nav").show();

                if ( ! e.currentTarget.hasAttribute('not-selectable')) {
                    $scope.$apply(function() {
                        panels.active = e.currentTarget.dataset.name;
                    });
                }
            });
        }
    }
}]);