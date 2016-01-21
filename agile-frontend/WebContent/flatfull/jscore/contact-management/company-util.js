(function(company_util, $, undefined) {
	
	
	company_util.isCompany = function(){
		
		if(App_Companies.companyDetailView && Current_Route == "company/" + App_Companies.companyDetailView.model.get('id'))
			return true;
		if(App_Companies.companies && Current_Route == "companies")
			return true;
		if(Current_Route && Current_Route.indexOf('company')>-1)
			return true;
		
		return false;
	};
	
	company_util.updateDocumentsList = function(document, isCompany){

		// Add model to collection. Disabled sort while adding and called
		// sort explicitly, as sort is not working when it is called by add
		// function
		
		$.each(document.contacts, function(index, contact) {
			
			if (contact.id == App_Companies.companyDetailView.model.get('id'))
			{
				if (documentsView && documentsView.collection)
				{
					if(documentsView.collection.get(document.id))
					{
						documentsView.collection.get(document.id).set(new BaseModel(document));
					}
					else
					{
						documentsView.collection.add(new BaseModel(document), { sort : false });
						documentsView.collection.sort();
					}
				}
				
				return false;
			}
		});
	};
	
	company_util.updateCasesList = function(cases,isCompany){

		// Add model to collection. Disabled sort while adding and called
		// sort explicitly, as sort is not working when it is called by add
		// function
		if (casesView && casesView.collection)
		{
			if(casesView.collection.get(cases.id))
			{
				casesView.collection.get(cases.id).set(new BaseModel(cases));
			}
			else
			{
				casesView.collection.add(new BaseModel(cases), { sort : false });
				casesView.collection.sort();
			}
		}
		
		/*if(App_Companies.companyDetailView.model.get('type')=='COMPANY')
		{
			activate_timeline_tab();  // if this contact is of type COMPANY, simply activate first tab & fill details
			fill_company_related_contacts(App_Companies.companyDetailView.model.id,'company-contacts'); 
			return;
		}*/
	};
	
	company_util.updateDealsList = function(deal,isCompany){
		// Add model to collection. Disabled sort while adding and called
		// sort explicitly, as sort is not working when it is called by add
		// function
		var current = App_Companies.companyDetailView.model.toJSON();

		/*
		 * Verifies whether the added deal is related to the contact in
		 * contact detail view or not
		 */
		$.each(deal.contacts, function(index, contact) {
			
			if (contact.id == current.id) {
				
				

				if (dealsView && dealsView.collection)
				{
					if(deal.archived == true)
					{
						dealsView.collection.remove(deal.id);
						dealsView.collection.sort();
					}
					else if(dealsView.collection.get(deal.id))
					{
						dealsView.collection.get(deal.id).set(new BaseModel(deal));
					}
					else
					{
						dealsView.collection.add(new BaseModel(deal), { sort : false });
						dealsView.collection.sort();
					}
				}
				
				return false;
			}
		});
	};
	
	company_util.displayGoogleMap = function(contact){
		
		if(contact == undefined)
			contact = App_Companies.companyDetailView.model.toJSON();

			var address = JSON.parse(getPropertyValue(contact.properties, "address"));
	
			// Gets the location (latitude and longitude) from the address
			var geocoder = new google.maps.Geocoder();
	
			// Latitude and longitude were not saved to the contact (chances to update the address)
			
			if(!address.address)address.address="";
			if(!address.city)address.city="";
			if(!address.state)address.state="";
			if(!address.country)address.country="";
			if(!address.zip)address.zip="";
			
			geocoder.geocode({
				'address' : '"'+ address.city + ', '
				+ address.state + ', ' + getNormalCountryNameFromShortName(address.country) + ', ' + address.zip + '"'
			}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					console.log(results);
					displayTimeZone(results);
	
					// Displays map portion
					$("#map").css('display', 'block');
					
					var myOptions = {
						zoom : 4,
						center : results[0].geometry.location,
						mapTypeId : google.maps.MapTypeId.ROADMAP
					}
	
					var map = new google.maps.Map(document.getElementById("map"),
							myOptions);
					
					var marker = new google.maps.Marker({
						map : map,
						position : results[0].geometry.location
					});
				}
			});
	};

	/**
	 * Searches the property fields in current contact with given property name, if
	 * property with given property name exists, then returns its value in a array
	 * 
	 * <p>
	 * This method is used when contact property has multiple values like email,
	 * phone, website etc
	 * </p>
	 * 
	 * @param propertyName
	 *            name of the property
	 * @returns {Array}
	 */
	company_util.agile_crm_get_company_properties_list = function(propertyName)
	{
		// Reads current contact model form the contactDetailView
		var company_model = App_Companies.companyDetailView.model;
	
		// Gets properties list field from contact
		var properties = company_model.get('properties');
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
	
	};

	company_util.show_map = function(el){
	
		var company = App_Companies.companyDetailView.model.toJSON();
		var address = getPropertyValue(company.properties, "address");
	
		// Return, if no address is found 
		if (!address) 
			return;
		
		try
		{
			address = JSON.parse(address);
		}
		catch (err)
		{
			return;
		}
		
		
	
		// If all the address fields are empty, just return.
		if (!address.address && !address.city && !address.state
				&& !address.country)
			return;
		
		//reads the value from cookie or local store if the value is no it will return from here
		
		var map_view=_agile_get_prefs('MAP_VIEW');
		if(map_view=="disabled"){
			$("#map_view_action",el).html("<i class='icon-plus text-sm c-p' title='Show map' id='enable_map_view'></i>");
			return;
		}
			
	
		// If google map is already loaded display the map else load the
		// "google maps api"
		try {
			if (google.maps) {
				displayGoogleMap(company);
			}
		} catch (err) {
	
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.src = "https://maps.googleapis.com/maps/api/js?&sensor=false&callback=company_util.displayGoogleMap";
			document.body.appendChild(script);
		}
	
	};
	
	company_util.starify = function(el){
	    head.js(LIB_PATH + 'lib/jquery.raty.min.js', function(){
	    	
	    	var company_model  =  App_Companies.companyDetailView.model;
	    	
	    	// If contact update is not allowed then start rating does not allow user to change it
	    	if(App_Companies.companyDetailView.model.get('owner') && !canEditContact(App_Companies.companyDetailView.model.get('owner').id))
	    	{
	    			$('#star', el).raty({
	    			 'readOnly': true,
	    			  score: App_Companies.companyDetailView.model.get('star_value')
	    			 });
	    		 return;
	    	}
	    	
	    	
	    	// Set URL - is this required?
	    	// contact_model.url = 'core/api/contacts';
	    	
	    	$('#star', el).raty({
	    		
	    		/**
	    		 * When a star is clicked, the position of the star is set as star_value of
	    		 * the contact and saved.    
	    		 */
	        	click: function(score, evt) {
	        	   
	        		/*// (commented- reloading as silent:true is not effecting) 
	        		  // alert('ID: ' + $(this).attr('id') + '\nscore: ' + score + '\nevent: ' + evt);
	        		contact_model.set('star_value', score, {silent: true});
	        	
	        		// Save model
	           		contact_model.save();*/
	           		
	        		App_Companies.companyDetailView.model.set({'star_value': score}, {silent : true});
	        		company_model =  App_Companies.companyDetailView.model.toJSON();
	        		var new_model = new Backbone.Model();
	        		new_model.url = 'core/api/contacts';
	        		new_model.save(company_model, {
	        			success: function(model){
	        			}
	        		});
	
	        	},
	        	
	        	/**
	        	 * Highlights the stars based on star_value of the contact
	        	 */
	        	score: company_model.get('star_value')
	            
	        });
	    });
	    
	};

}(window.company_util = window.company_util || {}, $));

