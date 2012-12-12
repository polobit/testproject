$(function(){
	
	// Tag suggestions when 'Tag is added' and 'Tag is deleted' options selected
	$('#trigger-type').live('change',function(e){
        e.preventDefault();		
		
        if($(this).val() == 'TAG_IS_ADDED' || $(this).val() == 'TAG_IS_DELETED')
		  {
			setup_tags_typeahead();
		  }
        // When Add score is selected delete tags if present already
        if($(this).val() == 'ADD_SCORE')
        	{ 
        	$('#tags-ul').empty();
        	}
	});
});
	