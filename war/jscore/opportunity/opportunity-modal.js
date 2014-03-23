$(function(){
	
	/**
	 * Shows deal popup  
	 */
	$('.deals-add').live('click', function(e) {
		e.preventDefault();
		show_deal();
	});
	
	/**
	 * Validates deal and saves
	 */
	$("#opportunity_validate").live('click', function(e){
		e.preventDefault();

    	// To know updated or added deal form names
    	var modal_id = $(this).closest('.opportunity-modal').attr("id");
    	var form_id = $(this).closest('.opportunity-modal').find('form').attr("id");
    	
       	var json = serializeForm(form_id);
       	json["custom_data"] = serialize_custom_fields(form_id);
       	
       	console.log(json);
       	if(form_id == "opportunityForm")
       		saveDeal(form_id, modal_id, this, json, false);
       	else
       		saveDeal(form_id, modal_id, this, json, true);
	});
	
	/**
	 * To avoid showing previous errors of the modal.
	 */
	$('#opportunityModal, #opportunityUpdateModal').on('show', function() {

		// Removes alert message of error related date and time.
		$('#' + this.id).find('.alert').css('display', 'none');

		// Removes error class of input fields
		$('#' + this.id).find('.error').removeClass('error');
	});
	
    
    /**
     * "Hide" event of note modal to remove contacts appended to related to field
     * and validation errors
     */ 
    $('#opportunityModal').on('hidden', function () {
    	
		// Removes appended contacts from related-to field
		$("#opportunityForm").find("li").remove();
		
		// Removes validation error messages
		remove_validation_errors('opportunityModal');

    });
    
    /**
     * "Hide" event of note modal to remove contacts appended to related to field
     * and validation errors
     */ 
    $('#opportunityUpdateModal').on('hidden', function () {
		
    	// Removes appended contacts from related-to field
		$("#opportunityUpdateForm").find("li").remove();
		
		// Removes validation error messages
		remove_validation_errors('opportunityUpdateModal');

    });
    
   /** 
    * Deal list view edit
    */
    $('#opportunities-model-list > tr > td:not(":first-child")').live('click', function(e) {
		e.preventDefault();
		updateDeal($(this).closest('tr').data());
	});
    
    /**
     * Dash board edit
     */
	$('#dashboard-opportunities-model-list > tr').live('click', function(e) {
		e.preventDefault();
		updateDeal($(this).data());
	});
	
	$('.milestones > li').live('mouseenter', function () {
		$(this).find('.deal-options').css("display","inline");
	});
	
	$('.milestones > li').live('mouseleave', function () {
		$(this).find('.deal-options').css("display","none");
	});
	
	/**
	 * Milestone view deal edit
	 */
	$('.deal-edit').live('click', function(e) {
		e.preventDefault();
        var data = $(this).closest('.data').attr('data');
        var currentDeal = App_Deals.opportunityCollectionView.collection.get(data);
		updateDeal(currentDeal);
	});

	/**
	 * Milestone view deal delete
	 */
	$('.deal-delete').live('click', function(e) {
		e.preventDefault();
        if(!confirm("Are you sure you want to delete?"))
			return;
        
        var id = $(this).closest('.data').attr('data');
        var milestone = ($(this).closest('ul').attr("milestone")).trim();
        var id_array = [];
		var id_json = {};
		
		// Create array with entity id.
		id_array.push(id);
		
		// Set entity id array in to json object with key ids, 
		// where ids are read using form param
		id_json.ids = JSON.stringify(id_array);

        var that = this;
		$.ajax({
			url: 'core/api/opportunity/bulk',
			type: 'POST',
			data: id_json,
			success: function() {

				// Checks and deletes the deal from milestone array
				var milestone_array = App_Deals.opportunityMilestoneCollectionView.collection.models[0].get(milestone);
				for(var i in milestone_array)
				{
					if(milestone_array[i].id == id)
						milestone_array.splice(i, 1);
				}
	
				// Removes deal from list
				$(that).closest('li').css("display","none");
				
				// Shows Milestones Pie
				pieMilestones();
	
				// Shows deals chart
				dealsLineChart();
			}
		});
	});
});

/**
 * Show deal popup for editing
 */ 
function updateDeal(ele) {
	
	var value = ele.toJSON();
	
	add_recent_view(new BaseModel(value));
	
	var dealForm = $("#opportunityUpdateForm");
	
	deserializeForm(value, $("#opportunityUpdateForm"));
	
	$("#opportunityUpdateModal").modal('show');
	
	// Call setupTypeAhead to get contacts
	agile_type_ahead("relates_to", dealForm, contacts_typeahead);
	
	// Fills owner select element
	populateUsers("owners-list", dealForm, value, 'owner', function(data) {
				dealForm.find("#owners-list").html(data);
				if (value.owner) {
					$("#owners-list", dealForm).find('option[value=' + value['owner'].id + ']')
							.attr("selected", "selected");
					$("#owners-list", $("#opportunityUpdateForm")).closest('div').find('.loading-img').hide();
				}
	});
	
	// Fills milestone select element
	populateMilestones(dealForm, undefined, value, function(data){
		dealForm.find("#milestone").html(data);
		if (value.milestone) {
			$("#milestone", dealForm).find('option[value=\"'+value.milestone+'\"]')
					.attr("selected", "selected");
		}
		$("#milestone", dealForm).closest('div').find('.loading-img').hide();
	});
	
	add_custom_fields_to_form(value, function(data){
		var el = show_custom_fields_helper(data["custom_fields"], []);
	//	if(!value["custom_data"])  value["custom_data"] = [];
		$("#custom-field-deals", dealForm).html(fill_custom_fields_values_generic($(el), value["custom_data"]));
		
	}, "DEAL")
}

