var companies_view_loader = {
	fetchHeadings : function(callback)
	{
		if (!App_Companies.companyViewModel)
		{
			var view = new Backbone.Model();
			view.url = 'core/api/contact-view-prefs/company';
			view.fetch({ success : function(data)
			{		
				App_Companies.companyViewModel = data.toJSON();
				if(callback && typeof callback === "function")
				{
					return callback(App_Companies.companyViewModel);
				}

			} });
		}
		else if(callback && typeof callback === "function")
		{
			return callback(App_Companies.companyViewModel);
		}
	},

	getCompanies : function(modelData, el, tag_id)
	{
		/**
		 * If collection is already defined and contacts are fetched the
		 * show results instead of initializing collection again
		 */
		if (COMPANIES_HARD_RELOAD == true)
		{
			App_Companies.companiesListView = undefined;
			COMPANIES_HARD_RELOAD = false;
		}
		var that = this;
		var url = this.getCompaniesUrl(tag_id);
		var slateKey = getCompanyPadcontentKey(url);
		var templateKey = this.getCompaniesTemplateKey();
		var individual_tag_name = this.getCompaniesIndividualTagName();
		var postData = {'filterJson': this.getPostData()};
		var sortKey = this.getCompaniesSortKey();

		App_Companies.contactDateFields = COMPANY_DATE_FIELDS;
		App_Companies.contactContactTypeFields = COMPANIES_CONTACT_TYPE_FIELDS;
		App_Companies.contactCompanyTypeFields = COMPANIES_COMPANY_TYPE_FIELDS;
		
		if(!App_Companies.companiesListView)
		{
			App_Companies.companiesListView = new  Contacts_Events_Collection_View({ url : url, modelData : modelData, sort_collection : false, templateKey : templateKey, individual_tag_name : individual_tag_name,
				post_data: postData, cursor : true, page_size : getMaximumPageSize(), global_sort_key : sortKey, slateKey : slateKey, request_method : 'POST', postRenderCallback : function(cel, collection)
				{	
					that.setupCompanyFilterName(cel, tag_id);

					if(App_Companies.companiesListView.collection.models.length > 0 && !App_Companies.companiesListView.collection.models[0].get("count"))
					{
						// Call to get Count 
						getAndUpdateCollectionCount("companies", el);					
					}
					else
					{
						companies_view_loader.setUpCompaniesCount(el);
					}

				} });
			App_Companies.companiesListView.collection.fetch();

			App_Companies.companiesListView.appendItem = function(base_model){
				contactTableView(base_model,App_Companies.contactDateFields,this,App_Companies.contactContactTypeFields,App_Companies.contactCompanyTypeFields);
			};

			$("#companies-list-view", el).html(App_Companies.companiesListView.render().el);
		}
		else
		{
			App_Companies.companiesListView.options.modelData = modelData;

			App_Companies.companiesListView.appendItem = function(base_model){
				contactTableView(base_model,App_Companies.contactDateFields,this,App_Companies.contactContactTypeFields,App_Companies.contactCompanyTypeFields);
			};

			$("#companies-list-view", el).html(App_Companies.companiesListView.render(true).el);
		}
	},

	getCompaniesUrl : function(tag_id)
	{
		if(tag_id)
		{
			return "core/api/tags/list/" + decodeURI(tag_id);
		}

		var company_filter_id = _agile_get_prefs("company_filter");
		if(company_filter_id)
		{
			return "core/api/filters/query/list/" + company_filter_id;
		}

		if(_agile_get_prefs('dynamic_company_filter'))
		{
			return "core/api/filters/filter/dynamic-filter";
		}

		return "/core/api/contacts/companies/list";
	},

	setupCompanyFilterName : function(el, tag_id)
	{
		if (tag_id){
			var template = Handlebars.compile('<ul id="added-tags-ul" class="tagsinput p-n m-b-sm m-t-sm m-l-sm"><li  class="inline-block tag btn btn-xs btn-primary" data="developer"><span class="m-l-xs pull-left">{{name}}</span><a class="close default_company_remove_tag m-l-xs pull-left">&times</a></li></ul>');

		 	// Adds contact name to tags ul as li element
			$('.filter-criteria', el).html(template({name : decodeURI(tag_id)})).attr("_filter", tag_id);
			return;
		}

		var company_filter_id = _agile_get_prefs("company_filter");
		if(!company_filter_id)
		{
			$('.filter-criteria', el).html("");
			return;
		}
		var filter_name = "";
		if(App_Companies.companyFiltersListView && App_Companies.companyFiltersListView.collection)
		{
			var conFilterObj = App_Companies.companyFiltersListView.collection.get(company_filter_id);
			if(conFilterObj)
			{
				filter_name = conFilterObj.get("name");
				var template = Handlebars.compile('<ul id="added-tags-ul" class="tagsinput p-n m-b-sm m-t-sm m-l-sm"><li class="inline-block tag btn btn-xs btn-primary" data="developer"><span class="inline-block m-r-xs v-middle">{{name}}</span><a class="close default_company_filter">&times</a></li></ul>');

			 	$('.filter-criteria', el).html(template({name : filter_name})).attr("_filter", company_filter_id);
			}
		}
	},

	getCompaniesSortKey : function()
	{
		var sortKey = _agile_get_prefs("company_sort_field");
		if(sortKey)
		{
			return sortKey;
		}
		
		return "-created_time";
	},

	getCompaniesTemplateKey : function()
	{
		return "companies-list-view";
	},

	getCompaniesIndividualTagName : function()
	{
		return "tr";
	},

	getPostData : function()
	{
		var lhs_filter_data = _agile_get_prefs('dynamic_company_filter');
		if(lhs_filter_data)
		{
			return lhs_filter_data;
		}
		return "";
	},

	setUpCompaniesCount : function(el)
	{
		if(App_Companies.companiesListView && App_Companies.companiesListView.collection) 
		{
			var count = 0;
			if(App_Companies.companiesListView.collection.models.length > 0) {
				count = App_Companies.companiesListView.collection.models[0].attributes.count || App_Companies.companiesListView.collection.models.length;
			}
			var count_message;
			if (count > 9999 && (_agile_get_prefs('contact_filter') || _agile_get_prefs('dynamic_contact_filter')))
				count_message = "<small> (" + 10000 + "+ Total) </small>" + '<span style="vertical-align: text-top; margin-left: 0px">' + '<img border="0" src="' + updateImageS3Path("/img/help.png") + '"' + 'style="height: 10px; vertical-align: middle" rel="popover"' + 'data-placement="bottom" data-title="Lead Score"' + 'data-content="Looks like there are over 10,000 results. Sorry we can\'t give you a precise number in such cases."' + 'id="element" data-trigger="hover">' + '</span>';
			else
				count_message = "<small> (" + count + " Total) </small>";
			$('#contacts-count', el).html(count_message);
		}
	},

	disableBulkActionBtns : function()
	{
		//After add or remove column, toggle list view, make SELECT_ALL false and remove check for select all checkbox
		SELECT_ALL = false;
		$(".thead_check", $("#bulk-action-btns")).prop("checked", false);
		$("#bulk-action-btns button").addClass("disabled");
		$("#companiesTabelView").removeClass("disabled");
	},

	buildCompaniesView : function(el, tag_id)
	{
		var that = this;
		company_list_view.init(el);
		setUpCompanySortFilters(el);
		setupLhsFilters(el, true);
		setUpCompanyFields(el);
		this.fetchHeadings(function(modelData){
			that.getCompanies(modelData, el, tag_id);
		});
	}

};