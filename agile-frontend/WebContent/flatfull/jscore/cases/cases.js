/**
 * Case is modelled along the lines of Deals. So functionality and coding style
 * are very similar.
 * 
 * @author Chandan
 */
$(function(){

	$("#casesModal").on("show.bs.modal", function(c) {
        add_custom_fields_to_form({}, function(data)
		{
			var el_custom_fields = show_custom_fields_helper(data["custom_fields"], ["modal"]);
			$("#custom-field-case", $("#casesModal")).html($(el_custom_fields));

		}, "CASE");
    });	

	$('#casesModal, #casesUpdateModal').on("shown.bs.modal", function()
	{
		// Add placeholder and date picker to date custom fields
		$('.date_input').attr("placeholder","Select Date");
    	$('.date_input').datepicker({
			format: CURRENT_USER_PREFS.dateFormat, weekStart : CALENDAR_WEEK_START_DAY
		});

		// Enable the datepicker
		$('#close_date').datepicker({
			format : CURRENT_USER_PREFS.dateFormat, weekStart : CALENDAR_WEEK_START_DAY
		});
	
	});
	
	$('#casesModal,#casesUpdateModal').on('click', '#cases_validate', function(e) 
	{
		e.preventDefault();

		// To know updated or added cases form names
		var modal_id = $(this).closest('.cases-modal').attr("id");
		var form_id = $(this).closest('.cases-modal').find('form').attr("id");
		var json = serializeForm(form_id);
		savecases(form_id, modal_id, this, json);
	});

});


// show add case modal
function initializeCasesListeners(el){
	
	$('#cases-listners').off();
	// $("#cases-listners #cases-model-list > tr").off('mouseenter');
	$("#cases-listners").on('mouseenter','#cases-model-list > tr', function(){

		var data = $(this).find('.data').attr('data');
		var currentCase = App_Cases.casesCollectionView.collection.get(data);
		var that = this;
		getTemplate('cases-detail-popover', currentCase.toJSON(), undefined, function(template_ui){
	 		if(!template_ui)
	    		return;
	    	var ele = $(template_ui);
			$(that).popover(
					{ "rel" : "popover", "trigger" : "hover", "placement" : 'right', "original-title" : currentCase.toJSON().name, "content" : ele,
						"html" : true, });
			$(that).popover('show');
		}, null);

	});

	/**
	 * On mouse out on the row hides the popover.
	 */
	 $("#cases-listners #cases-model-list > tr").off('mouseleave');
	 $('#cases-listners').on('mouseleave', '#cases-model-list > tr', function()
	{
		$(this).popover('hide');
	});

	$("#cases-listners .cases-add").off('click');
	$('#cases-listners').on('click', '.cases-add', function(e)
	{
		e.preventDefault();
		showCases();
	});

	
	$("#cases-listners #cases-model-list > tr > td:not(':first-child')").off('click');
	$('#cases-listners').on('click', '#cases-model-list > tr > td:not(":first-child")', function(e) 
	{
		e.preventDefault();
		updatecases($(this).closest('tr').data());
	});
}

/**
 * Show cases popup for editing
 * 
 * @param ele
 */
function updatecases(ele)
{	
	$("#casesUpdateModal").html(getTemplate("cases-update-modal", {})).modal("show");
	var value = ele.toJSON();

	add_recent_view(new BaseModel(value));

	var casesForm = $("#casesUpdateForm");
	deserializeForm(value, casesForm);

	// Call setupTypeAhead to get contacts
	agile_type_ahead("contacts-typeahead-input", casesForm, contacts_typeahead);

	add_custom_fields_to_form(value, function(data)
	{
		var el_custom_fields = show_custom_fields_helper(data["custom_fields"], [
			"modal"
		]);
		fill_custom_fields_values_generic($(el_custom_fields), value["custom_data"])
		$("#custom-field-case", casesForm).html(fill_custom_fields_values_generic($(el_custom_fields), value["custom_data"]));

	}, "CASE");

	// Fills owner select element
	populateUsers("owners-list", casesForm, value, 'owner', function(data)
	{
		casesForm.find("#owners-list").html(data);
		if (value.owner)
		{
			$("#owners-list", casesForm).find('option[value=' + value['owner'].id + ']').attr("selected", "selected");
		}

	});
}

