/**
 * Creates backbone router for contacts management and filter (custom view)
 * operations.
 * 
 * @module Contact management & filters
 */

CONTACTS_HARD_RELOAD = true;

var import_tab_Id;

var ContactsRouter = Backbone.Router.extend({

	routes : { 
		
		"" : "dashboard", 
		
		"dashboard" : "dashboard",
		
		// "dashboard-test": "dashboard",

		/* Contacts */
		"contacts" : "contacts",
		
		"contact/:id" : "contactDetails",
		
		"import" : "importContacts",

		"import/salesforce" : "salesforceImport",

		//add contact when customfields are there
		"contact-edit" : "editContact",
		
		"contact-add" : "addContact",
		
		"contact-duplicate" : "duplicateContact",
		
		"duplicate-contacts/:id" : "duplicateContacts",

		"merge-contacts" : "mergeContacts",
		
		"tags/:tag" : "contacts", 
		
		"send-email" : "sendEmail",
		
		"send-email/:id" : "sendEmail",

		"send-emails/:id" : "sendEmailCustom",
		
		"add-campaign" : "addContactToCampaign",

		/* Return back from Scribe after oauth authorization */
		"gmail" : "email", "twitter" : "socialPrefs", "linkedin" : "socialPrefs",
		
		/* CALL */
		"contacts/call-lead/:first/:last" : "addLead",
			
			/* CALL-with mobile number */
			"contacts/call-lead/:first/:last/:mob" : "addLeadDirectly",
			
			/* CALL-with only mobile number */
			"contacts/call-lead/:mob" : "addMobLead",
			
			"call-contacts" : "callcontacts"
	},
	
	initialize : function()
	{
		/*
		 * $(".active").removeClass("active");
		 * 
		 * $("#content").html(getTemplate('dashboard-timline', {}));
		 * setup_dashboardTimeline();
		 */
	},

	salesforceImport : function(){
         App_Datasync.salesforce();
	},

	dashboard : function()
	{

		$(".active").removeClass("active");
		if(CURRENT_DOMAIN_USER.domain == "admin")
		{
			Backbone.history.navigate("domainSearch" , {
                trigger: true
            });
            return;
		}

		getTemplate('portlets', {}, undefined, function(template_ui){
				if(!template_ui)
					  return;

				var el = $(template_ui);
				$("#content").html(el);

				$('[data-toggle="tooltip"]').tooltip();
				if ((navigator.userAgent.toLowerCase().indexOf('chrome') > -1&&navigator.userAgent.toLowerCase().indexOf('opr/') == -1) && !document.getElementById('agilecrm_extension'))
				{
					$("#chrome-extension-button").removeClass('hide');
				}

				loadPortlets(el);

		}, "#content");

	},
	
	/**
	 * Fetches all the contacts (persons) and shows as list, if tag_id
	 * and filter_id are not defined, if any one of them is defined then
	 * fetches the contacts related to that particular id (tag_id or
	 * filter_id) and shows as list. Adds tags, charts for tags and
	 * filter views to the contacts list from postRenderCallback of its
	 * Base_Collection_View. Initiates infiniScroll to fetch contacts
	 * (25 in count) step by step on scrolling down instead of fetching
	 * all at once.
	 */
	contacts : function(tag_id, filter_id, grid_view, is_lhs_filter)
		{
		insidePopover=false;
		if(SCROLL_POSITION)
		{
			$('html, body').animate({ scrollTop : SCROLL_POSITION  },1000);
			SCROLL_POSITION = 0;
		} else {
			$( window ).scrollTop( 0 );
		}
		
		// If contacts are selected then un selects them
		SELECT_ALL = false;
		
		//campaign filters are disabled for time being.
		/*if(_agile_get_prefs('dynamic_contact_filter') &&_agile_get_prefs('dynamic_contact_filter').indexOf('campaign_status') >= 0 ) {
			_agile_delete_prefs('dynamic_contact_filter');
		}*/
		//custom scroll element for grid view
		var custom_scrollable_element=null;
		var max_contacts_count = 20;
		var is_company = false;
		var template_key = "contacts";
		var individual_tag_name = "tr";
		var sort_key = _agile_get_prefs("sort_by_name");
		if(!sort_key || sort_key == null) {
			sort_key = '-created_time';
			// Saves Sort By in cookie
			_agile_set_prefs('sort_by_name', sort_key);
		}
		
		// Checks if user is using custom view. It check for grid view
		if (grid_view || _agile_get_prefs("agile_contact_view"))
		{
			template_key = "contacts-grid";
			individual_tag_name = "div";
			custom_scrollable_element="#contacts-grid-model-list";
		}
		
		// Default url for contacts route
		var url = '/core/api/contacts/list';
		var collection_is_reverse = false;
		this.tag_id = tag_id;
		var postData;

		// Tags, Search & default browse comes to the same function
		if (tag_id)
		{
			tag_id = decodeURI(tag_id);

			tag_id = decodeURI(tag_id);

			
			// erase filter cookie
			_agile_delete_prefs('contact_filter');
			//_agile_delete_prefs('company_filter');
			//_agile_delete_prefs('contact_filter_type');
			_agile_delete_prefs('dynamic_contact_filter');

			if (this.contactsListView && this.contactsListView.collection)
			{

				if (this.contactsListView.collection.url.indexOf('core/api/tags/list/' + tag_id) == -1)
				{
					this.contactsListView = undefined;
				}
			}

			this.customView(_agile_get_prefs("contact_view"), undefined, 'core/api/tags/list/' + tag_id, tag_id);
			return;
			
		}
		else
		{
			if (this.contactsListView && this.contactsListView.collection)
			{

				if (this.contactsListView.collection.url.indexOf('core/api/tags/list') != -1)
				{
					console.log(window.location.hash = '#contacts');
					this.contactsListView = undefined;
				}
			}
		}

		// If contact-filter cookie is defined set url to fetch
		// respective filter results
		if (filter_id || (filter_id = _agile_get_prefs('contact_filter')))
		{
			collection_is_reverse = false;
			url = "core/api/filters/query/list/" + filter_id;
		}

		// If view is set to custom view, load the custom view
		if (!_agile_get_prefs("agile_contact_view"))
		{
			if(_agile_get_prefs('dynamic_contact_filter')) {
				// Then call customview function with filter url
				this.customView(_agile_get_prefs("contact_view"), undefined, 'core/api/filters/filter/dynamic-filter', undefined,  is_lhs_filter, _agile_get_prefs('dynamic_contact_filter'));
				return;
			}
			// If there is a filter saved in cookie then show filter
			// results in custom view saved
			if (_agile_get_prefs('contact_filter'))
			{
				// Then call customview function with filter url
				this.customView(_agile_get_prefs("contact_view"), undefined, "core/api/filters/query/list/" + _agile_get_prefs('contact_filter'), tag_id);
				return;
			}

			// Else call customView function fetches results from
			// default url : "core/api/contacts/list"
			this.customView(_agile_get_prefs("contact_view"), undefined, undefined, undefined, is_lhs_filter);
			return;
		}

		console.log("while creating new base collection view : " + collection_is_reverse);

		/**
		 * If collection is already defined and contacts are fetched the
		 * show results instead of initializing collection again
		 */
		if (CONTACTS_HARD_RELOAD == true)
		{
			this.contactsListView = undefined;
			CONTACTS_HARD_RELOAD = false;
		}
		
		if (this.contactsListView && this.contactsListView.collection)
		{
			this.contactsListView.collection.url = url;

			$('#content').html('<div id="contacts-listener-container"></div>');
			$('#contacts-listener-container').html(this.contactsListView.render(true).el);

			$(".active").removeClass("active");
			$("#contactsmenu").addClass("active");

			contactFiltersListeners();

			return;
		}
		if(_agile_get_prefs('dynamic_contact_filter')) {
			url = 'core/api/filters/filter/dynamic-filter';
			postData = _agile_get_prefs('dynamic_contact_filter');
		} 

		var slateKey = getContactPadcontentKey(url);
		
		if(is_lhs_filter) {
			template_key = "contacts-table";
			
			if (grid_view || _agile_get_prefs("agile_contact_view"))
			{
				template_key = "contacts-grid-table";
				individual_tag_name = "div";
				custom_scrollable_element="#contacts-grid-table-model-list";
			}
		}

		/*
		 * cursor and page_size options are taken to activate
		 * infiniScroll
		 */
		this.contactsListView = new  Contacts_Events_Collection_View({ url : url,custom_scrollable_element:custom_scrollable_element, sort_collection : false, templateKey : template_key, individual_tag_name : individual_tag_name,
			cursor : true, page_size : 25, global_sort_key : sort_key, slateKey : slateKey, request_method : 'POST', post_data: {filterJson: postData}, postRenderCallback : function(el, collection)
			{		  
		
			$("#contacts-view-options").css( 'pointer-events', 'auto' );

				// Contacts are fetched when the app loads in
				// the initialize
				var cel = App_Contacts.contactsListView.el;
				var collection = App_Contacts.contactsListView.collection;

				abortCountQueryCall();
				
				// To set heading in template
				if(is_lhs_filter) {

					setupViews(el);
					setupContactFilterList();
					//setUpContactView();

					if(collection.models.length > 0 && !collection.models[0].get("count")){
						// Call to get Count 
						getAndUpdateCollectionCount("contacts", el);						
					}
					else {
						var count = 0;
						if(collection.models.length > 0) {
							count = collection.models[0].attributes.count || collection.models.length;
						}
						var count_message;
						if (count > 9999 && (_agile_get_prefs('contact_filter') || _agile_get_prefs('dynamic_contact_filter')))
							count_message = "<small> (" + 10000 + "+ Total) </small>" + '<span style="vertical-align: text-top; margin-left: 0px">' + '<img border="0" src="' + updateImageS3Path("/img/help.png") + '"' + 'style="height: 10px; vertical-align: middle" rel="popover"' + 'data-placement="bottom" data-title="Lead Score"' + 'data-content="Looks like there are over 10,000 results. Sorry we can\'t give you a precise number in such cases."' + 'id="element" data-trigger="hover">' + '</span>';
						else
							count_message = "<small> (" + count + " Total) </small>";
						$('#contacts-count').html(count_message);

					}
					
				} else {

					setupLhsFilters(cel, is_company);
					setupViews(cel);
					setupContactFilterList(cel, tag_id);
					setUpContactView(cel);

					if(collection.models.length > 0 && !collection.models[0].get("count")){
						// Call to get Count 
						getAndUpdateCollectionCount("contacts", el);						
					}
				}

				$('[data-toggle="tooltip"]').tooltip();
				start_tour("contacts", el);

			} });

		// Contacts are fetched when the app loads in the initialize
		this.contactsListView.collection.fetch();
		if(!is_lhs_filter) {
			$('#content').html('<div id="contacts-listener-container"></div>');
			$('#contacts-listener-container').html(this.contactsListView.render().el);
			contactFiltersListeners();
			contactListener();
		} else {
			$('#contacts-listener-container').find('.contacts-inner-div').html(this.contactsListView.render().el);
			$('#bulk-actions').css('display', 'none');
			$('#bulk-select').css('display', 'none');
			$('#bulk-action-btns > button').addClass("disabled");
			CONTACTS_HARD_RELOAD = true;
			
		}
		$(".active").removeClass("active");
		$("#contactsmenu").addClass("active");
		$('[data-toggle="tooltip"]').tooltip();

	
		


	},
	
	/**
	 * Fetches all the duplicate contacts (persons) for the given
	 * contact and shows as list
	 */
	duplicateContacts : function(contact_id)
	{

		dup_contacts1_array.length = 0;
		var max_contacts_count = 20;
		var individual_tag_name = "tr";

		// Default url for contacts route
		this.contact_id = contact_id;
		var url = '/core/api/search/duplicate-contacts/' + contact_id;
		var collection_is_reverse = false;
		template_key = "duplicate-contacts";

		if (App_Contacts.contactDetailView === undefined)
		{
			Backbone.history.navigate("contact/" + contact_id, { trigger : true });
			return;
		}

		/*
		 * cursor and page_size options are taken to activate
		 * infiniScroll
		 */
		this.duplicateContactsListView = new Contacts_Events_Collection_View({ url : url, templateKey : template_key, individual_tag_name : 'tr', cursor : true,
			page_size : 25, sort_collection : collection_is_reverse, slateKey : null, postRenderCallback : function(el)
			{
				// this.duplicateContactsListView.collection.forEach(function(model,
				// index) {
				// model.set('master_id',contact_id);
				// });
			} });

		// Contacts are fetched when the app loads in the initialize
		this.duplicateContactsListView.collection.fetch();

		$('#content').html(this.duplicateContactsListView.render().el);

		$(".active").removeClass("active");
		$("#contactsmenu").addClass("active");

	},

	/**
	 * Merges duplicate contacts(persons) into a single master contact,
	 * at a time we can merge 3 contacts
	 */
	mergeContacts : function()
	{
		
		
		var id = dup_contacts1_array[0];

		var max_contacts_count = 20;
		var individual_tag_name = "table";

		var collection_is_reverse = false;
		template_key = "merge-contacts";

		if (App_Contacts.duplicateContactsListView == undefined || dup_contacts1_array.length<1)
		{
			Backbone.history.navigate("contacts", { trigger : true });
			return;
		}
		var contacts = [];
		for (var i = 0; i < dup_contacts1_array.length; i++)
		{
			var contact_id = Number(dup_contacts1_array[i]);
			var data = App_Contacts.duplicateContactsListView.collection.where({ id : contact_id });
			var temp = contacts.concat(data);
			contacts = temp;
		}
		var bigObject = {};
		var master_record = App_Contacts.contactDetailView.model.toJSON();
		console.log(master_record);
//		bigObject['custom_fields'] = get_custom_fields();
		var objects = []
		var length = 0;
		objects[0] = master_record;
		for (i = 0; i < contacts.length; i++)
		{
			objects[i + 1] = contacts[i].toJSON();
			length++;
		}
		bigObject["contacts"] = objects;
		bigObject["length"] = length;
		
		// Contact Edit - take him to continue-contact form
		add_custom_fields_to_form(bigObject, function(contact)
		{
			this.mergeContactsView = new Contact_Details_Model_Events({ template : template_key, data : bigObject, postRenderCallback : function(el)
			{
				// g_id_array.length = 0;
			} });

			$('#content').html(this.mergeContactsView.render(true).el);
			$( window ).scrollTop( 0 );
			$(".active").removeClass("active");
			$("#contactsmenu").addClass("active");

		}, master_record.type);	
	},

	/**
	 * Shows a contact in its detail view by taking the contact from
	 * contacts list view, if list view is defined and contains the
	 * contact, otherwise downloads the contact from server side based
	 * on its id. Loads timeline, widgets, map and stars (to rate) from
	 * postRenderCallback of its Base_Model_View.
	 * 
	 */
	contactDetails : function(id, contact)
	{
		$('[data-toggle="tooltip"]').tooltip();


		//If call campaign is running then show the campaign
		if(CALL_CAMPAIGN.last_clicked == "start-bulk-campaign"){
			startCallCampaign(CALL_CAMPAIGN.contact_id_list);
			CALL_CAMPAIGN.last_clicked = "";
		} 
		//Removed previous contact timeline nodes from the queue, if existed
		if(timeline_collection_view && timeline_collection_view.queue)
		{
			timeline_collection_view.queue.pop();
		}
		
		//For getting custom fields
		if(App_Contacts.customFieldsList == null || App_Contacts.customFieldsList == undefined){
			App_Contacts.customFieldsList = new Contacts_Events_Collection_View({ url : '/core/api/custom-fields/position', sort_collection : false, restKey : "customFieldDefs",
				templateKey : "admin-settings-customfields", individual_tag_name : 'tr' });
			App_Contacts.customFieldsList.collection.fetch();
		}

		var contact_collection;
		

		if (!contact && this.contactDetailView && this.contactDetailView.model != null)
		{
			//contact_collection = this.contactDetailView;

			if (id == this.contactDetailView.model.toJSON()['id'])
			{
				App_Contacts.contactDetails(id, this.contactDetailView.model);
				
				return;
			}
		}

		// If user refreshes the contacts detail view page directly - we
		// should load from the model
		if (!contact)
			if (!this.contactsListView || this.contactsListView.collection.length == 0 || this.contactsListView.collection.get(id) == null)
			{

				console.log("Downloading contact");

				// Download
				var contact_details_model = Backbone.Model.extend({ url : function()
				{
					return '/core/api/contacts/' + this.id;
				} });

				var model = new contact_details_model();
				model.id = id;
				model.fetch({ success : function(data)
				{
					if(data.type == 'COMPANY'){
						App_Companies.companyDetails(id);
						return;
					}
					// Call Contact Details again
					App_Contacts.contactDetails(id, model);

				}, 
				error: function(data, response)
				{
					if(response && response.status == '403')

						$("#content").html ("<div class='well'><div class='alert bg-white text-center'><div class='slate-content p-md text'><h4 style='opacity:0.8;margin-bottom:5px!important;'> Sorry, you do not have permission to view this Contact.</h4><div class='text'style='opacity:0.6;'>Please contact your admin or account owner to enable this option.</div></div></div></div>");

				}
				});
				
				return;
			}

		// If not downloaded fresh during refresh - read from collection
		if (!contact)
		{
			// Set url to core/api/contacts/list (If filters are loaded
			// contacts url is changed so set it back)

			//this.contactsListView.collection.url = "core/api/contacts/list";
			contact = this.contactsListView.collection.get(id);
		}
		
		// Assigning contact collection
		if(this.contactsListView && this.contactsListView.collection)
			contact_collection = this.contactsListView.collection;

		add_recent_view(contact);

		// If contact is of type company , go to company details page
		if (contact.get('type') == 'COMPANY')
		{			
			Backbone.history.navigate( "company/"+id, { trigger : true });
			return;
		}

		this.contactDetailView = new Contact_Details_Model_Events({ model : contact, isNew : true, template : "contact-detail", postRenderCallback : function(el)
		{
			

			//mobile tabs
			 $('.content-tabs').tabCollapse(); 

			//$("#mobile-menu-settings").trigger('click');
			// Clone contact model, to avoid render and post-render fell
			// in to
			// loop while changing attributes of contact
			if(canEditCurrentContact())
			{
				var recentViewedTime = new Backbone.Model();
				recentViewedTime.url = "core/api/contacts/viewed-at/" + contact.get('id');
				recentViewedTime.save();
			}

			if (App_Contacts.contactsListView && App_Contacts.contactsListView.collection && App_Contacts.contactsListView.collection.get(id))
				App_Contacts.contactsListView.collection.get(id).attributes = contact.attributes;

			load_contact_tab(el, contact.toJSON());

			loadWidgets(el, contact.toJSON());
			
			
			
			/*
			 * // To get QR code and download Vcard
			 * $.get('/core/api/VCard/' + contact.toJSON().id,
			 * function(data){ console.log("Vcard string");
			 * console.log(data); var url =
			 * 'https://chart.googleapis.com/chart?cht=qr&chs=180x180&chld=0&choe=UTF-8&chl=' +
			 * encodeURIComponent(data); $("#qrcode", el).html('<img
			 * src="' + url + '" id="qr_code" alt="QR Code"/>');
			 * //$("#qrcode", el).html('<img
			 * style="display:inline-block!important;" src="' + url + '"
			 * id="qr_code" alt="QR Code" data="' + data + '"
			 * onload="qr_load();"/>'); $("#qrcode", el).prepend('<span
			 * style="padding: 8% 0%;margin-right: 2px;float:right;"
			 * id="downloadify"></span>'); });
			 */

			starify(el);

			show_map(el);

			// To navigate between contacts details
			if (contact_collection != null)
				contact_detail_view_navigation(id, App_Contacts.contactsListView, el);

			//fill_owners(el, contact.toJSON());
			start_tour("contact-details", el);
			
			// this part is to remove the progress cursor from contact number shown in contact detail page
			if(default_call_option.callOption.length == 0){
				$(".contact-make-call",el).removeClass("c-progress");
				$(".contact-make-skype-call",el).removeClass("c-progress");
			}
			} });

		var el = this.contactDetailView.render(true).el;
		$(el).find('.content-tabs').tabCollapse(); 

		$('#content').html(el);

		// Check updates in the contact.
		checkContactUpdated();

		if(_agile_get_prefs('MAP_VIEW')=="disabled")
				$("#map_view_action").html("<i class='icon-plus text-sm c-p' title='Show map' id='enable_map_view'></i>");
		else
				$("#map_view_action").html("<i class='icon-minus text-sm c-p' title='Hide map' id='disable_map_view'></i>");


		//contactInnerTabsInvoke(el);

	},

	/**
	 * Takes the contact to continue contact form to edit it. If
	 * attempts to edit a contact without defining contact detail view,
	 * navigates to contacts page. Gets the contact to edit, from its
	 * list view or its custom view, if not found in both downloads from
	 * server side (Contact database).
	 */
	editContact : function(contact)
	{

		// Takes back to contacts if contacts detailview is not defined
		if (!this.contactDetailView || !this.contactDetailView.model.id)
		{
			this.navigate("contacts", { trigger : true });
			return;
		}

		// If contact detail view is defined the get current contact
		// model id
		var id = this.contactDetailView.model.id;

		if (this.contactDetailView && this.contactDetailView.model.id)
		{
			contact = this.contactDetailView.model.toJSON();
		}

		// If contact list is defined the get contact to edit from the
		// list
		else if (this.contactsListView && this.contactsListView.collection && this.contactsListView.collection.get(id))
		{
			contact = this.contactsListView.collection.get(id).toJSON();
		}

		// If contacts list view is not defined happens when in
		// custom-view route or in filter
		// then get contact from contact custom view
		else if (this.contact_custom_view && this.contact_custom_view.collection && this.contact_custom_view.collection.get(id))
		{
			contact = this.contact_custom_view.collection.get(id).toJSON();
		}

		// If contact list view and custom view list is not defined then
		// download contact
		else if (!contact)
		{
			// Download contact for edit since list is not defined
			var contact_details_model = Backbone.Model.extend({ url : function()
			{
				return '/core/api/contacts/' + id;
			} });

			var model = new contact_details_model();

			model.fetch({ success : function(contact)
			{

				// Call Contact edit again with downloaded contact
				// details
				App_Contacts.editContact(contact.toJSON());
			} });

			return;
		}

		// Contact Edit - take him to continue-contact form
		add_custom_fields_to_form(contact, function(contact)
		{

			if (contact.type == 'COMPANY')
				deserialize_contact(contact, 'continue-company');
			else
				deserialize_contact(contact, 'continue-contact');
		}, contact.type);
	},

	/**
	 * Creates a duplicate contact to the existing one. Deletes the
	 * email (as well as it has to be unique) and id (to create new one)
	 * of the existing contact and saves it. Also takes the duplicate
	 * contact to continue contact form to edit it.
	 */
	duplicateContact : function()
	{

		// Takes back to contacts if contacts detail view is not defined
		if (!this.contactDetailView || !this.contactDetailView.model.id || !this.contactsListView || this.contactsListView.collection.length == 0)
		{
			this.navigate("contacts", { trigger : true });
			return;
		}

		// Contact Duplicate
		var contact = this.contactDetailView.model
		var orginal_json = contact.toJSON();
		var json = $.extend(true, {}, orginal_json);

		// Delete email as well as it has to be unique
		json = delete_contact_property(json, 'email');
		delete json.id;

		var contactDuplicate = new Backbone.Model();
		contactDuplicate.url = 'core/api/contacts';
		contactDuplicate.save(json, { success : function(data)
		{
			add_custom_fields_to_form(data.toJSON(), function(contact)
			{

				deserialize_contact(contact, 'continue-contact');

			});
		} });
	},

	/**
	 * Navigates the contact (of type company) to continue company form
	 */
	/*
	 * continueCompany: function () { // commented here to avoid the
	 * creation of multiple entities var model =
	 * serialize_and_save_continue_contact(undefined, 'companyForm',
	 * 'companyModal', true, false, '#continue-company'); },
	 */

	/**
	 * Imports contacts from a csv file and then uploads all the
	 * contacts to database
	 */
	importContacts : function()
	{
		$('#content').html('<div id="import-contacts-event-listener"></div>');
		getTemplate("import-contacts", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;

			$('#import-contacts-event-listener').html($(template_ui));	
			initializeImportEvents('import-contacts-event-listener');
			if(import_tab_Id){
				 $('#import-tabs-content a[href="#'+import_tab_Id+'"]').tab('show');
				 import_tab_Id=undefined;
			}
			else{
				$('#import-tabs-content a[href="#csv-tab"]').tab('show');
			}

		}, "#import-contacts-event-listener");       
	},
	

	/**
	 * Subscribes a contact to a campaign. Loads the related template
	 * and triggers the custom event "fill_campaigns_contact" to show
	 * the campaigns drop down list.
	 */
	addContactToCampaign : function()
	{

		getTemplate("contact-detail-campaign", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;

			$("#content").html($(template_ui));	
			$('body').trigger('fill_campaigns_contact');

		}, "#content"); 

		
	},

	/**
	 * Shows a send email form with some prefilled values (email - from,
	 * to and templates etc..). To prefill the fields the function
	 * populate_send_email_details is called from the
	 * postRenderCallback.
	 */
	sendEmail : function(id, subject, body, cc, bcc, force_reload)
	{

		// Check old hash and call same function

		if(!force_reload && Agile_Old_Hash && Agile_Old_Hash.indexOf("contact/") > -1)
		{
              var contactId = Agile_Old_Hash.split("/")[1];

             
             // Gets the domain name from the contacts of the custom fields.
               var currentContactJson = App_Contacts.contactDetailView.model.toJSON();
               if(contactId == currentContactJson.id){
					var properties = currentContactJson.properties;
					var email;
					$.each(properties,function(id, obj){
						if(obj.name == "email"){
							email = obj.value;
							return false;
						}
					});
			   }
              
              this.sendEmail(email, subject, body, cc, bcc, true);
              return;
		}
		var that=this;
		sendMail(id,subject,body,cc,bcc,that);
	
	},

	sendEmailCustom : function(id, subject, body, cc, bcc,custom_view)
	{
		var that=this.contact_popover;
		insidePopover=false;
		sendMail(id,subject,body,cc,bcc,that,true);
	
	},
	
	/**
	 * Custom views, its not called through router, but by cookies
	 */
	// Id = custom-view-id, view_data = custom view data if already
	// availabel, url = filter url if there is any filter
	customView : function(id, view_data, url, tag_id, is_lhs_filter, postData)
	{
		console.log("customView");

		SELECT_ALL = false;
		App_Contacts.tag_id = tag_id;

		// If url is not defined set defult url to contacts
		if (!url)
		{
			url = "core/api/contacts/list";
		}
		

		if (CONTACTS_HARD_RELOAD == true)
		{
			this.contact_custom_view = undefined;
			CONTACTS_HARD_RELOAD = false;
			view_data = undefined;
			// App_Contacts.contactViewModel = undefined;
		}

		// If id is defined get the respective custom view object
		if (!view_data)
		{
			// Once view id fetched we use it without fetching it.
			if (!App_Contacts.contactViewModel)
			{
				var view = new Backbone.Model();
				view.url = 'core/api/contact-view-prefs';
				view.fetch({ success : function(data)
				{
					// If custom view object is empty i.e., custom view
					// is deleted.
					// custom view cookie is eraised and default view is
					// shown
					if ($.isEmptyObject(data.toJSON()))
					{
						// Erase custom_view cookie, since
						// view object with given id is not available
						_agile_delete_prefs("contact_view");

						// Loads default contact view
						App_Contacts.contacts();
						return;
					}
					App_Contacts.contactViewModel = data.toJSON();
					App_Contacts.customView(undefined, App_Contacts.contactViewModel, url, tag_id, is_lhs_filter);

				} });
				return;
			}

			view_data = App_Contacts.contactViewModel;

		}
	

		// If defined
		if (this.contact_custom_view && this.contact_custom_view.collection.url == url)
		{
			var el = App_Contacts.contact_custom_view.render(true).el;
			$('#content').html('<div id="contacts-listener-container"></div>');
			$('#contacts-listener-container').html(el);
			$("#contacts-view-options").css( 'pointer-events', 'auto' );
			if(agile_is_mobile_browser()) {
			$('#contacts-table tbody tr .icon-append-mobile',el).after('<td><div class="text-md text-muted m-t contact-list-mobile"><i class="fa fa-angle-right"></i></div></td>');
			}
			

			contactFiltersListeners();
			contactListener();

			if (_agile_get_prefs('company_filter'))
				$('#contact-heading', el).text('Companies');

			//setup_tags(el);
			//pieTags(el);

			setupViews(el, view_data.name);
			setupContactFilterList(el, tag_id);
			setUpContactView(el);

			$(".active").removeClass("active"); // Activate Contacts
												// Navbar tab
			$("#contactsmenu").addClass("active");
			return;
		}

		var slateKey = getContactPadcontentKey(url);
		var sort_key = _agile_get_prefs("sort_by_name");
		if(!sort_key || sort_key == null) {
			sort_key = '-created_time';
			// Saves Sort By in cookie
			_agile_set_prefs('sort_by_name', sort_key);
		}
		var template_key = "contacts-custom-view";
		var individual_tag_name='tr';
		var custom_scrollable_element=null;

		// Checks if user is using custom view. It check for grid view
		if (_agile_get_prefs("agile_contact_view"))
		{
			template_key = "contacts-grid";
			individual_tag_name = "div";
			custom_scrollable_element="#contacts-grid-model-list";
		}
		//if directly called the method, i.e on click of custom view link, 
		//the url will be updated if any filter conditions are selected.
		if(_agile_get_prefs('dynamic_contact_filter')) {
			url = 'core/api/filters/filter/dynamic-filter';
			postData=_agile_get_prefs('dynamic_contact_filter');
		}
		if(is_lhs_filter) {
			template_key = "contacts-custom-view-table";

			if (_agile_get_prefs("agile_contact_view"))
		    {
			template_key = "contacts-grid-table";
			individual_tag_name = "div";
			custom_scrollable_element="#contacts-grid-table-model-list";
		    }
		}	
		
		this.contact_custom_view = new Contacts_Events_Collection_View({ url : url, restKey : "contact", modelData : view_data, global_sort_key : sort_key,
			templateKey : template_key,custom_scrollable_element:custom_scrollable_element, individual_tag_name : individual_tag_name, slateKey : slateKey, cursor : true, request_method : 'POST', post_data: {'filterJson': postData}, page_size : 25, sort_collection : false,
			postRenderCallback : function(el, collection)
			{
				
				App_Contacts.contactsListView = App_Contacts.contact_custom_view;
				contactListener();


				// To set chats and view when contacts are fetch by
				// infiniscroll
				//setup_tags(el);

				//pieTags(el);
				setupViews(el, view_data.name);
				$("#contacts-view-options").css( 'pointer-events', 'auto' );

				// show list of filters dropdown in contacts list
				setupContactFilterList(el, App_Contacts.tag_id);

				if(tag_id)
				setUpContactView(el,true);
			    else
				setUpContactView(el);

				abortCountQueryCall();

				if(is_lhs_filter) {

					if(collection.models.length > 0 && !collection.models[0].get("count")){
						// Call to get Count 
						getAndUpdateCollectionCount("contacts", el);
					} else {
						var count = 0;
						if(collection.models.length > 0) {
							count = collection.models[0].attributes.count || collection.models.length;
						}
						var count_message;
						if (count > 9999 && (_agile_get_prefs('contact_filter') || _agile_get_prefs('dynamic_contact_filter')))
							count_message = "<small> (" + 10000 + "+ Total) </small>" + '<span style="vertical-align: text-top; margin-left: 0px">' + '<img border="0" src="'+ updateImageS3Path("/img/help.png") +'"' + 'style="height: 10px; vertical-align: middle" rel="popover"' + 'data-placement="bottom" data-title="Lead Score"' + 'data-content="Looks like there are over 10,000 results. Sorry we can\'t give you a precise number in such cases."' + 'id="element" data-trigger="hover">' + '</span>';
						else
							count_message = "<small> (" + count + " Total) </small>";
						$('#contacts-count').html(count_message);
					}
					
				} else {	

					if(collection.models.length > 0 && !collection.models[0].get("count")){
						// Call to get Count 
						getAndUpdateCollectionCount("contacts", el);						
					}

					setupLhsFilters(el);
				}

				if(agile_is_mobile_browser()) {
				
					var $nextEle = $('<td><div class="text-md text-muted m-t contact-list-mobile"><i class="fa fa-angle-right"></i></div></td>');
					$('#contacts-table tbody tr .icon-append-mobile',el).after($nextEle);
				}
				

				

			}, appendItemCallback: function(el){
				if(agile_is_mobile_browser()) {
					$('#contacts-table tbody tr .icon-append-mobile',el).after('<td><div class="text-md text-muted m-t contact-list-mobile"><i class="fa fa-angle-right"></i></div></td>');
				}
			}, });

		var _that = this;
		App_Contacts.contactDateFields = CONTACTS_DATE_FIELDS;

		if(!App_Contacts.contactDateFields){
				$.getJSON("core/api/custom-fields/type/scope?type=DATE&scope=CONTACT", function(customDatefields)
				{
					App_Contacts.contactDateFields = customDatefields;
					
					// Defines appendItem for custom view
					_that.contact_custom_view.appendItem = function(base_model){
						contactTableView(base_model,App_Contacts.contactDateFields,this);
					};
					// Fetch collection
					_that.contact_custom_view.collection.fetch();
					contactListener();
					
				});

		} else{

				// Defines appendItem for custom view
				_that.contact_custom_view.appendItem = function(base_model){
					contactTableView(base_model,App_Contacts.contactDateFields,this);
				};
				// Fetch collection
				_that.contact_custom_view.collection.fetch();
		}

		if(!is_lhs_filter) {
			$('#content').html('<div id="contacts-listener-container"></div>');
			$('#contacts-listener-container').html(this.contact_custom_view.el);
			contactFiltersListeners();
		} else {
			$('#contacts-listener-container').find('.contacts-inner-div').html(this.contact_custom_view.el);
			$('#bulk-actions').css('display', 'none');
			$('#bulk-select').css('display', 'none');
			$('#bulk-action-btns > button').addClass("disabled");

			CONTACTS_HARD_RELOAD = true;
		}
		
		// Activate Contacts Navbar tab
		$(".active").removeClass("active");
		$("#contactsmenu").addClass("active");
	
	},
	
	addLead : function(first, last){
		$("#personModal").on("shown", function(){
			$(this).find("#fname").val(first);
			$(this).find("#lname").val(last);
		});
		$("#personModal").modal();
	},
	
	addLeadDirectly : function(first, last,mob){
		$("#personModal").on("shown", function(){
			$(this).find("#fname").val(first);
			$(this).find("#lname").val(last);
			$(this).find("#phone").val(mob);
		});
		$("#personModal").modal();
	},

	addMobLead : function(mob){
		$("#personModal").on("shown", function(){
			$(this).find("#phone").val(mob);
		});
		$("#personModal").modal();
	},
	
	addContact : function(){
		$.getJSON("core/api/custom-fields/scope?scope=CONTACT", function(data)
		{
			if(data.length > 0){
				var json = {custom_fields:data,properties:[]};
				getTemplate("continue-contact", json, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$("#content").html($(template_ui));	
					// Add placeholder and date picker to date custom fields
					$('.date_input').attr("placeholder", "Select Date");

					$('.date_input').datepicker({ format : CURRENT_USER_PREFS.dateFormat, weekStart : CALENDAR_WEEK_START_DAY});

					// To set typeahead for tags
					setup_tags_typeahead();

					// Iterates through properties and ui clones
					
					var fxn_display_company = function(data, item)
					{
						$("#content [name='contact_company_id']")
								.html(
										'<li class="inline-block tag btn btn-xs btn-primary m-r-xs m-b-xs" data="' + data + '"><span><a class="text-white m-r-xs" href="#contact/' + data + '">' + item + '</a><a class="close" id="remove_tag">&times</a></span></li>');
						$("#content #contact_company").hide();
					}
					agile_type_ahead("contact_company", $('#content'), contacts_typeahead, fxn_display_company, 'type=COMPANY', '<b>No Results</b> <br/> Will add a new one');

				}, "#content"); 

					
			}else{
				Backbone.history.navigate("contacts" , {trigger: true});
				$("#personModal").modal("show");
			}		
					
		});

	},
	
		callcontacts : function()
	{
		
		$(".active").removeClass("active");
		var total_count = CALL_CAMPAIGN.total_count;
		var callSetting = {};
		callSetting['total_count'] = total_count;
		callSetting['time']=[10,20,30,40,50,60];
		
		getTemplate("call-campaign-setting", callSetting, undefined, function(template_ui){
			if(!template_ui)
				  return;
			  
			$(".butterbar").hide();
			$("#content").html($(template_ui));	
			$('[data-toggle="tooltip"]').tooltip();

		}, "#content"); 



	}
		
	});

