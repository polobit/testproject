
function loadProfile(contact_id, callback){	
	var queueName = "widget_queue_"+ contact_id;
	queueGetRequest(queueName, "/core/api/widgets/paypal/profile/" + PAYPAL_Plugin_Id, "", 
	function success(data){
		getDetails(data);

		// If defined, execute the callback function
		if (callback && typeof (callback) === "function")
			callback(data);
	}, 
	function error(data){
		console.log("Error : "+data);
	});
}

function getDetails(accessToken) {	
	console.log("accessToken "+accessToken);
	var tok = "Bearer " + accessToken;
	var obj = {email : "prem.agilecrm@gmail.com"};

//	{ email : Email};

	$.ajax({
		headers : {
			"Accept-Language" : "en_US",
			"Authorization" : tok
		},
		url : "https://api.paypal.com/v1/invoicing/search",
		type : "POST",
		contentType : "application/json",
		data : JSON.stringify(obj),
		complete : function(result) {
			console.log("Paypal *** Invoices");
			console.log(result);
			var data={};			
			data = result.responseJSON;		
			getTemplate('paypal-invoices', data, undefined, function(template_ui){				
				$('#Paypal').html(template_ui);
			});			
		}
	});
}

function startPaypalWidget(contact_id){
	PAYPAL_PLUGIN_NAME = "Paypal";

	PAYPAL_UPDATE_LOAD_IMAGE = '<center><img id="paypal_load" src=' + '\"img/ajax-loader-cursor.gif\" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';

	var paypal_widget = agile_crm_get_widget(PAYPAL_PLUGIN_NAME);

	console.log(paypal_widget);

	PAYPAL_Plugin_Id = paypal_widget.id;	
	Email = agile_crm_get_contact_property('email');

	loadProfile(contact_id, function(){

	});

}