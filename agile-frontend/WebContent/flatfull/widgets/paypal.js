
var paypalOBJ = {};
var paymentINVCount = 1;
var showMorePaypalINV = '<div class="widget_tab_footer paypal_inv_show_more" align="center"><a class="c-p text-info" id="paypal_inv_show_more" rel="tooltip" title="Click to see more tickets">Show More</a></div>';


function loadPaypalInvoices(offSet){

	if(offSet == 0){
		var result = {};
		result.invoices = paypalOBJ.invoices.slice(0, 5);

		getTemplate('paypal-invoices', result, undefined, function(template_inv){			
			$('#Paypal').html(template_inv);
		},null);

		if(paypalOBJ.invoices.length > 5){
			$('#Paypal').append(showMorePaypalINV);
		}
	}else if(offSet > 0  && (offSet+5) < paypalOBJ.invoices.length){
		var result = {};
		result.invoices = paypalOBJ.invoices.slice(offSet, (offSet+5));
		$('.paypal_inv_show_more').remove();
		$('#Paypal').apped(getTemplate('paypal-invoices', result));
		$('#Paypal').append(showMorePaypalINV);
	}else{
		var result = {};
		result.invoices = paypalOBJ.invoices.slice(offSet, paypalOBJ.invoices.length);
		$('.paypal_inv_show_more').remove();
		$('#Paypal').append(getTemplate('paypal-invoices', result));
	}

}

function loadProfile(contact_id, callback){	
	var queueName = "widget_queue_"+ contact_id;
	queueGetRequest(queueName, "/core/api/widgets/paypal/profile/" + PAYPAL_Plugin_Id, "", 
	function success(data){
		getInvoices(data);			
		// If defined, execute the callback function
		if (callback && typeof (callback) === "function")
			callback(data);
	}, 
	function error(data){
		console.log("Error : "+data);
	});
}

function getInvoices(accessToken){	
	var tok = "Bearer " + accessToken;
	var obj = {email : "prem.agilecrm@gmail.com"};

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
			paypalOBJ = {};	
			paymentINVCount = 1;			
			paypalOBJ.invoices = result.responseJSON.invoices;
			loadPaypalInvoices(0);					
		}
	});
}

function startPaypalWidget(contact_id){
	PAYPAL_PLUGIN_NAME = "Paypal";

	paypalOBJ = {};
	paymentINVCount =1;

	PAYPAL_UPDATE_LOAD_IMAGE = '<center><img id="paypal_load" src=' + '\"img/ajax-loader-cursor.gif\" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';

	var paypal_widget = agile_crm_get_widget(PAYPAL_PLUGIN_NAME);

	console.log(paypal_widget);

	PAYPAL_Plugin_Id = paypal_widget.id;	
	Email = agile_crm_get_contact_property('email');


	$("#widgets").off("click", "#paypal_inv_show_more");
	$("#widgets").on("click", "#paypal_inv_show_more", function(e){
		e.preventDefault();
		var offSet = paymentINVCount * 5;
		loadPaypalInvoices(offSet);
		++paymentINVCount;
	});


	loadProfile(contact_id, function(){

	});

}