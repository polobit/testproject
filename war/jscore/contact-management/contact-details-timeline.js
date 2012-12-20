/**
 * Fetches all the entities (notes, deals, tasks, logs and mails) simultaneously, 
 * which are related to a contact (in contactDetailView) and initiates isotope 
 * with the first fetched details (to show in time-line) and inserts the next 
 * fetched data into time-line.
 *  
 * @method load_timeline_details 
 * @param {Object} el
 * 				html object of contact detail view
 * @param contactId
 * 				id of a contact in contact detail view
 */
function load_timeline_details(el, contactId)
{
		/**
		 * An empty collection (length zero) is created to add first fetched 
		 * details and then initializes isotope with this data 
		 */ 
		var timelineView =  new Base_Collection_View({
			templateKey: 'timeline',
			individual_tag_name: 'li',
		});
		
		/**
		 * Another empty collection is created to add other data (apart from first fetched)
		 * which is fetched while the isotope is getting initialized with the first fetched 
		 * data, because it can not be inserted with out complete initialization of isotope.  
		 * 
		 */
		var timelineViewMore =  new Base_Collection_View({
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
				
		// Fetches logs related to the contact
		var LogsCollection = Backbone.Collection.extend({
			url: '/core/api/campaigns/logs/contact/' + contactId,
		});
		var logsCollection = new LogsCollection();
		logsCollection .fetch({
			success: function(){
				
				// Remove logs related loading image
				$('#time-line', el).find('.loading-img-log').remove();
				if(logsCollection.length == 0)
					return;
					
				// If timeline is not defined yet, calls setup_timeline for the first time
				if(timelineView.collection.length == 0){
					
					$.each(logsCollection.toJSON(), function(index, model) {
						timelineView.collection.add(JSON.parse(model.logs));
					});	
										
					/*
					 * Calls setup_timeline with a callback function to insert other models 
					 * (fetched while initializing the isotope) if available.
					 */
					setup_timeline(timelineView.collection.toJSON(), el, function(el){
							
						console.log("new call back........");
						console.log(timelineViewMore.collection.toJSON());
						$.each(timelineViewMore.collection.toJSON(), function(index,data){
							$('#timeline', el).isotope( 'insert', $(getTemplate("timeline", data)) );
						});
					});
				}else{
						
					/*
					 * Already setup_timeline is called with the first fetched data.
					 * 
					 * Inserts the data into timeline or adds to other collection (timelineViewMore) 
					 * by validating the status of isotope initialization.
					 */   
					$.each(logsCollection.toJSON(), function(index, model) {
														
						validate_insertion(JSON.parse(model.logs), timelineViewMore);
					});
				}
			
			}
		});
		
		var contact = App_Contacts.contactDetailView.model;
		var json = contact.toJSON();
		 
		// Get email of the contact in contact detail
		var email = getPropertyValue(json.properties, "email");
		
		// Go for mails when only the contact has an email
		if(email){
			
			var EmailsCollection = Backbone.Collection.extend({
				url: 'core/api/email?e=' + encodeURIComponent(email) + '&c=10&o=0',
			});
			var emailsCollection = new EmailsCollection();
			emailsCollection .fetch({
				success: function(){
					$('#time-line', el).find('.loading-img-email').remove();
					
					if(emailsCollection.toJSON()[0]['emails'].length > 0){
						
						// If timeline is not defined yet, calls setup_timeline for the first time
						if(timelineView.collection.length == 0){
							
							timelineView.collection.add(emailsCollection.toJSON()[0]['emails']);
							
							// No callback function is taken as the email takes more time to fetch
							setup_timeline(timelineView.collection.toJSON(), el);
						}else{
							$.each(emailsCollection.toJSON()[0]['emails'], function(index, data){
								
								/*
								 * Inserts mails to timeline with out validating the isotope status,
								 * as it takes more time to fetch.
								 */  
								$('#timeline', el).isotope( 'insert', $(getTemplate("timeline", data)) );
							});
						}
					}
				},
				error: function(){
					
					// Remove loading image of mails
					$('#time-line', el).find('.loading-img-email').remove();
				}
			});
		}else{
			
			// Removes loading image of mails, if there is no email to contact  
			$('#time-line', el).find('.loading-img-email').remove();
		}
		
		/**
		 * Defines a collection to store the response of all the request urls (notes, deals 
		 * and tasks) in the array (fetchContactDetails).
		 */ 
		var arrayView =  new Base_Collection_View({
			templateKey: 'timeline',
			individual_tag_name: 'li',
		});
		
		/*
		 * Stores all urls (notes, deals and tasks) in an array to fetch data using
		 * same collection by changing its url.
		 */ 
		var fetchContactDetails = ['core/api/contacts/' + contactId + '/notes', 'core/api/contacts/'+ contactId + '/deals', 'core/api/contacts/'+ contactId + '/tasks'];
		var loading_count = 0;
		
		$.each(fetchContactDetails, function(index, url){
			
			// Verifies completion of all urls
			var is_timeline_available = false;
			
			var View =  Backbone.Collection.extend({
				url: url,
			});
			var view = new View();
			view.fetch({
				success: function(){
					
					if(view.length > 0)
						arrayView.collection.add(view.models);
					
					// If all the urls got their responses, goes for timeline
					if(++loading_count == fetchContactDetails.length){
						remove_loading_img(el);
						
						// If timeline is not defined yet, calls setup_timeline for the first time
						if(timelineView.collection.length == 0){
							timelineView.collection.add(arrayView.collection.models);
							
							/*
							 * Calls setup_timeline with a callback function to insert other models 
							 * (fetched while initializing the isotope) if available.
							 */
							setup_timeline(timelineView.collection.toJSON(), el, function(el){
								
								$.each(timelineViewMore.collection.toJSON(), function(index,data){
									$('#timeline', el).isotope( 'insert', $(getTemplate("timeline", data)) );
								});
							})
						}else{
							
							/*
							 * Already setup_timeline is called with the first fetched data.
							 * 
							 * Inserts the data into timeline or adds to other collection (timelineViewMore) 
							 * by validating the status of isotope initialization.
							 */							
							validate_insertion(arrayView.collection.toJSON(), timelineViewMore);
						}
					}
				}
			});
		});	
	
}	

/**
 * Inserts the models into timeline, if isotope is defined (initialized 
 * completely) otherwise adds to a collection (timelineViewMore) to insert
 * them on complete initialization of isotope from setupTimelin callback
 * function.
 * 
 * @method validate_insertion
 * @param models
 * 			collection of models to add timeline
 * @param timelineViewMore
 * 			collection to add models
 * 			
 */
function validate_insertion(models, timelineViewMore){
	
	/*
	 * If isotope is not defined an exception will be raised, then
	 * it goes to catch block and adds the data to the collection
	 */
	try{
		head.js(LIB_PATH + "lib/jquery.isotope.min.js", LIB_PATH + "lib/jquery.event.resize.js", function(){
		
			if($('#timeline').isotope()){
				$.each(models, function(index,data){
				
					$('#timeline').isotope( 'insert', $(getTemplate("timeline", data)) );
				});
			}
		});
		
	}catch(err){
		
		timelineViewMore.collection.add(models);
	}
}

/**
 * Loads minified jquery.isotope plug-in and jquery.event.resize plug-in to 
 * to initialize the isotope and appends the given models to the timeline, by 
 * loading their corresponding templates using handlebars
 * 
 * @method setup_timeline 
 * @param models
 * 			models to append timeline
 * @param el
 * 			html object of the contact detail view
 * @param callback
 * 			function to insert models into timelin on its initialization
 */
function setup_timeline(models, el, callback) {
	
	// Load plugins for timeline	
	head.js(LIB_PATH + "lib/jquery.isotope.min.js", LIB_PATH + "lib/jquery.event.resize.js", function(){
		
		/*
		 * Defines the layout and its dimensions, container size and
		 * arrangement of data position added to timeline etc..
		 */ 
		customize_isotope();
	
		/*
		 * Appends each model to timeline, by loading their corresponding
		 * templates using handlebars
		 */
		$.each(models, function(index, model) {
			// combine data & templqate
			$('#timeline', el).append(getTemplate("timeline", model));
		}); //each

		// Initializes isotope with options (sorts the data based on created time)
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

		// Resizes the item height
		$('#timeline .item a.open-close').click(function(e){
			$(this).siblings('.body').slideToggle(function(){
				$('#timeline').isotope('reLayout');
			});
			$(this).parents('.post').toggleClass('closed');
			$('#expand-collapse-buttons a').removeClass('active');
			e.preventDefault();
		});

		// Resizes the line height based on entities overall height
		$('#timeline').resize(function(){ // uses "jQuery resize event" plugin
			adjust_line();
		});
		
		/*
		 * Calls the callback function to insert the data into timeline, which
		 * is not inserted due to initialization issues. 
		 */ 
		if(callback && typeof(callback) === "function"){
			callback(el);
		}
		
	}); // head js
	
}

/*
 * Keep the actual line from extending beyond the last item's date tab
 */
function adjust_line(){
	var $lastItem = $('.item.last');
	var itemPosition = $lastItem.data('isotope-item-position');
	var dateHeight = $lastItem.find('.date').height();
	var dateOffset = $lastItem.find('.date').position();
	var innerMargin = parseInt($lastItem.find('.inner').css('marginTop'));
	var lineHeight = itemPosition.y + innerMargin + dateOffset.top + (dateHeight / 2);
	$('#line').height(lineHeight);
}

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
	 * It executes every tiem, when a amodal is added or deleted from timeline.
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

/**
 * Removes loading image from timeline view
 * 
 * @param el
 * 			html object of contact detail view
 */
function remove_loading_img(el){
	$('#time-line', el).find('.loading-img').remove();
}

/**
 * Handles the events (click and mouseenter) of mail and log entities of 
 * tiemline 
 */
$(function () {
	
	/*
	 * Shows the mail details in detail on a popup modal, when '+'
	 * symbol is clicked 
	 */  
	$("#tl-mail-popover").live('click',function(e){
		e.preventDefault();

		var htmlstring = $(this).closest('div.text').html();
		htmlstring = htmlstring.replace("icon-plus", "");

		// Add pre tag to the string to consider white spaces
		$("#mail-in-detail").html("<pre>" + htmlstring + "</pre>");
		
		$("#timelineMailModal").modal("show");
        
    });
	
	/*
	 * Shows the campaign log details on a popup modal
	 */ 
	$("#tl-log-popover").live('click',function(e){
		e.preventDefault();
		
		var string = $(this).closest('div.text').text();
		string = string.replace("From:", "</br>From:</br>").replace("To:", "</br>To:</br>").replace("Subject:", "</br>Subject:</br>").replace("Text:", "</br>Text:</br>").replace("HTML:", "");
		
		// Add pre tag to the string to consider white spaces
		$("#log-in-detail").html("<pre>" + string + "</pre>");
		
		$("#timelineLogModal").modal("show");
    });
	
	/*
	 * Shows the list of mails(mail sent to) as popover, when mouse is entered on
	 * to address of the email
	 */  
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

