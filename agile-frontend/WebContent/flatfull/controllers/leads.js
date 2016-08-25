LEADS_HARD_RELOAD = true;
var LEADS_DYNAMIC_FILTER_COOKIE_STATUS = "toggle_leads_lhs_filters_" + CURRENT_DOMAIN_USER.id;
var LeadsRouter = Backbone.Router.extend({
	routes : {
		"leads" : "leads",
		"lead-filters" : "leadFilters",
		"lead-filter-add" : "leadFilterAdd",
		"lead-filter-edit/:id" : "leadFilterEdit",
		"lead/:id" : "leadsDetails",
		"lead-edit" : "editLead"
	},

	leads : function()
	{
		var that = this;
		this.leadsViewLoader = new LeadsViewLoader();
		this.leadsBulkActions = new LeadsBulkActions();
		var leadsHeader = new Leads_Header_Events_View({ data : {}, template : "leads-header", isNew : true,
			postRenderCallback : function(el)
			{
				that.leadsViewLoader.buildLeadsView(el);

				that.leadsViewLoader.setUpLeadsCount(el);
			} 
		});
		$('#content').html(leadsHeader.render().el);

		$(".active").removeClass("active");
		$("#leadsmenu").addClass("active");
		$('[data-toggle="tooltip"]').tooltip();
	},

	leadFilters : function()
	{
		this.leadFiltersList = new Base_Collection_View({ url : '/core/api/filters?type=LEAD', restKey : "ContactFilter", templateKey : "leads-filter",
			individual_tag_name : 'tr', sort_collection : false,
			postRenderCallback : function(el)
			{
				head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
				{
					$(".created_time", el).timeago();
				});

			}});

		this.leadFiltersList.collection.fetch();
		$("#content").html(this.leadFiltersList.render().el);
	},

	leadFilterAdd : function()
	{

		var leadFilter = new Leads_Filter_Events_View({ url : 'core/api/filters', template : "leads-filter-add", isNew : "true", window : "lead-filters",
			postRenderCallback : function(el)
			{
				head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js?_='+_agile_get_file_hash("agile.jquery.chained.min.js"), function()
				{
					chainFiltersForLead(el, undefined, function()
					{
						$('#content').html(el);
						scramble_input_names($(el).find('#filter-settings'));
					});
				});				
			} });
		$("#content").html(LOADING_HTML);
		leadFilter.render();		
	},

	leadFilterEdit : function(id)
	{
		if (!this.leadFiltersList || this.leadFiltersList.collection.length == 0 || this.leadFiltersList.collection.get(id) == null)
		{
			this.navigate("lead-filters", { trigger : true });
			return;
		}

		var lead_filter = this.leadFiltersList.collection.get(id);
		var leadFilter = new Leads_Filter_Events_View({ url : 'core/api/filters', model : lead_filter, template : "leads-filter-add", window : "lead-filters",
			postRenderCallback : function(el)
			{
				head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js?_='+_agile_get_file_hash("agile.jquery.chained.min.js"), function()
				{
					chainFiltersForLead(el, lead_filter.toJSON(), function()
					{
						$('#content').html(el);
						scramble_input_names($(el).find('#filter-settings'));
					});
				});				
			} });
		$("#content").html(LOADING_HTML);
		leadFilter.render();		
	},

	leadsDetails : function(id, lead)
	{
		// For getting custom fields
		if (App_Leads.customFieldsList == null || App_Leads.customFieldsList == undefined)
		{
			App_Leads.customFieldsList = new Base_Collection_View({ url : '/core/api/custom-fields/position', sort_collection : false,
				restKey : "customFieldDefs", templateKey : "admin-settings-customfields", individual_tag_name : 'tr' });
			App_Leads.customFieldsList.collection.fetch();
		}

		var lead_collection;

		if (!lead && this.leadDetailView && this.leadDetailView.model != null)
		{
			if (id == this.leadDetailView.model.toJSON()['id'])
			{
				App_Leads.leadsDetails(id, this.leadDetailView.model);
				
				return;
			}
		}

		// If user refreshes the leads detail view page directly - we
		// should load from the model
		if(!lead)
		{
			if (!this.leadsListView || (this.leadsListView && this.leadsListView.collection.length == 0) || (this.leadsListView && this.leadsListView.collection.get(id) == null))
			{

				var lead_details_model = Backbone.Model.extend({ url : function()
				{
					return '/core/api/contacts/' + this.id;
				} });

				var model = new lead_details_model();
				model.id = id;
				model.fetch({ success : function(data)
				{
					// Call Lead Details again
					App_Leads.leadsDetails(id, model);

				}, 
				error: function(data, response)
				{
					if(response && response.status == '403')

						$("#content").html ("<div class='well'><div class='alert bg-white text-center'><div class='slate-content p-md text'><h4 style='opacity:0.8;margin-bottom:5px!important;'> "+_agile_get_translated_val('contacts','invalid-viewer')+"</h4><div class='text'style='opacity:0.6;'>"+_agile_get_translated_val('companies','enable-permission')+"</div></div></div></div>");

				}
				});
				
				return;
			}
		}

		// If not downloaded fresh during refresh - read from collection
		if (!lead)
		{
			lead = this.leadsListView.collection.get(id);
		}
		
		// Assigning lead collection
		if(this.leadsListView && this.leadsListView.collection)
			lead_collection = this.leadsListView.collection;

		this.leadDetailView = new Contact_Details_Model_Events({ data : lead, isNew : true, template : "leads-details",
			postRenderCallback : function(el)
			{
				App_Leads.leadDetails = new LeadDetails();

				App_Leads.leadDetails.loadLeadTabs(el, lead.toJSON());

				loadWidgets(el, lead, "widgets");
			} 
		});

		$('#content').html(this.leadDetailView.render().el);
		
	},

	editLead : function(lead)
	{
		var lead = null;

		// Takes back to companies if companies detailview is not defined
		if (!this.leadDetailView || !this.leadDetailView.model.id)
		{
			this.navigate("leads", { trigger : true });
			return;
		}

		// If company detail view is defined the get current company
		// model id
		var id = this.leadDetailView.model.id;

		if (this.leadDetailView && this.leadDetailView.model.id)
		{
			lead = this.leadDetailView.model.toJSON();
		}

		// If contact list is defined the get contact to edit from the
		// list
		else if (this.leadsListView && this.leadsListView.collection && this.leadsListView.collection.get(id))
		{
			lead = this.leadsListView.collection.get(id).toJSON();
		}

		// If contact list view and custom view list is not defined then
		// download contact
		else if (!lead)
		{
			// Download contact for edit since list is not defined
			var lead_details_model = Backbone.Model.extend({ url : function()
			{
				return '/core/api/contacts/' + id;
			} });

			var model = new lead_details_model();

			model.fetch({ success : function(contact)
			{

				// Call Contact edit again with downloaded contact
				// details
				App_Leads.editLead(lead.toJSON());
			} });

			return;
		}

		// Contact Edit - take him to continue-contact form
		add_custom_fields_to_form(lead, function(lead)
		{
				deserialize_contact(lead, 'update-lead');
		}, lead.type);
	}
});