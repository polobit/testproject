var BrainTreeObj = {};
var transactionCount = 1;

var showMoreBraintreeTrans = '<div class="widget_tab_footer braintree_trans_show_more" align="center"><a class="c-p text-info" id="braintree_trans_show_more" rel="tooltip" title="Click to see more tickets">Show More</a></div>';


function getTransactions(callback, contact_id){
	/*
	 * Calls queueGetRequest method in widget_loader.js, with queue name as
	 * "widget_queue" to retrieve tickets
	 */

	if(Email){
		queueGetRequest("widget_queue_"+contact_id, "/core/api/widgets/btree/get/" + BRAINTREE_Plugin_Id + "/" + Email, "json", 
			function success(data){

			console.log("Brain tree success data ");
			console.log(data);
				
			BrainTreeObj.transaction = data;

			// If defined, execute the callback function
			if (callback && typeof (callback) === "function"){
				callback(0);
			}

		}, function error(data){
			console.log("Brain tree failed ");
			$('#Braintree').html('<div class="wrapper-sm">Please configure widget properly</div>');
		});
	}else{
		$('#Braintree').html('<div class="wrapper-sm">Email not found for this contact</div>');
	}
}

function loadTransaction(offSet){
	if(offSet == 0){
		var result = {};

		if(BrainTreeObj.transaction instanceof Array){
			result.transaction = BrainTreeObj.transaction.slice(0, 5); 
		}else{
			result.transaction = [];
			result.transaction[0] = BrainTreeObj.transaction;
		}

		result.transaction = BrainTreeObj.transaction.slice(0, 5);

		getTemplate('braintree-transactions', result, undefined, function(template){					
			$('#Braintree').html(template);
		},null);

		if(BrainTreeObj.transaction.length > 5){
			$('#Braintree').append(showMoreBraintreeTrans);
		}
	}else if(offSet > 0  && (offSet+5) < BrainTreeObj.transaction.length){
		var result = {};
		result.transaction = BrainTreeObj.transaction.slice(offSet, (offSet+5));
		$('.braintree_trans_show_more').remove();
		$('#Braintree').apped(getTemplate('braintree-transactions', result));
		$('#Braintree').append(showMoreBraintreeTrans);
	}else{
		var result = {};
		result.transaction = BrainTreeObj.transaction.slice(offSet, BrainTreeObj.transaction.length);
		$('.braintree_trans_show_more').remove();
		$('#Braintree').append(getTemplate('braintree-transactions', result));
	}
}

function startBraintreeWidget(contact_id){
	console.log("brain tree loaded : "+contact_id);

	BrainTreeObj = {};
	transactionCount = 1;

	BRAINTREE_PLUGIN_NAME = "Braintree";

	var braintree_widget = agile_crm_get_widget(BRAINTREE_PLUGIN_NAME);

	console.log('In Braintree');
	console.log(braintree_widget);

	BRAINTREE_Plugin_Id = braintree_widget.id;

	// Stores email of the contact as global variable
	Email = agile_crm_get_contact_property('email');
	console.log('Email: ' + Email);

	getTransactions(function(){
		loadTransaction(0);
	}, contact_id);

	$("#widgets").off("click", "#braintree_trans_show_more");
	$("#widgets").on("click", "#braintree_trans_show_more", function(e)
	{
		e.preventDefault();
		var offSet = transactionCount * 5;
		loadTransaction(offSet);
		++transactionCount;
	});
}