$(function(){
	
	$('#email-gateway-delete').die().live('click', function(e){
		e.preventDefault();
		
		if(!confirm("Are you sure you want to delete?"))
    		return false;
		
		$.ajax({
			url: 'core/api/email-gateway',
			type: 'DELETE',
			success: function(){
				
				if(App_Admin_Settings.email_gateway && App_Admin_Settings.email_gateway.model)
			     {
			    	 var data = App_Admin_Settings.email_gateway.model.toJSON();
			    	 
			    	 if(data.email_api == "MANDRILL")
			    	 {
			    		 	// Delete mandrill webhook
							$.getJSON("core/api/email-gateway/delete-webhook?api_key="+ data.api_key+"&type="+data.email_api, function(data){
								
								console.log(data);
								
							});
			    	 }
			     }	
				
				location.reload(true);
			}
		});
	});
	
	$('#sms-gateway-delete').die().live('click', function(e){
		e.preventDefault();
		
		if(!confirm("Are you sure you want to delete?"))
    		return false;
		var id=$(this).attr('data');
		$.ajax({
			url: 'core/api/widgets/integrations/'+id,
			type: 'DELETE',
			success: function(){
				location.reload(true);
			}
		});
	});
	
});

function modalAlert(templateName,message,title){
	
	if(templateName == undefined || message == undefined || title == undefined)
		return;
	var alertJSON = {};
	alertJSON["title"] = title;
	alertJSON["message"] = message;
	var template = $(getTemplate(templateName,alertJSON));
	template.modal('show');
	return;
}



