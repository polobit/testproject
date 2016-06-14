
var SHOPIFYTickets = {};
var SHOPIFYCount = 1;
var showMoreSHOPIFY = '<div class="widget_tab_footer shopify_show_more" align="center"><a class="c-p text-info" id="SHOPIFY_show_more" rel="tooltip" title="Click to see more tickets">Show More</a></div>';

function loadSHOPIFYTickets(offSet){
	if(offSet == 1){

		var result = {};
		var isArray = SHOPIFYTickets.isArray;
		
		if(SHOPIFYTickets instanceof Array){
			result = SHOPIFYTickets.slice(1, 6); 
		}else{
			result = SHOPIFYTickets;
		}

		getTemplate('shopify-order-list', result, undefined, function(template_ui){
			$('#shopify_orders_panel').append(template_ui);
			if(SHOPIFYTickets.length > 6 && SHOPIFYTickets instanceof Array){
				$('#shopify_orders_panel').append(showMoreSHOPIFY);
			}
		});
		
		// Load jquery time ago function to show time ago in tickets
		head.js(LIB_PATH + 'lib/jquery.timeago.js', function(template_ui)
		{
			$(".time-ago", template_ui).timeago();
		});
	}else if(offSet > 1  && (offSet + 5) < SHOPIFYTickets.length){
		var result = {};
		result = SHOPIFYTickets.slice(offSet, (offSet+5));		
		console.log(result);
		$('.shopify_show_more').remove();
		$('#shopify_orders_panel').append(getTemplate('shopify-order-list', result)).append(showMoreSHOPIFY);
	}else{
		var result = {};
		result = SHOPIFYTickets.slice(offSet, SHOPIFYTickets.length);
		$('.shopify_show_more').remove();
		$('#shopify_orders_panel').append(getTemplate('shopify-order-list', result));
	}
}

function showShopifyClient(shop, contact_id)
{
		console.log("calling show shopify client..");

		if (EmailList.length == 0)
		{
			shopifyError(Shopify_PLUGIN_NAME, "Please provide email for this contact");
			return;
		}
		var emailArray = [];
		for (var i = 0; i < EmailList.length; i++)
		{
						emailArray[i] = EmailList[i].value;
		}
		console.log(emailArray);
		console.log("In show Shopify Client" + Shopify_Plugin_Id);

		queueGetRequest("widget_queue_"+contact_id, "/core/api/widgets/shopify/" + Shopify_Plugin_Id + "/" + emailArray, "json", function success(data, queueName)
		{
				console.log('In Shopify clients fetching data..');
				console.log(data)

				// If data is not defined return
				if (data)
				{
					var name ="";
					var fristName = agile_crm_get_contact_property("first_name");
					var lastName = agile_crm_get_contact_property("last_name");

					if(fristName){
						name += fristName;
					}

					if(lastName){
						name += lastName;
					}

					var d = data;
					console.log("total spent " + d[0].customer.total_spent);
					data.unshift({ "name" : name,"id":d[0].customer.id, "shop" : shop, "total_spent" : d[0].customer.total_spent, "currency" : d[0].currency });
					console.log("customer info " + name);
					console.log("final data ");
					console.log(data);

					SHOPIFYTickets = data;
					getTemplate('shopify-profile', data, undefined, function(template_ui){
				 		if(!template_ui)
				    		return;
				    	var template = $(template_ui);
				    	console.log("libpath is" + LIB_PATH);
						console.log(template)
						head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
							$(".time-ago", template).timeago();
						});

						$('#Shopify').html(template);
						loadSHOPIFYTickets(1); 
					}, null);
	}
				else
				{
								shopifyError(Shopify_PLUGIN_NAME, data.responseText);
				}

		}, function error(data, queueName)
		{
			console.log("In Shopify error ");
			console.log(data);
			console.log("error response " + data);
			// Remove loading on error
			$('#SHOPIFY_PROFILE_LOAD_IMAGE').remove();

			var resText = data.responseText;
			if (resText.indexOf('No Customer found') != -1){
				console.log("No customer found");
				createStripeContact(resText);
			}else{
							shopifyError("Shopify", resText);
			}

		});
}

function createStripeContact(message)
{
		getTemplate('shopify-profile-addcontact', {}, undefined, function(template_ui){
	 		if(!template_ui)
	    		return;
			$('#' + Shopify_PLUGIN_NAME).html(template_ui); 
		}, '#' + Shopify_PLUGIN_NAME);
}

