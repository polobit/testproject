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
 *//*


 * Taken as global to verify whether timeline is defined or not while adding
 * entities (notes, tasks and etc..) related to a contact.
   
var timelineView;
function load_timeline_details1(el, contactId, callback1)
{
	// Sets to true, if the associated entity is fetched 
	var is_logs_fetched = false, is_mails_fetched = false, is_array_urls_fetched = false;
	
		*//**
		 * An empty collection (length zero) is created to add first fetched 
		 * details and then initializes isotope with this data 
		 *//* 
		timelineView =  new Base_Collection_View({
			templateKey: 'timeline',
			individual_tag_name: 'li',
		});
	
		
		*//**
		 * Another empty collection is created to add other data (apart from first fetched)
		 * which is fetched while the isotope is getting initialized with the first fetched 
		 * data, because it can not be inserted with out complete initialization of isotope.  
		 * 
		 *//*
		var timelineViewMore =  new Base_Collection_View({
			templateKey: 'timeline',
			individual_tag_name: 'li',
		});
		
		// Override comparator to sort models on time base
		timelineView.collection.comparator = function(item){
			if (item.get('created_time')) {
	            return item.get('created_time');
	        }
			if (item.get('createdTime')) {
				return item.get('createdTime')/1000;
		    }
	        if (item.get('time')) {
	        	return item.get('time')/1000;
	        }
	        if (item.get('date_secs')) {
	        	return item.get('date_secs')/1000;
	        }
	        return item.get('id');
		}
		
		var contact = App_Contacts.contactDetailView.model.toJSON();
		
		addTagsToTimeline(App_Contacts.contactDetailView.model, el);
		
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
					$.each(logsCollection.toJSON(), function(index, model){
						
						// Add these log-types in timeline
						if(model.log_type == 'EMAIL_SENT' || model.log_type == 'EMAIL_OPENED' || model.log_type == 'EMAIL_CLICKED' 
							 || model.log_type == 'SET_OWNER' || model.log_type == 'SCORE'
								|| model.log_type == 'ADD_DEAL' || model.log_type == 'TWEET')
						{
							timelineView.collection.add(model, {silent : true});
						}
						
					});
								
					
					 * Calls setup_timeline with a callback function to insert other models 
					 * (fetched while initializing the isotope) if available.
					 
					setup_timeline(timelineView.collection.toJSON(), el, function(el){
						$.each(timelineViewMore.collection.toJSON(), function(index,data){
							var newItem = $(getTemplate("timeline", data));
							newItem.find('.inner').append('<a href="#" class="open-close"></a>');
							$('#timeline', el).isotope( 'insert', newItem);
						});
					});
				}else{
					var logs_array = [];	
					
					 * Already setup_timeline is called with the first fetched data. Adds all the
					 * logs of each campaign to an array and then inserts the array values 
					 * (avoids calling insertion and month marker multiple times).
					 * Inserts the data into timeline or adds to other collection (timelineViewMore) 
					 * by validating the status of isotope initialization.
					    
					$.each(logsCollection.toJSON(), function(index, model) {						
						
						// Add these log-types in timeline.
						if(model.log_type == 'EMAIL_SENT' || model.log_type == 'EMAIL_OPENED' || model.log_type == 'EMAIL_CLICKED' 
							 || model.log_type == 'SET_OWNER' || model.log_type == 'SCORE'
									|| model.log_type == 'ADD_DEAL' || model.log_type == 'TWEET')
						{
							logs_array.push(model);			
						    timelineView.collection.add(model, {silent : true});
						}
						
						//validate_insertion(JSON.parse(model.logs), timelineViewMore);
					});
					validate_insertion(logs_array, timelineViewMore);
				}
			
			}
		});
		
		*//** Emails Collection Starts**//*
		var contact = App_Contacts.contactDetailView.model;
		var json = contact.toJSON();
		 
		// Get email of the contact in contact detail
		var email = getPropertyValue(json.properties, "email");
		
		// Go for mails when only the contact has an email
		if(email){
			
			var EmailsCollection = Backbone.Collection.extend({
				url: 'core/api/emails/imap-email?e=' + encodeURIComponent(email) + '&c=10&o=0',
			});
			var emailsCollection = new EmailsCollection();
			emailsCollection .fetch({
				success: function(){
					is_mails_fetched = true;
					show_timeline_padcontent(is_logs_fetched, is_mails_fetched, is_array_urls_fetched);
					
					$('#time-line', el).find('.loading-img-email').remove();
					
					
					
					if(emailsCollection.toJSON()[0] && emailsCollection.toJSON()[0]['emails'] && emailsCollection.toJSON()[0]['emails'].length > 0){
					
						// Adds Personal Email Opened Track Data to timeline.
						add_personal_email_opened_to_timeline(emailsCollection.toJSON()[0]['emails'],el);

						// If timeline is not defined yet, calls setup_timeline for the first time
						if(timelineView.collection.length == 0 && emailsCollection.toJSON()[0]){

							// No callback function is taken as the email takes more time to fetch
							setup_timeline(timelineView.collection.toJSON(), el, function(el) {

								$.each(timelineViewMore.collection.toJSON(), function(index,data){
									
									// if error occurs in imap (model is obtained with the error msg along with contact-email models),
									// ignore that model
									if(('errormssg' in data) || data.status === "error")
										return true;
									
									var newItem = $(getTemplate("timeline", data));
									newItem.find('.inner').append('<a href="#" class="open-close"></a>');
									$('#timeline', el).isotope( 'insert', newItem);
								});
							});
						}else{
							    var emailsArray = [];
							    
								$.each(emailsCollection.toJSON()[0]['emails'], function(index, model){
									
									// if error occurs in imap (model is obtained with the error msg along with contact-email models),
									// ignore that model
									if(('errormssg' in model) || model.status === "error")
										return true;
									
									emailsArray.push(model);
								});
								
							validate_insertion(emailsArray, timelineViewMore);
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
           
			//if(!address)
				//get_address_from_browsing_history(email, json,el);
			
			// Gets address from stats and save to contact
			get_stats(email,json,el);
		}else{
			is_mails_fetched = true;
			
			// Removes loading image of mails, if there is no email to contact  
			$('#time-line', el).find('.loading-img-email').remove();
			$('#time-line',el).find('.loading-img-stats').remove();
		}
		*//**End of Emails Collection**//*
		
		*//**
		 * Defines a collection to store the response of all the request urls (notes, deals 
		 * and tasks) in the array (fetchContactDetails).
		 *//* 
		
		var entity_types = ["deals", "notes", "cases", "tasks"]
		$.getJSON('core/api/contacts/related-entities/' + contactId, function(data){
			var entities = [];
			
			for(var index in entity_types)
			{
				entities = entities.concat(data[entity_types[index]]);
				
			}
			
			remove_loading_img(el);
			
			
			timelineView.collection.add(entities , {silent : true});
			
		
				// If timeline is not defined yet, calls setup_timeline for the first time
				if(timelineView.collection.length == 0){

					
					 * Calls setup_timeline with a callback function to insert other models 
					 * (fetched while initializing the isotope) if available.
					 
					setup_timeline(timelineView.collection.toJSON(), el, function(el) {
						
						$.each(timelineViewMore.collection.toJSON(), function(index,data){
							var newItem = $(getTemplate("timeline", data));
							newItem.find('.inner').append('<a href="#" class="open-close"></a>');
							$('#timeline', el).isotope( 'insert', newItem);
						});
					})
				}else{
					
					
					 * Already setup_timeline is called with the first fetched data.
					 * 
					 * Inserts the data into timeline or adds to other collection (timelineViewMore) 
					 * by validating the status of isotope initialization.
					 							
					validate_insertion(entities, timelineViewMore);
				}
		})
}	

*//**
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
 *//*
function validate_insertion(models, timelineViewMore){
	
	
	 * If isotope is not defined an exception will be raised, then
	 * it goes to catch block and adds the data to the collection
	 
	try{
		head.load(LIB_PATH + "lib/jquery.isotope.min.js", LIB_PATH + "lib/jquery.event.resize.js", "css/misc/agile-timline.css", function(){
		

			if($('#timeline').isotope()) {
				var month_years = [];
				$.each(models, function(index, model){
					var month_year = entity_created_month_year(model);

					if (month_years.indexOf(month_year) < 0 && MONTH_YEARS.indexOf(month_year) < 0){
						month_years[month_years.length] = month_year;
						MONTH_YEARS[MONTH_YEARS.length] = month_year;
					}	
					var newItem = $(getTemplate("timeline", model));
					newItem.find('.inner').append('<a href="#" class="open-close"></a>');
					$('#timeline').isotope( 'insert', newItem);
				});

				// add a month marker for each month that has a post
				create_month_marker(month_years, true, App_Contacts.contactDetailView.el);
			}
		});
		
	}catch(err){
		console.log(err);
		timelineViewMore.collection.add(models);
	}
}

*//**
 * Shows "no entities present" pad content for timeline by verifying
 * whether all the entities are fetched or not.
 *  
 * @param is_logs_fetched
 * @param is_mails_fetched
 * @param is_array_urls_fetched
 *//*
function show_timeline_padcontent(is_logs_fetched, is_mails_fetched, is_array_urls_fetched){
	if(!is_logs_fetched || !is_mails_fetched || !is_array_urls_fetched )
		return;
	
	if (timelineView.collection.length == 0)
		$("#timeline-slate").css('display', 'block');
}

// Stores month names with their maximum days to get time stamp (milliseconds)
var monthArray = ['January 31', 'February 28', 'March 31', 'April 30', 'May 31', 'June 30',
                  'July 31', 'August 31', 'September 30', 'October 31', 'November 30', 'December 31'];

// Stores "monthIndex-year" of timeline initiating entities
var MONTH_YEARS;

*//**
 * Get the timestamp (milliseconds) given month of the year.
 *//*
function getTimestamp(month_index, year){
	if((year % 4) == 0)
		monthArray[1] = 'February 29';
	return Date.parse(monthArray[month_index] + ', ' + year) + 86400000 - 1; 
}

*//**
 * Returns month index and full year of the given entity as "-" separated.
 * @param model
 * @returns {String}
 *//*
function entity_created_month_year(model){
	if(model.created_time)
		return month_year = new Date(model.created_time * 1000).getMonth() + '-' + new Date(model.created_time * 1000).getFullYear();
	if(model.createdTime)
		return month_year = new Date(model.createdTime).getMonth() + '-' + new Date(model.createdTime).getFullYear();
	else if(model.time)
		return month_year = new Date(model.time * 1000).getMonth() + '-' + new Date(model.time * 1000).getFullYear();
	else if(model.date_secs)
		return month_year = new Date(model.date_secs).getMonth() + '-' + new Date(model.date_secs).getFullYear();
}

*//**
 * Inserts or appends month marker to the timeline
 * @param month_years
 * @param is_insert
 *//*
function create_month_marker(month_years, is_insert, el){
	// add a year marker for each year that has a post
	$.each(month_years, function(i, val){
		var monthYear = val.split('-');
		var timestamp = getTimestamp(monthYear[0], monthYear[1]) / 1000;
		var context = {year: monthArray[monthYear[0]].split(' ')[0], timestamp: timestamp};
		if(is_insert){
			$('#timeline', el).isotope( 'insert', $(getTemplate("year-marker", context)));
		}	
		else{
			$('#timeline', el).append(getTemplate("year-marker", context));
		}	
	});
	$("#timline").isotope('reloadItems');
}


function add_entity_to_timeline(model)
{
	var list = [];
	list.push(model.toJSON())

	// console.log(model.get('id'));

	if (!timelineView.collection.get(model.get('id')))
	{
		timelineView.collection.add(model,  {silent : true})
		validate_insertion(list);
		return;
	}


	update_entity_template(model);

}

function update_entity_template(model)
{
	$("#" + model.get("id"), $('#timeline', App_Contacts.contactDetailView.el)).html(getTemplate('timeline', model.toJSON()));
}


*//**
 * Loads minified jquery.isotope plug-in and jquery.event.resize plug-in to 
 * initialize the isotope and appends the given models to the timeline, by 
 * loading their corresponding templates using handlebars
 * 
 * @method setup_timeline 
 * @param models
 * 			models to append timeline
 * @param el
 * 			html object of the contact detail view
 * @param callback
 * 			function to insert models into timeline on its initialization
 *//*
function setup_timeline(models, el, callback) {
	
	// Removes pad content of no data presents
	 $("#timeline-slate").css('display', 'none');
	 
	 MONTH_YEARS = [];
	
	// Load plugins for timeline	
	
		
	 head.load(LIB_PATH + "lib/jquery.isotope.min.js", LIB_PATH + "lib/jquery.event.resize.js", "css/misc/agile-timline.css", function(){
		
		 
		 * Defines the layout and its dimensions, container size and
		 * arrangement of data position added to timeline etc..
		  
		customize_isotope();
		
		
		 * Appends each model to timeline, by loading their corresponding
		 * templates using handlebars
		 
		$.each(models, function(index, model) {
			
			// saves the month and years so we can create month markers
			var month_year = entity_created_month_year(model);
			
					
			if (MONTH_YEARS.indexOf(month_year) < 0)
				MONTH_YEARS[MONTH_YEARS.length] = month_year;
			
			//console.log(MONTH_YEARS);
			
			// combine data & template
			$('#timeline', el).append(getTemplate("timeline", model));
		}); //each

		// add a month marker for each month that has a post
		create_month_marker(MONTH_YEARS, false, el);

		var $container = $("#timeline", el);
		
		// Initializes isotope with options (sorts the data based on created time)
		$('#timeline', el).imagesLoaded(function(){
			$container.isotope({
				itemSelector : '.item',
				transformsEnabled: true,
				layoutMode: 'spineAlign',
				spineAlign:{
					gutterWidth: 56
				},
				getSortData: {
					timestamp: function($elem){
						var time = parseFloat($elem.find('.timestamp').text());
						
						// If time is in milliseconds then return time in seconds
						if ((time / 100000000000) > 1)
							return time/1000;
						
						return time
					}
				},
				sortBy: 'timestamp',
				sortAscending: false,
				itemPositionDataEnabled: true
			});
		});
		
		// Using autoellipsis for showing 3 lines of message
		head.js(LIB_PATH + 'lib/jquery.autoellipsis.min.js', function(){
			$('#timeline', el).find("#autoellipsis").ellipsis();
			$('#timeline', el).isotope('reLayout');
		});
		
		// add open/close buttons to each post
		$('#timeline .item.post', el).each(function(){
			$(this).find('.inner').append('<a href="#" class="open-close"></a>');
		});
		// Resizes the line height based on entities overall height
		$('#timeline', el).resize(function(){
			adjust_line();
		});
		
		
		 * Calls the callback function to insert the data into timeline, which
		 * is not inserted due to initialization issues. 
		  
		if(callback && typeof(callback) === "function"){
			callback(el);
		}
		
	}); // head js
	
}


 * Keep the actual line from extending beyond the last item's date tab
 
function adjust_line(){
	var $lastItem = $('.item.last');
	var itemPosition = $lastItem.data('isotope-item-position');
	var dateHeight = $lastItem.find('.date').height();
	var dateOffset = $lastItem.find('.date').position();
	var innerMargin = parseInt($lastItem.find('.inner').css('marginTop'));
	var lineHeight = itemPosition.y + innerMargin + dateOffset.top + (dateHeight / 2);
	$('#line').height(lineHeight);
}

*//**
 * Defines the layout and its dimensions, container size and
 * arrangement of data position added to timeline etc..
 * 
 * @method customize_isotope
 *//*
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

	
	 * Defines the dimentions of layout, and alters the position of data.
	 * It executes every tiem, when a modal is added or deleted from timeline.
	  
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

*//**
 * Removes loading image from timeline view
 * 
 * @param el
 * 			html object of contact detail view
 *//*
function loading_img(el){
	$('#time-line', el).find('.loading-img').remove();
}

*//**
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
 * @param {Object}
 *            backbone element.
 *//*function get_stats(email, contact, el)
{
	// If there are no web-stats - return
	if(!(readCookie('_agile_jsapi') != null && readCookie('_agile_jsapi') == "true") && (NO_WEB_STATS_SETUP && get_web_stats_count_for_domain() == '0'))
	{
		is_mails_fetched = true;
		is_logs_fetched = false;
		is_array_urls_fetched = false;
		show_timeline_padcontent(is_logs_fetched, is_mails_fetched, is_array_urls_fetched);
		
		// Remove loading image of mails
		$('#time-line', el).find('.loading-img-stats').remove();
		
		return;
	}
	
	// Made global variable false and set cookie
	NO_WEB_STATS_SETUP = false;
	createCookie('_agile_jsapi',true, 500);
	
	var StatsCollection = Backbone.Collection.extend({
		                        url:'core/api/web-stats?e='+ encodeURIComponent(email)
		                                             });
	
	this.statsCollection = new StatsCollection();
	statsCollection.fetch({
		success:function(data){
			
			is_mails_fetched = true;
			is_logs_fetched = false;
			is_array_urls_fetched = false;
			
			show_timeline_padcontent(is_logs_fetched, is_mails_fetched, is_array_urls_fetched);
			
         	$('#time-line', el).find('.loading-img-stats').remove();
			
			// Checks whether data is empty or not.
			if (data.toJSON() && data.toJSON().length > 0) {
				
				// Gets address of the contact from its browsing history
				var address = getPropertyValue(contact.properties, "address");
				
				if(!address)
				{
				var addressJSON = {};
				
				if(data.toJSON()[0].city != "")
				{
				    addressJSON.city = ucfirst(data.toJSON()[0].city);
				    addressJSON.state = ucfirst(data.toJSON()[0].region);
				    addressJSON.country = getCode(data.toJSON()[0].country);
				
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
				}
								
				// If timeline is not defined yet, calls setup_timeline for the first time
				if(timelineView.collection.length == 0)
				{					
					$.each(data.toJSON(),function(index,model){					
						timelineView.collection.add(model,  {silent : true});
					});					
					
					// No callback function is taken as the stats takes more time to fetch
					setup_timeline(timelineView.collection.toJSON(), el);							
				}
				else
				{					
						$.each(data.toJSON(),function(index,model){
						var newItem = $(getTemplate("timeline", model));
						newItem.find('.inner').append('<a href="#" class="open-close"></a>');
						
						
						 * Inserts mails to timeline with out validating the isotope status,
						 * as it takes more time to fetch.
						   
						$('#timeline', el).isotope( 'insert', newItem);
						});
				}
				
				addTagAgile(CODE_SETUP_TAG);	
			}
			
		},
		error: function(){
			is_mails_fetched = true;
			show_timeline_padcontent(is_logs_fetched, is_mails_fetched, is_array_urls_fetched);
			
			// Remove loading image of mails
			$('#time-line', el).find('.loading-img-stats').remove();
		}
	});
	}
 
 function addTagsToTimeline(contact, el)
 {
 	if (timelineView.collection.length == 0)
 	{
 		timelineView.collection.add(contact, {silent : true});

 		// Add tags in timeline
 		$.each(contact.get('tagsWithTime'), function(index, tag)
 		{
 			// console.log(tag);
 			timelineView.collection.add(tag, {silent : true});
 		})
 		setup_timeline(timelineView.collection.toJSON(), el);

 	}
 	else
 	{
 		var newItem = $(getTemplate("timeline", contact));
 		var newItem = $(getTemplate("timeline", contact));

 		newItem.find('.inner').append('<a href="#" class="open-close"></a>');
 		
 		 * Inserts mails to timeline with out validating the isotope status, as
 		 * it takes more time to fetch.
 		 
 		$('#timeline', el).isotope('insert', newItem);
 	}
 }

 function addTagToTimelineDynamically(tags)
 {
	 alert("tags tag");
	 if(!timelineView || !timelineView.collection)
		 return;
	 
 	if (timelineView.collection.length == 0)
 	{
 		$.each(tags, function(index, tag)
 		{
 			timelineView.collection.add(tag, {silent : true});
 		});

 		setup_timeline(timelineView.collection.toJSON(), el);
 		return;
 	}

 	var tags_to_add = [];
 	$.each(tags, function(index, tag)
 	{
 		if (!timelineView.collection.where(tag).length == 0)
 			return;

 		timelineView.collection.add(tag, {silent : true});
 		tags_to_add.push(tag);
 	});

 	validate_insertion(tags_to_add);

 	
 	 * var newItem = $(getTemplate("timeline", tag));
 	 * 
 	 * newItem.find('.inner').append('<a href="#" class="open-close"></a>');
 	 * 
 	 * Inserts mails to timeline with out validating the isotope status, as it
 	 * takes more time to fetch.
 	 * 
 	 * $('#timeline', el).isotope( 'insert', newItem);
 	 

 }
 
 *//**
  * Adds Email Opened data having email opened time to timeline.
  * 
  * @param emails - Emails JSON.
  * 
  * @param el - Backbone el.
  **//*
 function add_personal_email_opened_to_timeline(emails,el)
 {
	// Temporary array to clone emails
	var emails_clone = [];
	
	// Clone emails Array to not affect original emails
	$.extend(true, emails_clone, emails);
	
	var emails_opened = [];
	 
	 if (timelineView.collection.length == 0)
	 	{
			 $.each(emails_clone,function(index, model){
				if(model.email_opened_at && model.email_opened_at !== 0)
			 	{
				 	// Need createdTime key to sort in timeline.
					model.createdTime = (model.email_opened_at) * 1000;
					
				 	// Temporary entity to identify timeline template
					model.agile_email = "agile_email";
				 	
					// To avoid merging with emails template having date entity
					model.date = undefined;
					
				 	timelineView.collection.add(model, {silent : true});
			 	}
			 });
			 
			 setup_timeline(timelineView.collection.toJSON(), el);
	 	}
	 else
		 {
		 $.each(emails_clone, function(index, model){
				if(model.email_opened_at && model.email_opened_at !== 0)
			 	{
					// Need createdTime key to sort in timeline.
					model.createdTime = (model.email_opened_at) * 1000;
				 	
					// Temporary entity to identify timeline template
					model.agile_email = "agile_email";
				 	
					// To avoid merging with emails template having date entity
					model.date = undefined;
				 	
					emails_opened.push(model);
			 	}
			 });
		 
		 validate_insertion(emails_opened);
		 }
 }

 *//**
  * Removes an element from timeline
  * 
  * @param element
  *//*
 function removeItemFromTimeline(element)
 {
 
	 try
	 {
		 var element = $('#timeline');
		 if(element.length == 0)
			 return;
		 $(element).isotope('remove', element, function()
				 {
			 		$("#timeline").isotope( 'reLayout')
				 });
	 }
	 catch(err)
	 {
		 console.log(err);
	 }
 }

*//**
 * Handles the events (click and mouseenter) of mail and log entities of 
 * tiemline 
 *//*
$(function () {
	
	 * Shows the mail details in detail on a popup modal, when '+'
	 * symbol is clicked 
	   
	$("#tl-mail-popover").live('click',function(e){
		e.preventDefault();
		
		var htmlstring = $(this).closest('div').attr("data");
		// var htmlstring = $(this).closest('div.text').html();
		// htmlstring = htmlstring.replace("icon-plus", "");

		$("#mail-in-detail").html("<div style='background:none;border:none;'>" + htmlstring + "</div>");
		
		$("#timelineMailModal").modal("show");
        
    });
	
	
	 * Shows the campaign log details on a popup modal
	  
	$("#tl-log-popover").live('click',function(e){
		e.preventDefault();
		
		var string = $(this).closest('div').attr("data");

		// Add div tag to the string to consider white spaces
		$("#log-in-detail").html("<div style='background:none;border:none;'>" + string + "</div>");
		
		$("#timelineLogModal").modal("show");
    });
	
	*//**
	 * Shows analytics popup modal with full details.
	 **//*
	$("#tl-analytics-popover").live('click',function(e){
		e.preventDefault();
		
		var string = $(this).closest('div.body').html();
		var pageViews = $(string).find('div.ellipsis-multi-line');

		$("#analytics-in-detail").html("<div'>" + $(pageViews).html() + "</div>");
		
		$("#timelineAnalyticsModal").modal("show");
	});
	
	
	 * Shows the list of mails(mail sent to) as popover, when mouse is entered on
	 * to address of the email
	   
	$("#tl-mail-to-popover").live('mouseenter',function(e){
		
		$(this).popover({
        	template:'<div class="popover"><div class="arrow"></div><div class="popover-inner" style="padding:1px;width:340px;border-radius:2px"><div class="popover-content"><p></p></div></div></div>'
        });
		
		var string = $(this).text();
		var html = new Handlebars.SafeString(string.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/,/g, ",</br>").replace("To:","To:</br>").replace("read more", ""));
		$(this).attr("data-content", html);
        $(this).popover('show');
    });
	
	// Resizes the item height and open close effect for timeline elements
	$('#timeline .item a.open-close').live("click", function(e){
		$(this).siblings('.body').slideToggle(function(){
			$('#timeline').isotope('reLayout');
		});
		$(this).parents('.post').toggleClass('closed');
		$('#expand-collapse-buttons a').removeClass('active');
		e.preventDefault();
	});
	
});*/