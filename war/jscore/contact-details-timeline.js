
// Create an empty collection to add all details
function loadTimelineDetails(el, contactId)
{
		var timelineView =  new Base_Collection_View({
		templateKey: 'timeline',
		individual_tag_name: 'li',
		});
		
		// Override comparator to sort models on time base
		timelineView.collection.comparator = function(item){
			if (item.get('created_time')) {
	            return item.get('created_time');
	        }
	        if (item.get('t')) {
	        	return item.get('t')/1000;
	        }
	        return item.get('id');
		}
		
		// Fetch logs and add to timeline
		var LogsCollection = Backbone.Collection.extend({
			url: '/core/api/campaigns/logs/contact/' + contactId,
		});
		var logsCollection = new LogsCollection();
		logsCollection .fetch({
			success: function(){
				$.each(logsCollection.toJSON(), function(index, model) {
					timelineView.collection.add(JSON.parse(model.logs));
				});
			
			}
		});
		
		var contact = App_Contacts.contactDetailView.model;
		var json = contact.toJSON();
		 
		// Get email of the contact in contact detail
		var email = getPropertyValue(json.properties, "email");
		
		// Go for mails only when the contact has email
		if(email)
		{
			var EmailsCollection = Backbone.Collection.extend({
				url: 'core/api/email?e=' + encodeURIComponent(email) + '&c=10&o=0',
			});
			var emailsCollection = new EmailsCollection();
			emailsCollection .fetch({
				success: function(){
					timelineView.collection.add(emailsCollection.toJSON()[0]['emails']);

				// Call to setup timeline
					setUpTimeline(timelineView.collection.toJSON(), el);
				},
				error: function(){
					console.log("error...");
					setUpTimeline(timelineView.collection.toJSON(), el);
				}
			});
		}
		
		// Store all details urls in an array and fetch 
		var fetchContactDetails = ['core/api/contacts/' + contactId + '/notes', 'core/api/contacts/'+ contactId + '/deals', 'core/api/contacts/'+ contactId + '/tasks'];
		var loading_count = 0;
		
		$.each(fetchContactDetails, function(index, url){

			var View =  Backbone.Collection.extend({
				url: url,
			});
			var view = new View();
			view.fetch({
				success: function(){
					timelineView.collection.add(view.models);
					if(++loading_count == fetchContactDetails.length){
						
						// If no email for the contact call time line from here
						if(!email){
						// Call to setup timeline
						setUpTimeline(timelineView.collection.toJSON(), el);
						}
					}
				}
			});
		});	
}	

function setUpTimeline(models, el) {
	
	// Remove loading image
	removeLoadingImg(el);
	
	// Load plugins for timeline	
	head.js(LIB_PATH + "lib/jquery.isotope.min.js", LIB_PATH + "lib/jquery.event.resize.js", function(){
		 // $('#timeline').html('<div id="line-container"><div id="line"></div></div></div>');
		customizeIsotope();
	
		$.each(models, function(index, model) {
			// combine data & templqate
			$('#timeline', el).append(getTemplate("timeline", model));
		}); //each

		$('#timeline',el).imagesLoaded(function(){
			$('#timeline').isotope({
				itemSelector : '.item',
				transformsEnabled: true,
				layoutMode: 'spineAlign',
				spineAlign:{
					gutterWidth: 56
				},
				getSortData: {
					timestamp: function($elem){
						return parseFloat($elem.find('.timestamp').text());
					}
				},
				sortBy: 'timestamp',
				sortAscending: false,
				itemPositionDataEnabled: true
			});
		});

		// add open/close buttons to each post
		$('#timeline .item.post').each(function(){
			$(this).find('.inner').append('<a href="#" class="open-close"></a>');
		});

		$('#timeline .item a.open-close').click(function(e){
			$(this).siblings('.body').slideToggle(function(){
				$('#timeline').isotope('reLayout');
			});
			$(this).parents('.post').toggleClass('closed');
			$('#expand-collapse-buttons a').removeClass('active');
			e.preventDefault();
		});

		$('#timeline').resize(function(){ // uses "jQuery resize event" plugin
			adjustLine();
		});
		
	}); // head js
	
}

/*
 * Keep the actual line from extending beyond the last item's date tab
 */
function adjustLine(){
	var $lastItem = $('.item.last');
	var itemPosition = $lastItem.data('isotope-item-position');
	var dateHeight = $lastItem.find('.date').height();
	var dateOffset = $lastItem.find('.date').position();
	var innerMargin = parseInt($lastItem.find('.inner').css('marginTop'));
	var lineHeight = itemPosition.y + innerMargin + dateOffset.top + (dateHeight / 2);
	$('#line').height(lineHeight);
}

function customizeIsotope()
{
$.Isotope.prototype._spineAlignReset = function() {
	this.spineAlign = {
		colA: 0,
		colB: 0,
		lastY: -60
	};
};

$.Isotope.prototype._spineAlignLayout = function( $elems ) {
	var instance = this,
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
$.Isotope.prototype._spineAlignGetContainerSize = function() {
	var size = {};
	size.height = this.spineAlign[( this.spineAlign.colB > this.spineAlign.colA ? 'colB' : 'colA' )];
	return size;
};
$.Isotope.prototype._spineAlignResizeChanged = function() {
	return true;
};
}	
	
function removeLoadingImg(el){
	$('#time-line', el).find('.loading-img').remove();
}

$(function () {
	
	// Show the mail(message) details in a modal 
	$("#tl-mail-popover").live('click',function(e){
		e.preventDefault();

		var htmlstring = $(this).closest('div.text').html();
		htmlstring = htmlstring.replace("icon-plus", "");

		// Add pre tag to the string to consider white spaces
		$("#mail-in-detail").html("<pre>" + htmlstring + "</pre>");
		
		$("#timelineMailModal").modal("show");
        
    });
	
	// Show the campaign log details in a modal
	$("#tl-log-popover").live('click',function(e){
		e.preventDefault();
		
		var string = $(this).closest('div.text').text();
		string = string.replace("From:", "</br>From:</br>").replace("To:", "</br>To:</br>").replace("Subject:", "</br>Subject:</br>").replace("Text:", "</br>Text:</br>").replace("HTML:", "");
		
		// Add pre tag to the string to consider white spaces
		$("#log-in-detail").html("<pre>" + string + "</pre>");
		
		$("#timelineLogModal").modal("show");
    });
	
	// Show the list of mails(to) as popover
	$("#tl-mail-to-popover").live('mouseenter',function(e){
		
		$(this).popover({
        	template:'<div class="popover"><div class="arrow"></div><div class="popover-inner" style="padding:1px;width:340px;border-radius:2px"><div class="popover-content"><p></p></div></div></div>'
        });
		
		var string = $(this).text();
		var html = new Handlebars.SafeString(string.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/,/g, ",</br>").replace("To:","To:</br>").replace("read more", ""));
		$(this).attr("data-content", html);
        $(this).popover('show');
    });
	
});

