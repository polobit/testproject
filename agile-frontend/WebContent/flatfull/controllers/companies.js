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
	
		"company/:id" : "companyDetails"
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
	companies : function(tag_id, company_filter_id, grid_view, is_lhs_filter)
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

		var max_contacts_count = 20;
		var is_company = true;
		var template_key = "companies";
		var individual_tag_name = "tr";
		var sort_key = readCookie("company_sort_field");
		if (!sort_key || sort_key == null)
		{
			sort_key = '-created_time';
			// Saves Sort By in cookie
			createCookie('sort_by_name', sort_key);
		}

		// Checks if user is using custom view. It check for grid view
		if (grid_view || readCookie("agile_contact_view"))
		{
			template_key = "contacts-grid";
			individual_tag_name = "div";
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
			//eraseCookie('contact_filter');
			eraseCookie('company_filter');
			//eraseCookie('contact_filter_type');
			//eraseData('dynamic_contact_filter');

			if (this.companiesListView && this.companiesListView.collection)
			{

				if (this.companiesListView.collection.url.indexOf('core/api/tags/list/' + tag_id) == -1)
				{
					this.companiesListView = undefined;
				}
			}

			this.customView(readCookie("contact_view"), undefined, 'core/api/tags/list/' + tag_id, tag_id);
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
		if (company_filter_id || (company_filter_id = readCookie('company_filter')))
		{
			collection_is_reverse = false;
			url = "core/api/filters/query/list/" + company_filter_id;
		}

		console.log("while creating new base collection view : " + collection_is_reverse);

		/**
		 * If collection is already defined and contacts are fetched the
		 * show results instead of initializing collection again
		 */
		if (COMPANIES_HARD_RELOAD == true)
		{
			this.companiesListView = undefined;
			COMPANIES_HARD_RELOAD = false;
		}

		if (this.companiesListView && this.companiesListView.collection)
		{
			this.companiesListView.collection.url = url;

			$('#content').html(this.companiesListView.render(true).el);

			$(".active").removeClass("active");
			$("#companiesmenu").addClass("active");
			return;
		}
		if (readData('dynamic_company_filter'))
		{
			url = 'core/api/filters/filter/dynamic-filter';
			postData = readData('dynamic_company_filter');
		}

		var slateKey = getContactPadcontentKey(url);
		if (is_lhs_filter)
		{
			template_key = "companies-table";
			if (grid_view || readCookie("agile_contact_view"))
			{
				template_key = "contacts-grid-table";
				individual_tag_name = "div";
			}
		}

		/*
		 * cursor and page_size options are taken to activate
		 * infiniScroll
		 */
		this.companiesListView = new Base_Collection_View(
				{
					url : url,
					sort_collection : false,
					templateKey : template_key,
					individual_tag_name : individual_tag_name,
					cursor : true,
					page_size : 25,
					global_sort_key : sort_key,
					slateKey : slateKey,
					request_method : 'POST',
					post_data : { filterJson : postData },
					postRenderCallback : function(el, collection)
					{

						// Contacts are fetched when the app loads in
						// the initialize
						var cel = App_Companies.companiesListView.el;
						var collection = App_Companies.companiesListView.collection;
						
						company_list_view.init(cel);

						// To set heading in template
						if (is_lhs_filter)
						{
							var count = 0;
							if (collection.models.length > 0)
							{
								count = collection.models[0].attributes.count || collection.models.length;
							}
							var count_message;
							if (count > 9999 && (readCookie('contact_filter') || readData('dynamic_contact_filter')))
								count_message = "<small> (" + 10000 + "+ Total) </small>" + '<span style="vertical-align: text-top; margin-left: -5px">' + '<img border="0" src="/img/help.png"' + 'style="height: 10px; vertical-align: middle" rel="popover"' + 'data-placement="bottom" data-title="Lead Score"' + 'data-content="Looks like there are over 10,000 results. Sorry we can\'t give you a precise number in such cases."' + 'id="element" data-trigger="hover">' + '</span>';
							else
								count_message = "<small> (" + count + " Total) </small>";
							$('#contacts-count').html(count_message);
						}
						else
						{
							setupLhsFilters(cel, is_company);
						}

						start_tour("contacts", el);
					} });

		// Contacts are fetched when the app loads in the initialize
		this.companiesListView.collection.fetch();
		if (!is_lhs_filter)
		{
			$('#content').html(this.companiesListView.render().el);
		}
		else
		{
			$('#content').find('.contacts-div').html(this.companiesListView.render().el);
			$('#bulk-actions').css('display', 'none');
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
						$("#content").html(response.responseText);
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
		this.companyDetailView = new Base_Model_View({ model : company, isNew : true, template : "company-detail",
			postRenderCallback : function(el)
			{
				fill_company_related_contacts(id, 'company-contacts');
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
		fill_company_related_contacts(id, 'company-contacts');
		company_detail_tab.initEvents();
		return;
	}
});