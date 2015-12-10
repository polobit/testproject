angular.module('builder.directives').directive('selectedTab', function() {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="selected-tab hidden"><span class="top"></span><span class="bottom"></span></div>',
        link: function($scope, el) {
            $('.main-nav').on('click', '.nav-item', function(e) {
                $(".nav-item").removeClass("active2");
                angular.element(e.target).closest("div").addClass("active2");
            });
        }
    }
});