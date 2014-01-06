$(function(){ 
	
	/**
	 * To avoid showing previous errors of the modal.
	 */
	$('#uploadDocumentModal').on('show', function() {

		// Removes alert message of error related date and time.
		$('#' + this.id).find('.alert').css('display', 'none');
		
		// Removes error class of input fields
		$('#' + this.id).find('.error').removeClass('error');
	});
	
    /**
     * "Hide" event of note modal to remove contacts appended to related to field
     * and validation errors
     */ 
    $('#uploadDocumentModal').on('hidden', function () {
    	
		// Removes appended contacts from related-to field
		$("#uploadDocumentForm").find("li").remove();
		$('#uploadDocumentForm').find('#error').html("");
		
		// Removes validation error messages
		remove_validation_errors('uploadDocumentModal');

    });

	$(".link").live('click', function(e)
	{
		e.preventDefault();
		$('#uploadDocumentForm').find('#error').html("");
		var id = $(this).find("a").attr("id").toUpperCase();
		
		if(id && id == "GOOGLE")
			var newwindow = window.open("upload-google-document.jsp?id=upload-form", 'name','height=510,width=800');
		else if(id && id == "S3")
			var newwindow = window.open("upload-custom-document.jsp?id=upload-form", 'name','height=310,width=500');
		
		if (window.focus)
		{
			newwindow.focus();
		}
		return false;
	});
	
    $('#document_validate').on('click',function(e){
 		e.preventDefault();
 		
 		var modal_id = $(this).closest('.upload-document-modal').attr("id");
    	var form_id = $(this).closest('.upload-document-modal').find('form').attr("id");
    	var saveBtn = this;

    	// serialize form.
		var json = serializeForm(form_id);
		
 		// Returns, if the save button has disabled attribute
 		if ($(saveBtn).attr('disabled'))
 			return;

 		// Disables save button to prevent multiple click event issues
 		disable_save_button($(saveBtn));
 		
 		if (!isValidForm('#' + form_id)) {

 			// Removes disabled attribute of save button
 			enable_save_button($(saveBtn));//$(saveBtn).removeAttr('disabled');
 			
 			return false;
 		}
 		
 		var url = $('#' + form_id).find('#upload_url').val();
 		if(url == "")
 		{
 			$('#' + form_id).find('#error').html('<div class="alert alert-error">Sorry! Document not attached properly.</div>');
 			enable_save_button($(saveBtn));
 			return;
 		}
	 		
 		var newDocument = new Backbone.Model();
 		newDocument.url = 'core/api/documents';
 		newDocument.save(json, {
 			success : function(data) {

 				// Removes disabled attribute of save button
 				enable_save_button($(saveBtn));//$(saveBtn).removeAttr('disabled');
 				
 				$('#' + form_id).find('#url').html("");
 				$('#' + form_id).find("#network_type").val("");
 				$('#' + form_id).find("#upload_url").val("");
 				
 				//$('#' + modalId).find('span.save-status img').remove();
 				$('#' + modal_id).modal('hide');

 				$('#' + form_id).each(function() {
 					this.reset();
 				});
 				
 				var document = data.toJSON();
 				add_recent_view(new BaseModel(document));
 				
 				// Updates data to timeline
 				if (App_Contacts.contactDetailView
 						&& Current_Route == "contact/"
 								+ App_Contacts.contactDetailView.model.get('id')) {

 					// Add model to collection. Disabled sort while adding and called
 					// sort explicitly, as sort is not working when it is called by add
 					// function
 					
 					
 					/*
 					 * Verifies whether the added document is related to the contact in
 					 * contact detail view or not
 					 */
 					$.each(document.contacts, function(index, contact) {
 						
 						if (contact.id == App_Contacts.contactDetailView.model
 								.get('id')) {
 							
 							

 							if (documentsView && documentsView.collection)
 							{
 								if(documentsView.collection.get(document.id))
 								{
 									documentsView.collection.get(document.id).set(new BaseModel(document));
 								}
 								else
 								{
 									documentsView.collection.add(new BaseModel(document), { sort : false });
 									documentsView.collection.sort();
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
 				else {
 					App_Deals.navigate("documents", {
 						trigger : true
 					});
 				}
 			}
 		});

	});

});	


function saveDocumentURL(url, network)
{
	$('#uploadDocumentForm').find("#network_type").val(network);
   	$('#uploadDocumentForm').find('#upload_url').val(url);
   	$('#uploadDocumentForm').find('#url').html('<a href="'+ url +'" target="_blank">'+ url +'</a>');
}