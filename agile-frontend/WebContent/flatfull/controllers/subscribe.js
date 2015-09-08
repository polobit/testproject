/**
 * Creates Backbone Router for subscription operations, defines routes for
 * subscribe, updating creditcard/plan, invoice, invoice detailed view
 * 
 * @module Subscription
 * @author Yaswanth
 */
var SubscribeRouter = Backbone.Router.extend({

	routes : {
	/* Subscription page */
	"subscribe-plan" : "subscribe", "subscribe-plan/:id" : "subscribe",
	
	
	/* Updating subscription details */
	"updatecard" : "updateCreditCard",
	
	"updateplan" : "updatePlan", "purchase-plan" : "purchasePlan",
	
	"purchase-plan-new" : "purchasePlanNew",

	/* Invoices */
	"invoice" : "invoice", "invoice/:id" : "invoiceDetails","getInvoiceDetails/:id" : "getInvoiceDetails",
	"subscribe_new" : "subscribe_new" ,
	"subscribe" : "subscribe_new",
	"email_subscription" : "email_subscription",
	"attach-card" :  "addCreditCardNew",
	"update-card" : "updateCardNew",
	},

	/**
	 * Shows the subscription details(If subscribed ) of subscription form, this
	 * function also sets account statistics in the subscription page, using
	 * post render callback of the Base_Model_View
	 */
	subscribe : function(id)
	{
		$("#content").html("<div id='subscribe_plan_change'></div>");
		if(IS_NEW_USER && _plan_on_signup && _plan_on_signup.plan_type && _plan_on_signup.plan_type == "FREE")
		{
			_plan_on_signup = null;
			Backbone.history.navigate("dashboard", {trigger : true});
			return;
		}
		
		/*
		 * Creates new view with a render callback to setup expiry dates
		 * field(show dropdown of month and year), countries list and respective
		 * states list using countries.js plugin account stats in subscription
		 * page
		 */
		var subscribe_plan = new Base_Model_View({ url : "core/api/subscription?reload=true", template : "subscribe-new", window : 'subscribe',
		/*
		 * postRenderCallback : function(el) { // Setup account statistics
		 * set_up_account_stats(el); // Load date and year for card expiry
		 * card_expiry(el); // Load countries and respective states
		 * head.js(LIB_PATH + 'lib/countries.js', function() {
		 * print_country($("#country", el)); }); },
		 */
		postRenderCallback : function(el)
		{

			
			initializeSubscriptionListeners();
			
			var data = subscribe_plan.model.toJSON();
			var _window = window;

			// Setup account statistics
			set_up_account_stats(el);

			USER_BILLING_PREFS = data;

			
			USER_CREDIRCARD_DETAILS = subscribe_plan.model.toJSON().billingData;
			
			if(!USER_CREDIRCARD_DETAILS && !(IS_NEW_USER && _plan_on_signup))
			{
				Backbone.history.navigate("subscribe", {trigger : true});
				return;
			}
			var billing_data = JSON.parse(data.billingData);
			var stripe_subscription = getSubscription(data.billingData, data.plan);
			var planType = "";						
 			var id = null;
 			var quantity;
 			if(stripe_subscription == null)
 			{
 				quantity = "2";
 				planType = "FREE";
 			}
 			else
 			{
 				quantity = billing_data.subscription.quantity;
 				planType = billing_data.subscription.plan.name.toUpperCase();
 			}
 			var planDetails = "<span class='text-head-black'>Current Plan</span></br><span class='text-head-black'>"+quantity+" Users</span>";
 			if(planType.indexOf('STARTER') == 0){
 				var id = $('#starter_plan');
 			}else if(planType.indexOf('REGULAR') == 0){
 				var id = $('#regular_plan');
			}else if(planType.indexOf('PRO') == 0){			
 				var id = $('#pro_plan');			
 			}	
 			
 			if(id){
 				addStyleForAPlan(id,planDetails);
 				$("#plan_type").val(id.attr("id").split("_")[0]);
 			}
									
			element = setPriceTemplete(data.plan.plan_type, el);

			// Show Coupon code input field
			id = (id && id == "coupon") ? id : "";
			showCouponCodeContainer(id);
			$("#user_quantity").val(quantity);
			price = update_price();
			$( "#users_quantity").text(quantity);
     	    $("#users_total_cost").text((quantity * price).toFixed(2));

			/*head.load(CSS_PATH + "css/misc/agile-plan-upgrade.css", LIB_PATH + 'lib/jquery.slider.min.js', function()
			{ */
				if ($.isEmptyObject(data))
					setPlan("free");
				else
					setPlan(data);
				
			//	load_slider(el);
			// });

		} });
		$('#subscribe_plan_change').html(subscribe_plan.render().el);
		$(".active").removeClass("active");
		$("#planView").addClass("active");
	},
	
	getInvoiceDetails : function(invoice_id)
	{
		var invoicedata;
		var companydata;
		var obj;
		
		if (!invoice_id)
			  return;
		
		accessUrlUsingAjax('core/api/subscription/getinvoice?d=' +invoice_id, function(data){
			console.log("Invoice object");
			console.log(data);
			invoicedata = data;

			accessUrlUsingAjax('/core/api/account-prefs', 
				function(data){
					console.log("Account prefs");
					console.log(data);
					companydata = data;

					obj = {"invoice" : invoicedata,	"company" : companydata}
					console.log("xxxxxxxxxxxxxxx");
					console.log(obj);
					head.js(LIB_PATH + 'jscore/handlebars/handlebars-helpers.js', function()
					{
						getTemplate('invoice-detail', obj, undefined, function(template_ui){
							if(!template_ui)
								  return;
							$('#content').html($(template_ui));	
						}, "#content");
					});

				}, 
				function(response){
					showNotyPopUp("information", "error occured please try again", "top");
				});

		}, function(response){
				showNotyPopUp("information", "error occured please try again", "top");
		});
		
		 	
	},	

	
	
	/**
	 * After selecting plan, page is navigated to purchase plan where user enter
	 * his credit card details. It shows a form with countries and states and
	 * fields to enter credit card details
	 */
	purchasePlanNew : function()
	{

		var that = this;
		var window = this;
		// Plan json is posted along with credit card details
		var plan = plan_json
		var upgrade_plan = new Base_Model_View({ url : "core/api/subscription", template : "purchase-plan-new", isNew : true,
			postRenderCallback : function(el)
			{
				initializeSubscriptionListeners();
				head.js(LIB_PATH + 'lib/countries.js', function()
				{
					print_country($("#country", el));
				});
				
				
			},
			saveCallback : function(data)
			{
				_IS_FREE_PLAN = false;
				window.navigate("subscribe", { trigger : true });
				showNotyPopUp("information", "Your plan has been updated successfully", "top");
			}
			
		});

		// Prepend Loading
		$('#content').html(upgrade_plan.render().el);
		$(".active").removeClass("active");
		$("#planView").addClass("active");
		// $("#fat-menu").addClass("active");
	} ,
	
	
	
	/**
	 * Shows forms to updates Credit card details, loads subscription details
	 * from core/api/subscription to deserailize and show credit card details in
	 * to form, so user can change any details if required render callback sets
	 * the countries and states and card expiry, also deserialized the values.
	 * Update credit card details are sent to core/api/subscription, where if
	 * checks update is for credit card or plan
	 */
	updateCreditCard : function()
	{
		var card_details = new Base_Model_View({ url : "core/api/subscription", template : "subscription-card-detail", window : 'purchase-plan',
			postRenderCallback : function(el)
			{

				// Load date and year for card expiry
				card_expiry(el);

				// To deserialize
				var card_detail_form = el.find('form.card_details'), card_data = card_details.model.toJSON().billingData;

				USER_CREDIRCARD_DETAILS = card_data;
				plan_json.customer = JSON.parse(USER_CREDIRCARD_DETAILS);


					// Deserialize card details
					if (!$.isEmptyObject(card_data))
					{
						// Deserialize method defined in
						// agile_billing.js
						deserialize_card_details(JSON.parse(card_data), $(card_detail_form));
					}

			},
			saveCallback : function(data)
			{
				$("#change-card").show();
			}
		});

		$('#content').html(card_details.render().el);
		$(".active").removeClass("active");
		$("#planView").addClass("active");
	},

	
	/**
	 * Shows form the update plan, uses the same url used to create new
	 * subscription/update credit card of plan, deserializes the current plan
	 */
	updatePlan : function()
	{
		var update_plan = new Base_Model_View({ url : "core/api/subscription-addon/subscribe", template : "purchase-email-plan",  
			
			saveCallback : function(){
				window.navigate("subscribe", { trigger : true });
				showNotyPopUp("information", "Your plan has been updated successfully. Please logout and login again for the new changes to apply.", "top");
			},
			postRenderCallback : function(el) {
				initializeSubscriptionListeners();
				card_expiry(el);
				head.js(LIB_PATH + 'lib/countries.js', function()
				{
					print_country($("#country", el));
				});
			}
			
		});

		$('#content').html(update_plan.render().el);
		$(".active").removeClass("active");
		$("#planView").addClass("active");
	},

	/**
	 * Fetches the invoices and displays as list.
	 */
	invoice : function()
	{
		this.invoice = new Base_Collection_View({ url : "core/api/subscription/invoices", templateKey : "invoice", window : 'subscribe',
			individual_tag_name : 'tr' })

		// Fetches the invoice payments
		this.invoice.collection.fetch();
		console.log(this.invoice.collection.fetch());

		$('#content').html(this.invoice.el);
	},

	/**
	 * Displays detailed invoice, when selected from the invoice list
	 */
	invoiceDetails : function(id)
	{

		// Checks whether invoice list is defined, if list is not
		// defined get the list of invoices
		if (!this.invoice || !this.invoice.collection || this.invoice.collection == 0 || this.invoice.collection.get(id) == null)
		{
			this.navigate("invoice", { trigger : true });
			return;
		}

		// Gets invoice item from the collection
		var model = this.invoice.collection.get(id);

		// Displays detailed invoice
		var invoice_details = new Base_Model_View({
		// url: "core/api/subscription/invoice",
		model : model, template : "invoice-detail", window : 'invoice', isNew : true });

		$('#content').html(invoice_details.render().el);
	},

	/**
	 * After selecting plan, page is navigated to purchase plan where user enter
	 * his credit card details. It shows a form with countries and states and
	 * fields to enter credit card details
	 */
	purchasePlan : function()
	{
		// If plan is not defined i.e., reloaded, or plan not chosen properly,
		// then page is navigated back to subscription/ choose plan page
		if (!plan_json.plan)
		{
			this.navigate("subscribe", { trigger : true });

			return;
		}
		
		_plan_on_signup = null;

		var window = this;
		// Plan json is posted along with credit card details
		var plan = plan_json
		var upgrade_plan = new Base_Model_View({ url : "core/api/subscription", template : "purchase-plan", isNew : true, data : plan,
			postRenderCallback : function(el)
			{
				initializeSubscriptionListeners();
				// Discount
				showCouponDiscountAmount(plan_json, el);
				card_expiry(el);
			},
			saveCallback : function(data)
			{
				window.navigate("subscribe", { trigger : true });
				showNotyPopUp("information", "Your plan has been updated successfully", "top");

				try
				{
					push_actual_plan(data.plan)
				}
				catch(err)
				{
					console.log(err);
				}

			},
			errorCallback : function(data)
			{
				showNotyPopUp("information", "There was an error while processing your payment. Please try again later.", "top");
			}
			
		});

		// Prepend Loading
		$('#content').html(upgrade_plan.render().el);
		$(".active").removeClass("active");
		$("#planView").addClass("active");
		// $("#fat-menu").addClass("active");
	} ,

	

	/**
	 * Email plans
	 */
	email_subscription : function(subscription)
	{
		var that = this;
		var counter = 0;
		var viewParams = {
				url : "core/api/subscription",
				isNew : true,
				template : "email-plan-form",
				postRenderCallback : function(el) {
					$("#close", el).click(function(e){
						e.preventDefault();
						that.setup_email_plan(subscription);
					})
					
							// Phone number validation
					jQuery.validator.addMethod("email_plan_minimum", function(value, element) {
	
								if (this.optional(element))
									return true;

								return parseInt(value) >= 5;
							}, " Should purchase a minimum of 5000 emails.");
					
					$("#email-quantity", el).on('keyup', function(e){ 
						isValidForm($("#email-plan-form", el));
						if(e.which == 13)
							{
								e.preventDefault();
							}
					})
					
				},
				saveCallback : function(data)
				{
					that.setup_email_plan(subscription);
					showNotyPopUp("information", "Your email package will be updated in a few minutes.", "top");
				}
			}
		
		if(subscription)
		{
			viewParams["model"] = subscription;
		}
		
		var counter = 0;
		var email_subscription = new Base_Model_View(viewParams);
		
		// Prepend Loading
		$('#email-details-pane').html(email_subscription.render().el);
		
		// that.email_subscription();

		$("#email-quantity").bind('keyup', function(e){
			// console.log(e.which);
				var quantity =  $(this).val();
				if(isNaN(quantity))
					return;
				
				var emails = quantity * 1000;
				
				if(IS_HAVING_MANDRILL)
				{
					$("#emails_total_cost").html(quantity * 2);
					$("#email_rate").html("$2");
					return;
				}
				if(emails < 100000)
					{
						$("#emails_total_cost").html(quantity * 4);
						$("#email_rate").html("$4");
					}
				
				else if(emails <= 1000000)
				{
					$("#emails_total_cost").html(quantity * 3);
					$("#email_rate").html("$3");
				}
				else if(emails >= 1000000)
				{
					$("#emails_total_cost").html(quantity * 2);
					$("#email_rate").html("$2");
				}
				
			});
		
		
	},
	email_sbuscrption_step1 : function(subscription)
	{
		
		var is_model = true;
		try
		{
			subscription.toJSON();
		}
		catch (e)
		{
			is_model = false;
		}
		var that = this;
		var counter = 0;
		
		var params = {
				url : "core/api/subscription?reload=true", template : "email-plan-details", window : 'subscribe', isNew : true,
				/*
				 * postRenderCallback : function(el) { // Setup account statistics
				 * set_up_account_stats(el); // Load date and year for card expiry
				 * card_expiry(el); // Load countries and respective states
				 * head.js(LIB_PATH + 'lib/countries.js', function() {
				 * print_country($("#country", el)); }); },
				 */
				postRenderCallback : function(el)
				{
					if(++counter <= 1)
					{
						
						$("#account_email_plan_upgrade", el).on('click' , function(e){
							e.preventDefault();
							that.email_subscription(subscribe_email_plan.model);
						})
						
					}
					
					
				}
		}
		
		if(is_model)
			{
				params["model"] = subscription;
			}
		else
			{
				params["data"] = subscription;
			}
		/*
		 * Creates new view with a render callback to setup expiry dates
		 * field(show dropdown of month and year), countries list and respective
		 * states list using countries.js plugin account stats in subscription
		 * page
		 */
		var subscribe_email_plan = new Base_Model_View(params);
		
		$('#email-details-pane').html(subscribe_email_plan.render(true).el);
		
	},
	
	
	
	/**
	 * Shows forms to updates Credit card details, loads subscription details
	 * from core/api/subscription to deserailize and show credit card details in
	 * to form, so user can change any details if required render callback sets
	 * the countries and states and card expiry, also deserialized the values.
	 * Update credit card details are sent to core/api/subscription, where if
	 * checks update is for credit card or plan
	 */
	updateCardNew : function()
	{
		var card_details = new Base_Model_View({ url : "core/api/subscription", template : "subscription-card-detail", window : 'purchase-plan',
			postRenderCallback : function(el)
			{

				// Load date and year for card expiry
				card_expiry(el);

				// To deserialize
				var card_detail_form = el.find('form.card_details'), card_data = card_details.model.toJSON().billingData;

				USER_CREDIRCARD_DETAILS = card_data;
				plan_json.customer = JSON.parse(USER_CREDIRCARD_DETAILS);

				var activeCard = getActiveCard (plan_json.customer);
				
				// Load countries and respective states
					// Deserialize card details
					if (!$.isEmptyObject(card_data))
					{
						// Deserialize method defined in
						// agile_billing.js
						deserialize_card_details(activeCard, $(card_detail_form));
					}

			}
		});

		$('#content').html(card_details.render().el);
	},
	
	
	/**
	 * Susbscribe new 
	 */
	subscribe_new : function()
	{
		var that = this;
		var counter = 0;
		$(".active").removeClass("active");
		$("#planView").addClass("active");
		$("#content").html("");
		showTransitionBar();
		
		/*
		 * Creates new view with a render callback to setup expiry dates
		 * field(show dropdown of month and year), countries list and respective
		 * states list using countries.js plugin account stats in subscription
		 * page
		 */
		$.getJSON("core/api/subscription?reload=true", function(data){
			_billing_restriction = data.cachedData;
			init_acl_restriction();

			getTemplate('subscribe', data, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));

				initializeAccountSettingsListeners();
				initializeInvoicesListeners();
				var subscription_model = new BaseModel(data);
				
				$("#show_plan_page").on('click' , '#change-card', function(e){
					e.preventDefault();
					//alert("here");
					that.showCreditCardForm(subscription_model, function(model){
					});
				});
					
				that.setup_account_plan(subscription_model);
				
				that.setup_email_plan(subscription_model);
				
				that.show_card_details(subscription_model);
				
				that.recent_invoice(subscription_model);

			}, "#content");

			
		}).done(function(){
			hideTransitionBar();
		}).fail(function(){
			hideTransitionBar();
		});
		
		
	},
	setup_account_plan : function(subscription)
	{
		var counter = 0;
		var that = this;
		/*
		 * Creates new view with a render callback to setup expiry dates
		 * field(show dropdown of month and year), countries list and respective
		 * states list using countries.js plugin account stats in subscription
		 * page
		 */
		var subscribe_account_plan = new Base_Model_View({ url : "core/api/subscription", model : subscription, template : "account-plan-details", window : 'subscribe-plan',
		/*
		 * postRenderCallback : function(el) { // Setup account statistics
		 * set_up_account_stats(el); // Load date and year for card expiry
		 * card_expiry(el); // Load countries and respective states
		 * head.js(LIB_PATH + 'lib/countries.js', function() {
		 * print_country($("#country", el)); }); },
		 */
		postRenderCallback : function(el)
		{
			
			if(++counter <= 1)
			{
				$("#attach_card_notification", el).on('click' , function(e){
					e.preventDefault();
					that.showCreditCardForm(subscribe_account_plan.model, function(model){
						Backbone.history.navigate("subscribe-plan", { trigger : true });
					})
				})
				
				$("#user-plan-details-popover", el).on('click', function(e){
					  var ele = getTemplate("account-plan-details-popover", subscribe_account_plan.model.get("planLimits"));
					  var that = this;
					  getTemplate('account-plan-details-popover', subscribe_account_plan.model.get("planLimits"), undefined, function(template_ui){
				 		if(!template_ui)
				    		return;
				    	var ele = $(template_ui);
				    	console.log(ele);
					        $(that).attr({
					        	"rel" : "popover",
					        	"data-placement" : 'right',
					        	"data-original-title" : "Plan Details",
					        	"data-content" :  ele,
					        });
					        $(that).popover('show');
						
					}, null);

						  
				});
				
			}
			
			
			// that.email_subscription();
			
		}});
		
		$('#plan-details-pane').html(subscribe_account_plan.render(true).el);
	},
	setup_email_plan : function(subscription)
	{
		var counter = 0;
		var that = this;
		IS_HAVING_MANDRILL = false;
		$.ajax({
			url:"core/api/email-gateway",
			type:"GET",
			success: function(data)
			{
				if(data && data.email_api == "MANDRILL")
					IS_HAVING_MANDRILL = true;
					
			}
		
		});
		
		/*
		 * Creates new view with a render callback to setup expiry dates
		 * field(show dropdown of month and year), countries list and respective
		 * states list using countries.js plugin account stats in subscription
		 * page
		 */
		var subscribe_email_plan = new Base_Model_View({ url : "core/api/subscription", template : "email-plan-details", model : subscription, window : 'subscribe',
		/*
		 * postRenderCallback : function(el) { // Setup account statistics
		 * set_up_account_stats(el); // Load date and year for card expiry
		 * card_expiry(el); // Load countries and respective states
		 * head.js(LIB_PATH + 'lib/countries.js', function() {
		 * print_country($("#country", el)); }); },
		 */
		postRenderCallback : function(el)
		{
				$("#account_email_attach_card", el).on('click' , function(e){
					e.preventDefault();
					//alert("here");
					that.showCreditCardForm(subscribe_email_plan.model, function(model){
						that.email_subscription(subscribe_email_plan.model);
					});
				});
				
				$("#account_email_plan_upgrade", el).on('click' , function(e){
					e.preventDefault();
					that.email_subscription(subscribe_email_plan.model);
					});
				
				
				getTemplate("email-plan-subscription-details-popover", subscribe_email_plan.model.toJSON(), "Yes", function(content){
					console.log(content)
					  $("#email-plan-details-popover", el).attr({
				        	"rel" : "popover",
				        	"data-placement" : 'right',
				        	"data-original-title" : "Plan Details",
				        	"data-content" :  content,
				        	//"trigger" : "hover"
				        });
					  
				$("#email-plan-details-popover", el).on('click', function(e){
						  $(this).popover('show');
					  });
				
				
				       
				       
				});
				
			// that.email_subscription();
			
		}});
		
		$('#email-details-pane').html(subscribe_email_plan.render(true).el);
	},
	showCreditCardForm : function(subscription, callback)
	{
		if(!subscription)
			subscription = new BaseModel({});
		var counter = 0;
		$('#credit-card-form-modal-holder').empty();
		var card_details = new Base_Model_View({ url : "core/api/subscription", 
			// reload : true,
			modal : "#credit-card-form-modal",
			template : "credit-card-form", model:subscription,
			postRenderCallback : function(el)
			{
				// Load date and year for card expiry
				card_expiry(el);
				if(++counter <= 1)
				{
					
					$('.modal-backdrop').remove();	
				
					
				}
			},
			saveCallback : function(model)
			{
				$('.modal-backdrop').remove();	
				$("#credit-card-form-modal").modal('hide');
				$('body').removeClass('modal-open');
				
				$("#change-card").show();
				
				if(callback && typeof callback == "function")
					callback(model);
				
			}
			
		});

		$('#credit-card-form-modal-holder').html(card_details.render(true).el);
		$("#credit-card-form-modal").modal('show');
		// console.log(card_details.render(true).el);1
	},
	
	show_card_details : function(subscription)
	{
		var that = this;
		var counter = 0;
		/*
		 * Creates new view with a render callback to setup expiry dates
		 * field(show dropdown of month and year), countries list and respective
		 * states list using countries.js plugin account stats in subscription
		 * page
		 */
		var stripe_customer_details = new Base_Model_View({ url : "core/api/subscription", model : subscription, template : "customer-details-block",
		/*
		 * postRenderCallback : function(el) { // Setup account statistics
		 * set_up_account_stats(el); // Load date and year for card expiry
		 * card_expiry(el); // Load countries and respective states
		 * head.js(LIB_PATH + 'lib/countries.js', function() {
		 * print_country($("#country", el)); }); },
		 */
		postRenderCallback : function(el)
		{
			$("#change-card", el).on('click' , function(e){
				e.preventDefault();
				//alert("here");
				that.showCreditCardForm(stripe_customer_details.model, function(model){
				});
			});
			
		}});
		
		$('#customer-details-holder').html(stripe_customer_details.render(true).el);
	},
	
	/**
	 * Shows forms to updates Credit card details, loads subscription details
	 * from core/api/subscription to deserailize and show credit card details in
	 * to form, so user can change any details if required render callback sets
	 * the countries and states and card expiry, also deserialized the values.
	 * Update credit card details are sent to core/api/subscription, where if
	 * checks update is for credit card or plan
	 */
	addCreditCardNew : function(subscription)
	{
		var viewParams = { url : "core/api/subscription", template : "subscription-card-detail", window : 'purchase-plan', isNew:true,
				postRenderCallback : function(el)
				{

					// Load date and year for card expiry
					card_expiry(el);

					// Load countries and respective states
					head.js(LIB_PATH + 'lib/countries.js', function()
					{
						print_country($("#country", el));
					});

				}}
		
		if(subscription)
			{
				viewParams["model"] = subscription;
				viewParams["isNew"] = false ;
			}
		var card_details = new Base_Model_View();

		$('#content').html(card_details.render().el);
		$(".active").removeClass("active");
		$("#planView").addClass("active");
	},
	
	/*recent_invoice : function()
	{
		var invoice_collection = new Base_Collection_View({
			url : "core/api/subscription/invoices?page_size=3",
			templateKey : "invoice-partial"
		});
		
		invoice_collection.collection.fetch();
		$("#invoice-details-holder").html(invoice_collection.render().el)
	},
	*/
	// gets collection of charges of aa paricular customer based on
	recent_invoice : function(subscription)
	{
		if(!subscription.get("billingData"))
			return;
		
		console.log(subscription.get("billingData"));
		var customerId = null;
		try
		{
			customerId = JSON.parse(subscription.get("billingData")).id;
		}
		catch(e)
		{
			customerId = subscription.get("billingData").id;
		}
		
		var invoice_collection = new Base_Collection_View({ url : "core/api/subscription/charges/"+customerId+"?page_size=20" , templateKey : "charge",

		individual_tag_name : 'tr',sortKey : 'created', descending : true });
		invoice_collection.collection.fetch();

		$("#invoice-details-holder").html(invoice_collection.render().el);
	},

});

