/**
 * Creates backbone router for contacts management and filter (custom view)
 * operations.
 * 
 * @module Contact management & filters
 */

CONTACTS_HARD_RELOAD = true;

var ContactsRouter = Backbone.Router.extend({

	routes : { 
		
		"" : "dashboard", 
		
		"dashboard" : "dashboard",
		
		// "dashboard-test": "dashboard",

		/* Contacts */
		"contacts" : "contacts",
		
		"contact/:id" : "contactDetails",
		
		"import" : "importContacts",
		
		"contact-edit" : "editContact",
		
		"contact-duplicate" : "duplicateContact",
		
		"duplicate-contacts/:id" : "duplicateContacts",

		"merge-contacts" : "mergeContacts",
		
		"tags/:tag" : "contacts", 
		
		"send-email" : "sendEmail",
		
		"send-email/:id" : "sendEmail",
		
		"add-campaign" : "addContactToCampaign",

		/* Return back from Scribe after oauth authorization */
		"gmail" : "email", "twitter" : "socialPrefs", "linkedin" : "socialPrefs",
		
		/* CALL */
		"contacts/call-lead/:first/:last" : "addLead"
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

	dashboard : function()
	{

		$(".active").removeClass("active");

		var time_int = parseInt($('meta[name="last-login-time"]').attr('content'));
		var time_date = new Date(time_int * 1000);

		head.js(LIB_PATH + 'lib/jquery.timeago.js', LIB_PATH + 'jscore/handlebars/handlebars-helpers.js', function()
		{
			var el = $(getTemplate('dashboard1', { time_sec : (time_date).toString().toLowerCase(), time_format : "" }));
			$("#content").html(el);
			
			$("span#last-login-time").timeago();
			
			setup_dashboard(el);
			// loadDynamicTimeline("my-timeline", el);
		});
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
	contacts : function(tag_id, filter_id, grid_view)
	{
		if(SCROLL_POSITION)
		{
			$('html, body').animate({ scrollTop : SCROLL_POSITION  },1000);
			SCROLL_POSITION = 0;
		}
		
		// If contacts are selected then un selects them
		SELECT_ALL = false;

		var max_contacts_count = 20;
		var template_key = "contacts";
		var individual_tag_name = "tr";
		
		// Checks if user is using custom view. It check for grid view
		if (grid_view || readCookie("agile_contact_view"))
		{
			template_key = "contacts-grid";
			individual_tag_name = "div";
		}
		
		// Default url for contacts route
		var url = '/core/api/contacts';
		var collection_is_reverse = false;
		this.tag_id = tag_id;

		// Check if contacts page is set to show companie
		if (readCookie('company_filter'))
		{
			eraseCookie('contact_filter');
		}
		// Tags, Search & default browse comes to the same function
		if (tag_id)
		{
			tag_id = decodeURI(tag_id);

			tag_id = decodeURI(tag_id);

			
			// erase filter cookie
			eraseCookie('contact_filter');
			eraseCookie('company_filter');

			if (this.contactsListView && this.contactsListView.collection)
			{

				if (this.contactsListView.collection.url.indexOf('core/api/tags/' + tag_id) == -1)
				{
					this.contactsListView = undefined;
				}
			}

			if (readCookie("contact_view"))
			{
				this.customView(readCookie("contact_view"), undefined, 'core/api/tags/' + tag_id, tag_id);
				return;
			}

			filter_id = null;

			url = '/core/api/tags/' + tag_id;

			tag_id = unescape(tag_id);
			
		}
		else
		{
			if (this.contactsListView && this.contactsListView.collection)
			{

				if (this.contactsListView.collection.url.indexOf('core/api/tags/') != -1)
				{
					console.log(window.location.hash = '#contacts');
					this.contactsListView = undefined;
				}
			}
		}

		if (readCookie('company_filter'))
		{
			// Change template to companies - this template is separate
			// from contacts default template
			url = "core/api/contacts/companies";

			if (!grid_view && !readCookie("agile_contact_view"))
				template_key = "companies";
		}

		// If contact-filter cookie is defined set url to fetch
		// respective filter results
		if (filter_id || (filter_id = readCookie('contact_filter')))
		{
			collection_is_reverse = false;
			url = "core/api/filters/query/" + filter_id;
		}

		// If view is set to custom view, load the custom view
		// If Company filter active-don't load any Custom View Show
		// default
		if (!readCookie('company_filter') && readCookie("contact_view"))
		{
			// If there is a filter saved in cookie then show filter
			// results in custom view saved
			if (readCookie('contact_filter'))
			{
				// Then call customview function with filter url
				this.customView(readCookie("contact_view"), undefined, "core/api/filters/query/" + readCookie('contact_filter'), tag_id);
				return;
			}

			// Else call customView function fetches results from
			// default url : "core/api/contacts"
			this.customView(readCookie("contact_view"), undefined);
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

			$('#content').html(this.contactsListView.render(true).el);

			$(".active").removeClass("active");
			$("#contactsmenu").addClass("active");
			return;
		}

		var slateKey = getContactPadcontentKey(url);
		
		/*
		 * cursor and page_size options are taken to activate
		 * infiniScroll
		 */
		this.contactsListView = new Base_Collection_View({ url : url, templateKey : template_key, individual_tag_name : individual_tag_name,
			cursor : true, page_size : 25, sort_collection : collection_is_reverse, slateKey : slateKey,  postRenderCallback : function(el)
			{

				// Contacts are fetched when the app loads in
				// the initialize
				var cel = App_Contacts.contactsListView.el;
				var collection = App_Contacts.contactsListView.collection;

				// To set heading in template
				if (readCookie('company_filter'))
				{
					// $('#contact-heading',el).text('Companies');
				}

				// To set chats and view when contacts are fetch by
				// infiniscroll
				setup_tags(cel);
				pieTags(cel);
				setupViews(cel);

				/*
				 * Show list of filters dropdown in contacts list, If
				 * filter is saved in cookie then show the filter name
				 * on dropdown button
				 */
				setupContactFilterList(cel, tag_id);
				start_tour("contacts", el);
			} });

		// Contacts are fetched when the app loads in the initialize
		this.contactsListView.collection.fetch();

		$('#content').html(this.contactsListView.render().el);

		$(".active").removeClass("active");
		$("#contactsmenu").addClass("active");

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
		this.duplicateContactsListView = new Base_Collection_View({ url : url, templateKey : template_key, individual_tag_name : 'tr', cursor : true,
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
			this.mergeContactsView = new Base_Model_View({ template : template_key, data : bigObject, postRenderCallback : function(el)
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

		var contact_collection;

		if (!contact && this.contactDetailView && this.contactDetailView.model != null)
		{
			contact_collection = this.contactDetailView;

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

					// Call Contact Details again
					App_Contacts.contactDetails(id, model);

				} });

				return;
			}

		// If not downloaded fresh during refresh - read from collection
		if (!contact)
		{
			// Set url to core/api/contacts (If filters are loaded
			// contacts url is changed so set it back)

			this.contactsListView.collection.url = "core/api/contacts";
			contact = this.contactsListView.collection.get(id);
			contact_collection = this.contactsListView.collection;

		}

		add_recent_view(contact);

		// If contact is of type company , go to company details page
		if (contact.get('type') == 'COMPANY')
		{
			this.contactDetailView = new Base_Model_View({ model : contact, isNew : true, template : "company-detail",
				postRenderCallback : function(el)
				{
					fill_company_related_contacts(id, 'company-contacts');
					// Clone contact model, to avoid render and
					// post-render fell in to
					// loop while changing attributes of contact
					var recentViewedTime = new Backbone.Model();
					recentViewedTime.url = "core/api/contacts/viewed-at/" + contact.get('id');
					recentViewedTime.save();

					if (App_Contacts.contactsListView && App_Contacts.contactsListView.collection && App_Contacts.contactsListView.collection.get(id))
						App_Contacts.contactsListView.collection.get(id).attributes = contact.attributes;

					starify(el);
					show_map(el);
					//fill_owners(el, contact.toJSON());
					// loadWidgets(el, contact.toJSON());
				} });

			var el = this.contactDetailView.render(true).el;
			$('#content').html(el);
			fill_company_related_contacts(id, 'company-contacts');
			return;
		}

		this.contactDetailView = new Base_Model_View({ model : contact, isNew : true, template : "contact-detail", postRenderCallback : function(el)
		{

			// Clone contact model, to avoid render and post-render fell
			// in to
			// loop while changing attributes of contact
			var recentViewedTime = new Backbone.Model();
			recentViewedTime.url = "core/api/contacts/viewed-at/" + contact.get('id');
			recentViewedTime.save();

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
				contact_detail_view_navigation(id, contact_collection, el);

			//fill_owners(el, contact.toJSON());
			start_tour("contact-details", el);
			
			// For sip
			if (Sip_Stack != undefined && Sip_Register_Session != undefined && Sip_Start == true)
			{
				$(".contact-make-sip-call").show();
				$(".contact-make-twilio-call").hide();
				$(".contact-make-call").hide();
			}
			else if (Twilio.Device.status() == "ready" || Twilio.Device.status() == "busy")
			{
				$(".contact-make-sip-call").hide();
				$(".contact-make-twilio-call").show();
				$(".contact-make-call").hide();
			}	
			} });

		var el = this.contactDetailView.render(true).el;

		$('#content').html(el);
		
		// Check updates in the contact.
		checkContactUpdated();
		
		// For sip
		if (Sip_Stack != undefined && Sip_Register_Session != undefined && Sip_Start == true)
		{
			$(".contact-make-sip-call").show();
			$(".contact-make-twilio-call").hide();
			$(".contact-make-call").hide();
		}
		else if (Twilio.Device.status() == "ready" || Twilio.Device.status() == "busy")
		{
			$(".contact-make-sip-call").hide();
			$(".contact-make-twilio-call").show();
			$(".contact-make-call").hide();
		}
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
		var json = contact.toJSON();

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
		$('#content').html(getTemplate("import-contacts", {}));
	},
	

	/**
	 * Subscribes a contact to a campaign. Loads the related template
	 * and triggers the custom event "fill_campaigns_contact" to show
	 * the campaigns drop down list.
	 */
	addContactToCampaign : function()
	{
		$("#content").html(getTemplate("contact-detail-campaign", {}));

		$('body').trigger('fill_campaigns_contact');
	},

	/**
	 * Shows a send email form with some prefilled values (email - from,
	 * to and templates etc..). To prefill the fields the function
	 * populate_send_email_details is called from the
	 * postRenderCallback.
	 */
	sendEmail : function(id, subject, body)
	{
		
		var model = {};
		
		// Takes back to contacts if contacts detail view is not defined
		if (this.contactDetailView && !this.contactDetailView.model.get(id))
		{
			// Show the email form with the email prefilled from the curtrent contact
			model = this.contactDetailView.model.toJSON();
		}
		
		var el = $("#content").html(getTemplate("send-email", model));
		
		if (id)
			$("#emailForm", el).find('input[name="to"]').val(id);
		else
			$("#emailForm", el).find('input[name="to"]').val('');

		// Checks Zoomifier tag for contact
		if (checkTagAgile("Zoomifier") && this.contactDetailView)
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
		
		// Setup HTML Editor
		if(id)
		{		
			setupTinyMCEEditor('textarea#email-body', false, undefined, function(){
				
					if(!body)
						body = '';
				
					// Add tinymce content
					set_tinymce_content('email-body', body);
			
				});
		}
		else
		{	
			setupTinyMCEEditor('textarea#email-body', true, undefined, function(){

					if(!body)
						body = '';
				
					// Add tinymce content
					set_tinymce_content('email-body', body);
			});
		}
		
	},
	
	/**
	 * Custom views, its not called through router, but by cookies
	 */
	// Id = custom-view-id, view_data = custom view data if already
	// availabel, url = filter url if there is any filter
	customView : function(id, view_data, url, tag_id)
	{
		SELECT_ALL = false;
		App_Contacts.tag_id = tag_id;

		// If url is not defined set defult url to contacts
		if (!url)
		{
			url = "core/api/contacts";
		}

		if (CONTACTS_HARD_RELOAD == true)
		{
			this.contact_custom_view = undefined;
			CONTACTS_HARD_RELOAD = false;
			view_data = undefined;
		}

		// If id is defined get the respective custom view object
		if (id && !view_data)
		{
			// Once view id fetched we use it without fetching it.
			if (!App_Contacts.contactViewModel)
			{
				var view = new Backbone.Model();
				view.url = 'core/api/contact-view/' + id;
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
						eraseCookie("contact_view");

						// Loads default contact view
						App_Contacts.contacts();
						return;
					}
					App_Contacts.contactViewModel = data.toJSON();
					App_Contacts.customView(undefined, App_Contacts.contactViewModel, url, tag_id);

				} });
				return;
			}

			view_data = App_Contacts.contactViewModel;

		}

		// If defined
		if (this.contact_custom_view)
		{
			// App_Contacts.contactsListView=this.contact_custom_view;
			if (!(this.contact_custom_view.collection.url == url))
			{
				App_Contacts.contact_custom_view.collection.url = url;
				App_Contacts.contact_custom_view.collection.fetch()
				$('#content').html(App_Contacts.contact_custom_view.render().el);
				return;
			}

			var el = App_Contacts.contact_custom_view.render(true).el;
			$('#content').html(el);

			if (readCookie('company_filter'))
				$('#contact-heading', el).text('Companies');

			setup_tags(el);
			pieTags(el);
			setupViews(el, view_data.name);
			setupContactFilterList(el, tag_id);

			$(".active").removeClass("active"); // Activate Contacts
												// Navbar tab
			$("#contactsmenu").addClass("active");
			return;
		}

		var slateKey = getContactPadcontentKey(url);
		
		this.contact_custom_view = new Base_Collection_View({ url : url, restKey : "contact", modelData : view_data,
			templateKey : "contacts-custom-view", individual_tag_name : 'tr', slateKey : slateKey, cursor : true, page_size : 25, sort_collection : false,
			postRenderCallback : function(el)
			{
				App_Contacts.contactsListView = App_Contacts.contact_custom_view;

				// To set heading in template
				if (readCookie('company_filter'))
					$('#contact-heading', el).text('Companies');

				// To set chats and view when contacts are fetch by
				// infiniscroll
				setup_tags(el);

				pieTags(el);
				setupViews(el, view_data.name);

				// show list of filters dropdown in contacts list
				setupContactFilterList(el, App_Contacts.tag_id);
			} });

		// Defines appendItem for custom view
		this.contact_custom_view.appendItem = contactTableView;

		// Fetch collection
		this.contact_custom_view.collection.fetch();

		$('#content').html(this.contact_custom_view.el);

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
	}
});
