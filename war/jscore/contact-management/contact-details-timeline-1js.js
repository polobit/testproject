var noAnimationBruteForce = true; 
var timeline_view = Backbone.View
.extend({
	initialize : function()
	{
		// Binds functions to view
		_.bindAll(this, 'render', 'appendItem', 'addItems');
		
		this.options.data = App_Contacts.contactDetailView.model.toJSON().tagsWithTime;
		this.options.data.push(App_Contacts.contactDetailView.model.toJSON());
		this.options.data.push(App_Contacts.contactDetailView.model.toJSON().tagsWithTime);
		
		this.collection = new BaseCollection([], {});
		configure_timeline_comparator(this.collection);
		this.collection.add(this.options.data, {silent : true});
		load_other_timline_entities();
		this.queue = new Queue;
		this.collection.bind('add', this.appendItem);
		
	},
	appendItem : function(model)
	{
		this.collection.add(model, {silent: true});
		var elements = getTemplate("timeline", model);
		$('#timeline').isotope("addItems", elements);
	},
	addItems : function(models)
	{
		//this.collection.add(models, {silent: true});
		//	$("#timeline").append(getTemplate("timeline1", models));
		//	$("#timeline").append($(getTemplate("timeline1", models)));
		
		getTemplate("timeline1", models, undefined, function(result){
			$("#timeline").isotope('insert', $(result));	
		})
		
			
	},
	render: function() {
		remove_loading_img(App_Contacts.contactDetailView.el)
		
		configure_timeline();
		
		if(this.collection.length < 0)
		{
			var i = 0;
			var length = this.collection.length;
			while(i < length)	
			{
				
				var end = i + 20;
				
				end = end > length ? length - 1 : end;
				if(end == i)
					break;
				console.log(end + ", " + i);
				var _this = this;
				//console.log(getTemplate("timeline1", this.collection.toJSON()));
				getTemplate("timeline1", this.collection.toJSON().slice(i, end), undefined, function(result){
					alert("callback");
					if(i == 0)
					{
						//var _this = this;
						
						
						
						$("#timeline").isotope('insert', $(result));
					}
					else
						
					{
						alert("else");
							//$("#timeline").append($newEls).isotope( 'appended', $newEls);
							$("#timeline").isotope('insert', $(result));
					}
						
						
					
		/*			_this.queue.add_function(function(models){
						//alert(models);
			//			return true;
					}, _this.collection.toJSON().slice(i, end))*/
				
					
				});
				i += 20;
			}
		}
		
		getTemplate("timeline1", this.collection.toJSON(), undefined, function(result){
			$("#timeline").isotope('insert', $(result));
		});
		
	//	if(!noAnimationBruteForce)
		
		//	configure_timeline();
			
	//		$("#timeline").isotope('insert', $(getTemplate("timeline1", this.collection.toJSON())));
			create_month_marker(MONTH_YEARS, true, App_Contacts.contactDetailView.model.el);
		//$("#timeline").isotope('reLayout');

		// Resizes the line height based on entities overall height
	/*	$('#timeline').resize(function(){
			adjust_line();
			alert("test");
		});*/
	}
});



function load_timeline_details1(el, contactId, callback1, noAnimation)
{
	noAnimationBruteForce = true;
	init_timeline();
	
}

var timeline_collection_view
var MONTH_YEARS;
var month_years = [];
function init_timeline()
{
	MONTH_YEARS = [];
	// Load plugins for timeline	
	head.js("/lib/isotope.pkgd.js", LIB_PATH + "lib/jquery.event.resize.js", function(){
		//configure_timeline();
		timeline_collection_view = new timeline_view();
		timeline_collection_view.render();
	});

}

function configure_timeline_comparator(collection)
{
	
	//Override comparator to sort models on time base
	collection.comparator = function(item){
		var month_year = entity_created_month_year(item.toJSON());
		
		if (month_years.indexOf(month_year) < 0 && MONTH_YEARS.indexOf(month_year) < 0){
			month_years[month_years.length] = month_year;
			MONTH_YEARS[MONTH_YEARS.length] = month_year;
		}	
		
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
}

function configure_timeline()
{
	customize_isotope();
	
	var $container = $("#timeline", App_Contacts.contactDetailView.el);
	
	// Initializes isotope with options (sorts the data based on created time)
	$container.imagesLoaded(function(){
		$container.isotope({
			itemSelector : ".item",
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
}

function load_other_timline_entities()
{
	var contact = App_Contacts.contactDetailView.model.toJSON();
	var contactId = contact['id'];
	/* Stores all urls (notes, deals and tasks) in an array to fetch data using
	 * same collection by changing its url.
	 */ 
	
	var email = getPropertyValue(contact.properties, "email");
	
	var fetchContactDetails = ['core/api/contacts/' + contactId + '/notes', 
	                           'core/api/contacts/'+ contactId + '/deals',
	                           'core/api/contacts/'+ contactId + '/cases', //Added to also fetch cases
	                           'core/api/contacts/'+ contactId + '/tasks',
	                           '/core/api/campaigns/logs/contact/' + contactId];	
	
	
	// Go for mails when only the contact has an email
	if(email) {
		fetchContactDetails.push('core/api/emails/imap-email?e=' + encodeURIComponent(email) + '&c=10&o=0');
		
		get_stats(email, contact, App_Contacts.contactDetailView.el, function(stats){
			if(stats && stats.length > 0)
				timeline_collection_view.addItems(stats);
		})
	}
	
	$.each(fetchContactDetails, function(index, url)
	{
		$.getJSON(url, function(data){
			if(data && data.length > 0)
				timeline_collection_view.addItems(data);
		});
	})

}

function getTimlineTemplate(models)
{
	
}

