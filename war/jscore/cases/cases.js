//handle popover
$(function () {
	
	/**
	 * When mouseover on any row of opportunities list, the popover of deal is shown
	 **/
	$('#cases-model-list > tr').live('mouseenter', function () {
        
        var data = $(this).find('.data').attr('data');

        var currentCase = App_Cases.casesCollectionView.collection.get(data);
       
        console.log(currentCase.toJSON());
        
        var ele = getTemplate("cases-detail-popover", currentCase.toJSON());
        $(this).attr({
        	"rel" : "popover",
        	"data-placement" : 'right',
        	"data-original-title" : currentCase.toJSON().title,
        	"data-content" :  ele
        });
       
       
        /**
         * Checks for last 'tr' and change placement of popover to 'top' inorder
         * to prevent scrolling on last row of list
         **/
        $('#cases-model-list > tr:last').attr({
        	"rel" : "popover",
        	"data-placement" : 'top',
        	"data-original-title" : currentCase.toJSON().name,
        	"data-content" :  ele
        });
        $(this).popover('show');
     });
    
	
    /**
     * On mouse out on the row hides the popover.
     **/
	$('#cases-model-list > tr').live('mouseleave', function(){
    	 $(this).popover('hide');
    });
    
   /**
    * Close button of Case popup is clicked.
    **/
	$('#close-case').live('click', function(e){
    	e.preventDefault();
//    	window.history.back();
    });

});

//show add case modal
$(function(){

	$('.cases-add').live('click', function(e) {
		e.preventDefault();
		showCases();
	});

	$("#cases_validate").live('click', function(e){
		e.preventDefault();

    	// To know updated or added cases form names
    	var modal_id = $(this).closest('.cases-modal').attr("id");
    	var form_id = $(this).closest('.cases-modal').find('form').attr("id");
    	
       	var json = serializeForm(form_id);
//		console.log(json);
       	savecases(form_id, modal_id, this, json);    	
	});
	
	/**
	 * To avoid showing previous errors of the modal.
	 */
	$('#casesModal, #casesUpdateModal').on('show', function() {

		// Removes alert message of error related date and time.
		$('#' + this.id).find('.alert').css('display', 'none');
		
		// Removes error class of input fields
		$('#' + this.id).find('.error').removeClass('error');
	});
	
    
    /**
     * "Hide" event of note modal to remove contacts appended to related to field
     * and validation errors
     */ 
    $('#casesModal').on('hidden', function () {
    	
		// Removes appended contacts from related-to field
		$("#casesForm").find("li").remove();
		
		// Removes validation error messages
		remove_validation_errors('casesModal');

    });
    
    /**
     * "Hide" event of note modal to remove contacts appended to related to field
     * and validation errors
     */ 
    $('#casesUpdateModal').on('hidden', function () {
		
    	// Removes appended contacts from related-to field
		$("#casesUpdateForm").find("li").remove();
		
		// Removes validation error messages
		remove_validation_errors('casesUpdateModal');

    });
    
	$('#cases-model-list > tr').live('click', function(e) {
		e.preventDefault();
		updatecases($(this).data());
	});
    
});

// Show cases popup for editing
function updatecases(ele) 
{
	var value = ele.toJSON();
	
	var casesForm = $("#casesUpdateForm");
	
	deserializeForm(value,$("#casesUpdateForm"));
	
	// Call setupTypeAhead to get contacts
	agile_type_ahead("contacts-typeahead-input", casesForm, contacts_typeahead);
	
	// Fills owner select element
	populateUsers("owners-list", casesForm, value, 'owner', function(data) 
	{
				casesForm.find("#owners-list").html(data);
				if (value.owner) 
				{
					$("#owners-list", casesForm).find('option[value=' + value['owner'].id + ']')
							.attr("selected", "selected");
				}
				
				$("#casesUpdateModal").modal('show');

	});
}

// Show new cases popup
function showCases()
{	
	var el = $("#casesForm");
	
	// Fills owner select element
	populateUsers("owners-list", el, undefined, undefined, function(data){
		
			$("#casesForm").find("#owners-list").html(data);
			$("#owners-list",$("#casesForm")).find('option[value='+ CURRENT_DOMAIN_USER.id +']').attr("selected", "selected");
				// Contacts type-ahead
			agile_type_ahead("contacts-typeahead-input", el, contacts_typeahead);
		});

		// Enable the datepicker
		$('#close_date', el).datepicker({
			format : 'mm/dd/yyyy'
		});
		
		$("#casesModal").modal('show');
}

// Updates or Saves a cases
function savecases(formId, modalId, saveBtn, json)
{	
	console.log(formId);
	// Returns, if the save button has disabled attribute
	if ($(saveBtn).attr('disabled'))return;

	// Disables save button to prevent multiple click event issues
	$(saveBtn).attr('disabled', 'disabled');
	
	if (!isValidForm('#' + formId)) {
		// Removes disabled attribute of save button
		$(saveBtn).removeAttr('disabled');
		return false;
	}
	
	// Shows loading symbol until model get saved
    $('#' + modalId).find('span.save-status').html(LOADING_HTML);
	
	var newEntry=false;
	if(json.id===undefined)newEntry=true;
	
	console.log("MODEL ID="+json.id);
	
	var newcases = new Backbone.Model();
	newcases.url = 'core/api/cases';
	newcases.save(json, 
	{
		success : function(data) 
		{
			
			// Removes disabled attribute of save button
			$(saveBtn).removeAttr('disabled');

			$('#' + modalId).find('span.save-status img').remove();
			$('#' + modalId).modal('hide');

			$('#' + formId).each(function() {
				this.reset();
			});
			
			var cases = data.toJSON();
			// Updates data to timeline
/*If(TIMELINE) page*/			
			if (App_Contacts.contactDetailView
					&& Current_Route == "contact/"
							+ App_Contacts.contactDetailView.model.get('id')) {

				
				// Verifies whether the added task is related to the contact in
				// contact detail view or not
				//
				$.each(cases.contacts, function(index, contact) {
					
					if (contact.id == App_Contacts.contactDetailView.model
							.get('id')) {

						
						// Activates timeline in contact detail tab and tab
						// content
						
						activate_timeline_tab();
						
						 // If timeline is not defined yet, initiates with the
						 // data else inserts
						 
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
					}//end if
				}); //end each
			}//end if
/*enf-if(TIMELINE) */
				else if(Current_Route == 'cases')
				{
					if(newEntry==true)App_Cases.casesCollectionView.collection.add(data);
					else
					{						
						App_Cases.casesCollectionView.collection.remove(json);
						App_Cases.casesCollectionView.collection.add(data);
						//location.reload(true);
					}
					App_Cases.casesCollectionView.render(true);
				}
				else App_Calendar.navigate("cases",{trigger:true}); 
		}
	});
}