/*****Companies List view******/

(function(company_list_view, $, undefined) {
	
	/**
	 * Gets the list of custom fields saved by the user, and shown in the Html
	 * element with "view-list" in the Html element sent to this method. It fetches
	 * the list of custom fields and on rendering the collection unordered list of
	 * created and appended in view-list element in contacts page. If custom view
	 * selected from the list, this function is called with button name from the
	 * customView function, which is set on the list button.
	 * 
	 * @param cel
	 *            html element
	 * @param button_name
	 *            name of the button (name of the view)
	 */
	function setupCompanyViews(cel, button_name) {

		// Creates a view for custom views
		getTemplate("company-view-collection", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
				
			var el = $(template_ui);
			$("#view-list", cel).html(el);
			updateSelectedSortKey($("#view-list", cel));

		}, $("#view-list", cel));
			
	}
	
	var updateSelectedSortKey = function(el) {
		var sort_key = _agile_get_prefs("company_sort_field");
		if(sort_key && sort_key != null) {
			var idSuffix = '-asc';
			if(sort_key.indexOf('-') == 0) {
				sort_key = sort_key.substring(1);
				idSuffix = '-desc'
			}
			var elementId = 'comp-sort-by-'+sort_key+idSuffix;
			$(el).find('#'+elementId).addClass('bold-text');
		}
	};
	
	/**
	 * Sets up contact filters list in contacts list page, also whether cookie is
	 * save with filter name to load filter results instead of all contacts
	 * 
	 * @method setupContactFilterList
	 * @param cel
	 *            Html form element to append filters list,
	 */
	var companyFiltersListView
	var setupCompanyFilterList = function(cel, tag_id)
	{
		if (tag_id)
			$('.filter-criteria', cel)
					.html(
							'<ul id="added-tags-ul" class="tagsinput p-n m-b-sm m-t-sm m-l-sm"><li  class="inline-block tag btn btn-xs btn-primary" data="developer"><span class="m-l-xs pull-left">' + decodeURI(tag_id) + '</span><a class="close default_contact_remove_tag m-l-xs pull-left">&times</a></li></ul>').attr("_filter", tag_id);
							
		setTimeout(function(){
					
			var filter_id = null;
			companyFiltersListView = new Base_Collection_View(
				{
					url : '/core/api/filters?type=COMPANY',
					sort_collection : false,
					restKey : "ContactFilter",
					templateKey : "company-filter-list",
					individual_tag_name : 'li',
					sort_collection : false,
					no_transition_bar : true,
					postRenderCallback : function(el)
					{
						var filter_name;
						// Set saved filter name on dropdown button
						if (filter_name = _agile_get_prefs('company_filter'))
						{
							// If is not system type get the name of the filter from
							// id(from cookie)
								filter_id = filter_name;
								if(companyFiltersListView.collection.get(filter_name))
										filter_name = companyFiltersListView.collection.get(filter_name).toJSON().name;
								

							el.find('.filter-dropdown').append(filter_name);
						}

						if (!filter_name)
							return;

						$('.filter-criteria', cel)
						.html(
								'<ul id="added-tags-ul" class="tagsinput p-n m-b-sm m-t-sm m-l-sm"><li class="inline-block tag btn btn-xs btn-primary" data="developer"><span class="inline-block m-r-xs v-middle">' + filter_name + '</span><a class="close default_company_filter">&times</a></li></ul>');
						
						if(filter_id)
							$('.filter-criteria', cel).attr("_filter", filter_id);
						else
							$('.filter-criteria', cel).attr("_filter", filter_name);
							
					} });

				// Fetchs filters
				companyFiltersListView.collection.fetch();
			
				var filter_dropdown_element = companyFiltersListView.render().el;
			
				// Shows in contacts list
				$('#filter-list', cel).html(companyFiltersListView.render().el);
		}, 500);
				
	};
	
	company_list_view.revertToDefaultCompanies = function(){
		// Erase filter cookie. Erases both contact and company filter
		_agile_delete_prefs('company_filter');
		_agile_delete_prefs('dynamic_filter');
	
		if (App_Companies.companiesListView)
			App_Companies.companiesListView = undefined;
		//if (App_Contacts.contact_custom_view)
			//App_Contacts.contact_custom_view = undefined;
	
		// Loads contacts
		App_Companies.companies();
	};
	
	company_list_view.init = function(cel){
		setupCompanyFilterList(cel);
		setupCompanyViews(cel);
	};

}(window.company_list_view = window.company_list_view || {}, $));

