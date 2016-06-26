/**
 * Defines the layout and its dimensions, container size and
 * arrangement of data position added to timeline etc..
 * 
 * @method customize_isotope
 */

function customize_isotope()
{
	// Resets the layout based on items 
	$.Isotope.prototype._spineAlignReset = function() {
		this.spineAlign = {
			colA: 0,
			colB: 0,
			lastY: -60
		};
	};

	/*
	 * Defines the dimentions of layout, and alters the position of data.
	 * It executes every tiem, when a modal is added or deleted from timeline.
	 */ 
	$.Isotope.prototype._spineAlignLayout = function( $elems ) {
		var	instance = this,
			props = this.spineAlign,
			gutterWidth = Math.round( this.options.spineAlign && this.options.spineAlign.gutterWidth ) || 0,
			centerX = Math.round(this.element.width() / 2);
		
		Date.prototype.monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

		Date.prototype.getMonthName = function() {
            return this.monthNames[this.getMonth()];
        };
        var currentDate = new Date();
        
		$elems.each(function(i, val){
			var $this = $(this);
			$this.removeClass('last').removeClass('top');
			if (i == $elems.length - 1)
				$this.addClass('last');
			var x, y;
			if ($this.hasClass('year-marker')){
				var width = $this.width();
				x = centerX - (width / 2);
				if (props.colA >= props.colB){
					y = props.colA;
					if (y == 0){
						$this.addClass('top');
						if($this.find('.year').text()==currentDate.getMonthName()){
							$this.find('.inner2').addClass('inner2-top');
							$this.find('.inner2').removeClass('inner2');
							$this.find('.year').text('Now'); 
						}
					}
					props.colA += $this.outerHeight(true);
					props.colB = props.colA;
				}
				else{
					y = props.colB;
					if (y == 0){
						$this.addClass('top');
						if($this.find('.year').text()==currentDate.getMonthName()){
							$this.find('.inner2').addClass('inner2-top');
							$this.find('.inner2').removeClass('inner2');
							$this.find('.year').text('Now');
						}
					}
					props.colB += $this.outerHeight(true);
					props.colA = props.colB;
				}
			}
			else{
				var colorNumber = ((i+1)%4) + 1;
				$this.removeClass('color1').removeClass('color2').removeClass('color3').removeClass('color4');
				$this.addClass('color'+colorNumber);
					
				$this.removeClass('left').removeClass('right');
				var isColA = props.colB >= props.colB;
				if (isColA)
					$this.addClass('right');
				else
					$this.addClass('right');
				x = isColA ?
						centerX + (gutterWidth / 2): // right side
						centerX + (gutterWidth / 2); // right side
				y = isColA ? props.colB : props.colB;
				if (y - props.lastY <= 60){
					var extraSpacing = 60 - Math.abs(y - props.lastY);
					$this.find('.inner').css('marginTop', 0);
					props.lastY = y + extraSpacing;
				}
				else{
					$this.find('.inner').css('marginTop', 0);
					props.lastY = y;
				}
				props[( isColA ? 'colB' : 'colB' )] += $this.outerHeight(true);
				/*alert("$this.attr('id')---"+$this.attr('id'));
				alert("$this.height()---"+$this.height());*/
				/*if($this.attr('id')!=""){
					$("<style type='text/css' id='"+$this.attr('id')+"' />").appendTo("head");
					$("#"+$this.attr('id')).text(".post.right.color"+colorNumber+":before{padding-bottom: "+($this.height())+"px;}");
				}else{
					$this.attr('id','color'+i);
					$("<style type='text/css' id='"+$this.attr('id')+"' />").appendTo("head");
					$("#"+$this.attr('id')).text(".post.right.color"+colorNumber+":before{padding-bottom: "+($this.height())+"px;}");
					$this.attr('id','');
					alert("$this.height()-----"+$this.height());
				}*/
			}
			instance._pushPosition( $this, x, y );
		});
	};
	
	// Sets the container size based on spinAlignLayout function resulrs
	$.Isotope.prototype._spineAlignGetContainerSize = function() {
		var size = {};
		size.height = this.spineAlign[( this.spineAlign.colB > this.spineAlign.colA ? 'colB' : 'colB' )];
		return size;
	};
	$.Isotope.prototype._spineAlignResizeChanged = function() {
		return true;
	};
}	

function configure_timeline(el)
{
	var cnt = 0;
	customize_isotope();

	var $container = $("#timeline", (el ? el : App_Contacts.contactDetailView.el));
	var elemen="";

	// Initializes isotope with options (sorts the data based on created time)
	$container.isotope({ itemSelector : ".item", transformsEnabled : true, layoutMode : 'spineAlign', spineAlign : { gutterWidth : 56 },
		getSortData : { timestamp : function($elem)
		{
			elemen = parseFloat($elem.find('.timestamp').text());
			var time = parseFloat($elem.find('.timestamp').text());

			if (!time)
				return 0;
			// If time is in milliseconds then return time in seconds
			if ((time / 100000000000) > 1)
				return time / 1000;

			return time
		} }, sortBy : 'timestamp', sortAscending : false, itemPositionDataEnabled : true, onLayout: function($elem){
			$elem.removeClass('special');
			setTimeout(function(){
				$elem.addClass('special');
				$elem.addClass($elem.attr('id')+'');
				if($elem.attr('id')!=undefined){
					$elem.addClass('special');
					$elem.addClass($elem.attr('id')+'');
					var eleHeight = parseInt($elem.height())+10;
					if($elem.hasClass('color1'))
						$('head').append('<style>.post.right.color1.special:before{padding-bottom:'+eleHeight+'px;}</style>');
					if($elem.hasClass('color2'))
						$('head').append('<style>.post.right.color2.special:before{padding-bottom:'+eleHeight+'px;}</style>');
					if($elem.hasClass('color3'))
						$('head').append('<style>.post.right.color3.special:before{padding-bottom:'+eleHeight+'px;}</style>');
					if($elem.hasClass('color4'))
						$('head').append('<style>.post.right.color4.special:before{padding-bottom:'+eleHeight+'px;}</style>');
				}
			},1000);
		} });
}