/**
 * Show new deal popup
 */ 
function show_deal(){
	
	var el = $("#opportunityForm");

	$("#opportunityModal").modal('show');
	
	add_custom_fields_to_form({}, function(data){
		var el_custom_fields = show_custom_fields_helper(data["custom_fields"], []);
		$("#custom-field-deals", $("#opportunityModal")).html($(el_custom_fields));
		
	}, "DEAL")
	
	
	
	// Fills owner select element
	populateUsers("owners-list", el, undefined, undefined, function(data){
		
		$("#opportunityForm").find("#owners-list").html(data);
		$("#owners-list", $("#opportunityForm")).find('option[value='+ CURRENT_DOMAIN_USER.id +']').attr("selected", "selected");
		$("#owners-list", $("#opportunityForm")).closest('div').find('.loading-img').hide();
	});
	// Contacts type-ahead
	agile_type_ahead("relates_to", el, contacts_typeahead);
	
	// Fills milestone select element
	populateMilestones(el, undefined, undefined, function(data){
		$("#milestone", el).html(data);
		$("#milestone", el).closest('div').find('.loading-img').hide();
	});
	
	

	// Enable the datepicker
	$('#close_date', el).datepicker({
		format : 'mm/dd/yyyy',
	});
}

/**
 * Updates or Saves a deal
 */ 
function saveDeal(formId, modalId, saveBtn, json, isUpdate){
	// Returns, if the save button has disabled attribute
	if ($(saveBtn).attr('disabled'))
		return;

	// Disables save button to prevent multiple click event issues
	disable_save_button($(saveBtn));//$(saveBtn).attr('disabled', 'disabled');
	
	if (!isValidForm('#' + formId)) {
		// Removes disabled attribute of save button
		enable_save_button($(saveBtn));//$(saveBtn).removeAttr('disabled');
		return false;
	}
	
	// Shows loading symbol until model get saved
    // $('#' + modalId).find('span.save-status').html(LOADING_HTML);

	var newDeal = new Backbone.Model();
	newDeal.url = 'core/api/opportunity';
	newDeal.save(json, {
		success : function(data) {

			// Removes disabled attribute of save button
			enable_save_button($(saveBtn));//$(saveBtn).removeAttr('disabled');

			//$('#' + modalId).find('span.save-status img').remove();
			$('#' + modalId).modal('hide');

			$('#' + formId).each(function() {
				this.reset();
			});
			
			var deal = data.toJSON();
			
			add_recent_view(new BaseModel(deal));
			
			// Updates data to timeline
			if (App_Contacts.contactDetailView
					&& Current_Route == "contact/"
							+ App_Contacts.contactDetailView.model.get('id')) {

				// Add model to collection. Disabled sort while adding and called
				// sort explicitly, as sort is not working when it is called by add
				// function
				
				
				/*
				 * Verifies whether the added task is related to the contact in
				 * contact detail view or not
				 */
				$.each(deal.contacts, function(index, contact) {
					
					if (contact.id == App_Contacts.contactDetailView.model
							.get('id')) {
						
						

						if (dealsView && dealsView.collection)
						{
							if(dealsView.collection.get(deal.id))
							{
								dealsView.collection.get(deal.id).set(new BaseModel(deal));
							}
							else
							{
								dealsView.collection.add(new BaseModel(deal), { sort : false });
								dealsView.collection.sort();
							}
						}
						
							// Activates "Timeline" tab and its tab content in
							// contact detail view
							// activate_timeline_tab();
							add_entity_to_timeline(data);
							/*
							 * If timeline is not defined yet, initiates with the
							 * data else inserts
							 */
							return false;
					}
				});
			}
			// When deal is added or updated from Deals route
			else if (Current_Route == 'deals') {

				if(!readCookie("agile_deal_view")) {
					var modelJSON = App_Deals.opportunityMilestoneCollectionView.collection.models[0];
					var newMilestone = json.milestone;
					if (isUpdate)
					{
						var oldDealJSON = App_Deals.opportunityCollectionView.collection.get(json.id).toJSON();
						var oldMilestone = oldDealJSON.milestone;
						var milestone = modelJSON.get(oldMilestone);
						for(var i in milestone)
						{
							if(milestone[i].id == json.id)
							{
								if(newMilestone != oldMilestone)
								{
									milestone[i].owner_id = milestone[i].owner.id;
									//milestone[i].milestone = newMilestone;
									//modelJSON.get(newMilestone).push(milestone[i]);
									modelJSON.get(newMilestone).push(deal);
									milestone.splice(i, 1);
								}
								else 
								{
									deal.owner_id = milestone[i].owner.id;
									milestone.splice(i, 1);
									modelJSON.get(oldMilestone).push(deal);
								}
								
							}
						}
					}
					else
					  modelJSON.get(newMilestone).push(deal);
					
					App_Deals.opportunityMilestoneCollectionView.render(true);
				}
				if (isUpdate)
				 App_Deals.opportunityCollectionView.collection.remove(json);
			
				App_Deals.opportunityCollectionView.collection.add(data);
				App_Deals.opportunityCollectionView.render(true);

			}
			else {
				App_Deals.navigate("deals", {
					trigger : true
				});
			}
		}
	});
}