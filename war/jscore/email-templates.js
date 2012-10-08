$(function(){	
	$('#settings-email-templates-model-list > tr').live('click', function(e){
		e.preventDefault();
		var data = $(this).find('.data').attr('data');
		console.log(data);
		if(data)
			{
			 Backbone.history.navigate("email-template/" + data, {
		            trigger: true
		        });
			}
		
	});
});	