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
					if (y == 0) $this.addClass('top');
					props.colA += $this.outerHeight(true);
					props.colB = props.colA;
				}
				else{
					y = props.colB;
					if (y == 0) $this.addClass('top');
					props.colB += $this.outerHeight(true);
					props.colA = props.colB;
				}
			}
			else{
				$this.removeClass('left').removeClass('right');
				var isColA = props.colB >= props.colA;
				if (isColA)
					$this.addClass('left');
				else
					$this.addClass('right');
				x = isColA ?
						centerX - ( $this.outerWidth(true) + gutterWidth / 2 ) : // left side
						centerX + (gutterWidth / 2); // right side
				y = isColA ? props.colA : props.colB;
				if (y - props.lastY <= 60){
					var extraSpacing = 60 - Math.abs(y - props.lastY);
					$this.find('.inner').css('marginTop', extraSpacing);
					props.lastY = y + extraSpacing;
				}
				else{
					$this.find('.inner').css('marginTop', 0);
					props.lastY = y;
				}
				props[( isColA ? 'colA' : 'colB' )] += $this.outerHeight(true);
			}
			instance._pushPosition( $this, x, y );
		});
	};
	
	// Sets the container size based on spinAlignLayout function resulrs
	$.Isotope.prototype._spineAlignGetContainerSize = function() {
		var size = {};
		size.height = this.spineAlign[( this.spineAlign.colB > this.spineAlign.colA ? 'colB' : 'colA' )];
		return size;
	};
	$.Isotope.prototype._spineAlignResizeChanged = function() {
		return true;
	};
}	

function configure_timeline()
{
	customize_isotope();

	var $container = $("#timeline", App_Contacts.contactDetailView.el);

	// Initializes isotope with options (sorts the data based on created time)
	$container.isotope({ itemSelector : ".item", transformsEnabled : true, layoutMode : 'spineAlign', spineAlign : { gutterWidth : 56 },
		getSortData : { timestamp : function($elem)
		{
			var time = parseFloat($elem.find('.timestamp').text());

			if (!time)
				return 0;
			// If time is in milliseconds then return time in seconds
			if ((time / 100000000000) > 1)
				return time / 1000;

			return time
		} }, sortBy : 'timestamp', sortAscending : false, itemPositionDataEnabled : true });
}
