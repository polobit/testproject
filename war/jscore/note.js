$(function(){ 
    
    // Save note 
    $('#note_validate').live('click', function(e){
    	e.preventDefault();
    	if (!isValidForm('#noteForm'))
        	return false;
    	
       	var json = serializeForm("noteForm");
    	
    	$('#noteForm').each (function(){
        	  this.reset();
        	});
    	$("#noteModal").modal('hide');
      	var noteModel = new Backbone.Model();
      	noteModel.url = 'core/api/notes';
      	noteModel.save(json);
    });
    
    // Show note modal 
    $('#show-note').live('click', function(e){
     	$("#noteModal").modal('show');
    	
    	var	el = $("#noteForm");
    	agile_type_ahead("note_related_to", el, contacts_typeahead);
    });
    
    // Hide event of note modal
    $('#noteModal').on('hidden', function () {
    	
    	  // Remove appended contacts from related-to
    	  $("#noteForm").find("li").remove();
    	  
    	  $('#noteForm').each (function(){
        	  this.reset();
          });
    });
});