/**
 * Creates backbone router for companies management and filter (custom view)
 * operations.
 * 
 * @module Company management & filters
 */

CONTACTS_HARD_RELOAD = true;

var CompaniesRouter = Backbone.Router
.extend({
	
	routes : {
	
		/* Companies */
		"companies" : "companies",
	
		"company/:id" : "companyDetails"
	},
	
	/**
	 * Fetches all the companies and shows as list, if tag_id
	 * and filter_id are not defined, if any one of them is defined then
	 * fetches the contacts related to that particular id (tag_id or
	 * filter_id) and shows as list. Adds tags, charts for tags and
	 * filter views to the contacts list from postRenderCallback of its
	 * Base_Collection_View. Initiates infiniScroll to fetch contacts
	 * (25 in count) step by step on scrolling down instead of fetching
	 * all at once.
	 */
	companies : function(tag_id, filter_id, grid_view, is_lhs_filter)
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

		// campaign filters are disabled for time being.
		if (readData('dynamic_contact_filter') && readData('dynamic_contact_filter').indexOf('campaign_status') >= 0)
		{
			eraseData('dynamic_contact_filter');
		}

		var max_contacts_count = 20;
		var is_company = true;
		var template_key = "companies";
		var individual_tag_name = "tr";
		var sort_key = readCookie("sort_by_name");
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

		// Check if contacts page is set to show companies
		if (readCookie('company_filter'))
		{
			eraseCookie('contact_filter');
			eraseCookie('contact_filter_type');
			is_company = true;
		}

		// Tags, Search & default browse comes to the same function
		if (tag_id)
		{
			tag_id = decodeURI(tag_id);

			tag_id = decodeURI(tag_id);

			// erase filter cookie
			eraseCookie('contact_filter');
			eraseCookie('company_filter');
			eraseCookie('contact_filter_type');
			eraseData('dynamic_contact_filter');

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

		if (readCookie('company_filter'))
		{
			// Change template to companies - this template is separate
			// from contacts default template
			url = "core/api/contacts/companies/list";

			if (!grid_view && !readCookie("agile_contact_view"))
				template_key = "companies";
		}

		// If contact-filter cookie is defined set url to fetch
		// respective filter results
		if (filter_id || (filter_id = readCookie('contact_filter')))
		{
			collection_is_reverse = false;
			url = "core/api/filters/query/list/" + filter_id;
			if (readCookie('contact_filter_type') && readCookie('contact_filter_type') == 'COMPANY')
				template_key = "companies";
		}

		console.log("while creating new base collection view : " + collection_is_reverse);

		/**
		 * If collection is already defined and contacts are fetched the
		 * show results instead of initializing collection again
		 */
		if (CONTACTS_HARD_RELOAD == true)
		{
			this.companiesListView = undefined;
			CONTACTS_HARD_RELOAD = false;
		}

		if (this.companiesListView && this.companiesListView.collection)
		{
			this.companiesListView.collection.url = url;

			$('#content').html(this.companiesListView.render(true).el);

			$(".active").removeClass("active");
			$("#contactsmenu").addClass("active");
			return;
		}
		if (readData('dynamic_contact_filter') && !readCookie('company_filter'))
		{
			url = 'core/api/filters/filter/dynamic-filter';
			postData = readData('dynamic_contact_filter');
		}
		else if (readData('dynamic_company_filter') && readCookie('company_filter'))
		{
			url = 'core/api/filters/filter/dynamic-filter';
			postData = readData('dynamic_company_filter');
		}

		var slateKey = getContactPadcontentKey(url);
		if (is_lhs_filter)
		{
			template_key = "contacts-table";
			if (grid_view || readCookie("agile_contact_view"))
			{
				template_key = "contacts-grid-table";
				individual_tag_name = "div";
			}
			if (readCookie('company_filter'))
			{
				template_key = "companies-table";
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
							setupViews();
							setupContactFilterList();
						}
						else
						{
							setupLhsFilters(cel, is_company);
							setupViews(cel);
							setupContactFilterList(cel, tag_id);
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
			$('#content').find('.span9').html(this.companiesListView.render().el);
			$('#bulk-actions').css('display', 'none');
			$('#bulk-select').css('display', 'none');
			CONTACTS_HARD_RELOAD = true;
		}
		$(".active").removeClass("active");
		$("#companiesmenu").addClass("active");
	
	}
});