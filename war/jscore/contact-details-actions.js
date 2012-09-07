$(function(){ 
	// Display activity(task) modal related to contact
    $('#contact-add-task').live('click', function(e){
    	e.preventDefault();
    	highlightTask();
    	var	el = $("#taskForm");
    	fillRelation(el);
    	$('#activityModal').modal('show');
    });
    
    // Display note modal related to contact
    $('#contact-add-note').live('click', function(e){
    	e.preventDefault();
    	var	el = $("#noteForm");
    	fillRelation(el);
    	$('#noteModal').modal('show');
     });
});

function fillRelation(el){
	 var json = App_Contacts.contactDetailView.model.toJSON();
 	 var contact_name = json.properties[0].value + " " + json.properties[1].value;
 	
 	$('.tags',el).html('<li class="label label-warning"  style="display: inline-block; vertical-align: middle; margin-right:3px;" value="'+ json.id +'">'+contact_name+'</li>');

}