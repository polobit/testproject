
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
	var obj = {
	"merchant_info ": {
		"email": "dennis@sample.com",
		"first_name": "Dennis",
		"last_name": "Doctor",
		"business_name": "Medical Professionals, LLC",
		"phone": {
			"country_code": "001",
			"national_number": "5032141716"
		},
		"address": {
			"line1": "1234 Main St.",
			"city": "Portland",
			"state": "OR",
			"postal_code": "97217",
			"country_code": "US"
		}
	},
	"billing_info": [{
		"email": "example@example.com"
	}],
	"items": [{
		"name": "Sutures",
		"quantity": 100,
		"unit_price": {
			"currency": "USD",
			"value": 5
		}
	}],
	"note": "Medical Invoice 16 Jul, 2013 PST",
	"payment_term": {
		"term_type": "NET_45"
	},
	"shipping_info": {
		"first_name": "Sally",
		"last_name": "Patient",
		"business_name": "Not applicable",
		"address": {
			"line1": "1234 Broad St.",
			"city": "Portland",
			"state": "OR",
			"postal_code": "97216",
			"country_code": "US"
		}
	}
};

//	{ email : Email};

	$.ajax({
		headers : {
			"Accept-Language" : "en_US",
			"Authorization" : tok
		},
		url : "https://api.sandbox.paypal.com/v1/invoicing/invoices",
		type : "POST",
		contentType : "application/json",
		data : JSON.stringify(obj),
		complete : function(result) {
			console.log("Paypal *** Invoices");
			console.log(result);
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