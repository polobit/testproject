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
	"invoice" : "invoice", "invoice/:id" : "invoiceDetails",
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
		/*
		 * Creates new view with a render callback to setup expiry dates
		 * field(show dropdown of month and year), countries list and respective
		 * states list using countries.js plugin account stats in subscription
		 * page
		 */
		var subscribe_plan = new Base_Model_View({ url : "core/api/subscription", template : "subscribe-new", window : 'subscribe',
		/*
		 * postRenderCallback : function(el) { // Setup account statistics
		 * set_up_account_stats(el); // Load date and year for card expiry
		 * card_expiry(el); // Load countries and respective states
		 * head.js(LIB_PATH + 'lib/countries.js', function() {
		 * print_country($("#country", el)); }); },
		 */
		postRenderCallback : function(el)
		{
			var data = subscribe_plan.model.toJSON();
			var _window = window;

			// Setup account statistics
			set_up_account_stats(el);

			USER_BILLING_PREFS = data;
			
			USER_CREDIRCARD_DETAILS = subscribe_plan.model.toJSON().billingData;
			
			if(!USER_CREDIRCARD_DETAILS)
				{
					Backbone.history.navigate("subscribe_new");
					return;
				}
			element = setPriceTemplete(data.plan.plan_type, el);

			// Show Coupon code input field
			id = (id && id == "coupon") ? id : "";
			showCouponCodeContainer(id);

			head.load(CSS_PATH + 'css/jslider.css', CSS_PATH + "css/misc/agile-plan-upgrade.css", LIB_PATH + 'lib/jquery.slider.min.js', function()
			{
				if ($.isEmptyObject(data))
					setPlan("free");
				else
					setPlan(data);
				load_slider(el);
			});
		} });
		$('#content').html(subscribe_plan.render().el);
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
				head.js(LIB_PATH + 'lib/countries.js', function()
				{
					print_country($("#country", el));
				});
				
				
			},
			saveCallback : function(data)
			{
				window.navigate("subscribe", { trigger : true });
				showNotyPopUp("information", "You have been upgraded successfully. Please logout and login again for the new changes to apply.", "top");
			}
			
		});

		// Prepend Loading
		$('#content').html(upgrade_plan.render().el);
		$(".active").removeClass("active");
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

				// Load countries and respective states
				head.js(LIB_PATH + 'lib/countries.js', function()
				{
					print_country($("#country", el));

					// Deserialize card details
					if (!$.isEmptyObject(card_data))
					{
						// Deserialize method defined in
						// agile_billing.js
						deserialize_card_details(JSON.parse(card_data), $(card_detail_form));
					}
				});

			} });

		$('#content').html(card_details.render().el);
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
				showNotyPopUp("information", "You have been upgraded successfully. Please logout and login again for the new changes to apply.", "top");
			},
			postRenderCallback : function(el) {
				card_expiry(el);
				head.js(LIB_PATH + 'lib/countries.js', function()
				{
					print_country($("#country", el));
				});
			}
			
		});

		$('#content').html(update_plan.render().el);
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

		var window = this;
		// Plan json is posted along with credit card details
		var plan = plan_json
		var upgrade_plan = new Base_Model_View({ url : "core/api/subscription", template : "purchase-plan", isNew : true, data : plan,
			postRenderCallback : function(el)
			{
				// Discount
				showCouponDiscountAmount(plan_json, el);
			},
			saveCallback : function(data)
			{
				window.navigate("subscribe_new", { trigger : true });
				showNotyPopUp("information", "You have been upgraded successfully. Please logout and login again for the new changes to apply.", "top");
			}
			
		});

		// Prepend Loading
		$('#content').html(upgrade_plan.render().el);
		$(".active").removeClass("active");
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
					
					$("#email-quantity", el).die().live('keydown', function(e){
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
						
						$("#account_email_plan_upgrade", el).die().live('click' , function(e){
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
				head.js(LIB_PATH + 'lib/countries.js', function()
				{
					print_country($("#country", el));

					// Deserialize card details
					if (!$.isEmptyObject(card_data))
					{
						// Deserialize method defined in
						// agile_billing.js
						deserialize_card_details(activeCard, $(card_detail_form));
					}
				});

			} });

		$('#content').html(card_details.render().el);
	},
	
	
	/**
	 * Susbscribe new 
	 */
	subscribe_new : function()
	{
		var that = this;
		var counter = 0;
		
		$("#content").html(LOADING_HTML);
		
		/*
		 * Creates new view with a render callback to setup expiry dates
		 * field(show dropdown of month and year), countries list and respective
		 * states list using countries.js plugin account stats in subscription
		 * page
		 */
		$.getJSON("core/api/subscription?reload=true", function(data){
			$("#content").html(getTemplate("subscribe", data))
		
			var subscription_model = new BaseModel(data);
				
			that.setup_account_plan(subscription_model);
			
			that.setup_email_plan(subscription_model);
			
			that.show_card_details(subscription_model);
			
			that.recent_invoice(subscription_model);
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
				$("#attach_card_notification", el).die().live('click' , function(e){
					e.preventDefault();
					that.showCreditCardForm(subscribe_account_plan.model, function(model){
						Backbone.history.navigate("subscribe-plan", { trigger : true });
					})
				})
				
				$("#user-plan-details-popover", el).live('click', function(e){
					  var ele = getTemplate("account-plan-details-popover", subscribe_account_plan.model.get("planLimits"));
					  console.log(ele);
				        $(this).attr({
				        	"rel" : "popover",
				        	"data-placement" : 'right',
				        	"data-original-title" : "Plan Details",
				        	"data-content" :  ele,
				        	//"trigger" : "hover"
				        });
				        $(this).popover('show');
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
				$("#account_email_attach_card", el).die().live('click' , function(e){
					e.preventDefault();
					//alert("here");
					that.showCreditCardForm(subscribe_email_plan.model, function(model){
						that.email_subscription(subscribe_email_plan.model);
						//$("#content").html(getTemplate("subscribe", model.toJSON()))
					});
				});
				
				$("#account_email_plan_upgrade", el).die().live('click' , function(e){
					e.preventDefault();
					that.email_subscription(subscribe_email_plan.model);
					//alert("here");
						//$("#content").html(getTemplate("subscribe", model.toJSON()))
					});
				
				
				getTemplate("email-plan-subscription-details-popover", subscribe_email_plan.model.toJSON(), "Yes", function(content){
					console.log(content)
					  $("#email-plan-details-popover", el).attr({
				        	"rel" : "popover",
				        	"data-placement" : 'right',
				        	"data-original-title" : "Usage details",
				        	"data-content" :  content,
				        	//"trigger" : "hover"
				        });
					  
				$("#email-plan-details-popover", el).live('click', function(e){
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
			$("#change-card", el).die().live('click' , function(e){
				e.preventDefault();
				//alert("here");
				that.showCreditCardForm(stripe_customer_details.model, function(model){
					//$("#content").html(getTemplate("subscribe", model.toJSON()))
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
		
		var invoice_collection = new Base_Collection_View({ url : "core/api/subscription/charges/"+customerId+"?page_size=3" , templateKey : "charge",

		individual_tag_name : 'tr',sortKey : 'createdtime', descending : true });
		invoice_collection.collection.fetch();

		$("#invoice-details-holder").html(invoice_collection.render().el);
	},

});