function getAndUpdateCollectionCount(type, el, countFetchURL){

		console.log("countFetchURL = " + countFetchURL);

		var count_message = "";
    	$("#contacts-count").html(count_message);

    	var countURL = "";
    	if(type == "contacts")
    		countURL = App_Contacts.contactsListView.options.url + "/count";
    	else if(type == "workflows")
    		countURL = countFetchURL + "/count";
     	else
    		countURL = App_Companies.companiesListView.options.url + "/count";

    	// Hide bulk action checkbox
    	$(".thead_check", el).closest("label").css("visibility", "hidden");
    	$("table", el).addClass("hide-head-checkbox");

    	abortCountQueryCall();

    	Count_XHR_Call = $.get(countURL, {}, function(data){
    		        data = parseInt(data);
    		        
                    count_message = "<small> (" + data + " Total) </small>";
					$('#contacts-count').html(count_message);

					if(type == "workflows")
						  $("span.badge.bg-primary", el).html(data);

					// Reset collection
					if(type == "contacts")
						App_Contacts.contactsListView.collection.models[0].set("count", data, {silent: true});
					else if(type == "workflows"){
						
					} else{
						App_Companies.companiesListView.collection.models[0].set("count", data, {silent: true});
					}

					$(".thead_check", el).closest("label").css("visibility", "visible");
					$("table", el).removeClass("hide-head-checkbox");	
    	});
}

