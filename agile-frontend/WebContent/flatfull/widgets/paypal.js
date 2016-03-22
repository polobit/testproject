
var paypalOBJ = {};
var paymentINVCount = 1;
var showMorePaypalINV = '<div class="widget_tab_footer paypal_inv_show_more" align="center"><a class="c-p text-info" id="paypal_inv_show_more" rel="tooltip" title="Click to see more tickets">Show More</a></div>';


function loadPaypalInvoices(offSet){

	if(offSet == 0){
		var result = {};
		if(Email && Email != ""){			
			if(paypalOBJ.invoices && paypalOBJ.invoices.length > 0){				
				result.invoices = paypalOBJ.invoices.slice(0, 5);
			}else{
				result.content = "No invoices found.";
			}
		}else{
			result.content = "Email not found for this contact.";
		}

		getTemplate('paypal-invoices', result, undefined, function(template_inv){						
			$('#PayPal').html(template_inv);
			head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
				$( ".time-ago", $('#PayPal')).each(function(){
  					$(this).text(jQuery.timeago($(this).text()));
				});							
			});
		},null);

		if(paypalOBJ.invoices && paypalOBJ.invoices.length > 5){
			$('#PayPal').append(showMorePaypalINV);
		}
	}else if(offSet > 0  && (offSet+5) < paypalOBJ.invoices.length){
		var result = {};
		result.invoices = paypalOBJ.invoices.slice(offSet, (offSet+5));
		$('.paypal_inv_show_more').remove();
		getTemplate('paypal-invoices', result, undefined, function(template_inv){
			$('#PayPal').apped(template_inv);
			head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
				$( ".time-ago", $('#PayPal')).each(function(){
  					$(this).text(jQuery.timeago($(this).text()));
				});							
			});
			$('#PayPal').append(showMorePaypalINV);
		});		
	}else{
		var result = {};
		result.invoices = paypalOBJ.invoices.slice(offSet, paypalOBJ.invoices.length);
		$('.paypal_inv_show_more').remove();
		getTemplate('paypal-invoices', result, undefined, function(template_inv){
			$('#PayPal').append(template_inv);
			head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
				$( ".time-ago", $('#PayPal')).each(function(){
  					$(this).text(jQuery.timeago($(this).text()));
				});							
			});
		});
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
		$('#PayPal').html('<div class="wrapper-sm">Error Occured while fetching invoices</div>');
	});
}

function getInvoices(accessToken){	
	if(Email && Email != ""){
		var tok = "Bearer " + accessToken;
		var obj = {email : Email};		
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
	}else{		
		paypalOBJ = {};
		loadPaypalInvoices(0);
	}	
}

function startPayPalWidget(contact_id){
	PAYPAL_PLUGIN_NAME = "PayPal";

	paypalOBJ = {};
	paymentINVCount =1;

	PAYPAL_UPDATE_LOAD_IMAGE = '<center><img id="paypal_load" src=' + '\"img/ajax-loader-cursor.gif\" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';

	var paypal_widget = agile_crm_get_widget(PAYPAL_PLUGIN_NAME);

	console.log(paypal_widget);

	PAYPAL_Plugin_Id = paypal_widget.id;	
	Email = agile_crm_get_contact_property('email');


	$("#"+WIDGET_PARENT_ID).off("click", "#paypal_inv_show_more");
	$("#"+WIDGET_PARENT_ID).on("click", "#paypal_inv_show_more", function(e){
		e.preventDefault();
		var offSet = paymentINVCount * 5;
		loadPaypalInvoices(offSet);
		++paymentINVCount;
	});


	loadProfile(contact_id, function(){

	});

}