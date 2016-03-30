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
						$("#"+deal.id).closest("li").removeAttr("class");
						$("#"+deal.id).closest("li").addClass("deal-color");
						$("#"+deal.id).closest("li").addClass(deal.colorName);

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
								

							el.find('.filter-dropdown').append(Handlebars.compile('{{name}}')({name : filter_name}));
						}

						if (!filter_name)
							return;

						var template = Handlebars.compile('<ul id="added-tags-ul" class="tagsinput p-n m-b-sm m-t-sm m-l-sm"><li class="inline-block tag btn btn-xs btn-primary" data="developer"><span class="inline-block m-r-xs v-middle">{{name}}</span><a class="close default_company_filter">&times</a></li></ul>');

					 	// Adds contact name to tags ul as li element
						$('.filter-criteria', cel).html(template({name : filter_name}));
						
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
		       			if ($.inArray(new_tags, old_tags) == -1) {

		       				var template = Handlebars.compile('<li  class="tag inline-block btn btn-xs btn-default m-r-xs" style="color:#363f44" data="{{name}}"><span><a class="anchor m-r-xs custom-color" style="color:#363f44" href="#tags/{{name}}" >{{name}}</a><a class="close remove-company-tags" id="{{name}}" tag="{{name}}">&times</a></span></li>');

						 	// Adds contact name to tags ul as li element
							$('#added-tags-ul').append(template({name : new_tags}));

		       			}
		       			
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
            		$(el).find('ul li').each(function(){
				    $(this).addClass("deal-color");
				    $(this).addClass($(this).find("input").attr("class"));
			        });
            	})
            }
        });
        dealsView.collection.fetch();
        $('#company-deals', App_Companies.companyDetailView.el).html(dealsView.el);
        company_detail_tab.activateCurrentTab($('#company-deals'));
        
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
        $('#company-cases', App_Companies.companyDetailView.el).html(casesView.el);
        company_detail_tab.activateCurrentTab($('#company-cases'));
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
        $('#company-notes', App_Companies.companyDetailView.el).html(notesView.render().el);
        company_detail_tab.activateCurrentTab($('#company-notes'));
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
	        $('#company-documents', App_Companies.companyDetailView.el).html(documentsView.render().el);
	        company_detail_tab.activateCurrentTab($('#company-documents'));
	};

	company_detail_tab.load_company_events = function()
		{
			id = App_Companies.companyDetailView.model.id;
			eventsView = new Base_Collection_View({
	            url: '/core/api/contacts/' + id + "/events",
	            restKey: "event",
	            templateKey: "contact-events",
	            individual_tag_name: 'li',
	            sortKey:"created_time",
	            descending: true,
	            postRenderCallback: function(el) {
	            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
	            		 $(".event-created-time", el).timeago();
	              	});
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
	        $('#company-events', App_Companies.companyDetailView.el).html(eventsView.render().el);
	        company_detail_tab.activateCurrentTab($('#company-events'));
		};

		company_detail_tab.load_company_tasks = function()
		{
			   id = App_Companies.companyDetailView.model.id;
				tasksView = new Base_Collection_View({
		            url: '/core/api/contacts/' + id + "/tasks",
		            restKey: "task",
		            templateKey: "contact-tasks",
		            individual_tag_name: 'li',
		            sortKey:"created_time",
		            descending: true,
		            postRenderCallback: function(el) {
		            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
		            		 $(".task-created-time", el).timeago();
		              	});
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
		        $('#company-tasks', App_Companies.companyDetailView.el).html(tasksView.render().el);
	        company_detail_tab.activateCurrentTab($('#company-tasks'));
		};
        
        company_detail_tab.load_company_mail = function(mail_server_url,email_server)
		{	
			killAllPreviousRequests();
			$('#company-mail #company-mails-span', App_Companies.companyDetailView.el).remove();
			$('#company-mails', App_Companies.companyDetailView.el).html("");
			if(typeof mailsView !== 'undefined')
			{
				mailsView.render = null;
				mailsView.collection = null;
			}
			var contact = App_Companies.companyDetailView.model;
			var json = contact.toJSON();
			// Get email of the contact in contact detail
			var email = getAllPropertyValuesByName(json.properties, "email", ",");			
			// Shows an error alert, when there is no email to the contact
			if (!email)
			{
				show_no_email_alert();
				return;
			}
			var company_detail_tab_scope = this;
			var has_email_configured = true;
			var has_shared_email_configured = true;			
			if(email_server && mail_server_url)
			{
				if($('#has_email_configured', App_Companies.companyDetailView.el).html() === 'true')
					has_email_configured = true;
				else
					has_email_configured = false;
				if(email_server !== 'all')
					company_fetchMails(company_detail_tab_scope,has_email_configured,mail_server_url,email_server,email);
				else
				{
					var email_accounts_model = mailAccountsView_company.model.toJSON();
					fetchAllMails(company_detail_tab_scope,has_email_configured,email_accounts_model,email);
				}
			}
			else
			{
				loadMailTabView_company(company_detail_tab_scope,email_server,mail_server_url,email);
			}		
		};
        
	/**
 * This method responsible for building mail tab UI in contact-details page.
 * First it loads configured email accounts and then loads emails from selected
 * email account. It has an option of showing all emails in one shot also.
 */
function loadMailTabView_company(company_detail_tab_scope,email_server,mail_server_url,email)
{
	var has_email_configured = true;
	var has_shared_email_configured = true;
	var model = "";
	var email_dropdown_html = "";
	var from_email = "";
    mailAccountsView_company = new Base_Model_View({ url : 'core/api/emails/synced-accounts', template : "email-account-types",change:false,
		postRenderCallback : function(el)
		{	
			model = mailAccountsView_company.model.toJSON();
			if(model.hasEmailAccountsConfigured)
				has_email_configured = true;
			else
				has_email_configured = false;
			if(model.hasSharedEmailAccounts)
				has_shared_email_configured = true;
			else
				has_shared_email_configured = false;
			//Reading cookie info, fetches mail server type and email from cookie 
			var cookie_info = fetch_mailserverurl_from_cookie(model);
			if(cookie_info && cookie_info.length == 4)
			{
				mail_server_url = cookie_info[0];
				email_dropdown_html = cookie_info[1];
				email_server = cookie_info[2];
				from_email = cookie_info[3];
				if(from_email)
					email_server_type = from_email;
			}
			//By default loads mails from Agile server
			if(!email_server || !mail_server_url || !from_email || (!has_email_configured && !has_shared_email_configured))
			{
				email_server = "agile";
				email_dropdown_html = '<i class="icon-cloud" style="margin-right:4px;font-size: 1.2em"></i>'+'Agile';
				email_server_type = "agilecrm";
			}
			//Fetching emails from All registered email accounts
			if(email_server ==='all' || mail_server_url === 'all')
				fetchAllMails(company_detail_tab_scope,has_email_configured,model,email)
			else
				company_fetchMails(company_detail_tab_scope,has_email_configured,mail_server_url,email_server,email);
			if(has_email_configured || has_shared_email_configured)
			{
				if(email_dropdown_html)
					$('#email-type-select',App_Companies.companyDetailView.el).html(email_dropdown_html);	 
				$('#company-mail-account-types', App_Companies.companyDetailView.el).css('display','block');
			} 						
		}
	});
	$('#company-mail-account-types', App_Companies.companyDetailView.el).html(mailAccountsView_company.render().el);	 
}

/**
 * This function is used to get mails from specified server and email, 
 * if server or email is not specified then it fetches 
 * mails sent through Agile.
 */
function company_fetchMails(company_detail_tab_scope,has_email_configured,mail_server_url,email_server,email)
{	
	$('#company-mail', App_Companies.companyDetailView.el).append('<span id="company-mails-span"> <img class="mails-loading p-r-xs m-b m-l-sm pull-left"  src= "'+updateImageS3Path("/img/ajax-loader-cursor.gif")+'"></img></span>');
	this.configured_sync_email = "";
	var cursor = true;

	// By default showing Agile emails
	if(email_server === 'agile')
	{
		mail_server_url = 'core/api/emails/agile-cemails?search_email='+encodeURIComponent(email);
		email_server_type = "agilecrm";
		cursor = false;
	}
	else
		mail_server_url = mail_server_url + '&search_email='+encodeURIComponent(email);

	// Fetches mails collection
	mailsView = new Base_Collection_View({ url : mail_server_url , cursor : cursor, page_size : 10,
	templateKey : "email-social", sort_collection : true, sortKey : "date_secs", descending : true, individual_tag_name : "li",
	postRenderCallback : function(el)
	{
		$('#company-mail', App_Companies.companyDetailView.el).find("#no-email").css('display','block');
		head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
		{
			$(".email-sent-time", el).each(function(index, element)
			{
				$(element).timeago();
			});
		});
		
		if(email_server_type!="agilecrm")
			company_detail_tab_scope.configured_sync_email = email_server_type;
	
		if(!has_email_configured)
			$('#email-prefs-verification',App_Companies.companyDetailView.el).css('display', 'block');
		contact_detail_page_infi_scroll($('#contact-dtl', App_Companies.companyDetailView.el), mailsView);
		$('#company-mail #company-mails-span', App_Companies.companyDetailView.el).remove();
	}});
	mailsView.collection.fetch();
	$('#company-mails', App_Companies.companyDetailView.el).html(mailsView.render().el);
}

function fetchAllMails(company_detail_tab_scope,has_email_configured,email_accounts_model,email)
{	
	var all_emails = [];
	var fetch_urls = email_accounts_model['fetchUrls'];
	$('#contact-dtl', App_Companies.companyDetailView.el).unbind("scroll");
	loadAllMailsView(company_detail_tab_scope,has_email_configured,all_emails);
    fetchMailsFromAllAccounts(company_detail_tab_scope,has_email_configured,fetch_urls,email);
}

/**
 * 
 * This function is used to fetch mails from all configured email
 * accounts. It calls emails servers in asynchronous fashion.
 * After getting response from each server call, view automatically
 * gets sorted and rendered with new items
 
 * @param contact_details_tab_scope
 * @param has_email_configured
 * @param fetch_urls
 * @param email
 */
function fetchMailsFromAllAccounts(company_detail_tab_scope,has_email_configured,fetch_urls,email)
{
	var response_count = 0;
	if(fetch_urls)
	{
		if(fetch_urls.length > 0)
		{
			$('#company-mail-account-types', App_Companies.companyDetailView.el).prepend('<span id="company-mails-span"> <img class="all-mails-loading p-r-xs m-b m-l-sm pull-left"  src= "'+updateImageS3Path("/img/ajax-loader-cursor.gif")+'"></img></span>');
			$('#company-mail-account-types', App_Companies.companyDetailView.el).find('.all-mails-loading').css("display","block");
		}
		for(var i=0;i<fetch_urls.length;i++)
		{
			var xhr = $.ajax({ url : fetch_urls[i]+'&search_email='+encodeURIComponent(email),
				success : function(emails)
				{	
					response_count++;
					if(emails)
					{	if(ifNoError(emails[0]))
						{
							if(!mailsView)
							{				
								setTimeout(function(){
									mailsView.collection.add(emails);
									mailsView.render(true);
									showTransitionBar();
								},5000);
							}
							else
							{
								mailsView.collection.add(emails);
								mailsView.render(true);				
							}
						}
						if(response_count === fetch_urls.length)
						{
							showMailsInfoMessages();
						}
				    }
				},
			    error : function(response)
			    {
			    	response_count++;
			    	if(response_count === fetch_urls.length)
			    	{
			    		showMailsInfoMessages(response);
			    	}
			    }
			});
			email_requests.push(xhr);
		}
	}
}
/**
 * /**
 * This function is responsible for building mailsView.
 * Mails view consists mails fetched from emails servers.
 
 * @param contact_details_tab_scope
 * @param has_email_configured
 * @param fetched_emails
 * 
 */
function loadAllMailsView(company_detail_tab_scope,has_email_configured,fetched_emails)
{
	if(typeof mailsView !== 'undefined')
	{
		mailsView.render = null;
		mailsView = null;
	}
	this.configured_sync_email = "";
	mailsView = new Base_Collection_View({data : fetched_emails,
	templateKey : "email-social", sort_collection : true, sortKey : "date_secs", descending : true, individual_tag_name : "li",
	postRenderCallback : function(el)
	{
		head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
		{
			$(".email-sent-time", el).each(function(index, element)
			{
				$(element).timeago();
			});
		});
		
		if(email_server_type!="agilecrm")
			company_detail_tab_scope.configured_sync_email = email_server_type;
	
		if(!has_email_configured)
			$('#email-prefs-verification',App_Companies.companyDetailView.el).css('display', 'block');
		//$('#mail #mails-span', App_Contacts.contactDetailView.el).remove();
	}});
	$('#company-mails', App_Companies.companyDetailView.el).html(mailsView.render(true).el);
}

