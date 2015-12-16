
function loadProfile(contact_id, callback){	
	var queueName = "widget_queue_"+ contact_id;
	queueGetRequest(queueName, "/core/api/widgets/paypal/profile/" + PAYPAL_Plugin_Id + "/" + Email, "json", 
	function success(data){
		// If defined, execute the callback function
		if (callback && typeof (callback) === "function")
			callback(data);
		alert('Done Success');
	}, 
	function error(data){
		alert('Done Error');
	});
}

function startPaypalWidget(contact_id){
	alert(contact_id);
	PAYPAL_PLUGIN_NAME = "Paypal";

	PAYPAL_UPDATE_LOAD_IMAGE = '<center><img id="paypal_load" src=' + '\"img/ajax-loader-cursor.gif\" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';

	var paypal_widget = agile_crm_get_widget(PAYPAL_PLUGIN_NAME);

	console.log(paypal_widget);

	PAYPAL_Plugin_Id = paypal_widget.id;	
	Email = agile_crm_get_contact_property('email');

	loadProfile(contact_id, function(){

	});

}