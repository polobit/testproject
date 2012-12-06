$(function(){
	
	// When the row of a trigger clicked,it should navigate to edit trigger
	$('#triggers-model-list > tr').live('click', function(e){
		e.preventDefault();
		
		var id = $(this).find('.data').attr('data');
		// Navigate to trigger form
		if(id)
			{
			 Backbone.history.navigate("trigger/" + id, {
		            trigger: true
		        });
			}
		
	});
	
	// Tag suggestions when 'Tag is added' and 'Tag is deleted' options selected
	$('#trigger-type').live('change',function(e){
        e.preventDefault();		
		
        if($(this).val() == 'TAG_IS_ADDED' || $(this).val() == 'TAG_IS_DELETED')
		  {
			setupTagsTypeAhead();
		  }
        // When Add score is selected delete tags if present already
        if($(this).val() == 'ADD_SCORE')
        	{ 
        	$('#tags-ul').empty();
        	}
	});
	

	   	
	
});