/**
 * This method is used read email_type_select cookie , parses cookie value
 * and evalutes if cookie informations has vaild now or not.
 * This cookie stores information about selected mail type and mail under mail tab.
 * @param model
 * @returns {Array}
 */
function fetch_mailserverurl_from_cookie(model)
{
	var cookie_value = _agile_get_prefs(email_server_type_cookie_name);
	var final_url = "";
	var cookie_info = [];
	if(cookie_value)
	{
		var values = cookie_value.split("|");
		if(values)
		{
			if(values.length === 2)
			{
				var email = values[0];
				var email_server = values[1];
				var html = "";
				var shared = false;
				if(email && email_server)
				{
					if(email_server.toLowerCase()==='all')
					{
						cookie_info[0] = 'all'
						cookie_info[1] = 'All Mail';
						cookie_info[2] = 'all';
						cookie_info[3] = 'all';
					}
					else if(email_server.toLowerCase()==='google')
					{
						var hasGmail = false;
						if(typeof model.gmailUserNames !== 'undefined' && model.hasOwnProperty('gmailUserNames'))
						{
							for(var i=0;i<model.gmailUserNames.length;i++)
							{
								if(model.gmailUserNames[i] === email)
								{
									hasGmail = true;
									break;
								}
							}
						}
						if(typeof model.sharedGmailUserNames !== 'undefined' && model.hasOwnProperty('sharedGmailUserNames'))
						{
							for(var i=0;i<model.sharedGmailUserNames.length;i++)
							{
								if(model.sharedGmailUserNames[i] === email)
								{
									hasGmail = true;
									shared = true;
									break;
								}
							}
						}
						if(hasGmail)
						{
							final_url = 'core/api/social-prefs/google-emails?from_email='+email;
							html = '<i class="icon-google-plus" style="margin-right:4px;font-size: 1.2em"></i>'+email;
							if(shared)
								html = html+ ' (Shared)';
						}
					}
					else if(email_server.toLowerCase()==='imap')
					{
						var hasImap = false;
						if(typeof model.imapUserNames !== 'undefined' && model.hasOwnProperty('imapUserNames'))
						{
							for(var i=0;i<model.imapUserNames.length;i++)
							{
								if(model.imapUserNames[i] === email)
								{
									hasImap = true;
									break;
								}
							}
						}
						if(typeof model.sharedImapUserNames !== 'undefined' && model.hasOwnProperty('sharedImapUserNames'))
						{
							for(var i=0;i<model.sharedImapUserNames.length;i++)
							{
								if(model.sharedImapUserNames[i] === email)
								{
									hasImap = true;
									shared = true;
									break;
								}
							}
						}
						if(hasImap)
						{
							final_url = 'core/api/imap/imap-emails?from_email='+email;
							html = '<i class="icon-envelope-alt" style="margin-right:4px;font-size: 1.2em"></i>'+email;
							if(shared)
								html = html+ ' (Shared)';
						}
					}
					else if(email_server.toLowerCase()==='exchange')
					{
						var hasExchange = false;
						if(typeof model.exchangeUserNames !== 'undefined' && model.hasOwnProperty('exchangeUserNames'))
						{
							for(var i=0;i<model.exchangeUserNames.length;i++)
							{
								if(model.exchangeUserNames[i] === email)
								{
									hasExchange = true;
									break;
								}
							}
						}
						if(typeof model.sharedExchangeUserNames !== 'undefined' && model.hasOwnProperty('sharedExchangeUserNames'))
						{
							for(var i=0;i<model.sharedExchangeUserNames.length;i++)
							{
								if(model.sharedExchangeUserNames[i] === email)
								{
									hasExchange = true;
									shared = true;
									break;
								}
							}
						}
						if(hasExchange)
						{
							final_url = 'core/api/office/office365-emails?from_email='+email;
							html = '<i class="icon-windows" style="margin-right:4px;font-size: 1.2em"></i>'+email;
							if(shared)
								html = html+ ' (Shared)';
						}
					}
					if(final_url)
					{
						cookie_info[0] = final_url
						cookie_info[1] = html;
						cookie_info[2] = email_server;
						cookie_info[3] = email;
					}
				}
			}// end of if cookie values == 2
		}
	}
	return cookie_info;
}