function abortCountQueryCall(){
	try{
		Count_XHR_Call.abort();
	}catch(e){}
}

function sendMail(id,subject,body,cc,bcc,that,custom_view)
{
	var model = {};
		
		if(!canSendEmails(1))
		{
			var pendingEmails = getPendingEmails();
			window.history.back();
			var title = "Emails Limit";
			var yes = "";
			var no = "Ok"
			var upgrade_link =  'Please <a  href="#subscribe" class="action text-info" data-dismiss="modal" subscribe="subscribe" action="deny"> upgrade </a> your email subscription.';
			var emialErrormsg = '<div class="m-t-xs">To continue sending emails from your account, please<a href="#subscribe" class="action text-info" data-dismiss="modal" subscribe="subscribe" action="deny"> purchase </a>more.</div>';
			var message = "<div>Sorry, your emails quota has been utilized.</div>" + emialErrormsg;
			
			showModalConfirmation(title, 
					message, 
					""
				, function(element){
						
					// No callback
						Backbone.history.navigate( "subscribe", { trigger : true });
						return;
					},
					function(element){
						
					}, yes, no);
			return;
		}

		if(custom_view){
			model=that.toJSON();
		}
		else{
		// Takes back to contacts if contacts detail view is not defined
		if (that.contactDetailView && !that.contactDetailView.model.get(id))
		{
			// Show the email form with the email prefilled from the curtrent contact
			model = that.contactDetailView.model.toJSON();
		}
		
		if(App_Companies.companyDetailView){
			var compEmailTemp = getPropertyValue(App_Companies.companyDetailView.model.toJSON().properties,'email');
			if(id && id == compEmailTemp){
				model = App_Companies.companyDetailView.model.toJSON();
			}
		}
	}
	
		var el = $("#content").html('<div id="send-email-listener-container"></div>').find('#send-email-listener-container').html(getTemplate("send-email", model));
		
		// Call setupTypeAhead to get contacts
		agile_type_ahead("to", el, contacts_typeahead, null, null, "email-search", null, true, null, true);


		$("#content").html('<div id="send-email-listener-container"></div>');
		//var that = this;
		getTemplate("send-email", model, undefined, function(template_ui){
			if(!template_ui)
				  return;

			var el = $("#send-email-listener-container").html($(template_ui));

			// Call setupTypeAhead to get contacts
			agile_type_ahead("to", el, contacts_typeahead, null, null, "email-search", null, true, null, true);

			agile_type_ahead("email_cc", el, contacts_typeahead, null, null, "email-search", null, true, null, true);

			agile_type_ahead("email_bcc", el, contacts_typeahead, null, null, "email-search", null, true, null, true);

			// To append name to email
			if (id)
			{
				var name;

				// For Reply all, id may contains multiple emails. If contains multiple, skip
				if (model && id.indexOf(',') == -1)
				{
					if (model.type == "PERSON")
					{

						var first_name = getPropertyValue(model.properties, "first_name");
						var last_name = getPropertyValue(model.properties, "last_name");

						if (first_name || last_name)
						{
							name = first_name ? first_name : "";
							name = (name + " " + (last_name ? last_name : "")).trim();
						}
					}
					else
					{
						var company_name = getPropertyValue(model.properties, "name");
						name = (company_name ? company_name : "").trim();
					}
				}

				if (name && name.length)
				{
					var data = id;

					// If already appended with name, skip
					if(id.indexOf('<') == -1 && id.indexOf('>') == -1)
						data = name + ' <' + id.trim() + '>';

					$('#to', el)
							.closest("div.controls")
							.find(".tags")
							.append(
									'<li class="tag  btn btn-xs btn-primary m-r-xs inline-block" data="' + data + '"><a href="#contact/' + model.id + '">' + name + '</a><a class="close" id="remove_tag">&times</a></li>');
				}
				else
					$("#emailForm", el).find('input[name="to"]').val(id);
			}
			else
				$("#emailForm", el).find('input[name="to"]').val('');

			// Checks Zoomifier tag for contact
			if (checkTagAgile("Zoomifier") && that.contactDetailView)
			{
				// Appends zoomifier link to attach their documents.
				head.js(LIB_PATH + 'lib/zoomifier.contentpicker.min.js', function()
				{
					$("#emailForm", el).find('textarea[name="body"]').closest(".controls")
							.append('<div><a style="cursor:pointer;" onclick="Javascript:loadZoomifierDocSelector();"><i class="icon-plus-sign"></i> Attach Zoomifier Doc</a></div>');
				});
			}

			// Populate from address and templates
			populate_send_email_details(el);
			
			if(subject)
				$("#emailForm",el).find('input[name="subject"]').val(subject);
			
			if(cc)
			{
				$("#emailForm",el).find('#email_cc').closest('.control-group').show();
				$("#emailForm",el).find('input[name="email_cc"]').val(cc);
			}
			
			if(bcc)
			{
				$("#emailForm",el).find('#email_bcc').closest('.control-group').show();
				$("#emailForm",el).find('input[name="email_bcc"]').val(bcc);
			}
			
			// Setup HTML Editor
			if(id)
			{		
				setupTinyMCEEditor('textarea#email-body', false, undefined, function(){
					
						if(!body)
							body = '';
					
						// Add tinymce content
						set_tinymce_content('email-body', body);
						
						// Register focus
						register_focus_on_tinymce('email-body');
				
					});
			}
			else
			{	
				setupTinyMCEEditor('textarea#email-body', true, undefined, function(){

						if(!body)
							body = '';
					
						// Add tinymce content
						set_tinymce_content('email-body', body);
						
						// Register focus
						register_focus_on_tinymce('email-body')
				});
			}
			
			initializeSendEmailListeners();
			sendEmailAttachmentListeners("send-email-listener-container");
			
			
		}, "#send-email-listener-container"); 
}