function addContactToShopify(shop)
{
		var url = "https://" + shop + "/admin/customers/new";
		window.open(url, "_blank");
}

function shopifyError(id, message)
{
		// build JSON with error message
		var error_json = {};
		error_json['message'] = message;

		/*
		 * Get error template and fill it with error message and show it in the div
		 * with given id
		 */

		console.log('shopify error ');
		getTemplate('shopify-error', error_json, undefined, function(template_ui){
	 		if(!template_ui)
	    		return;
			$('#' + id).html(template_ui); 
		}, '#' + id);

}

function startShopifyWidget(contact_id){

	 	SHOPIFYTickets = {};
		SHOPIFYCount = 1;

		console.log(contact_id);

		// Shopify widget name as a global variable
		Shopify_PLUGIN_NAME = "Shopify";

		console.log(" welcome to shopify plugin..")

		SHOPIFY_PROFILE_LOAD_IMAGE = '<center><img id="shopify_profile_load" src="img/ajax-loader-cursor.gif" style="margin-top: 10px;margin-bottom: 14px;"></img></center>';

		// Retrieves widget which is fetches using widget name
		var shopify_widget = agile_crm_get_widget(Shopify_PLUGIN_NAME);

		console.log('In Shopify');
		console.log("found widget " + shopify_widget);

		// ID of the Shopify widget as global variable
		Shopify_Plugin_Id = shopify_widget.id;

		var shopify_widget_prefs = JSON.parse(shopify_widget.prefs);
		var shop = shopify_widget_prefs['shop'];
		console.log("shop name" + shop);

		console.log("showing shopify plugin id " + Shopify_Plugin_Id);

		// Email as global variable
		Email = agile_crm_get_contact_property('email');

		console.log("email search found " + Email);

		// Email list as global variable
		EmailList = agile_crm_get_contact_properties_list("email");

		console.log("List of email in contact " + EmailList);

		var first_name = agile_crm_get_contact_property("first_name");
		var last_name = agile_crm_get_contact_property("last_name");
		console.log("found first name " + first_name);
		console.log("found last name" + last_name);

		if (last_name == undefined || last_name == null){
			last_name = ' ';
		}

		showShopifyClient(shop, contact_id);

        $("#"+WIDGET_PARENT_ID).off("click", '#shopify_add_contact');
		$("#"+WIDGET_PARENT_ID).on("click", '#shopify_add_contact', function(e){
						e.preventDefault();

						addContactToShopify(shop);
		});

        $("#"+WIDGET_PARENT_ID).off("click", '.order');
		$("#"+WIDGET_PARENT_ID).on("click", '.order', function(e){
			e.preventDefault();
			var orderId = $(this).attr('value');
			console.log("order id is " + orderId);
			// checking for data existence in div
			/*
			 * if ($('#collapse-' + orderId).text().trim() === "") {
			 */
			$('#collapse-' + orderId).html(SHOPIFY_PROFILE_LOAD_IMAGE);

			$.ajax({ url : "/core/api/widgets/shopify/items/" + Shopify_Plugin_Id + "/" + orderId, dataType : "json", success : function(data)
			{
							console.log("success data"+ data);
							console.log("in success order fetch.");
							$('#collapse-' + orderId).html(getTemplate('shopify-line-item', data));
							$('#SHOPIFY_PROFILE_LOAD_IMAGE').remove();
			}, error : function(data)
			{
							console.log("in item fetch error" + data);
							shopifyError(Shopify_PLUGIN_NAME, data)
							$('#SHOPIFY_PROFILE_LOAD_IMAGE').remove();
			} });

			if ($('#collapse-' + orderId).hasClass("collapse")){
				$('#collapse-' + orderId).removeClass("collapse");
			}else{
				$('#collapse-' + orderId).addClass("collapse");
			}

		});


		/*
		 * On click of show more in order panel, we splice 5 tickets from
		 * all_tickets and show every time
		 */		
		 $("#"+WIDGET_PARENT_ID).off('click','#SHOPIFY_show_more');
		 $("#"+WIDGET_PARENT_ID).on('click','#SHOPIFY_show_more', function(e){
			e.preventDefault();
			var offSet = SHOPIFYCount * 5;
			loadSHOPIFYTickets(offSet);
			++SHOPIFYCount;
		 });
}