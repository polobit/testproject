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
		
		if($('#trigger-type option:selected').val() == 'ADD_SCORE')
		$('#add-score-value').css('display', 'inline-block');
		else
		$('#add-score-value').css('display','none');
	});
	
});