/*****Company Details view******/

(function(company_detail_tab, $, undefined) {
	
	company_detail_tab.activateCurrentTab = function(ele){
		$('#contact-tab-content .tab-pane').removeClass('active');
		ele.addClass('active');
	};
	
	/**
	 * Changes, owner of the contact, when an option of change owner drop down
	 * is selected.   
	 */
	company_detail_tab.changeOwner = function(that){
		
		// Reads the owner id from the selected option
		var new_owner_id = that.attr('data');
		var new_owner_name = that.text();
		var current_owner_id = $('#contact-owner').attr('data');
		
		// Returns, if same owner is selected again 
		if(new_owner_id == current_owner_id)
			{
			  // Showing updated owner
			  show_owner();
			  return;
			}
		
		  var contactModel = new BaseModel();
		    contactModel.url = '/core/api/contacts/change-owner/' + new_owner_id + "/" + App_Companies.companyDetailView.model.get('id');
		    contactModel.save(App_Companies.companyDetailView.model.toJSON(), {success: function(model){

		    	// Replaces old owner details with changed one
				$('#contact-owner').text(new_owner_name);
				$('#contact-owner').attr('data', new_owner_id);
				
				// Showing updated owner
				show_owner(); 
				App_Companies.companyDetailView.model = model;
				
		    }});
   	};
	
	// Deletes a contact from database
	company_detail_tab.deleteCurrentCompany = function(){
		
		if(!confirm("Do you want to delete the company?"))
    		return;
		
		App_Companies.companyDetailView.model.url = "core/api/contacts/" + App_Companies.companyDetailView.model.id;
		App_Companies.companyDetailView.model.destroy({success: function(model, response) {
			  Backbone.history.navigate("companies",{trigger: true});
		}});
	};
	
	
	company_detail_tab.addTagsToCompany = function(){
		 // Add Tags
		var new_tags = get_new_tags('companyAddTags');
		if(new_tags)new_tags=new_tags.trim();
		
		if(!new_tags || new_tags.length<=0 || (/^\s*$/).test(new_tags))
		{
			console.log(new_tags);
			return;
		}
		if (!isValidTag(new_tags, true)) {
			return;
		}
		$('#add-tags').css("display", "block");
		$("#addTagsForm").css("display", "none");
		console.log(new_tags);
		
		if(new_tags) {
			var json = App_Companies.companyDetailView.model.toJSON();
	    		
	    	
	    	// Reset form
	    	$('#addTagsForm input').each (function(){
   		  	  	$(this).val("");
   		  	});
	    	
	    	// Checks if tag already exists in contact
			if($.inArray(new_tags, json.tags) >= 0)
				return;
			//Check tag acl before adding tag.
			acl_util.canAddTag(new_tags.toString(),function(respnse){
		    	json.tagsWithTime.push({"tag" : new_tags.toString()});
	   			
		    	// Save the contact with added tags
		    	var contact = new Backbone.Model();
		        contact.url = 'core/api/contacts';
		        contact.save(json,{
		       		success: function(data){
		       			
		       			addTagToTimelineDynamically(new_tags, data.get("tagsWithTime"));
		       			
		       			// Get all existing tags of the contact to compare with the added tags
		       			var old_tags = [];
		       			$.each($('#added-tags-ul').children(), function(index, element){
		       				old_tags.push($(element).attr('data'));
	       				});
		       			
		       			// Updates to both model and collection
		       			App_Companies.companyDetailView.model.set(data.toJSON(), {silent : true});
		       			
		       			// Append to the list, when no match is found 
		       			if ($.inArray(new_tags, old_tags) == -1) 
		       				$('#added-tags-ul').append('<li  class="tag inline-block btn btn-xs btn-default m-r-xs" style="color:#363f44" data="' + new_tags + '"><span><a class="anchor m-r-xs custom-color" style="color:#363f44" href="#tags/'+ new_tags + '" >'+ new_tags + '</a><a class="close remove-company-tags" id="' + new_tags + '" tag="'+new_tags+'">&times</a></span></li>');
		       			
		       			console.log(new_tags);
		       			// Adds the added tags (if new) to tags collection
		       			tagsCollection.add(new BaseModel({"tag" : new_tags}));
		       		}
		        });
			});
		}
	};
	
	company_detail_tab.load_company_deals = function ()
	{
		id = App_Companies.companyDetailView.model.id;
		dealsView = new Base_Collection_View({
			url: 'core/api/contacts/'+ id + "/deals" ,
            restKey: "opportunity",
            templateKey: "deals",
            individual_tag_name: 'li',
            sortKey:"created_time",
            descending: true,
            postRenderCallback: function(el) {
            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
            		 $(".deal-created-time", el).timeago();
            	})
            }
        });
        dealsView.collection.fetch();
        $('#deals', App_Companies.companyDetailView.el).html(dealsView.el);
        company_detail_tab.activateCurrentTab($('#deals'));
        
	};
	company_detail_tab.load_company_cases = function()
	{
		id = App_Companies.companyDetailView.model.id;
		casesView = new Base_Collection_View({
			url: 'core/api/contacts/'+ id + "/cases" ,
            restKey: "cases",
            templateKey: "cases-contact",
            individual_tag_name: 'li',
            sortKey:"created_time",
            descending: true,
            postRenderCallback: function(el) {
            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
            		 $(".deal-created-time", el).timeago();
            	})
            }
        });
		casesView.collection.fetch();
        $('#cases', App_Companies.companyDetailView.el).html(casesView.el);
        company_detail_tab.activateCurrentTab($('#cases'));
	};
	
	company_detail_tab.load_company_notes = function()
	{
	    var id = App_Companies.companyDetailView.model.id;
	    notesView = new Base_Collection_View({
            url: '/core/api/contacts/' + id + "/notes",
            restKey: "note",
            templateKey: "notes",
            individual_tag_name: 'li',
            sortKey:"created_time",
            descending: true,
            postRenderCallback: function(el) {
            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
            		 $(".note-created-time", el).timeago();
              	})
            }
        });
        notesView.collection.fetch();
        $('#notes', App_Companies.companyDetailView.el).html(notesView.el);
        company_detail_tab.activateCurrentTab($('#notes'));
	};
	
	company_detail_tab.load_company_documents = function()
	{
		 id = App_Companies.companyDetailView.model.id;
		 documentsView = new Base_Collection_View({
	            url: '/core/api/documents/contact/' + id + "/docs",
	            restKey: "document",
	            templateKey: "contact-documents",
	            individual_tag_name: 'li',
	            sortKey:"uploaded_time",
	            descending: true,
	            postRenderCallback: function(el) {
	            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
	            		 $(".document-created-time", el).timeago();
	              	});
	            
	            }
	        });
		    documentsView.collection.fetch();
	        $('#documents', App_Companies.companyDetailView.el).html(documentsView.el);
	        company_detail_tab.activateCurrentTab($('#documents'));
	};
	

}(window.company_detail_tab = window.company_detail_tab || {}, $));
