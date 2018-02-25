/*!
 * liScroll 1.0
 * Examples and documentation at: 
 * http://www.gcmingati.net/wordpress/wp-content/lab/jquery/newsticker/jq-liscroll/scrollanimate.html
 * 2007-2010 Gian Carlo Mingati
 * Version: 1.0.2.1 (22-APRIL-2011)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * Requires:
 * jQuery v1.2.x or later
 * 
 */


// jQuery.fn.liScroll = function(settings) {
// 		settings = jQuery.extend({
// 		travelocity: 0.07
// 		}, settings);		
// 		return this.each(function(){
// 				var $strip = jQuery(this);
// 				$strip.addClass("newsticker")
// 				var stripWidth = 1;
// 				$strip.find("li").each(function(i){
// 				stripWidth += jQuery(this, i).outerWidth(true); // thanks to Michael Haszprunar and Fabien Volpi
// 				});
// 				var $mask = $strip.wrap("<div class='mask'></div>");
// 				var $tickercontainer = $strip.parent().wrap("<div class='tickercontainer'></div>");								
// 				var containerWidth = $strip.parent().parent().width();	//a.k.a. 'mask' width 	
// 				$strip.width(stripWidth);			
// 				var totalTravel = stripWidth;
// 				var defTiming = totalTravel/settings.travelocity;	// thanks to Scott Waye		
// 				function scrollnews(spazio, tempo){
// 				$strip.animate({left: '-='+ spazio}, tempo, "linear", function(){$strip.css("left", containerWidth); scrollnews(totalTravel, defTiming);});
// 				}
// 				scrollnews(totalTravel, defTiming);				
// 				$strip.hover(function(){
// 				jQuery(this).stop();
// 				},
// 				function(){
// 				var offset = jQuery(this).offset();
// 				var residualSpace = offset.left + stripWidth;
// 				var residualTime = residualSpace/settings.travelocity;
// 				scrollnews(residualSpace, residualTime);
// 				});			
// 		});	
// };


$.fn.scrollList = function (delay) {
    delay = delay || 2000;
    var animateList = function ($list) {
        //get first child
        
        var $first = $list.children('li:first');
        //animate first two off the screen
        var width = $list.outerWidth(true);
        $list.animate({
            'margin-left': $list.width() * -1,
            'width': 1730  ,
        },
        7000,
        // on animation complete
        function () {
            //reset and move to the end of the list
            $(this).css('margin-left', 0).add($(this).next()).appendTo($list);
            //start again after delay
            setTimeout(function () {
                animateList($list)
            }, delay);
        }
    );
    };

    return this.each(function () {
        var $that = $(this)
        setTimeout(function () {
            animateList($that);
        }, delay);
    });

};