
function loadProfile(){

	queueGetRequest("widget_queue_"+contact_id, "/core/api/widgets/zendesk/profile/" + Zendesk_Plugin_Id + "/" + Email, "json", 
	function success(data){
		// If defined, execute the callback function
		if (callback && typeof (callback) === "function")
			callback(data);

	}, 
	function error(data){
		

	});
}

function startPaypalWidget(contact_id){
	PAYPAL_PLUGIN_NAME = "Paypal";

	PAYPAL_UPDATE_LOAD_IMAGE = '<center><img id="paypal_load" src=' + '\"img/ajax-loader-cursor.gif\" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';

	var paypal_widget = agile_crm_get_widget(PAYPAL_PLUGIN_NAME);

	console.log('In Zendesk');
	console.log(paypal_widget);

	PAYPAL_Plugin_Id = paypal_widget.id;
	alert(PAYPAL_Plugin_Id);

}