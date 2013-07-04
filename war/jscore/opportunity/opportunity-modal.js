$(function(){

	$('.deals-add').live('click', function(e) {
		e.preventDefault();
		showDeal();
	});

	$("#opportunity_validate").live('click', function(e){
		e.preventDefault();

    	// To know updated or added deal form names
    	var modal_id = $(this).closest('.opportunity-modal').attr("id");
    	var form_id = $(this).closest('.opportunity-modal').find('form').attr("id");
    	
       	var json = serializeForm(form_id);
       	saveDeal(form_id, modal_id, this, json);
    	
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
    
	$('#opportunities-model-list > tr').live('click', function(e) {
		e.preventDefault();
		updateDeal($(this).data());
	});
    
});

// Show deal popup for editing
function updateDeal(ele) {
	
	var value = ele.toJSON();
	
	var dealForm = $("#opportunityUpdateForm");
	// If we use only one modal for add and edit validation problems arises so done seperately.
	//var dealModal = $("#opportunityModal").clone();
	//dealModal.attr('id', "opportunityUpdateModal");
	//dealModal.find('h3').html("Edit Deal");
	//$("#opportunityForm > fieldset", dealModal).prepend('<input name="id" type="hidden"/>')
	//$("#opportunityForm", dealModal).attr('name', "opportunityUpdateForm");
	//$("#opportunityForm", dealModal).attr('id', "opportunityUpdateForm");

	
	deserializeForm(value, $("#opportunityUpdateForm"));
	
	// Call setupTypeAhead to get contacts
	agile_type_ahead("relates_to", dealForm, contacts_typeahead);
	
	// Fills owner select element
	populateUsers("owners-list", dealForm, value, 'owner', function(data) {
				dealForm.find("#owners-list").html(data);
				if (value.owner) {
					$("#owners-list", dealForm).find('option[value=' + value['owner'].id + ']')
							.attr("selected", "selected");
				}
				
				// Fills milestone select element
				populateMilestones(dealForm, undefined, value, function(data){
					dealForm.find("#milestone").html(data);
					if (value.milestone) {
						$("#milestone", dealForm).find('option[value=\"'+value.milestone+'\"]')
								.attr("selected", "selected");
					}
					$("#opportunityUpdateModal").modal('show');

				});
			});
}

// Show new deal popup
function showDeal(){
	
	var el = $("#opportunityForm");
	
	// Fills owner select element
	populateUsers("owners-list", el, undefined, undefined, function(data){
		
		$("#opportunityForm").find("#owners-list").html(data);
		$("#owners-list", $("#opportunityForm")).find('option[value='+ CURRENT_DOMAIN_USER.id +']').attr("selected", "selected");
		// Contacts type-ahead
		agile_type_ahead("relates_to", el, contacts_typeahead);
		
		// Fills milestone select element
		populateMilestones(el, undefined, undefined, function(data){
			$("#milestone", el).html(data);
		});

		// Enable the datepicker
		$('#close_date', el).datepicker({
			format : 'mm/dd/yyyy',
		});
		
		$("#opportunityModal").modal('show');
	});
}

// Updates or Saves a deal
function saveDeal(formId, modalId, saveBtn, json){
	
	// Returns, if the save button has disabled attribute
	if ($(saveBtn).attr('disabled'))
		return;

	// Disables save button to prevent multiple click event issues
	$(saveBtn).attr('disabled', 'disabled');
	
	if (!isValidForm('#' + formId)) {
		// Removes disabled attribute of save button
		$(saveBtn).removeAttr('disabled');
		return false;
	}
	
	// Shows loading symbol until model get saved
    $('#' + modalId).find('span.save-status').html(LOADING_HTML);

	var newDeal = new Backbone.Model();
	newDeal.url = 'core/api/opportunity';
	newDeal.save(json, {
		success : function(data) {

			// Removes disabled attribute of save button
			$(saveBtn).removeAttr('disabled');

			$('#' + modalId).find('span.save-status img').remove();
			$('#' + modalId).modal('hide');

			$('#' + formId).each(function() {
				this.reset();
			});
			
			var deal = data.toJSON();
			// Updates data to timeline
			if (App_Contacts.contactDetailView
					&& Current_Route == "contact/"
							+ App_Contacts.contactDetailView.model.get('id')) {

				/*
				 * Verifies whether the added task is related to the contact in
				 * contact detail view or not
				 */
				$.each(deal.contacts, function(index, contact) {
					
					if (contact.id == App_Contacts.contactDetailView.model
							.get('id')) {

						/*
						 * Activates timeline in contact detail tab and tab
						 * content
						 */
						activate_timeline_tab();
						/*
						 * If timeline is not defined yet, initiates with the
						 * data else inserts
						 */
						if (timelineView.collection.length == 0) {
							timelineView.collection.add(data);
							
							setup_timeline(timelineView.collection.toJSON(),
									App_Contacts.contactDetailView.el,
									undefined);
						} else {
							var newItem = $(getTemplate("timeline", data
									.toJSON()));
							newItem.find('.inner').append(
									'<a href="#" class="open-close"></a>');
							$('#timeline').isotope('insert', newItem);
						}
						return false;
					}
				});
			}
			else if (Current_Route == 'deals') {
				location.reload(true);
			}
			else {
				App_Calendar.navigate("deals", {
					trigger : true
				});
			}
		}
	});
}