var LeadDetails = (function(){

	function LeadDetails() {};

	LeadDetails.prototype.loadLeadTabs = function(el, leadJSON)
	{
		timeline_collection_view = null;
		var position = _agile_get_prefs("lead_tab_position");
		if (!position)
		{
			position = "time-line";
		}

		if(agile_is_mobile_browser())
		{
			return;
		}

		$('#contactDetailsTab a[href="#leads-'+position+'"]', el).tab('show');
		$(".tab-content", el).find("#"+position+"").addClass("active");

		switch(position)
		{
			case "time-line" :
			{
				this.loadTimeline();
				break;
			}
			case "notes" :
			{
				this.loadNotes();
				break;
			}
			case "events" :
			{
				this.loadEvents();
				break;
			}
			case "tasks" :
			{
				this.loadTasks();
				break;
			}
			case "deals" :
			{
				this.loadDeals();
				break;
			}
		}

	}

	LeadDetails.prototype.loadTimeline = function()
	{
	    $('div.tab-content', App_Leads.leadDetailView.el).find('div.active').removeClass('active');	
		$('#time-line', App_Leads.leadDetailView.el).addClass('active');
		if($("#timeline", App_Leads.leadDetailView.el).hasClass('isotope'))
		{
			$("#timeline", App_Leads.leadDetailView.el).isotope( 'reLayout', function(){} )
			return;
		}
		noAnimationBruteForce = true;
		timeline_entity_loader.init(App_Leads.leadDetailView.model.toJSON(), App_Leads.leadDetailView.el);

		var ele = $('#time-line', App_Leads.leadDetailView.el);
        this.activateLeadTab(ele);
	}

	LeadDetails.prototype.loadNotes = function()
	{
	    var id = App_Leads.leadDetailView.model.id;
	    notesView = new Base_Collection_View({
            url: '/core/api/contacts/' + id + "/notes",
            restKey: "note",
            templateKey: "notes",
            individual_tag_name: 'li',
            sortKey:"created_time",
            descending: true,
            postRenderCallback: function(el) {
            	agileTimeAgoWithLngConversion($(".note-created-time", el));
            	
              	contact_detail_page_infi_scroll($('#contact-dtl', App_Leads.leadDetailView.el), notesView);
            },
            appendItemCallback : function(el) {
				includeTimeAgo(el);
			}
        });
        notesView.collection.fetch();
        var ele = $('#notes', App_Leads.leadDetailView.el);
        $(ele).html(notesView.el);
        this.activateLeadTab(ele);
	}

	LeadDetails.prototype.loadEvents = function()
	{
		var id = App_Leads.leadDetailView.model.id;
		eventsView = new Base_Collection_View({
            url: '/core/api/contacts/' + id + "/events",
            restKey: "event",
            templateKey: "contact-events",
            individual_tag_name: 'li',
            sortKey:"created_time",
            descending: true,
            postRenderCallback: function(el) {
            	agileTimeAgoWithLngConversion($(".event-created-time", el));
            	
            	$('li',el).each(function(){
            	if($(this).find('.priority_type').text().trim() == "High") {
        			$(this).css("border-left","3px solid #f05050");
        		}else if($(this).find('.priority_type').text().trim() == "Normal"){
        			$(this).css("border-left","3px solid #7266ba");
        		}else if($(this).find('.priority_type').text().trim() == "Low") {
        			$(this).css("border-left","3px solid #fad733");
        		}
            	});
            }
        });
		eventsView.collection.fetch();
		var ele = $('#events', App_Leads.leadDetailView.el);
        $(ele).html(eventsView.el);
        this.activateLeadTab(ele);
	}

	LeadDetails.prototype.loadTasks = function()
	{
		var id = App_Leads.leadDetailView.model.id;
		tasksView = new Base_Collection_View({
            url: '/core/api/contacts/' + id + "/tasks",
            restKey: "task",
            templateKey: "contact-tasks",
            individual_tag_name: 'li',
            sortKey:"created_time",
            descending: true,
            postRenderCallback: function(el) {
            	agileTimeAgoWithLngConversion($(".task-created-time", el));
            	
            	$('li',el).each(function(){
            		if($(this).find('.priority_type').text().trim()== "HIGH") {
            			$(this).css("border-left","3px solid #f05050");
            		}else if($(this).find('.priority_type').text().trim() == "NORMAL"){
            			$(this).css("border-left","3px solid #7266ba");
            		}else if($(this).find('.priority_type').text().trim() == "LOW") {
            			$(this).css("border-left","3px solid #fad733");
            		}
            	});
            }
            
        });
		tasksView.collection.fetch();
		var ele = $('#tasks', App_Leads.leadDetailView.el);
        $(ele).html(tasksView.el);
        this.activateLeadTab(ele);
	}

	LeadDetails.prototype.loadDeals = function ()
	{
		var id = App_Leads.leadDetailView.model.id;
		dealsView = new Base_Collection_View({
			url: 'core/api/contacts/'+ id + "/deals" ,
            restKey: "opportunity",
            templateKey: "deals",
            individual_tag_name: 'li',
            sortKey:"created_time",
            descending: true,
            postRenderCallback: function(el) {
            	agileTimeAgoWithLngConversion($(".deal-created-time", el));
            	$(el).find('ul li').each(function(){
			    	$(this).addClass("deal-color");
			    	$(this).addClass($(this).find("input").attr("class"));
		        });
            }
        });
        dealsView.collection.fetch();
        var ele = $('#deals', App_Leads.leadDetailView.el);
        $(ele).html(dealsView.el);
        this.activateLeadTab(ele);
	}

	LeadDetails.prototype.saveLeadTabPosition = function (tab_href)
	{
		var position = _agile_get_prefs("lead_tab_position");

		if (position == tab_href)
			return;

		_agile_set_prefs("lead_tab_position", tab_href);
	}

	LeadDetails.prototype.activateLeadTab = function(ele)
	{
		$('#contact-tab-content .tab-pane').removeClass('active');
		$(ele).addClass('active');
	}

	LeadDetails.prototype.getLeadPropertiesList = function(propertyName)
	{
		// Reads current contact model form the contactDetailView
		var lead_model = App_Leads.leadDetailView.model;

		// Gets properties list field from contact
		var properties = lead_model.get('properties');
		var property_list = [];

		/*
		 * Iterates through each property in contact properties and checks for the
		 * match in it for the given property name and retrieves value of the
		 * property if it matches
		 */
		$.each(properties, function(index, property)
		{
			if (property.name == propertyName)
			{
				property_list.push(property);
			}
		});

		// If property is defined then return property value list
		return property_list;

	}

	/**
	 * Loads, minified jquery.raty plug-in to show stars to rate a contact in its  
	 * detail view and highlights the (no.of) stars based on star_value of the contact.
	 * 
	 * @method starify 
	 * @param {Object} el
	 * 			html object of contact detail view
	 */
	LeadDetails.prototype.starify = function(el) 
	{
	    head.js(LIB_PATH + 'lib/jquery.raty.min.js', function(){
	    	
	    	var lead_model  =  App_Leads.leadDetailView.model;
	    	
	    	// If contact update is not allowed then start rating does not allow user to change it
	    	if(App_Leads.leadDetailView.model.get('owner') && !canEditContact(App_Leads.leadDetailView.model.get('owner').id))
	    	{
	    			$('#star', el).raty({
	    				'readOnly': true,
	    				score: App_Leads.leadDetailView.model.get('star_value')
	    			});
	    		 return;
	    	}
	    	
	    	// Set URL - is this required?
	    	$('#star', el).raty({
	    		/**
	    		 * When a star is clicked, the position of the star is set as star_value of
	    		 * the contact and saved.    
	    		 */
	        	click: function(score, evt) {
	        		App_Leads.leadDetailView.model.set({'star_value': score}, {silent : true});
	        		lead_model =  App_Leads.leadDetailView.model.toJSON();
	        		var new_model = new Backbone.Model();
	        		new_model.url = 'core/api/contacts';
	        		new_model.save(lead_model, {
	        			success: function(model){
	        			}
	        		});

	        	},
	        	
	        	/**
	        	 * Highlights the stars based on star_value of the contact
	        	 */
	        	score: lead_model.get('star_value')
	            
	        });
	    });
	    
	}

	/**
	 * Loads the "google map API" by appending the url as script to html document
	 * body and displays the map (using callback of url) based on the address of the
	 * lead. If the google map is already loaded, just displays the map.
	 * 
	 * Geocoder is used to get the latitude and longitude of the given address
	 * 
	 * @method show_map
	 * @param {object}
	 *            el html object of the lead detail view
	 * @param {Object}
	 *            lead going to be shown in detail
	 */
	LeadDetails.prototype.show_map = function(el) 
	{
		var lead = App_Leads.leadDetailView.model.toJSON();
		var address = getPropertyValue(lead.properties, "address");

		// Return, if no address is found 
		if (!address) 
			return;
		
		try
		{
			address = JSON.parse(address);
			if(!address)
				return;
		}
		catch (err)
		{
			return;
		}

		// If all the address fields are empty, just return.
		if (!address.address && !address.city && !address.state && !address.country)
			return;
		
		//reads the value from cookie or local store if the value is no it will return from here
		var map_view=_agile_get_prefs('LEADS_MAP_VIEW');
		if(map_view == "disabled"){
			$("#map_view_action").html("<i class='icon-plus text-sm c-p' title='"+_agile_get_translated_val('contact-details','show-map')+"' id='enable_map_view'></i>");
			return;
		}

		// If google map is already loaded display the map else load the
		// "google maps api"
		try {
			if (google.maps) {
				display_google_map();
			}
		} catch (err) {

			load_gmap_script();
		}
	}

	return LeadDetails;

})();