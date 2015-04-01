/**
 * Fetches account prefs and render the template.
 * 
 * @param $account_activity -
 *            settings-account-activity template
 */
function load_admin_account_prefs($account_activity)
{
	var view = new Base_Model_View({ url : '/core/api/account-prefs', template : "admin-settings-account-prefs" });

	$account_activity.find('#admin-account-prefs').html(view.render().el);

}

/**
 * Fetches mandrill subaccount info and render them email activity template.
 * 
 * @param $account_activity -
 *            settings-account-activity template
 */
function load_account_email_activity($account_activity)
{
	// Email Activity
	var emailActivityModelView = new Base_Model_View({ url : 'core/api/emails/email-activity', template : 'admin-settings-email-activity', });

	$account_activity.find('#account-email-activity').html(emailActivityModelView.render().el);

}

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
});