function getPendingEmails()
{
	var count = _billing_restriction.one_time_emails_count;
	
	var max = getMaxEmailsLimit();
	
	// if max is greater than zero, we consider user is subscrbed to email plan
	if(max > 0)
	{
		// In case of count is less than zero we return 0;
		if(count < 0)
			return 0;
		
		return count;
	}
	
	// If max is zero then it is free plan
	if(max == 0)
	{
		// Count comes as a negavie value here
		var remaining =  5000 + count;
		if(remaining < 0)
			return 0;
		
		return remaining;
	}
	
	return count;
}

function getMaxEmailsLimit()
{
	var max = _billing_restriction.max_emails_count;
	
	if(max == undefined)
		max = 0;
	
	return max;
}
function canSendEmails(emails_to_send)
{
	var pending = getPendingEmails();
	if(pending >= emails_to_send)
		return true;
	
	return false;
}

function is_free_plan()
{
	return _IS_FREE_PLAN;
}

/**
 * This function is used to add the style for price panels.
 * @param id
 * @param description
 */
function addStyleForAPlan(id,planDetails){
	if(id){
		id.css("opacity","1");
		
		if(planDetails){
			id.find('.user-plan').html(planDetails);
			// id.find('.djc_addtocart_link').text('Add users');
		}
	}	
}

function removeStyleForAPlan(){
	var id = $('#plans-panel');
	id.find(".plan-collection-bot").css("opacity","0.5");
	
	
			
	
}