function contact_detail_page_infi_scroll(element_id, targetCollection)
{
	console.log("initialize_infinite_scrollbar",element_id);
	
	element_id.unbind("scroll");

	if (element_id == undefined || element_id == null)
	{
		console.log("no elmnt");
		return;
	}
	console.log(targetCollection);
	targetCollection.infiniScroll = new Backbone.InfiniScroll(targetCollection.collection, {
		target : element_id,
		untilAttr : 'cursor',
		param : 'cursor',
		strict : false,
		pageSize : targetCollection.page_size,
		success : function(colleciton, response)
		{
			console.log('in success');
			if (!colleciton.last().get("cursor"))
			{
				this.strict = true;
				targetCollection.infiniScroll.disableFetch();
			}
			// Remove loading icon
			$(targetCollection.infiniScroll.options.target).find('.scroll-loading').remove();
		},
		onFetch : function()
		{
			console.log('in fetch');
			// Add loading icon
			$(targetCollection.infiniScroll.options.target).append(
					'<div class="scroll-loading"> <img src="'+updateImageS3Path("/img/ajax-loader-cursor.gif") +'" style="margin-left: 44%;"> </div>');
		}
		});
}
function showMailsInfoMessages()
{
	showMailsErrorMessages();
	if(mailsView.collection.length > 20)
	{
		if(($('#all-emails-info',App_Companies.companyDetailView.el).length === 0))
		{
			$('#company-mails',App_Companies.companyDetailView.el).append('<div id="all-emails-info" class="alert alert-info">Showing relevant messages from all accounts. Maximum of 20 messages from each account </div>');
		}
	}
	$('#company-mail-account-types', App_Companies.companyDetailView.el).find('.all-mails-loading').remove();
	$('#company-mail', App_Companies.companyDetailView.el).find("#no-email").css('display','block');
}
function showMailsErrorMessages()
{
	for(var i=0;i<email_errors_divs.length;i++)
		$('#company-mails',App_Companies.companyDetailView.el).prepend(email_errors_divs[i]);
	email_errors_divs = [];
}
function ifNoError(email)
{
	if(email && 'errormssg' in email && 'owner_email' in email)
	{
		var email_error_div = '<div class="alert alert-danger" > <a href="#" class="close" data-dismiss="alert">&times;</a><span class="text-dark">Unable to fetch emails from account "'+email.owner_email+'" Error:'+ email.errormssg+'</span>';
		email_errors_divs.push(email_error_div);
		return false;
	}
	return true;
}
function killAllPreviousRequests()
{
	for(var i=0;i<email_requests.length;i++)
	{
		var xhr = email_requests[i];
		xhr.abort();
	}
	email_requests = [];
}
function show_no_email_alert()
{
	$('#company-mail', App_Companies.companyDetailView.el).html('<div class="alert alert-danger m-t-sm m-sm"><a class="close" data-dismiss="alert" href="#">&times;</a>Sorry! this company has no email to get the mails.</div>');
}




}(window.company_detail_tab = window.company_detail_tab || {}, $));

