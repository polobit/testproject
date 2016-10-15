/**
 * Creates backbone router for leads to create, read and update
 * operations
 *
 * @module Leads
 */
LEADS_HARD_RELOAD = true;
var LEADS_DYNAMIC_FILTER_COOKIE_STATUS = "toggle_leads_lhs_filters_" + CURRENT_DOMAIN_USER.id;
var LeadsRouter = Backbone.Router.extend({
	routes : {
		"leads" : "leads",
		"lead-filters" : "leadFilters",
		"lead-filter-add" : "leadFilterAdd",
		"lead-filter-edit/:id" : "leadFilterEdit",
		"lead/:id" : "leadsDetails",
		"lead-edit" : "editLead",
		"lead-add" : "addLead"
	},

	/*
	 * To get Leads and build leads view.
	 */
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

	/*
	 * To get lead filters and build lead filters list view.
	 */
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

	/*
	 * To add lead filter
	 */
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

	/*
	 * To edit lead filter
	 */
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

	/*
	 * To render lead details view
	 */
	leadsDetails : function(id, lead)
	{
		// For getting custom fields
		if (App_Leads.customFieldsList == null || App_Leads.customFieldsList == undefined)
		{
			App_Leads.customFieldsList = new Base_Collection_View({ url : '/core/api/custom-fields/position', sort_collection : false,
				restKey : "customFieldDefs", templateKey : "admin-settings-customfields", individual_tag_name : 'tr' });
			App_Leads.customFieldsList.collection.fetch();
		}

		//To fetch lead statuses 
		if(!App_Leads.leadStatusesListView)
		{
			var leadsViewLoader = new LeadsViewLoader();
			leadsViewLoader.setupStatuses();
		}

		//To fetch lead statuses 
		if(!App_Leads.leadSourcesListView)
		{
			var leadsViewLoader = new LeadsViewLoader();
			leadsViewLoader.setupSources();
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

		add_recent_view(lead);

		// If contact is of type company , go to company details page
		if (lead.get('type') == 'COMPANY')
		{			
			Backbone.history.navigate( "company/"+id, { trigger : true });
			return;
		}

		// If contact is of type contact , go to contact details page
		if (lead.get('type') == 'CONTACT')
		{			
			Backbone.history.navigate( "contact/"+id, { trigger : true });
			return;
		}

		this.leadDetailView = new Contact_Details_Model_Events({ data : lead, isNew : true, template : "leads-details",
			postRenderCallback : function(el)
			{
				App_Leads.leadDetails = new LeadDetails();

				App_Leads.leadDetails.loadLeadTabs(el, lead.toJSON());

				App_Contacts.contactDetailView = new Base_Model_View({ data : lead, isNew : true});

				loadWidgets(el, lead, "widgets");

				App_Leads.leadDetails.starify(el);

				App_Leads.leadDetails.show_map(el);

				// To navigate between contacts details
				if (lead_collection != null)
				{
					contact_detail_view_navigation(id, App_Leads.leadsListView, el);
				}
			} 
		});

		$('#content').html(this.leadDetailView.render().el);
		
	},

	/*
	 * To edit lead
	 */
	editLead : function(lead)
	{
		var lead = null;

		// Takes back to leads if lead detailview is not defined
		if (!this.leadDetailView || !this.leadDetailView.model.id)
		{
			this.navigate("leads", { trigger : true });
			return;
		}

		// If lead detail view is defined the get current lead
		// model id
		var id = this.leadDetailView.model.id;

		if (this.leadDetailView && this.leadDetailView.model.id)
		{
			lead = this.leadDetailView.model.toJSON();
		}

		// If leads list is defined the get lead to edit from the
		// list
		else if (this.leadsListView && this.leadsListView.collection && this.leadsListView.collection.get(id))
		{
			lead = this.leadsListView.collection.get(id).toJSON();
		}

		// If leads list view and custom view list is not defined then
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

				// Call Lead edit again with downloaded lead
				// details
				App_Leads.editLead(lead.toJSON());
			} });

			return;
		}

		// Lead Edit - take him to continue-lead form
		add_custom_fields_to_form(lead, function(lead)
		{
				deserialize_contact(lead, 'update-lead');
		}, lead.type);
	},

	addLead : function(){
		$.getJSON("core/api/custom-fields/scope?scope=LEAD", function(data)
		{
			if(data.length > 0){
				var json = {custom_fields:data,properties:[]};
				getTemplate("update-lead", json, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$("#content").html($(template_ui));	
					// Add placeholder and date picker to date custom fields
					$('.date_input').attr("placeholder", _agile_get_translated_val("contacts", "select-date"));

					$('.date_input').datepicker({ format : CURRENT_USER_PREFS.dateFormat, weekStart : CALENDAR_WEEK_START_DAY, autoclose: true});

					leadsViewLoader = new LeadsViewLoader();
                	leadsViewLoader.setupSources($("#content"));
                	leadsViewLoader.setupStatuses($("#content"));

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

					initializeEditContactListeners("updateLeadForm");

				}, "#content"); 

					
			}else{
				Backbone.history.navigate("leads" , {trigger: true});
				$("#personModal").modal("show");
			}		
					
		});

	},

});