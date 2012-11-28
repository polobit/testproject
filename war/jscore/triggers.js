$(function(){
	$('#triggers-model-list > tr').live('click', function(e){
		
		e.preventDefault();
		var data = $(this).find('.data').attr('data');
		if(data)
			{
			 Backbone.history.navigate("trigger/" + data, {
		            trigger: true
		        });
			}
		
	});
	
	$('#trigger-type').live('change',function(e){
        e.preventDefault();		
		  if($(this).val() == 'TAG_IS_ADDED' || $(this).val() == 'TAG_IS_DELETED')
		  {
			setupTagsTypeAhead();
		  }
	});
	
	
});