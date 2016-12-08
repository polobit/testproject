/**
 * Creates backbone router for contacts management and filter (custom view)
 * operations.
 * 
 * @module Contact management & filters
 */

CONTACTS_HARD_RELOAD = true;

var import_tab_Id;
var REFER_DATA;
var contact_company ;

var ContactsRouter = Backbone.Router.extend({

	routes : { 
		
		"" : "dashboard", 
		
		"dashboard" : "dashboard",
		
		"navigate-dashboard" : "navigateDashboard",
		
		"navigate-dashboard/:id" : "navigateDashboard", 
		
		//clicking on the dashboard icon
		"navbar-dashboard" : "homeDashboard",
		
		// "dashboard-test": "dashboard",

		/* Contacts */
		"contacts" : "contactsNew",
		
		"contact/:id" : "contactDetails",
		
		"import" : "importContacts",

		"import/salesforce" : "salesforceImport",

		//add contact when customfields are there
		"contact-edit" : "editContact",
		
		"contact-add" : "addContact",
		
		"contact-duplicate" : "duplicateContact",
		
		"duplicate-contacts/:id" : "duplicateContacts",

		"merge-contacts" : "mergeContacts",
		
		"tags/:tag" : "contactsNew", 
		
		"send-email" : "sendEmail",
		
		"send-email/documents/:id" : "sendDocumentEmail",
		"send-email/documents/:id/send" : "sendDocumentEmail",

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
	homeDashboard : function(){
		var newRole = $(".appaside.agile-menuactive").attr("data-service-name");
		
		if(CURRENT_DOMAIN_USER.role != newRole )
		{
			_agile_set_prefs("dashboard_" + CURRENT_DOMAIN_USER.id, menuServiceDashboard(newRole));
			updateDashboardRole(newRole);
		}
		Backbone.history.navigate("#", {
            trigger: true
        });
	},
	navigateDashboard : function(id){
		// Call dashboard route
		if(id)
		{
			_agile_set_prefs("dashboard_" + CURRENT_DOMAIN_USER.id, id);
			var prevrole = menuServicerole(id);
			if(CURRENT_DOMAIN_USER.role != prevrole)
			{
				updateDashboardRole(prevrole);
			}
		}
		Backbone.history.navigate("#", {
            trigger: true
        });
	},

	dashboard : function()
	{
		insidePopover=false;
		$("#agile-menu-navigation-container .active").removeClass("active");
		if(CURRENT_DOMAIN_USER.domain == "admin")
		{
			Backbone.history.navigate("domainSearch" , {
                trigger: true
            });
            return;
		}
		var role = CURRENT_DOMAIN_USER.role;
		//var dashboard_name = menuServiceDashboard(role);
		
		var dashboard_name = _agile_get_prefs("dashboard_"+CURRENT_DOMAIN_USER.id);
		if(isNaN(dashboard_name)){
			dashboard_name = menuServiceDashboard(role);	
		}
		else{
				dashboard_name = _agile_get_prefs("dashboard_"+CURRENT_DOMAIN_USER.id);
		}

		


		if(!dashboard_name){
			var selected_id = _agile_get_prefs("selected_dashboard_"+CURRENT_DOMAIN_USER.id);
			if(selected_id == "Dashboard")
				 dashboard_name = "Dashboard";
		}
		
		// Reset dashboard with role selected
		if(!dashboard_name){
			_agile_set_prefs("selected_dashboard_"+CURRENT_DOMAIN_USER.id, id);
			if(CURRENT_DOMAIN_USER.role == "SALES")
				  dashboard_name = "SalesDashboard";
			else if(CURRENT_DOMAIN_USER.role == "MARKETING")
				dashboard_name = "MarketingDashboard";
		}

		dashboard_name = dashboard_name ? dashboard_name : "DashBoard";
		$(".nav.nav-sub li").removeClass("agile-menuactive");
		$(".nav.nav-sub li").removeClass("active");
		$("."+dashboard_name+"-home").addClass("agile-menuactive");
		var dashboardJSON = {};
		if(CURRENT_USER_DASHBOARDS && dashboard_name != "DashBoard") {
			$.each(CURRENT_USER_DASHBOARDS, function(index, value){
				if(dashboard_name != "DashBoard" && value.id == dashboard_name) {
					dashboardJSON["id"] = value.id;
					dashboardJSON["name"] = value.name;
					dashboardJSON["description"] = value.description;
				}
			});
		}

		if(dashboard_name==="MarketingDashboard"){

			dashboardJSON["id"] = "MarketingDashboard";
			dashboardJSON["name"] = "{{agile_lng_translate 'dashboards' 'marketing'}}";
			dashboardJSON["description"] = _agile_get_translated_val("dashboards","marketing-help");

		}else if(dashboard_name == "SalesDashboard"){

			dashboardJSON["id"] = "SalesDashboard";
			dashboardJSON["name"] = "{{agile_lng_translate 'menu' 'sales'}}";
			dashboardJSON["description"] = _agile_get_translated_val("dashboards", "sales-help");

		}else if(!dashboardJSON["id"])
		{
			dashboard_name = "DashBoard";
		}

		getTemplate('portlets', dashboardJSON, undefined, function(template_ui){
				if(!template_ui)
					  return;

				var el = $(template_ui);
				$("#content").html(el);
				if(dashboard_name=="MarketingDashboard")
					$('#automation-video').show();
				
				$('[data-toggle="tooltip"]').tooltip();
				if ((navigator.userAgent.toLowerCase().indexOf('chrome') > -1&&navigator.userAgent.toLowerCase().indexOf('opr/') == -1) && !document.getElementById('agilecrm_extension'))
				{
					try{
						if (typeof chrome && typeof chrome.app && !chrome.app.isInstalled) 
							$("#chrome-extension-button").removeClass('hide');	
					}catch(e){}
					
				}

				loadPortlets(dashboard_name,el);

		}, "#content");
		//$("#home_dashboard").addClass("active");
		
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
			cursor : true, page_size : getMaximumPageSize(), global_sort_key : sort_key, slateKey : slateKey, request_method : 'POST', post_data: {filterJson: postData}, postRenderCallback : function(el, collection)
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
							count_message = "<small> (" + 10000 + "+ " +_agile_get_translated_val('other','total')+") </small>" + '<span style="vertical-align: text-top; margin-left: 0px">' + '<img border="0" src="' + updateImageS3Path("/img/help.png") + '"' + 'style="height: 10px; vertical-align: middle" rel="popover"' + 'data-placement="bottom" data-title="Lead Score"' + 'data-content="'+_agile_get_translated_val('results','over-count')+'"' + 'id="element" data-trigger="hover">' + '</span>';
						else
							count_message = "<small> (" + count + " " +_agile_get_translated_val('other','total')+") </small>";
						$('#contacts-count').html(count_message);

					}
					
				} else {

					setupLhsFilters(cel, is_company);
					setupViews(cel);
					setupContactFilterList(cel, tag_id);
					setUpContactView(cel);
					loadPortlets('Contacts',cel);
				

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
			if($("#select_grid_contacts1"))
			{
				$("#select_grid_contacts1").attr("checked", false);
			}
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
			page_size : getMaximumPageSize(), sort_collection : collection_is_reverse, slateKey : null, postRenderCallback : function(el)
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
			if($("#timeline").is(":visible")){
				$("#timeline").empty();
			}
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

						$("#content").html ("<div class='well'><div class='alert bg-white text-center'><div class='slate-content p-md text'><h4 style='opacity:0.8;margin-bottom:5px!important;'> "+_agile_get_translated_val('contacts','invalid-viewer')+"</h4><div class='text'style='opacity:0.6;'>"+_agile_get_translated_val('companies','enable-permission')+"</div></div></div></div>");

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

		

		// If contact is of type company , go to company details page
		if (contact.get('type') == 'COMPANY')
		{			
			Backbone.history.navigate( "company/"+id, { trigger : true });
			return;
		}

		// If contact is of type lead , go to lead details page
		if (contact.get('type') == 'LEAD')
		{			
			Backbone.history.navigate( "lead/"+id, { trigger : true });
			return;
		}

		this.contactDetailView = new Contact_Details_Model_Events({ model : contact, isNew : true, template : "contact-detail", postRenderCallback : function(el)
		{
			
			$(el).on('click',function(el){
				var newId = el.target.id;
				if(newId == "contact_name")
					return ;
				if(newId == "contactName")
					return ;
				if(newId == 'Contact-input-firstname' || newId == 'Contact-input-lastname')
					return;
				
					inlineNameChange(el,newId);
				
			});
		
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

			loadWidgets(el, contact.toJSON(), "widgets");
			
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
			if(contact)
				addTypeCustomData(contact.get('id') , el);

			} 
			
		});

		var el = this.contactDetailView.render(true).el;
		$(el).find('.content-tabs').tabCollapse(); 
		
		if(!this.contactDetailView.model.get('owner') || CURRENT_DOMAIN_USER.id == this.contactDetailView.model.get('owner').id || hasScope("VIEW_CONTACTS")){
			$('#content').html(el);
			add_recent_view(contact);
		}else{
			$("#content").html ("<div class='well'><div class='alert bg-white text-center'><div class='slate-content p-md text'><h4 style='opacity:0.8;margin-bottom:5px!important;'> "+_agile_get_translated_val('contacts','invalid-viewer')+"</h4><div class='text'style='opacity:0.6;'>"+_agile_get_translated_val('companies','enable-permission')+"</div></div></div></div>");
		}
	/*	if($(".toggle-contact-image .contact-delete-option").length == 0) {
			$(".toggle-contact-image .contact-edit-option").css("margin-left","10px");
			}*/
		// Check updates in the contact.
		checkContactUpdated();

		if(_agile_get_prefs('MAP_VIEW')=="disabled")
				$("#map_view_action").html("<i class='icon-plus text-sm c-p' title='"+_agile_get_translated_val('contact-details','show-map')+"' id='enable_map_view'></i>");
		else
				$("#map_view_action").html("<i class='icon-minus text-sm c-p' title='"+_agile_get_translated_val('contact-details','hide-map')+"' id='disable_map_view'></i>");


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
		if(contact.contact_company_id){							
			$.ajax({
				url : "/core/api/contacts/"+contact.contact_company_id ,
				type: 'GET',
				dataType: 'json',
				success: function(company){
					if(company){
						console.log(company);
						contact_company = company ;
					}
				}
			});
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

		App_Contacts.importContacts = new CONTACTS_IMPORT_VIEW({
			url : 'core/api/upload/status/CONTACTS',
			template : "import-contacts",
			postRenderCallback: function(el)
			{
				var leadsViewLoader = new LeadsViewLoader();
				leadsViewLoader.setupImportView(el);
				
				initializeImportEvents("import-contacts-event-listener");

				if(import_tab_Id) {
					 $('#import-tabs-content a[href="#'+import_tab_Id+'"]', el).tab('show');
					 import_tab_Id=undefined;
				}
				else{
					$('#import-tabs-content a[href="#csv-tab"]', el).tab('show');
				}
			}

		});

		$('#content').html(App_Contacts.importContacts.render().el);

		
/*
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
		*/ 
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

	sendDocumentEmail:function(id) 
	{
		//this.sendEmail(id,null,null,null,null,null,"documents");
		var that=this;
		sendMail(id,null,null,null,null,that,null,"documents");

			var options = {};
		options[_agile_get_translated_val('others','add-new')] = "verify_email";
		
		confirmandVerifyEmail()
	},

	/**
	 * Shows a send email form with some prefilled values (email - from,
	 * to and templates etc..). To prefill the fields the function
	 * populate_send_email_details is called from the
	 * postRenderCallback.
	 */
	sendEmail : function(id, subject, body, cc, bcc, force_reload,id_type)
	{

		// Check old hash and call same function

		if(!force_reload && Agile_Old_Hash && Agile_Old_Hash.indexOf("contact/") > -1)
		{
              var contactId = Agile_Old_Hash.split("/")[1];

             
             // Gets the domain name from the contacts of the custom fields.
               var currentContactJson = App_Contacts.contactDetailView.model.toJSON();
               var email;
               if(contactId == currentContactJson.id){
					var properties = currentContactJson.properties;
					
					$.each(properties,function(id, obj){
						if(obj.name == "email"){
							email = obj.value;
							return false;
						}
					});
			   }

			   if(App_Companies.companyDetailView){
			      var compEmailTemp = getPropertyValue(App_Companies.companyDetailView.model.toJSON().properties,'email');
			      var tempId = id;
			      id=id.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi)[0];
			        if(id && id == compEmailTemp){
				        email = tempId;
			        }
		        }
              
              this.sendEmail(email, subject, body, cc, bcc, true,id_type);
              return;
		}
		var that=this;
		sendMail(id,subject,body,cc,bcc,that);

		
		confirmandVerifyEmail()
	
	},

	sendEmailCustom : function(id, subject, body, cc, bcc,custom_view)
	{
		var that=this.contact_popover;
		insidePopover=false;
		sendMail(id,subject,body,cc,bcc,that,true);
		confirmandVerifyEmail();
	
	},
	
	/**
	 * Custom views, its not called through router, but by cookies
	 */
	// Id = custom-view-id, view_data = custom view data if already
	// availabel, url = filter url if there is any filter
	customView : function(id, view_data, url, tag_id, is_lhs_filter, postData)
	{
		console.log("customView");

		// Load contact detail js file
		tpl_directory.loadTemplates(["contact-detail"], function () {});

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
			// ts.contactViewModel = undefined;
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
			//loadPortlets('Contacts',el);
			if(agile_is_mobile_browser()) {
			// $('#contacts-table tbody tr .icon-append-mobile',el).after('<td><div class="text-md text-muted m-t contact-list-mobile"><i class="fa fa-angle-right"></i></div></td>');
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
			//loadPortlets('Contacts',el);


			$(".active").removeClass("active"); // Activate Contacts
												// Navbar tab
			$("#contactsmenu").addClass("active");
			 App_Contacts.contactsListView.delegateEvents();
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
		that = this ;
		this.contact_custom_view = new Contacts_Events_Collection_View({ url : url, restKey : "contact", modelData : view_data, global_sort_key : sort_key,
			templateKey : template_key,custom_scrollable_element:custom_scrollable_element, individual_tag_name : individual_tag_name, slateKey : slateKey, cursor : true, request_method : 'POST', post_data: {'filterJson': postData}, page_size : getMaximumPageSize(), sort_collection : false,
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

				// Render Contact fields
				setupContactFields(el);

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
							count_message = "<small> (" + 10000 + "+ " +_agile_get_translated_val('other','total')+") </small>" + '<span style="vertical-align: text-top; margin-left: 0px">' + '<img border="0" src="'+ updateImageS3Path("/img/help.png") +'"' + 'style="height: 10px; vertical-align: middle" rel="popover"' + 'data-placement="bottom" data-title="Lead Score"' + 'data-content="'+_agile_get_translated_val('results','over-count')+'"' + 'id="element" data-trigger="hover">' + '</span>';
						else
							count_message = "<small> (" + count + " " +_agile_get_translated_val('other','total')+") </small>";
						$('#contacts-count').html(count_message);
					}

					
				} else {	

					if(collection.models.length > 0 && !collection.models[0].get("count")){
						// Call to get Count 
						getAndUpdateCollectionCount("contacts", el);						
					}

					setupLhsFilters(el);
					loadPortlets('Contacts',el);
				}

				if(agile_is_mobile_browser()) {
				
					var $nextEle = $('<td><div class="text-md text-muted m-t contact-list-mobile"><i class="fa fa-angle-right"></i></div></td>');
					// $('#contacts-table tbody tr .icon-append-mobile',el).after($nextEle);
				}
				

			}, appendItemCallback: function(el){
				if(agile_is_mobile_browser()) {
					// $('#contacts-table tbody tr .icon-append-mobile',el).after('<td><div class="text-md text-muted m-t contact-list-mobile"><i class="fa fa-angle-right"></i></div></td>');
				}
			}, });

		var _that = this;
		App_Contacts.contactDateFields = CONTACTS_DATE_FIELDS;

		App_Contacts.contactContactTypeFields = CONTACTS_CONTACT_TYPE_FIELDS;
		App_Contacts.contactCompanyTypeFields = CONTACTS_COMPANY_TYPE_FIELDS;

		if(!App_Contacts.contactDateFields){
				$.getJSON("core/api/custom-fields/type/scope?type=DATE&scope=CONTACT", function(customDatefields)
				{
					App_Contacts.contactDateFields = customDatefields;
					
					// Defines appendItem for custom view
					_that.contact_custom_view.appendItem = function(base_model){
						contactTableView(base_model,App_Contacts.contactDateFields,this,App_Contacts.contactContactTypeFields,App_Contacts.contactCompanyTypeFields);
					};
					// Fetch collection
					_that.contact_custom_view.collection.fetch();
					contactListener();
					
				});

		} else{

				// Defines appendItem for custom view
				_that.contact_custom_view.appendItem = function(base_model){
					contactTableView(base_model,App_Contacts.contactDateFields,this,App_Contacts.contactContactTypeFields,App_Contacts.contactCompanyTypeFields);
				};
				// Fetch collection
				_that.contact_custom_view.collection.fetch();
		}

		if(!is_lhs_filter) {
			$('#content').html('<div id="contacts-listener-container"></div>');
			$('#contacts-listener-container').html(this.contact_custom_view.el);
			contactFiltersListeners();
			//loadPortlets('Contacts',el);
		} else {
			$('#contacts-listener-container').find('.contacts-inner-div').html(this.contact_custom_view.el);
			$('#bulk-actions').css('display', 'none');
			$('#bulk-select').css('display', 'none');
			$('#bulk-action-btns > button').addClass("disabled");
			if($("#select_grid_contacts1"))
			{
				$("#select_grid_contacts1").attr("checked", false);
			}
			CONTACTS_HARD_RELOAD = true;
		}
			
		// Activate Contacts Navbar tab
		$(".active").removeClass("active");
		$("#contactsmenu").addClass("active");
	
	},
	
	addLead : function(first, last){
		$("#personModal").on("show.bs.modal", function(){
			$(this).find("#fname").val(first);
			$(this).find("#lname").val(last);
		});
		$("#personModal").modal();
	},
	
	addLeadDirectly : function(first, last,mob){
		$("#personModal").on("show.bs.modal", function(){
			$(this).find("#fname").val(first);
			$(this).find("#lname").val(last);
			$(this).find("#phone").val(mob);
		});
		$("#personModal").modal();
	},

	addMobLead : function(mob){
		$("#personModal").on("show.bs.modal", function(){
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
					$('.date_input').attr("placeholder", _agile_get_translated_val("contacts", "select-date"));

					$('.date_input').datepicker({ format : CURRENT_USER_PREFS.dateFormat, weekStart : CALENDAR_WEEK_START_DAY, autoclose: true});

					// To set typeahead for tags
					setup_tags_typeahead();

					// Iterates through properties and ui clones
					
					var fxn_display_company = function(data, item)
					{
						$("#content [name='contact_company_id']")
								.html(
										'<li class="inline-block tag btn btn-xs btn-primary m-r-xs m-b-xs" data="' + data + '"><span><a class="text-white m-r-xs" href="#contact/' + data + '">' + item + '</a><a class="close" id="remove_tag">&times</a></span></li>');
						$("#content #contact_company").hide();
						if(data){							
							$.ajax({
								url : "/core/api/contacts/"+data,
								type: 'GET',
								dataType: 'json',
								success: function(company){
									if(company){
										console.log(company);
										contact_company = company ;
										var prop = null;
										$.each(contact_company.properties , function(){
											if(this.name == "address" && this.subtype == "office")
												prop = JSON.parse(this.value);
										});
										if(prop){
											$("#content .address-type").val("office");
											if(prop.address)
												$("#content #address").val(prop.address);
											if(prop.city)
												$("#content #city").val(prop.city);
											if(prop.state)
												$("#content #state").val(prop.state);
											if(prop.zip)
												$("#content #zip").val(prop.zip);
											if(prop.country)
												$("#content #country").val(prop.country);
										}

									}

								}
							});
						}
					}
					agile_type_ahead("contact_company", $('#content'), contacts_typeahead, fxn_display_company, 'type=COMPANY', '<b>'+_agile_get_translated_val("others","no-results")+'</b> <br/> ' + _agile_get_translated_val("others","add-new-one"));

					$('.contact_input', $('#content')).each(function(){
						agile_type_ahead($(this).attr("id"), $('#custom_contact_'+$(this).attr("id"), $('#content')), contacts_typeahead, undefined, 'type=PERSON');
					});

					$('.company_input', $('#content')).each(function(){
						agile_type_ahead($(this).attr("id"), $('#custom_company_'+$(this).attr("id"), $('#content')), contacts_typeahead, undefined, 'type=COMPANY');
					});

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



	},

	contactsNew : function(tag_id)
	{
		if(tag_id)
		{
			_agile_delete_prefs("contact_filter");
			_agile_delete_prefs('dynamic_contact_filter');
		}

		if(tag_id && _agile_get_prefs("contacts_tag") != tag_id)
		{
			CONTACTS_HARD_RELOAD = true;
			_agile_set_prefs("contacts_tag", tag_id);
		}
		$('#content').html('<div id="contacts-listener-container"></div>');
		var contactsHeader = new Contacts_And_Companies_Events_View({ data : {}, template : "contacts-header", isNew : true,page_size:3,
			postRenderCallback : function(el)
			{
				contacts_view_loader.buildContactsView(el, tag_id);
				
				contacts_view_loader.setUpContactsCount(el);
				
				loadPortlets('Contacts',el);
			} 
		});
		$('#contacts-listener-container').html(contactsHeader.render().el);

		$(".active").removeClass("active");
		$("#contactsmenu").addClass("active");
		$('[data-toggle="tooltip"]').tooltip();
	},

	});


function getAndUpdateCollectionCount(type, el, countFetchURL){

		console.log("countFetchURL = " + countFetchURL);

		var count_message = "";
    	$("#contacts-count").html(count_message);

    	var countURL = "";

    	if(type == "contacts-company")
    		countURL = App_Companies.contacts_Company_List.options.url + "/count";
    	else if(type == "contacts")
    		countURL = App_Contacts.contactsListView.options.url + "/count";

    	else if(type == "workflows")
    		countURL = countFetchURL + "/count";
    	else if(type == "leads")
    		countURL = App_Leads.leadsListView.options.url + "/count";
     	else
    		countURL = App_Companies.companiesListView.options.url + "/count";

    	// Hide bulk action checkbox
    	$(".thead_check", el).closest("label").css("visibility", "hidden");

    	$("table", el).addClass("hide-head-checkbox");

    	abortCountQueryCall();

    	Count_XHR_Call = $.get(countURL, {}, function(data){
    			if(type == "contacts")
    		        data = parseInt(data);
    		        count_message = "<small> (" + data + " "+_agile_get_translated_val('other','total')+") </small>";
					$('#contacts-count').html(count_message);

					if(type == "workflows")
						  $("span.badge.bg-primary", el).html(data);
					else if(type == "leads")
					{
						$('#leads-count').html(count_message);
					}

					// Reset collection
					if(type == "contacts-company")
    					App_Companies.contacts_Company_List.collection.models[0].set("count", data, {silent: true});
					else if(type == "contacts")
						App_Contacts.contactsListView.collection.models[0].set("count", data, {silent: true});
					else if(type == "workflows"){
						if(App_Workflows.active_subscribers_collection && App_Workflows.active_subscribers_collection.collection && App_Workflows.active_subscribers_collection.collection.length > 0)
							App_Workflows.active_subscribers_collection.collection.models[0].set("count", data, {silent: true});
					}else if(type == "leads" && App_Leads.leadsListView && App_Leads.leadsListView.collection && App_Leads.leadsListView.collection.length > 0){
						App_Leads.leadsListView.collection.models[0].set("count", data, {silent: true});
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

function sendMail(id,subject,body,cc,bcc,that,custom_view,id_type)
{
	var model = {};
		
		if(!canSendEmails(1))
		{
			var pendingEmails = getPendingEmails();
			window.history.back();
			var title = _agile_get_translated_val('campaigns', 'emails-limit');
			var yes = "";
			var no = _agile_get_translated_val("reputation", "Ok");
			var upgrade_link =  _agile_get_translated_val('contact-details','please') + ' <a  href="#subscribe" class="action text-info" data-dismiss="modal" subscribe="subscribe" action="deny"> '+_agile_get_translated_val('portlets','upgrade')+' </a> ' + _agile_get_translated_val('billing','your-email-subscription');
			var emialErrormsg = '<div class="m-t-xs">'+_agile_get_translated_val('billing','continue-send-emails')+', ' +_agile_get_translated_val('contact-details','please')+ '<a href="#subscribe" class="action text-info" data-dismiss="modal" subscribe="subscribe" action="deny"> '+_agile_get_translated_val('plan-and-upgrade','purchase')+' </a>'+_agile_get_translated_val('plan-and-upgrade','more')+'.</div>';
			var message = "<div>" +_agile_get_translated_val('billing','email-quota-exceed')+ "</div>" + emialErrormsg;
			
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

		var documentId=null;
		// Takes back to contacts if contacts detail view is not defined
		if (that.contactDetailView && !that.contactDetailView.model.get(id))
		{
			// Show the email form with the email prefilled from the curtrent contact
			model = that.contactDetailView.model.toJSON();
		}
		
		if(App_Companies.companyDetailView){
			var compEmailTemp = getPropertyValue(App_Companies.companyDetailView.model.toJSON().properties,'email');
			id=id.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi)[0];
			if(id && id == compEmailTemp){
				model = App_Companies.companyDetailView.model.toJSON();
			}
		}
		if(id_type=="documents" )
		{
			if(App_Documents.DocumentCollectionView && App_Documents.DocumentCollectionView.collection)
			{
				$.each(App_Documents.DocumentCollectionView.collection.models, function(index, document_model)
				{
					if(id && document_model.id==id	)
					{
						model=document_model.toJSON();	
						return false;
					}	
				});
			}
			if (documentsView && documentsView.collection)
			{
				if(documentsView.collection.get(id))
				{
					model=documentsView.collection.get(id).toJSON();
				}
				
			}
			if(dealDocsView && dealDocsView.collection)
			{
				if(dealDocsView.collection.get(id))
				{
					model=dealDocsView.collection.get(id).toJSON();
				}
			}
		}	

		if(Current_Route && App_Leads.leadDetailView && Current_Route == "lead/"+App_Leads.leadDetailView.model.get("id"))
		{
			model = App_Leads.leadDetailView.model.toJSON();
		}
	}
	
//		var el = $("#content").html('<div id="send-email-listener-container"></div>').find('#send-email-listener-container').html(getTemplate("send-email", model));
		
		// Call setupTypeAhead to get contacts
//		agile_type_ahead("to", el, contacts_typeahead, null, null, "email-search", null, true, null, true);


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
					if(id_type=="documents" && model.id!=null)
					{
						
						$('#emailForm').find('.add-attachment-select').addClass('hide');
						$('#emailForm').find('#eattachment').css('display','block');
						$('#emailForm').find('#attachment_id').css("display",'block');
						$('#emailForm').find('#attachment_id').find("#attachment_fname").removeClass("text-ellipsis")
						$('#emailForm').find('#attachment_id').find("#attachment_fname").attr("href","#documents/" + model.id)
						$('#emailForm').find('#attachment_id').find("#attachment_fname").css( 'cursor', 'pointer' );
				    	$('#emailForm').find('#attachment_id').find("#attachment_fname").html('<div title=' + model.name + ' class="line-clamp activity-tag" style="display:inline;">' + model.name +'</div>');
				    	$('#emailForm').find(".attachment-document-select").css('display','none');
				    	$('#emailForm').find('#eattachment_key').attr('name',"edoc_key");
				    	$('#emailForm').find('#eattachment_key').attr('value',model.id);
				    	$("#emailForm").find("#agile_attachment_name").attr("value", model.name);
				    	$("#emailForm").find(".add-attachment-cancel").addClass("hide");
				    	$("#emailForm").find(".attach-file").addClass("hide");
				    	$("#emailForm").find(".fa-paperclip").removeClass("fa-paperclip").addClass("fa-file-text-o");
				    	$("#emailForm").find("#attachment-select").append('<option selected=\'yes\' value='+ model.id +'>' + model.name+ '</option>');
				    	var first_name ="",last_name="";
				    	if(model.contacts && model.contacts.length>0)
				    	{

				    		var url = '/core/api/contacts/'+ model.contacts[0].id;
							$.ajax({
								url : url,
								type: 'GET',
								dataType: 'json',
								success: function(data){
									model_json=data;
									var email=getPropertyValue(model_json.properties, "email");
									var first_name = getPropertyValue(model_json.properties, "first_name");
									if(model_json.type=="COMPANY")
									{
										first_name = getPropertyValue(model_json.properties, "name");
									}
									var last_name = getPropertyValue(model_json.properties, "last_name");
									var name="";
									if (first_name || last_name)
									{
										name = first_name ? first_name : "";
										name = (name + " " + (last_name ? last_name : "")).trim();
									}
									// If already appended with name, skip
									if(email && email.indexOf('<') == -1 && email.indexOf('>') == -1)
										email = name + ' <' + email.trim() + '>';

									$('#to', el)
											.closest("div.controls")
											.find(".tags")
											.append(
													'<li class="tag  btn btn-xs btn-primary m-r-xs inline-block" data="' + email + '"><a class="text-white " href="#contact/' + model_json.id + '">' + name + '</a><a class="close text-white m-l-xs v-middle" id="remove_tag">&times</a></li>');									
												}
							});
					    	$("#edoc_contact_id","#emailForm").val(model.contacts[0].id);
					    	$("#contact_type","#emailForm").val(model.contacts[0].type);
					    	$("#doc_type","#emailForm").val(model.doc_type);
					    	/*
			               	first_name = getPropertyValue(model.contacts[0].properties, "first_name");
							last_name = getPropertyValue(model.contacts[0].properties, "last_name");
							id=getPropertyValue(model.contacts[0].properties, "email");*/
						}
						if (first_name || last_name)
						{
							name = first_name ? first_name : "";
							name = (name + " " + (last_name ? last_name : "")).trim();
						}
						
					}
					else if (model.type == "PERSON")
					{

						name  = getContactName(model);
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
					if(id && id.indexOf('<') == -1 && id.indexOf('>') == -1)
						data = name + ' <' + id.trim() + '>';

					$('#to', el)
							.closest("div.controls")
							.find(".tags")
							.append(
									'<li class="tag  btn btn-xs btn-primary m-r-xs inline-block" data="' + data + '"><a class="text-white" href="#contact/' + model.id + '">' + name + '</a><a class="close text-white m-l-xs v-middle" id="remove_tag">&times</a></li>');
				}
				else  if(!id_type)
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
							.append('<div><a style="cursor:pointer;" onclick="Javascript:loadZoomifierDocSelector();"><i class="icon-plus-sign"></i> '+_agile_get_translated_val('tags','attach-zoomifier')+'</a></div>');
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
function addTypeCustomData(contactId, el){
	var customFieldsView = new Base_Collection_View({
							url : 'core/api/contacts/getCustomfieldBasedContacts?id='+contactId+'&type=CONTACT',
							sortKey : 'time',
							descending : true,
							templateKey : "contact-type-custom-fields",
							cursor : true,
							page_size : getMaximumPageSize(),
							postRenderCallback : function(el){
								
							}
						});
	customFieldsView.collection.fetch({

		success : function(data){
			if(data.length){
				$('#contacts-type-custom-fields' , el).removeClass('hidden');
			}
		}
	});
	$('#contacts-type-custom-fields' , el).html(customFieldsView.render().el);
	
}

function confirmandVerifyEmail()
{
	var options = {};
	options["{{agile_lng_translate 'verification' 'add-new'}}"] = "verify_email";

	fetchAndFillSelect(
			'core/api/account-prefs/verified-emails/all',
			"email",
			"email",
			undefined,
			options,
			$('#from_email'),
			"prepend",
			function($select, data) {
				
				if($select.find('option').size()===1){
					$select.find("option:first").before("<option value='NOEMAIL'>- No Verified Email -</option>");
					$select.find('option[value ="NOEMAIL"]').attr("selected", "selected");
				}
				else {
					var ownerEmail = $select.find('option[value = \"'+CURRENT_DOMAIN_USER.email+'\"]').val();
					if(typeof(ownerEmail) !== "undefined")
						$select.find('option[value = \"'+CURRENT_DOMAIN_USER.email+'\"]').attr("selected", "selected");
					else{
						$select.find("option:first").before("<option value='SELECTEMAIL'>Select Email</option>");
						$select.find('option[value ="SELECTEMAIL"]').attr("selected", "selected");
					}
				}
				rearrange_from_email_options($select, data);
			});

}

function menuServiceDashboard(role){
		switch(role){
			case 'SALES':
			    return "SalesDashboard"
			    break;
			case 'MARKETING':
				return "MarketingDashboard";
				break;
			case 'SERVICE' :
				return "Dashboard";
				break;
		}
}
function menuServicerole(dashboard){
		switch(dashboard){
			case 'SalesDashboard':
			    return "SALES"
			    break;
			case 'MarketingDashboard':
				return "MARKETING";
				break;
			case 'Dashboard' :
				return "SERVICE";
				break;
		}
}
