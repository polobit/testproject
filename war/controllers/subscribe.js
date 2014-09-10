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
	"subscribe" : "subscribe", "subscribe/:id" : "subscribe",
	
	
	/* Updating subscription details */
	"updatecard" : "updateCreditCard", "updateplan" : "updatePlan", "purchase-plan" : "purchasePlan",
	
	

	/* Invoices */
	"invoice" : "invoice", "invoice/:id" : "invoiceDetails" },

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

			// Setup account statistics
			set_up_account_stats(el);

			if (!$.isEmptyObject(data))
			{
				USER_BILLING_PREFS = data;
				USER_CREDIRCARD_DETAILS = subscribe_plan.model.toJSON().billingData;
				console.log(USER_CREDIRCARD_DETAILS);
				element = setPriceTemplete(data.plan.plan_type, el);
			}

			else
				element = setPriceTemplete("free", el);

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
		// then page is navigated back to subcription/ choose plan page
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

				card_expiry(el);
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

	

	

});
