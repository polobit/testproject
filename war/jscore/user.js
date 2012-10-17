	
$(function(){
	$('#admin-settings-users-model-list > tr').live('click', function(e){
		
			e.preventDefault();
			var data = $(this).find('.data').attr('data');
			console.log(data);
			if(data)
				{
					Backbone.history.navigate("user-edit/" + data, {
		            trigger: true
					});
				}
		
		});
});