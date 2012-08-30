$(function(){
	$('#contacts-model-list > tr').live('click', function(e){
		
		e.preventDefault();
		var data = $(this).find('.data').attr('data');
		console.log(data);
		if(data)
			{
			 Backbone.history.navigate("contact/" + data, {
		            trigger: true
		        });
			}
		
	});
	
	$('#contacts-custom-view-model-list > tr').live('click', function(e){
		
		e.preventDefault();
		var data = $(this).find('.data').attr('data');
		console.log(data);
		if(data)
			{
			 Backbone.history.navigate("contact/" + data, {
		            trigger: true
		        });
			}
		
	});
	
});


function delete_contact_property(contact, propertyName)
{

	
}