var Contacts_Events_View = Base_Model_View.extend({
    events: {
    	/** Contacts bulk actions */
    	'click #bulk-owner' : 'bulkActionAddOwner',
    	'click #bulk-campaigns' : 'bulkActionAssignToCampaign',
    	'click #bulk-tags' : 'bulkActionAddTags',
    	'click #bulk-tags-remove' : 'bulkActionRemoveTags',
    	'click #bulk-email' : 'bulkActionSendEmail',
    	'click #bulk-contacts-export' : 'bulkActionExportContacts',
    	'click #bulk-companies-export' : 'bulkActionExportCompanies',
    	'click #select-all-available-contacts' : 'bulkActionSelectAvailContacts',
    	'click #select-all-revert' : 'bulkActionRevertAvailContacts',

    	/** Company bulk actions */
    	'click .default_company_filter' : 'bulkActionCompanyDefaultFilter',
    	'click #companies-filter' : 'bulkActionCompaniesFilter',
    	'click .company_static_filter' : 'bulkActionCompaniesStaticFilter',
    	'click #comp-sort-by-created_time-desc' : 'bulkActionCompaniesSortonTimeDesc',
    	'click #comp-sort-by-created_time-asc' : 'bulkActionCompaniesSortonTimeAsec',
    	'click .comp-sort-by-name' : 'bulkActionCompaniesSortByName',
    	'click #contact-actions-grid-delete' : 'contactActionsGridDelete',
    	
    	'click .filter' : 'filterResults',
    	'click .default_filter' : 'defaultFilterResults',
    	// 'click #companies-filter' : 'companyFilterResults',
    	'click .default_contact_remove_tag' : 'defaultContactRemoveTag',

    	//'click .contact-actions-delete-mobile' : 'onContactDelete'
    	'click .contact-type-image, .company-type-image' : 'navigateToProperContact',
    	'click .contacts-view' : 'toggleContactsView',
    	'click #contactTabelView' : 'toggleContactsListView',
    	'click .contactcoloumn' : 'addOrRemoveContactColumns',
    	
    },

    /*onContactDeleteAction : function(e){
    	e.preventDefault();
    	event.stopPropagation();
    	contact_delete_action.onContactDelete(e);
	},*/

    bulkActionCompaniesSortByName : function(e){

    	e.preventDefault();
			_agile_set_prefs('company_sort_field',$(e.currentTarget).attr('data'));
			COMPANIES_HARD_RELOAD=true;
			App_Companies.companies();
    },

	defaultContactRemoveTag: function(e)
	{
		e.preventDefault();
		CONTACTS_HARD_RELOAD = true;
		_agile_delete_prefs("contacts_tag");
		contacts_view_loader.getContacts(App_Contacts.contactViewModel, $("#contacts-listener-container"));
		window.location.hash = "contacts";
	},

    // Fetch filter result without changing route on click
	filterResults:  function(e)
	{

		contact_filters_util.filterResults(e);
	},

	/*
	 * If default filter is selected, removes filter cookies an load contacts
	 * with out any query condition
	 */
	defaultFilterResults:  function(e)
	{
		e.preventDefault();
		revertToDefaultContacts();
	},

	companyFilterResults: function(e)
	{
		contact_filters_util.companyFilterResults(e);
		
	},
    
	contactActionsGridDelete: function(e){
		
		e.preventDefault();
		var contact_id=$(e.currentTarget).attr('con_id');
    	var model=App_Contacts.contactsListView.collection.get(contact_id);
		$('#deleteGridContactModal').modal('show');

		$('#deleteGridContactModal').on("shown.bs.modal", function(){

				// If Yes clicked
		   $('#deleteGridContactModal').off('click', '#delete_grid_contact_yes');
		   $('#deleteGridContactModal').on('click', '#delete_grid_contact_yes', function(e) {
				e.preventDefault();
				// Delete Contact.
				$.ajax({
    					url: 'core/api/contacts/' + contact_id,
       					type: 'DELETE',
       					success: function()
       					{
       						$('#deleteGridContactModal').modal('hide');
       						App_Contacts.contactsListView.collection.remove(model);
       						$("#" + model.id).parent().parent().parent().remove();
       					}
       				});
			});


		   $('#deleteGridContactModal').on('click', '#delete_grid_contact_no', function(e) {
				e.preventDefault();
				if($(this).attr('disabled'))
			   	     return;
				$('#deleteGridContactModal').modal('hide');
			});

		});

    		
	},
	/*
	 * If default filter is selected, removes filter cookies an load contacts
	 * with out any query condition
	 */
	bulkActionCompanyDefaultFilter :  function(e)
	{
		e.preventDefault();
		company_list_view.revertToDefaultCompanies();
	},
	
	bulkActionCompaniesFilter : function(e)
	{

		e.preventDefault();
		_agile_delete_prefs('company_filter');
		//_agile_delete_prefs('contact_filter_type');

		//_agile_set_prefs('company_filter', "Companies");
		COMPANIES_HARD_RELOAD = true;
		App_Companies.companies(); // /Show Companies list, explicitly hard
		// reload
		return;
	},

	bulkActionCompaniesStaticFilter :  function(e)
	{

		e.preventDefault();
		_agile_delete_prefs('company_filter');
		//_agile_delete_prefs('dynamic_contact_filter');
		_agile_delete_prefs('dynamic_company_filter');

		var filter_id = $(e.currentTarget).attr('id');
		var filter_type = $(e.currentTarget).attr('filter_type');

		// Saves Filter in cookie
		_agile_set_prefs('company_filter', filter_id)
		//_agile_set_prefs('company_filter_type', filter_type)

		// Gets name of the filter, which is set as data
		// attribute in filter
		filter_name = $(e.currentTarget).attr('data');

		COMPANIES_HARD_RELOAD=true;
		App_Companies.companies();
		return;
		// /removed old code from below,
		// now filters will work only on contact, not company
	},
	
	bulkActionCompaniesSortonTimeDesc : function(e)
	{
		e.preventDefault();
		_agile_set_prefs('company_sort_field',$(e.currentTarget).attr('data'));
		COMPANIES_HARD_RELOAD=true;
		App_Companies.companies();
	},
	
	bulkActionCompaniesSortonTimeAsec : function(e){
		e.preventDefault();
		_agile_set_prefs('company_sort_field',$(e.currentTarget).attr('data'));
		COMPANIES_HARD_RELOAD=true;
		App_Companies.companies();
	},

    bulkActionAddOwner : function(e){
    	e.preventDefault();
    	contacts_bulk_actions.change_owner(e);
    },

    bulkActionAssignToCampaign : function(e){
    	e.preventDefault();
    	contacts_bulk_actions.assign_to_campaigns(e);
    },

    bulkActionAddTags :  function(e){
    	e.preventDefault();
    	contacts_bulk_actions.add_tags(e);
    },

    bulkActionRemoveTags :  function(e){
    	e.preventDefault();
    	contacts_bulk_actions.remove_tags(e);
    },
    bulkActionSendEmail : function(e){
    	e.preventDefault();
    	contacts_bulk_actions.send_email(e);
    },

    bulkActionExportContacts : function(e){
    	e.preventDefault();
    	contacts_bulk_actions.export_contacts(e);
    },

    bulkActionExportCompanies : function(e){
    	e.preventDefault();
    	contacts_bulk_actions.export_companies(e);
    },

    bulkActionSelectAvailContacts : function(e){
    	e.preventDefault();
    	contacts_bulk_actions.select_contacts(e);
    },

    bulkActionRevertAvailContacts : function(e){
    	e.preventDefault();

    	SELECT_ALL = false;
		_BULK_CONTACTS = undefined;
		
		var html = '';

		var resultCount = 0;
		var appCount = 0;
		var limitValue = 10000;		

		if(company_util.isCompany()){

			resultCount = App_Companies.companiesListView.collection.length;
			appCount = getAvailableContacts();

			if(localStorage.getItem("dynamic_company_filter") != null || localStorage.getItem("company_filter") != null) {				
				
				if(resultCount > limitValue){
					resultCount = limitValue + "+";
				}

				if(appCount > limitValue){
					appCount = limitValue + "+";
				}

			}

			html = "Selected " + resultCount + " companies. <a href='#'  id='select-all-available-contacts' class='c-p text-info'>Select all " + appCount + " companies</a>";
		}else{

			resultCount = App_Contacts.contactsListView.collection.length;
			appCount = getAvailableContacts();

			if(localStorage.getItem("dynamic_contact_filter") != null || localStorage.getItem("contact_filter") != null){	
				if(resultCount > limitValue){
					resultCount = limitValue + "+";
				}

				if(appCount > limitValue){
					appCount = limitValue + "+";
				}
			}

			html = "Selected " + resultCount + " contacts. <a href='#'  id='select-all-available-contacts' class='c-p text-info'>Select all " + appCount + " contacts</a>";
		}
		$('body').find('#bulk-select').html(html);
    },

    navigateToProperContact : function(e){
    	e.stopPropagation();
		var currentObjId = $(e.currentTarget).attr("id");
		if($(e.currentTarget).hasClass("contact-type-image"))
		{
			Backbone.history.navigate("contact/" + currentObjId, { trigger : true });
		}
		else
		{
			Backbone.history.navigate("company/" + currentObjId, { trigger : true });
		}
    },

    toggleContactsView : function(e){
    	e.preventDefault();
    	CONTACTS_HARD_RELOAD=true;
		var data=$(e.currentTarget).attr("data");
		if(data == "list"){
			_agile_delete_prefs("agile_contact_view");
			$("#contactTabelView").show();
		}
		else if(data == "grid"){
			_agile_set_prefs("agile_contact_view","grid-view");
			$("#contactTabelView").hide();
		}
		if(_agile_get_prefs("contacts_tag")){
			contacts_view_loader.getContacts(App_Contacts.contactViewModel, $("#contacts-listener-container"), _agile_get_prefs("contacts_tag"));
			return;
		}
		contacts_view_loader.getContacts(App_Contacts.contactViewModel, $("#contacts-listener-container"));
    },

    toggleContactsListView : function(e){
    	if(_agile_get_prefs("contactTabelView")){
    		_agile_delete_prefs("contactTabelView");
    		$(e.currentTarget).find("i").removeClass("fa fa-ellipsis-h");
    		$(e.currentTarget).find("i").addClass("fa fa-navicon");
    	}
    	else{
    		_agile_set_prefs("contactTabelView","true");
    		$(e.currentTarget).find("i").removeClass("fa fa-navicon");
    		$(e.currentTarget).find("i").addClass("fa fa-ellipsis-h");
    	}
    	$(e.currentTarget).parent().parent().toggleClass("compact");
		contacts_view_loader.getContacts(App_Contacts.contactViewModel, $("#contacts-listener-container"));
    },

    addOrRemoveContactColumns : function(e){
    	e.preventDefault();
    	var $checkboxInput = $(e.currentTarget).find("input");
    	if($checkboxInput.is(":checked"))
    	{
    		$checkboxInput.prop("checked", false);
    	}
    	else
    	{
    		$checkboxInput.prop("checked", true);
    	}
    	var json = serializeForm("contact-static-fields");
		$.ajax({
			url : 'core/api/contact-view-prefs',
			type : 'PUT',
			contentType : 'application/json',
			dataType : 'json',
			data :JSON.stringify(json),
			success : function(data)
			{
				App_Contacts.contactViewModel = data;
				contacts_view_loader.fetchHeadings(function(modelData){
					contacts_view_loader.getContacts(modelData, $("#contacts-listener-container"));
				});
			} 
		});
    }

   
});