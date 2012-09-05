$(function(){ 
	// Display activity(task) modal related to contact
    $('#contact-add-task').live('click', function(e){
    	e.preventDefault();
    	highlightTask();
    	fillIdAndName("taskForm", "contact_id", "task_related_to");
    	$('#activityModal').modal('show');
    });
    
    // Display note modal related to contact
    $('#contact-add-note').live('click', function(e){
    	e.preventDefault();
    	fillIdAndName("noteForm", "contact_id", "about");
    	$('#noteModal').modal('show');
     });
    
    // Save note related to contact
    $('#note_validate').live('click', function(e){
    	e.preventDefault();
    	$("#noteModal").modal('hide');
       	var json = serializeForm("noteForm");
    	
    	$('#noteForm').each (function(){
        	  this.reset();
        	});
      	 
      	var noteModel = new Backbone.Model();
      	noteModel.url = 'core/api/notes';
      	noteModel.save(json);
    });
});
function fillIdAndName(formId, hiddenIdName, nameId){
	 var json = App_Contacts.contactDetailView.model.toJSON();
 	 var contact_name = '<span class="label">' + json.properties[0].value + " " + json.properties[1].value + '</span>';
 	$('#' + formId).find( 'input[name=' + hiddenIdName + ']' ).val(json.id);
 	$('#' + nameId).val(contact_name);
}