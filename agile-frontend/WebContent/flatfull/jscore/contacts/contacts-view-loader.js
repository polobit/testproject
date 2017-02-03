var contacts_view_loader = {
	fetchHeadings : function(callback,url)
	{
		if (!App_Contacts.contactViewModel)
		{
			var view = new Backbone.Model();
			view.url = 'core/api/contact-view-prefs';
			view.fetch({ success : function(data)
			{		
				App_Contacts.contactViewModel = data.toJSON();
				if(callback && typeof callback === "function")
				{
					return callback(App_Contacts.contactViewModel);
				}

			} });
		}
		else if(callback && typeof callback === "function")
		{
			return callback(App_Contacts.contactViewModel);
		}
	},

	getContacts : function(modelData, el, tag_id)
	{
		/**
		 * If collection is already defined and contacts are fetched the
		 * show results instead of initializing collection again
		 */
		if (CONTACTS_HARD_RELOAD == true)
		{
			App_Contacts.contactsListView = undefined;
			CONTACTS_HARD_RELOAD = false;
		}
		

		//To disable bulk action buttons and remove check for select all checkbox
		this.disableBulkActionBtns();

		var that = this;
		var url = this.getContactsUrl(tag_id);
		var slateKey = getContactPadcontentKey(url);
		var templateKey = this.getContactsTemplateKey();
		var individual_tag_name = this.getContactsIndividualTagName();
		var postData = {'filterJson': this.getPostData()};
		var sortKey = this.getContactsSortKey();

		App_Contacts.contactDateFields = CONTACTS_DATE_FIELDS;
		App_Contacts.contactContactTypeFields = CONTACTS_CONTACT_TYPE_FIELDS;
		App_Contacts.contactCompanyTypeFields = CONTACTS_COMPANY_TYPE_FIELDS;
		
		if(!App_Contacts.contactsListView)
		{
			App_Contacts.contactsListView = new  Contacts_Events_Collection_View({ url : url, modelData : modelData, sort_collection : false, templateKey : templateKey, individual_tag_name : individual_tag_name,
				post_data: postData, cursor : true, page_size : getMaximumPageSize(), global_sort_key : sortKey, slateKey : slateKey, request_method : 'POST', postRenderCallback : function(cel, collection)
				{	

					that.setUpContactView($("#content"));	  
					that.setupContactFilterName(cel, tag_id);
					if(CURRENT_DOMAIN_USER.domain=='fieldglobal'){
						head.js(LIB_PATH + 'lib/jquery.timeago.js', function() {
							$('time',cel).timeago();
						});
					}
					if(App_Contacts.contactsListView.collection.models.length > 0 && !App_Contacts.contactsListView.collection.models[0].get("count"))
					{
						// Call to get Count 
						getAndUpdateCollectionCount("contacts", el);		
					}
					else
					{
						contacts_view_loader.setUpContactsCount(el);
					}
					
					contactListener();

				},
				appendItemCallback : function(p_el) {
					if(CURRENT_DOMAIN_USER.domain=='fieldglobal'){
						includeTimeAgo(p_el);
					}
				}});
			App_Contacts.contactsListView.collection.fetch();

			App_Contacts.contactsListView.appendItem = function(base_model){
				contactTableView(base_model,App_Contacts.contactDateFields,this,App_Contacts.contactContactTypeFields,App_Contacts.contactCompanyTypeFields);
			};

			$("#contacts-list-view", el).html(App_Contacts.contactsListView.render().el);
		}
		else
		{
			App_Contacts.contactsListView.options.modelData = modelData;

			App_Contacts.contactsListView.appendItem = function(base_model){
				contactTableView(base_model,App_Contacts.contactDateFields,this,App_Contacts.contactContactTypeFields,App_Contacts.contactCompanyTypeFields);
			};
			$("#contacts-list-view", el).html(App_Contacts.contactsListView.el);
			App_Contacts.contactsListView.render(true);
		}
	},

	getContactsUrl : function(tag_id)
	{
		if(tag_id)
		{
			return "core/api/tags/list/" + decodeURI(tag_id);
		}

		var contact_filter_id = _agile_get_prefs("contact_filter");
		if(contact_filter_id)
		{
			return "core/api/filters/query/list/" + contact_filter_id;
		}

		if(_agile_get_prefs('dynamic_contact_filter'))
		{
			return "core/api/filters/filter/dynamic-filter";
		}

		return "/core/api/contacts/list";
	},

	setupContactFilterName : function(el, tag_id)
	{
		if (tag_id){
			var template = Handlebars.compile('<ul id="added-tags-ul" class="tagsinput p-n m-b-sm m-t-sm m-l-sm"><li  class="inline-block tag btn btn-xs btn-primary" data="developer"><span class="m-l-xs pull-left">{{name}}</span><a class="close default_contact_remove_tag m-l-xs pull-left">&times</a></li></ul>');

		 	// Adds contact name to tags ul as li element
			$('.filter-criteria', el).html(template({name : decodeURI(tag_id)})).attr("_filter", tag_id);
			return;
		}

		var contact_filter_id = _agile_get_prefs("contact_filter");
		if(!contact_filter_id)
		{
			$('.filter-criteria', el).html("");
			return;
		}
		var filter_name = "My Contacts";
		if(contact_filter_id != "system-CONTACTS" && contactFiltersListView && contactFiltersListView.collection)
		{
			var conFilterObj = contactFiltersListView.collection.get(contact_filter_id);
			if(conFilterObj)
			{
				filter_name = conFilterObj.get("name");
			}
		}

		var template = Handlebars.compile('<ul id="added-tags-ul" class="tagsinput p-n m-b-sm m-t-sm m-l-sm"><li class="inline-block tag btn btn-xs btn-primary" data="developer"><span class="inline-block m-r-xs v-middle">{{name}}</span><a class="close default_filter">&times</a></li></ul>');

	 	// Adds contact name to tags ul as li element
		$('.filter-criteria', el).html(template({name : filter_name})).attr("_filter", contact_filter_id);
	},

	getContactsSortKey : function()
	{
		var sortKey = _agile_get_prefs("sort_by_name");
		if(sortKey)
		{
			return sortKey;
		}
		
		return "-created_time";
	},

	getContactsTemplateKey : function()
	{
		var templateKey = "contacts-list-view";
		if(_agile_get_prefs("agile_contact_view"))
		{
			templateKey = "contacts-grid-view";
		}
		
		return templateKey;
	},

	getContactsIndividualTagName : function()
	{
		var individualTagName = "tr";
		if(_agile_get_prefs("agile_contact_view"))
		{
			individualTagName = "div";
		}
		
		return individualTagName;
	},

	getPostData : function()
	{
		var lhs_filter_data = _agile_get_prefs('dynamic_contact_filter');
		if(lhs_filter_data)
		{
			return lhs_filter_data;
		}
		return "";
	},

	setUpContactView : function(cel)
	{
		if (_agile_get_prefs("agile_contact_view"))
		{
			$('#contacts-view-options', cel).html("<a data-toggle='tooltip' data-placement='bottom' data-original-title='{{agile_lng_translate 'deal-view' 'list-view'}}' class='btn btn-default btn-sm btn-default-imp-white btn-lg-imp contacts-view' data='list'><i class='fa fa-list'  style='margin-right:3px'></i></a>");
			$("#contacts-grid-view-checkbox", cel).show();
			$("#contacts-list-view-checkbox", cel).hide();
			$("#contactTabelView", cel).hide();
			$("#bulk-action-btns", cel).css("border-bottom", "1px solid #dee5e7");
			return;
		}
		
			$('#contacts-view-options', cel).html("<a data-toggle='tooltip' data-placement='bottom' data-original-title='{{agile_lng_translate 'deal-view' 'list-view'}}' class='btn btn-default btn-sm btn-default-imp-white btn-lg-imp contacts-view' data='list'><i class='fa fa-list'  style='margin-right:3px'></i></a>");
		$('#contacts-view-options', cel).html("<a data-toggle='tooltip' data-placement='bottom' data-original-title='{{agile_lng_translate 'tasks' 'grid-view'}}' class='btn btn-default btn-sm contacts-view btn-default-imp-white btn-lg-imp ' data='grid'><i class='fa fa-th-large' style='margin-right:3px'></i></a>");
		$("#contacts-grid-view-checkbox", cel).hide();
		$("#contacts-list-view-checkbox", cel).show();
		$("#bulk-action-btns", cel).css("border-bottom", "0");
		return;
	},

	setUpContactsCount : function(el)
	{
		if(App_Contacts.contactsListView && App_Contacts.contactsListView.collection) 
		{
			var count = 0;
			if(App_Contacts.contactsListView.collection.models.length > 0) {
				count = App_Contacts.contactsListView.collection.models[0].attributes.count || App_Contacts.contactsListView.collection.models.length;
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
		$("#contactTabelView").removeClass("disabled");
	},

	buildContactsView : function(el, tag_id)
	{
		var that = this;
		this.setUpContactView(el);
		setupContactFilterList(el, tag_id);
		setUpContactSortFilters(el);
		setupLhsFilters(el, false);
		setupContactFields(el);
		this.fetchHeadings(function(modelData){
			that.getContacts(modelData, el, tag_id);
		});
	}

};