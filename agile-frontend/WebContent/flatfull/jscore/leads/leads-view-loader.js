var LeadsViewLoader = (function(){

	function LeadsViewLoader() {};

	LeadsViewLoader.prototype.LEADS_CUSTOM_SORT_VIEW = undefined;
	LeadsViewLoader.prototype.LEAD_CUSTOM_FIELDS = undefined;

	LeadsViewLoader.prototype.fetchHeadings = function(callback)
	{
		if (!App_Leads.leadViewModel)
		{
			var view = new Backbone.Model();
			view.url = 'core/api/contact-view-prefs/lead';
			view.fetch({ success : function(data)
			{		
				App_Leads.leadViewModel = data.toJSON();
				if(callback && typeof callback === "function")
				{
					return callback(App_Leads.leadViewModel);
				}

			} });
		}
		else if(callback && typeof callback === "function")
		{
			return callback(App_Leads.leadViewModel);
		}
	}

	LeadsViewLoader.prototype.getLeads = function(modelData, el, tag_id)
	{
		/**
		 * If collection is already defined and leads are fetched the
		 * show results instead of initializing collection again
		 */
		if (LEADS_HARD_RELOAD == true)
		{
			App_Leads.leadsListView = undefined;
			LEADS_HARD_RELOAD = false;
		}
		var that = this;
		var url = this.getLeadsUrl(tag_id);
		var slateKey = getLeadPadcontentKey(url);
		var templateKey = this.getLeadsTemplateKey();
		var individual_tag_name = this.getLeadsIndividualTagName();
		var postData = {'filterJson': this.getPostData()};
		var sortKey = this.getLeadsSortKey();

		App_Leads.leadDateFields = LEADS_DATE_FIELDS;
		App_Leads.leadContactTypeFields = LEADS_CONTACT_TYPE_FIELDS;
		App_Leads.leadCompanyTypeFields = LEADS_COMPANY_TYPE_FIELDS;
		
		if(!App_Leads.leadsListView)
		{
			App_Leads.leadsListView = new  Leads_Collection_Events_View({ url : url, modelData : modelData, sort_collection : false, templateKey : templateKey, individual_tag_name : individual_tag_name,
				post_data: postData, cursor : true, page_size : 25, global_sort_key : sortKey, slateKey : slateKey, request_method : 'POST', postRenderCallback : function(cel, collection)
				{	
					that.setUpLeadView($("#content"));	  
					that.setupLeadFilterName(cel, tag_id);

					if(App_Leads.leadsListView.collection.models.length > 0 && !App_Leads.leadsListView.collection.models[0].get("count"))
					{
						// Call to get Count 
						getAndUpdateCollectionCount("leads", el);					
					}
					else
					{
						App_Leads.leadsViewLoader.setUpLeadsCount(el);
					}

				} });
			App_Leads.leadsListView.collection.fetch();

			App_Leads.leadsListView.appendItem = function(base_model){
				contactTableView(base_model,App_Leads.leadDateFields,this,App_Leads.leadContactTypeFields,App_Leads.leadCompanyTypeFields);
			};

			$("#leads-list-view", el).html(App_Leads.leadsListView.render().el);
		}
		else
		{
			App_Leads.leadsListView.options.modelData = modelData;

			App_Leads.leadsListView.appendItem = function(base_model){
				contactTableView(base_model,App_Leads.leadDateFields,this,App_Leads.leadContactTypeFields,App_Leads.leadCompanyTypeFields);
			};

			$("#leads-list-view", el).html(App_Leads.leadsListView.render(true).el);
		}
	}

	LeadsViewLoader.prototype.getLeadsUrl = function(tag_id)
	{
		if(tag_id)
		{
			return "core/api/tags/list/" + decodeURI(tag_id);
		}

		var lead_filter_id = _agile_get_prefs("lead_filter");
		if(lead_filter_id)
		{
			return "core/api/filters/query/list/" + lead_filter_id;
		}

		if(_agile_get_prefs('dynamic_lead_filter'))
		{
			return "core/api/filters/filter/dynamic-filter";
		}

		return "/core/api/leads/list";
	}

	LeadsViewLoader.prototype.setupLeadFilterName = function(el, tag_id)
	{
		if (tag_id){
			var template = Handlebars.compile('<ul id="added-tags-ul" class="tagsinput p-n m-b-sm m-t-sm m-l-sm"><li  class="inline-block tag btn btn-xs btn-primary" data="developer"><span class="m-l-xs pull-left">{{name}}</span><a class="close default_lead_remove_tag m-l-xs pull-left">&times</a></li></ul>');

		 	// Adds lead name to tags ul as li element
			$('.filter-criteria', el).html(template({name : decodeURI(tag_id)})).attr("_filter", tag_id);
			return;
		}

		var lead_filter_id = _agile_get_prefs("lead_filter");
		if(!lead_filter_id)
		{
			$('.filter-criteria', el).html("");
			return;
		}
		var filter_name = "My Leads";
		if(lead_filter_id != "system-LEADS" && App_Leads.leadFiltersListView && App_Leads.leadFiltersListView.collection)
		{
			var conFilterObj = App_Leads.leadFiltersListView.collection.get(lead_filter_id);
			if(conFilterObj)
			{
				filter_name = conFilterObj.get("name");
			}
		}

		var template = Handlebars.compile('<ul id="added-tags-ul" class="tagsinput p-n m-b-sm m-t-sm m-l-sm"><li class="inline-block tag btn btn-xs btn-primary" data="developer"><span class="inline-block m-r-xs v-middle">{{name}}</span><a class="close default_filter">&times</a></li></ul>');

	 	// Adds lead name to tags ul as li element
		$('.filter-criteria', el).html(template({name : filter_name})).attr("_filter", lead_filter_id);
	}

	LeadsViewLoader.prototype.getLeadsSortKey = function()
	{
		var sortKey = _agile_get_prefs("lead_sort_field");
		if(sortKey)
		{
			return sortKey;
		}
		
		return "-created_time";
	}

	LeadsViewLoader.prototype.getLeadsTemplateKey = function()
	{
		var templateKey = "leads-list-view";
		if(_agile_get_prefs("agile_lead_view"))
		{
			templateKey = "leads-grid-view";
		}
		
		return templateKey;
	}

	LeadsViewLoader.prototype.getLeadsIndividualTagName = function()
	{
		var individualTagName = "tr";
		if(_agile_get_prefs("agile_lead_view"))
		{
			individualTagName = "div";
		}
		
		return individualTagName;
	}

	LeadsViewLoader.prototype.getPostData = function()
	{
		var lhs_filter_data = _agile_get_prefs('dynamic_lead_filter');
		if(lhs_filter_data)
		{
			return lhs_filter_data;
		}
		return "";
	}

	LeadsViewLoader.prototype.setUpLeadView = function(cel)
	{
		if (_agile_get_prefs("agile_lead_view"))
		{
			$('#leads-view-options', cel).html("<a data-toggle='tooltip' data-placement='bottom' data-original-title='List View' class='btn btn-default btn-sm leads-view' data='list'><i class='fa fa-list'  style='margin-right:3px'></i></a>");
			$("#leads-grid-view-checkbox", cel).show();
			$("#leads-list-view-checkbox", cel).hide();
			$("#leadTabelView", cel).hide();
			$("#bulk-action-btns", cel).css("border-bottom", "1px solid #dee5e7");
			return;
		}
		
		$('#leads-view-options', cel).html("<a data-toggle='tooltip' data-placement='bottom' data-original-title='Grid View' class='btn btn-default btn-sm leads-view' data='grid'><i class='fa fa-th-large' style='margin-right:3px'></i></a>");
		$("#leads-grid-view-checkbox", cel).hide();
		$("#leads-list-view-checkbox", cel).show();
		$("#bulk-action-btns", cel).css("border-bottom", "0");
		return;
	}

	LeadsViewLoader.prototype.setUpLeadsCount = function(el)
	{
		if(App_Leads.leadsListView && App_Leads.leadsListView.collection) 
		{
			var count = 0;
			if(App_Leads.leadsListView.collection.models.length > 0) {
				count = App_Leads.leadsListView.collection.models[0].attributes.count || App_Leads.leadsListView.collection.models.length;
			}
			var count_message;
			if (count > 9999 && (_agile_get_prefs('lead_filter') || _agile_get_prefs('dynamic_lead_filter')))
				count_message = "<small> (" + 10000 + "+ Total) </small>" + '<span style="vertical-align: text-top; margin-left: 0px">' + '<img border="0" src="' + updateImageS3Path("/img/help.png") + '"' + 'style="height: 10px; vertical-align: middle" rel="popover"' + 'data-placement="bottom" data-title="Lead Score"' + 'data-content="Looks like there are over 10,000 results. Sorry we can\'t give you a precise number in such cases."' + 'id="element" data-trigger="hover">' + '</span>';
			else
				count_message = "<small> (" + count + " Total) </small>";
			$('#leads-count', el).html(count_message);
		}
	}

	LeadsViewLoader.prototype.setupLeadFields = function(el)
	{
		$('#lead-static-fields-group', el).html(getTemplate("lead-custom-fields"));

		get_custom_fields(function(data)
		{
	 		for(i=0; i<data.length; i++)
	 		{
				getTemplate("lead-custom-fields-append", data[i], undefined, function(template_ui){
     				if(!template_ui)
     				{
     					return;
     				}
		    		$("#custom-fields-group",el).append(template_ui);
		 		});
			}

			$.ajax({
				url : 'core/api/contact-view-prefs/lead',
				type : 'GET',
				dataType : 'json',
				
				success : function(data)
				{
					var customfields = $("#lead-static-fields");
					deserializecontactsForm(data.fields_set, customfields);
					console.log(data);
				}
			});
		});
	}

	LeadsViewLoader.prototype.setUpLeadSortFilters = function(el)
	{
		var that = this;
		if(this.LEADS_CUSTOM_SORT_VIEW)
		{
			$("#lead-sorter", el).html(this.LEADS_CUSTOM_SORT_VIEW.render(true).el);
			return;	
		}

		var view = LEAD_SORT_FIELDS_VIEW.view();
		this.LEADS_CUSTOM_SORT_VIEW = new view ({
			data : sort_lead_configuration.getLeadSortableFields(),
			templateKey : "contact-view-sort",
			sortPrefsName : "lead_sort_field",
			individual_tag_name : "li",
			sort_collection : false,
			postRenderCallback: function(el)
			{
				that.LEADS_CUSTOM_SORT_VIEW.postProcess();
			}
		});

		
		this.LEADS_CUSTOM_SORT_VIEW.init();
		$("#lead-sorter", el).html(this.LEADS_CUSTOM_SORT_VIEW.render(true).el);
		

		getSearchableCustomFields("LEAD", function(data){
			that.LEADS_CUSTOM_SORT_VIEW.addAll(data);
		})
		
	}

	LeadsViewLoader.prototype.setupLhsFilters = function(cel)
	{
		var that = this;
		var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
		App_Leads.leadsLHSFilter = new Leads_LHS_Filters_Events_View({ data : {}, template : "leads-lhs-filters", isNew : true,
			postRenderCallback : function(el)
			{
				//To set lead owners
				fillSelect('owner_select', '/core/api/users/partial', undefined, function()
				{
					if (!that.LEAD_CUSTOM_FIELDS)
					{
						$.getJSON("core/api/custom-fields/searchable/scope?scope=LEAD", function(fields)
						{
							that.LEAD_CUSTOM_FIELDS = fields;
							loadCustomFiledsFilters(fields, cel, false, true);
							return;
						})
					}
					else
					{
						loadCustomFiledsFilters(that.LEAD_CUSTOM_FIELDS, cel, false, true);
					}
				}, optionsTemplate, false, $('#lhs_filters_conatiner', cel));

				//To set lead sources
				fillSelect('lead_source_select', '/core/api/categories?entity_type=LEAD_SOURCE', undefined, function()
				{
					
				}, "<option value='{{id}}'>{{label}}</option>", false, $('#lhs_filters_conatiner', cel));

				//To set lead statuses
				fillSelect('lead_status_select', '/core/api/categories?entity_type=LEAD_STATUS', undefined, function()
				{
					//Removing status which is mapped to lead conversion to contact
					$("#lead_status_select", cel).find("option[data-conversion=true]").remove();
				}, "<option value='{{id}}' data-conversion='{{is_conversion_flag}}'>{{label}}</option>", false, $('#lhs_filters_conatiner', cel));
			} 
		});

		$('#lhs_filters_conatiner', cel).html(App_Leads.leadsLHSFilter.render().el);
	}

	LeadsViewLoader.prototype.setupFilterList = function(cel, tag_id)
	{
		App_Leads.leadFiltersListView = new Leads_Filter_Collection_Events_View(
		{
			url : '/core/api/filters?type=LEAD',
			sort_collection : false,
			restKey : "ContactFilter",
			templateKey : "leads-static-filters",
			individual_tag_name : 'li',
			sort_collection : false,
			no_transition_bar : true,
			postRenderCallback : function(el)
			{
				LeadsViewLoader.prototype.setupLeadFilterName(cel, tag_id);
			} 
		});

		App_Leads.leadFiltersListView.collection.fetch();
	
		$('#filter-list', cel).html(App_Leads.leadFiltersListView.render().el);
	}

	LeadsViewLoader.prototype.setupSources = function(el, obj)
	{
		var that = this;
		if(App_Leads.leadSourcesListView)
		{
			this.setupSourcesView(el, obj, App_Leads.leadSourcesListView.collection);
			return;
		}

		App_Leads.leadSourcesListView = new Base_Collection_View({ url : '/core/api/categories?entity_type=LEAD_SOURCE', sort_collection : false });

		App_Leads.leadSourcesListView.collection.fetch({ success: function(data){
			that.setupSourcesView(el, obj, data);
			hideTransitionBar();
		} });
		
	}

	LeadsViewLoader.prototype.setupSourcesView = function(el, obj, data)
	{
		if(data && el)
		{
			var $optEle = $('#lead_source_id', el);
			var template = "<option value='{{id}}'>{{label}}</option>";
			var compiledTemplate = Handlebars.compile(template);
			var sources = data.toJSON();
			$.each(sources, function(index, sourceJSON){
				$optEle.append(compiledTemplate(sourceJSON));
			});
			if(obj)
			{
				$optEle.find("option[value="+obj.lead_source_id+"]").attr("selected", "selected");
			}
		}
		
	}

	LeadsViewLoader.prototype.setupStatuses = function(el, obj)
	{
		var that = this;
		if(App_Leads.leadStatusesListView)
		{
			this.setupStatusesView(el, obj, App_Leads.leadStatusesListView.collection);
			return;
		}

		App_Leads.leadStatusesListView = new Base_Collection_View({ url : '/core/api/categories?entity_type=LEAD_STATUS', sort_collection : false });

		App_Leads.leadStatusesListView.collection.fetch({ success: function(data){
			that.setupStatusesView(el, obj, data);
			hideTransitionBar();
		} });
		
	}

	LeadsViewLoader.prototype.setupStatusesView = function(el, obj, data)
	{
		if(data && el)
		{
			var $optEle = $('#lead_status_id', el);
			var template = "<option value='{{id}}' label='{{label}}'>{{label}}</option>";
			var compiledTemplate = Handlebars.compile(template);
			var statuses = data.toJSON();
			$.each(statuses, function(index, statusJSON){
				$optEle.append(compiledTemplate(statusJSON));
				if(statusJSON.is_conversion_flag)
				{
					$('#lead_conversion_status', el).val(statusJSON.id);
				}
			});
			
			//In new lead form we won't add status "converted" as option value
			if(obj)
			{
				$optEle.find("option[value="+obj.lead_status_id+"]").attr("selected", "selected");
			}
			else
			{
				$optEle.find("option[label=Converted]").remove();
			}
		}
		
	}

	LeadsViewLoader.prototype.setupImportView = function(el)
	{
		App_Leads.importLeadsView = new CONTACTS_IMPORT_VIEW({
			url : 'core/api/upload/status/LEADS',
			template : "import-leads-main"
		});

		$('#leads-import', el).html(App_Leads.importLeadsView.render().el);
	}

	LeadsViewLoader.prototype.buildLeadsView = function(el, tag_id)
	{
		var that = this;
		this.setupStatuses();
		this.setUpLeadView(el);
		this.setupFilterList(el, tag_id);
		this.setUpLeadSortFilters(el);
		this.setupLhsFilters(el);
		this.setupLeadFields(el);
		this.fetchHeadings(function(modelData){
			that.getLeads(modelData, el, tag_id);
		});
	}

	return LeadsViewLoader;

})();