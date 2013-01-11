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

/*
 * Taken as global to verify whether timeline is defined or not while adding
 * entities (notes, tasks and etc..) related to a contact.
 */  
var timelineView;
function load_timeline_details(el, contactId, callback1)
{
	// Sets to true, if the associated entity is fetched 
	var is_logs_fetched = false, is_mails_fetched = false, is_array_urls_fetched = false;
	
		/**
		 * An empty collection (length zero) is created to add first fetched 
		 * details and then initializes isotope with this data 
		 */ 
		timelineView =  new Base_Collection_View({
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
				is_logs_fetched = true;
				show_timeline_padcontent(is_logs_fetched, is_mails_fetched, is_array_urls_fetched);
				
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
						$.each(timelineViewMore.collection.toJSON(), function(index,data){
							var newItem = $(getTemplate("timeline", data));
							newItem.find('.inner').append('<a href="#" class="open-close"></a>');
							$('#timeline', el).isotope( 'insert', newItem);
						});
					});
				}else{
					var logs_array = [];	
					/*
					 * Already setup_timeline is called with the first fetched data. Adds all the
					 * logs of each campaign to an array and then inserts the array values 
					 * (avoids calling insertion and month marker multiple times).
					 * Inserts the data into timeline or adds to other collection (timelineViewMore) 
					 * by validating the status of isotope initialization.
					 */   
					$.each(logsCollection.toJSON(), function(index, model) {
						logs_array = logs_array.concat(JSON.parse(model.logs));								
						//validate_insertion(JSON.parse(model.logs), timelineViewMore);
					});
					validate_insertion(logs_array, timelineViewMore);
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
					is_mails_fetched = true;
					show_timeline_padcontent(is_logs_fetched, is_mails_fetched, is_array_urls_fetched);
					
					$('#time-line', el).find('.loading-img-email').remove();
					
					if(emailsCollection.toJSON()[0]['emails'].length > 0){
						
						// If timeline is not defined yet, calls setup_timeline for the first time
						if(timelineView.collection.length == 0){
							
							timelineView.collection.add(emailsCollection.toJSON()[0]['emails']);
							
							// No callback function is taken as the email takes more time to fetch
							setup_timeline(timelineView.collection.toJSON(), el);
						}else{
							$.each(emailsCollection.toJSON()[0]['emails'], function(index, data){
								var newItem = $(getTemplate("timeline", data));
								newItem.find('.inner').append('<a href="#" class="open-close"></a>');
								/*
								 * Inserts mails to timeline with out validating the isotope status,
								 * as it takes more time to fetch.
								 */  
								$('#timeline', el).isotope( 'insert', newItem);
							});
						}
					}
				},
				error: function(){
					is_mails_fetched = true;
					show_timeline_padcontent(is_logs_fetched, is_mails_fetched, is_array_urls_fetched);
					
					// Remove loading image of mails
					$('#time-line', el).find('.loading-img-email').remove();
				}
			});
			
			// Gets address of the contact from its browsing history
			var address = getPropertyValue(json.properties, "address");
			if(!address)
				get_address_from_browsing_history(email, json);
		}else{
			is_mails_fetched = true;
			
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
						
						is_array_urls_fetched = true;
						show_timeline_padcontent(is_logs_fetched, is_mails_fetched, is_array_urls_fetched);
						
						if(arrayView.collection.length == 0)
							return;
						
						// If timeline is not defined yet, calls setup_timeline for the first time
						if(timelineView.collection.length == 0){
							timelineView.collection.add(arrayView.collection.models);
							
							/*
							 * Calls setup_timeline with a callback function to insert other models 
							 * (fetched while initializing the isotope) if available.
							 */
							setup_timeline(timelineView.collection.toJSON(), el, function(el){
								
								$.each(timelineViewMore.collection.toJSON(), function(index,data){
									var newItem = $(getTemplate("timeline", data));
									newItem.find('.inner').append('<a href="#" class="open-close"></a>');
									$('#timeline', el).isotope( 'insert', newItem);
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
				var month_years = [];
				$.each(models, function(index, model){
					var month_year = entity_created_month_year(model);
									
					if (month_years.indexOf(month_year) < 0 && MONTH_YEARS.indexOf(month_year))
						month_years[month_years.length] = month_year;
					var newItem = $(getTemplate("timeline", model));
					newItem.find('.inner').append('<a href="#" class="open-close"></a>');
					$('#timeline').isotope( 'insert', newItem);
				});
				
				// add a year marker for each year that has a post
				create_month_marker(month_years, true);
			}
		});
		
	}catch(err){
		console.log(err);
		timelineViewMore.collection.add(models);
	}
}

/**
 * Shows "no entities present" pad content for timeline by verifying
 * whether all the entities are fetched or not.
 *  
 * @param is_logs_fetched
 * @param is_mails_fetched
 * @param is_array_urls_fetched
 */
function show_timeline_padcontent(is_logs_fetched, is_mails_fetched, is_array_urls_fetched){
	if(!is_logs_fetched || !is_mails_fetched || !is_array_urls_fetched)
		return;
	
	if (timelineView.collection.length == 0)
		$("#timeline-slate").css('display', 'block');
}

// Stores month names with their maximum days to get time stamp (milliseconds)
var monthArray = ['January 31', 'February 28', 'March 31', 'April 30', 'May 31', 'June 30',
                  'July 31', 'August 31', 'September 30', 'October 31', 'November 30', 'December 31'];

// Stores "monthIndex-year" of timeline initiating entities
var MONTH_YEARS = [];

/**
 * Get the timestamp (milliseconds) given month of the year.
 */
function getTimestamp(month_index, year){
	if((year % 4) == 0)
		monthArray[1] = 'February 29';
	return Date.parse(monthArray[month_index] + ', ' + year); 
}

/**
 * Returns month index and full year of the given entity as "-" separated.
 * @param model
 * @returns {String}
 */
function entity_created_month_year(model){
	if(model.created_time)
		return month_year = new Date(model.created_time * 1000).getMonth() + '-' + new Date(model.created_time * 1000).getFullYear();
	else if(model.t)
		return month_year = new Date(model.t * 1000).getMonth() + '-' + new Date(model.t * 1000).getFullYear();
	else if(model.date_secs)
		return month_year = new Date(model.date_secs * 1000).getMonth() + '-' + new Date(model.date_secs).getFullYear();
}

/**
 * Inserts or appends month marker to the timeline
 * @param month_years
 * @param is_insert
 */
function create_month_marker(month_years, is_insert){
	// add a year marker for each year that has a post
	$.each(month_years, function(i, val){
		var monthYear = val.split('-');
		var timestamp = getTimestamp(monthYear[0], monthYear[1]) / 1000;
		var context = {year: monthArray[monthYear[0]].split(' ')[0], timestamp: timestamp};
		if(is_insert)
			$('#timeline').isotope( 'insert', $(getTemplate("year-marker", context)));
		else
			$('#timeline').append(getTemplate("year-marker", context));
	});
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
	
	// Removes pad content of no data presents
	 $("#timeline-slate").css('display', 'none');
	
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
			
			// save the years so we can create year markers
			var month_year = entity_created_month_year(model);
					
			if (MONTH_YEARS.indexOf(month_year) < 0)
				MONTH_YEARS[MONTH_YEARS.length] = month_year;
			
			// combine data & templqate
			$('#timeline', el).append(getTemplate("timeline", model));
		}); //each

		// add a year marker for each year that has a post
		create_month_marker(MONTH_YEARS, false);
		
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
		$('#timeline .item a.open-close').live("click", function(e){
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
 * When contact has no address, based on its email, traces address from its
 * browsing history and stores as address property of the contact.
 * 
 * To get address of a contact with its email, you should run the java script
 * api provided at api & analytics (admin settings) by pushing the email of the
 * contact
 * 
 * @param {String}
 *            email of the contact
 * @param {Object}
 *            contact present in contact detail view
 * @param {Boolean}
 *            empty_address refers the address presence (empty address or no
 *            address field) of a contact
 */
function get_address_from_browsing_history(email, contact) {

	// Get browsing address of contact with it's email, when it is defined
		var url = 'core/api/stats?e=' + encodeURIComponent(email);

		$.get(url, function(data) {

			// Go further only when the contact got browsing address
			if (data && data.length > 0) {
				var addressJSON = {};
				addressJSON.city = data[0].c.city;
				addressJSON.country = data[0].c.country;

				// If contact has no address property push the new one
					contact.properties.push({
						"name" : "address",
						"value" : JSON.stringify(addressJSON)
					});

				// Update contact with the browsing address
				var contactModel = new Backbone.Model();
				contactModel.url = 'core/api/contacts';
				contactModel.save(contact, {
					success : function(obj) {

					}
				});
			}
		});
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

