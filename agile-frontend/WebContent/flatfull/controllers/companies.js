/**
 * Creates backbone router for companies management and filter (custom view)
 * operations.
 * 
 * @module Company management & filters
 */

COMPANIES_HARD_RELOAD = true;

var CompaniesRouter = Backbone.Router
.extend({
	
	routes : {
	
		/* Companies */
		"companies" : "companies",
	
		"company/:id" : "companyDetails",
		
		"company-edit" : "editCompany",
		
		"company-view-prefs" : "companyViewPrefs"
	},
	
	/**
	 * Fetches all the companies and shows as list, if tag_id
	 * and company_filter_id are not defined, if any one of them is defined then
	 * fetches the contacts related to that particular id (tag_id or
	 * company_filter_id) and shows as list. Adds tags, charts for tags and
	 * filter views to the contacts list from postRenderCallback of its
	 * Base_Collection_View. Initiates infiniScroll to fetch contacts
	 * (25 in count) step by step on scrolling down instead of fetching
	 * all at once.
	 */
	companies : function(tag_id, company_filter_id, grid_view, is_lhs_filter, view_data)
	{

		if (SCROLL_POSITION)
		{
			$('html, body').animate({ scrollTop : SCROLL_POSITION }, 1000);
			SCROLL_POSITION = 0;
		}
		else
		{
			$(window).scrollTop(0);
		}
		
		// If contacts are selected then un selects them
		SELECT_ALL = false;
		
		/**
		 * If collection is already defined and contacts are fetched the
		 * show results instead of initializing collection again
		 */
		if (COMPANIES_HARD_RELOAD == true)
		{
			this.companiesListView = undefined;
			COMPANIES_HARD_RELOAD = false;
			view_data = undefined;
			// App_Companies.companyViewModel = undefined;
		}
		
		// If id is definesd get the respective custom view object
		if (!view_data)
		{
			// Once view id fetched we use it without fetching it.
			if (!App_Companies.companyViewModel)
			{
				var view = new Backbone.Model();
				view.url = 'core/api/contact-view-prefs/company';
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
						App_Companies.companies();
						return;
					}
					App_Companies.companyViewModel = data.toJSON();
					App_Companies.companies(tag_id, undefined, undefined, is_lhs_filter,App_Companies.companyViewModel);

				} });
				return;
			}

			view_data = App_Companies.companyViewModel;

		}

		var template_key = "companies-custom-view";
		var individual_tag_name = "tr";
		var sort_key = _agile_get_prefs("company_sort_field");
		if (!sort_key || sort_key == null)
		{
			sort_key = '-created_time';
			// Saves Sort By in cookie
			_agile_set_prefs('company_sort_field', sort_key);
		}

		// Default url for contacts route
		var url = '/core/api/contacts/companies/list';
		var collection_is_reverse = false;
		this.tag_id = tag_id;
		var postData;

		// Tags, Search & default browse comes to the same function
		if (tag_id)
		{
			tag_id = decodeURI(tag_id);

			tag_id = decodeURI(tag_id);

			// erase filter cookie
			_agile_delete_prefs('company_filter');
			
			if (this.companiesListView && this.companiesListView.collection)
			{

				if (this.companiesListView.collection.url.indexOf('core/api/tags/list/' + tag_id) == -1)
				{
					this.companiesListView = undefined;
				}
			}

			this.customView(_agile_get_prefs("contact_view"), undefined, 'core/api/tags/list/' + tag_id, tag_id);
			return;

		}
		else
		{
			if (this.companiesListView && this.companiesListView.collection)
			{

				if (this.companiesListView.collection.url.indexOf('core/api/tags/list') != -1)
				{
					console.log(window.location.hash = '#companies');
					this.companiesListView = undefined;
				}
			}
		}

		// If contact-filter cookie is defined set url to fetch
		// respective filter results
		if (company_filter_id || (company_filter_id = _agile_get_prefs('company_filter')))
		{
			collection_is_reverse = false;
			url = "core/api/filters/query/list/" + company_filter_id;
		}

		console.log("while creating new base collection view : " + collection_is_reverse);

		if (this.companiesListView && this.companiesListView.collection.url == url)
		{
			this.companiesListView.collection.url = url;
			
			var el = this.companiesListView.render(true).el;

			$('#content').html(el);

			contactFiltersListeners("lhs_filters_conatiner");

			$(".active").removeClass("active");
			$("#companiesmenu").addClass("active");
			return;
		}
		if (_agile_get_prefs('dynamic_company_filter'))
		{
			url = 'core/api/filters/filter/dynamic-filter';
			postData = _agile_get_prefs('dynamic_company_filter');
		}

		var slateKey = getCompanyPadcontentKey(url);
		if (is_lhs_filter)
		{
			template_key = "companies-custom-view-table";
			/*if (grid_view || _agile_get_prefs("agile_contact_view"))
			{
				template_key = "contacts-grid-table";
				individual_tag_name = "div";
			}*/
		}
		
		/*
		 * cursor and page_size options are taken to activate
		 * infiniScroll
		 */
		this.companiesListView = new Contacts_Events_Collection_View({ url : url, restKey : "contact", modelData : view_data, global_sort_key : sort_key,
			templateKey : template_key, individual_tag_name : 'tr', slateKey : slateKey, cursor : true, request_method : 'POST', post_data: {'filterJson': postData}, page_size : 25, sort_collection : false,
			postRenderCallback : function(el, collection)
			{
				// To set chats and view when contacts are fetch by
				// infiniscroll
				//setup_tags(el);

				company_list_view.init(el);

				setUpCompanySortFilters(el);

				abortCountQueryCall();
				
				if(is_lhs_filter) {

					if(collection.models.length > 0 && !collection.models[0].get("count")){
						// Call to get Count 
						getAndUpdateCollectionCount("companies", el);						
					}
					else {
						var count = 0;
						if(collection.models.length > 0) {
							count = collection.models[0].attributes.count || collection.models.length;
						}
						var count_message;
						if (count > 9999 && (_agile_get_prefs('company_filter') || _agile_get_prefs('dynamic_company_filter')))
							count_message = "<small> (" + 10000 + "+ Total) </small>" + '<span style="vertical-align: text-top; margin-left: -5px">' + '<img border="0" src="' + updateImageS3Path("/img/help.png")+ '"' + 'style="height: 10px; vertical-align: middle" rel="popover"' + 'data-placement="bottom" data-title="Lead Score"' + 'data-content="Looks like there are over 10,000 results. Sorry we can\'t give you a precise number in such cases."' + 'id="element" data-trigger="hover">' + '</span>';
						else
							count_message = "<small> (" + count + " Total) </small>";
						$('#contacts-count').html(count_message);
					}

				} else {

					
				    if(collection.models.length > 0 && !collection.models[0].get("count")){
						// Call to get Count 
						getAndUpdateCollectionCount("companies", el);						
					}
				    					
					setupLhsFilters(el,true);
					contactFiltersListeners("lhs_filters_conatiner");
				}
			} });
		
		var _that = this;
		App_Companies.companyDateFields = COMPANY_DATE_FIELDS;

		if(!App_Companies.companyDateFields){
			$.getJSON("core/api/custom-fields/type/scope?type=DATE&scope=COMPANY", function(customDatefields)
				{
					App_Companies.companyDateFields = customDatefields;

					// Defines appendItem for custom view
					_that.companiesListView.appendItem = function(base_model){
						contactTableView(base_model,customDatefields,this);
					};
			
					// Fetch collection
					_that.companiesListView.collection.fetch();
					
				});
		} else {
			// Defines appendItem for custom view
			_that.companiesListView.appendItem = function(base_model){
				contactTableView(base_model,App_Companies.companyDateFields,this);
			};
	
			// Fetch collection
			_that.companiesListView.collection.fetch();
		}
		

		if (!is_lhs_filter)
		{
			$('#content').html(this.companiesListView.el);
		}
		else
		{
			$('#content').find('.contacts-div').html(this.companiesListView.el);
			$('#bulk-actions').css('display', 'none');
			$('#bulk-select').css('display', 'none');
			COMPANIES_HARD_RELOAD = true;
		}

		$(".active").removeClass("active");
		$("#companiesmenu").addClass("active");
	
	},
	
	/**
	 * Shows a contact in its detail view by taking the contact from
	 * contacts list view, if list view is defined and contains the
	 * contact, otherwise downloads the contact from server side based
	 * on its id. Loads timeline, widgets, map and stars (to rate) from
	 * postRenderCallback of its Base_Model_View.
	 * 
	 */
	companyDetails : function(id, company){

		// For getting custom fields
		if (App_Companies.customFieldsList == null || App_Companies.customFieldsList == undefined)
		{
			App_Companies.customFieldsList = new Base_Collection_View({ url : '/core/api/custom-fields/position', sort_collection : false,
				restKey : "customFieldDefs", templateKey : "admin-settings-customfields", individual_tag_name : 'tr' });
			App_Companies.customFieldsList.collection.fetch();
		}

		var company_collection;

		if (!company && this.companyDetailView && this.companyDetailView.model != null)
		{
			// company_collection = this.contactDetailView;

			if (id == this.companyDetailView.model.toJSON()['id'])
			{
				App_Companies.companyDetails(id, this.companyDetailView.model);
				return;
			}
		}

		// If user refreshes the contacts detail view page directly - we
		// should load from the model
		if (!company)
			if (!this.companiesListView || this.companiesListView.collection.length == 0 || this.companiesListView.collection.get(id) == null)
			{

				console.log("Downloading contact");

				// Download
				var company_details_model = Backbone.Model.extend({ url : function()
				{
					return '/core/api/contacts/' + this.id;
				} });

				var model = new company_details_model();
				model.id = id;
				model.fetch({ success : function(data)
				{

					// Call Contact Details again
					App_Companies.companyDetails(id, model);

				}, error : function(data, response)
				{
					if (response && response.status == '403')

						$("#content").html("<div class='well'> <div class='alert bg-white text-center'><div class='slate-content p-md text'><h4 style='opacity:0.8'> Sorry, your account does not have access to Companies.</h4><div class='text'style='opacity:0.6'>Please contact your admin or account owner to enable this option.</div></div></div></div>");

				} });

				return;
			}

		// If not downloaded fresh during refresh - read from collection
		if (!company)
		{
			// Set url to core/api/contacts/list (If filters are loaded
			// contacts url is changed so set it back)

			// this.companiesListView.collection.url =
			// "core/api/contacts/list";
			company = this.companiesListView.collection.get(id);
		}

		// Assigning contact collection
		if (this.companiesListView && this.companiesListView.collection)
			company_collection = this.companiesListView.collection;

		add_recent_view(company);

		// If contact is of type company , go to company details page
		this.companyDetailView = new Contact_Details_Model_Events({ model : company, isNew : true, template : "company-detail", change : false,
			postRenderCallback : function(el)
			{
				fill_company_related_contacts(id, 'company-contacts', el);
				// Clone contact model, to avoid render and
				// post-render fell in to
				// loop while changing attributes of contact
				var recentViewedTime = new Backbone.Model();
				recentViewedTime.url = "core/api/contacts/viewed-at/" + company.get('id');
				recentViewedTime.save();

				if (App_Companies.companiesListView && App_Companies.companiesListView.collection && App_Companies.companiesListView.collection.get(id))
					App_Companies.companiesListView.collection.get(id).attributes = company.attributes;

				company_util.starify(el);
				company_util.show_map(el);
				// fill_owners(el, contact.toJSON());
				// loadWidgets(el, contact.toJSON());

			} });

		var el = this.companyDetailView.render(true).el;
		$('#content').html(el);
	//	fill_company_related_contacts(id, 'company-contacts');
		// company_detail_tab.initEvents();
		return;
	},
	
	companyViewPrefs : function(){
		var companyView = new Base_Model_View({ url : 'core/api/contact-view-prefs/company', template : "company-view",change: false, 
			restKey : "companyView", window : "companies", postRenderCallback : function(el, modelData)
			{
				fillSelect("custom-fields-optgroup", "core/api/custom-fields/scope?scope=COMPANY", undefined, function(data)
				{
					head.js(LIB_PATH + 'lib/jquery-ui.min.js', LIB_PATH + 'lib/jquery.multi-select.js', function()
					{

						$('#multipleSelect', el).multiSelect();

						$('.ms-selection', el).children('ul').addClass('multiSelect').attr("name", "fields_set").attr("id", "fields_set").sortable();

						$.each(modelData['fields_set'], function(index, field)
						{
							$('#multipleSelect', el).multiSelect('select', field);
						});

					});

				}, '<option value="CUSTOM_{{field_label}}">{{field_label}}</option>', true, el);
			}, saveCallback : function(data)
			{
				COMPANIES_HARD_RELOAD = true;
				App_Companies.navigate("companies", { trigger : true });
				App_Companies.companyViewModel = data.toJSON();

			} });

		$("#content").html(companyView.render().el);
	},
	
	/**
	 * Takes the contact to continue contact form to edit it. If
	 * attempts to edit a contact without defining contact detail view,
	 * navigates to contacts page. Gets the contact to edit, from its
	 * list view or its custom view, if not found in both downloads from
	 * server side (Contact database).
	 */
	editCompany : function(contact)
	{
		var company = null;

		// Takes back to companies if companies detailview is not defined
		if (!this.companyDetailView || !this.companyDetailView.model.id)
		{
			this.navigate("companies", { trigger : true });
			return;
		}

		// If company detail view is defined the get current company
		// model id
		var id = this.companyDetailView.model.id;

		if (this.companyDetailView && this.companyDetailView.model.id)
		{
			company = this.companyDetailView.model.toJSON();
		}

		// If contact list is defined the get contact to edit from the
		// list
		else if (this.companiesListView && this.companiesListView.collection && this.companiesListView.collection.get(id))
		{
			company = this.companiesListView.collection.get(id).toJSON();
		}

		// If contact list view and custom view list is not defined then
		// download contact
		else if (!company)
		{
			// Download contact for edit since list is not defined
			var company_details_model = Backbone.Model.extend({ url : function()
			{
				return '/core/api/contacts/' + id;
			} });

			var model = new company_details_model();

			model.fetch({ success : function(contact)
			{

				// Call Contact edit again with downloaded contact
				// details
				App_Companies.editCompany(company.toJSON());
			} });

			return;
		}

		// Contact Edit - take him to continue-contact form
		add_custom_fields_to_form(company, function(company)
		{
				deserialize_contact(company, 'continue-company');
		}, company.type);
	},
});