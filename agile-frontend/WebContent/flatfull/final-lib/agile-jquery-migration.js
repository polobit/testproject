(function( jQuery, window, undefined ) {
	jQuery.curCSS = jQuery.css;
	jQuery.browser = {};

	jQuery.browser.msie = false;
    jQuery.browser.version = 0;
    if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
        jQuery.browser.msie = true;
        jQuery.browser.version = RegExp.$1;
    }

})( jQuery, window );