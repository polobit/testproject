/**
 * modals.js script file defines the functionality of click events of some
 * buttons and "show" and "hide" events of person and company modals
 * 
 * @module Contact management
 * @author Rammohan
 */


var forceCompany={}; /* to force company on personModal,
						Should contain - 
							doit - true to force
							name - name of company
							id - id of company
						*/
$(function(){
	   
		/**
		 * "show" event of modal - 
		 * To handle UI before its drawn on screen, even before rolling onto screen.
		 * Clean modal.
		 * If forceCompany - hide company input & show non-cancellable company name tag.
		 * Else - enable things by default
		 */
		$("#personModal").on('show',function(data)
		{
			if(forceCompany.doit==true)
			{
				$("#personForm [name='contact_company_id']")
					.html('<li class="tag"  style="display: inline-block;" data="' + forceCompany.id + 
						'"><a href="#contact/' + forceCompany.id +'" id="contact_company_autofilled">' + forceCompany.name + 
						'</a></li>');
				$("#personForm #contact_company").hide();
				//Force Company, disable input box so user can't enter a new Company.
				
				forceCompany.doit=false; // prevent forcing company next time
			}
			else
			{
				//default clean model
				$("#personForm [name='contact_company_id']").html('');
				$("#personForm #contact_company").show();
				$("#personForm #contact_company").val('');
				$("#personForm input").val('');
			}	
		});
		
		
		$("#companyModal").on('show', function(data) {
			var target = data.target;
			add_custom_fields_to_form({}, function(data){
				var el = show_custom_fields_helper(data["custom_fields"], []);
			//	if(!value["custom_data"])  value["custom_data"] = [];
				
				$("#custom-field-deals", $(target)).html(el);
				// Add placeholder and date picker to date custom fields
				$('.date_input', $(target)).attr("placeholder","MM/DD/YYYY");
		    
				$('.date_input', $(target)).datepicker({
					format: 'mm/dd/yyyy'
				});
				
			}, "COMPANY")
			
			

		});
	
		/**
		 * "Shown" event of person modal 
		 * Activates tags typeahead to tags field, company typeahead too
		 */
		$("#personModal").on('shown', function(data){
			setup_tags_typeahead();
			
			var stat=$("#personForm #contact_company").attr('display');
			if( stat!='none')
			{
				/**
				 * Activate company-typeahead only if required, i.e. there's a Company Input field
				 * Custom function for typeahead results, 
				 * show at contact_company_id, data=id-of-company-contact and data=company-name
				 */
				var fxn_display_company=function(data,item)
				{
					$("#personForm [name='contact_company_id']")
						.html('<li class="tag"  style="display: inline-block;" data="' + data + 
							'"><a href="#contact/' + data +'" id="contact_company_autofilled">' + item + 
							'</a><a class="close" id="remove_tag">&times</a></li>');
					$("#personForm #contact_company").hide();
				}
				agile_type_ahead("contact_company",$('#personForm'), contacts_typeahead,fxn_display_company,'type=COMPANY','<b>No Results</b> <br/> Will add a new one');
			}
		});
		
		/**
		 * Close clicked of company entered, this brings back text input field of company to fill again
		 */
		$("#personForm [name='contact_company_id'] a.close").live('click',function(e){
			$("#personForm #contact_company").show();
		});
	
		/**
		 * Click event of "Save Changes" button in person modal
		 * Saves the contact using the function "serialize_and_save_continue_contact"
		 */
	    $('#person_validate').live('click', function(e){
	    	serialize_and_save_continue_contact(e, 'personForm', 'personModal', false, true, this, 'tags_source_person_modal');
	    });
	    
	    /**
		 * Navigates to controller to import contacts from a file
		 */
	    $('#import-link').live('click', function (e) {
	    	Backbone.history.navigate("import",{trigger: true});	        
	    });
	    
	    /**
		 * Click event of "Save Changes" button in company modal
		 * Saves the contact using the function "serialize_and_save_continue_contact"
		 */
	    $('#company_validate').live('click', function (e) {
	    	serialize_and_save_continue_contact(e, 'companyForm', 'companyModal', false, false, this);
	    });
	    
	    /**
	     * "Hidden" event of person modal
	     * Hides email alert error and removes validation errors
	     */ 
	    $('#personModal').on('hidden', function () {
	    	
	    	// Hides email error message
	    	$('#personModal').find(".alert").hide();
	    	
	    	// Removes validation error messages
	    	remove_validation_errors('personModal');
	    	$('#personModal input').val('');
	    });
	    
	    /**
	     * "Hidden" event of company modal
	     * Removes validation errors
	     */
	    $('#companyModal').on('hidden', function () {
	    	remove_validation_errors('companyModal');
	    	$('#companyModal input').val('');
	    });
});

/**
 * Removes validation messages (error or success) from any modal 
 * based on its id attribute
 * 
 * @method remove_validation_errors
 * @param modalId
 * 			specifies a modal
 */
function remove_validation_errors(modalId){
	$('#' + modalId).find("div.control-group").removeClass("error");
	$('#' + modalId).find("div.control-group").removeClass("success");
	$('#' + modalId).find("span.help-inline").remove();
}
