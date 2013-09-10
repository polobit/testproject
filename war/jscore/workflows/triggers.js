/**
 * triggers.js is a script file that sets tags typeahead when Tag options are selected
 * 
 * @module Campaigns
 * 
 **/
$(function(){
	
	// Tag suggestions when 'Tag is added' and 'Tag is deleted' options selected
	$('#trigger-type').live('change',function(e){
       
		e.preventDefault();		
		
        if($(this).val() == 'TAG_IS_ADDED' || $(this).val() == 'TAG_IS_DELETED')
		  {
        	// Tags typeahead for tag input field
        	addTagsDefaultTypeahead($('form#addTriggerForm').find('div#RHS'));
		  }
        
	});
});
	