// Show new cases popup
function showCases()
{

	$("#casesModal").html(getTemplate("cases-new-modal", {}));
	var el = $("#casesForm");

	// Contacts type-ahead
	agile_type_ahead("contacts-typeahead-input", el, contacts_typeahead);

	// Fills owner select element
	populateUsers("owners-list", el, undefined, undefined, function(data)
	{

		$("#casesForm").find("#owners-list").html(data);
		$("#owners-list", $("#casesForm")).find('option[value=' + CURRENT_DOMAIN_USER.id + ']').attr("selected", "selected");
		
	});

	$("#casesModal").modal("show");
}

// Updates or Saves a cases
function savecases(formId, modalId, saveBtn, json)
{
	// Returns, if the save button has disabled attribute
	if ($(saveBtn).attr('disabled'))
		return;

	// Disables save button to prevent multiple click event issues
	disable_save_button($(saveBtn));// $(saveBtn).attr('disabled', 'disabled');

	if (!isValidForm('#' + formId))
	{
		enable_save_button($(saveBtn));// $(saveBtn).removeAttr('disabled'); //
		// Removes disabled attribute of save
		// button
		return false;
	}

	// Shows loading symbol until model get saved
	// $('#' + modalId).find('span.save-status').html(getRandomLoadingImg());

	var newEntry = false; // test if this model is new, true => new model
	if (json.id === undefined)
		newEntry = true;

	json["custom_data"] = serialize_custom_fields(formId);

	var newcases = new Backbone.Model();
	newcases.url = 'core/api/cases';
	newcases.save(json, { success : function(data)
	{
		// Removes disabled attribute of save button
		enable_save_button($(saveBtn));// $(saveBtn).removeAttr('disabled');

		// $('#' + modalId).find('span.save-status img').remove();
		$('#' + modalId).modal('hide');

		$('#' + formId).each(function()
		{
			this.reset();
		});

		var cases = data.toJSON();

		add_recent_view(new BaseModel(cases));

		// Updates data to timeline
		/* If(Contact-Details) page - then adjust timeline */
		if (App_Contacts.contactDetailView && Current_Route == "contact/" + App_Contacts.contactDetailView.model.get('id'))
		{
			// Add model to collection. Disabled sort while adding and called
			// sort explicitly, as sort is not working when it is called by add
			// function
			if (casesView && casesView.collection)
			{
				if (casesView.collection.get(cases.id))
				{
					casesView.collection.get(cases.id).set(new BaseModel(cases));
				}
				else
				{
					casesView.collection.add(new BaseModel(cases), { sort : false });
					casesView.collection.sort();
				}
			}

			if (App_Contacts.contactDetailView.model.get('type') == 'COMPANY')
			{
				activate_timeline_tab(); // if this contact is of type
				// COMPANY, simply activate first
				// tab & fill details
				fill_company_related_contacts(App_Contacts.contactDetailView.model.id, 'company-contacts');
				return;
			}
			// / Now Only models which have type 'PERSON' will through below.

			// activate_timeline_tab(); // switch to first tab in Contact-Detail
			// View

			// Verifies whether the added case is related to the contact in
			// contact detail view or not

			/**
			 * Code to add Info of Case to timeline Not Fully Done, it was
			 * directly copied from Deals module.
			 * 
			 * If you wanna add Case to timeline, edit below
			 */
			$.each(cases.contacts, function(index, contact)
			{

				if (contact.id == App_Contacts.contactDetailView.model.get('id'))
				{

					// Activates "Timeline" tab and its tab content in
					// contact detail view
					// activate_timeline_tab();
					add_entity_to_timeline(data);
					/*
					 * If timeline is not defined yet, initiates with the data
					 * else inserts
					 */
					return false;
				}// end if
			}); // end each

			/*
			 * End of Adding data to timeline.
			 */
		}// end if
		/* end-if(Contact-Details) */
		/*
		 * If(Company-Details)
		 */
		else if (company_util.isCompany()) {
			company_util.updateCasesList(cases,true);
		}
		/*end-if(Company-Details) */
		else if (Current_Route == 'cases')
		{
			// On cases page.. adjust current model
			if (newEntry == true)
				App_Cases.casesCollectionView.collection.add(data);
			else
			{
				App_Cases.casesCollectionView.collection.remove(json);
				App_Cases.casesCollectionView.collection.add(data);
			}
			App_Cases.casesCollectionView.render(true);
		}
		else
			App_Calendar.navigate("cases", { trigger : true });
	}, error : function(data, response)
	{
		enable_save_button($(saveBtn));
	} });
}