/**
 * Creates Backbone Router for subscription operations, defines routes for
 * subscribe, updating creditcard/plan, invoice, invoice detailed view
 * 
 * @module Subscription
 * @author Yaswanth
 */
var SubscribeRouter = Backbone.Router
		.extend({

			routes : {
				/* Subscription page */
				"subscribe" : "subscribe",

				/* Updating subscription details */
				"updatecard" : "updateCreditCard",
				"updateplan" : "updatePlan",

				/* Invoices */
				"invoice" : "invoice",
				"invoice/:id" : "invoiceDetails"
			},

			/**
			 * Shows the subscription details(If subscribed ) of subscription
			 * form, this function also sets account statistics in the
			 * subscription page, using post render callback of the
			 * Base_Model_View
			 */
			subscribe : function()
			{
				/*
				 * Creates new view with a render callback to setup expiry dates
				 * field(show dropdown of month and year), countries list and
				 * respective states list using countries.js plugin account
				 * stats in subscription page
				 */
				var subscribe_plan = new Base_Model_View({
					url : "core/api/subscription",
					template : "subscribe",
					window : 'subscribe',
					postRenderCallback : function(el)
					{
						// Setup account statistics
						set_up_account_stats(el);

						// Load date and year for card expiry
						card_expiry(el);

						// Load countries and respective states
						head.js(LIB_PATH + 'lib/countries.js', function()
						{
							print_country($("#country", el));
						});
					}
				});

				$('#content').html(subscribe_plan.render().el);
			},

			/**
			 * Shows forms to updates Credit card details, loads subscription
			 * details from core/api/subscription to deserailize and show credit
			 * card details in to form, so user can change any details if
			 * required render callback sets the countries and states and card
			 * expiry, also deserialized the values. Update credit card details
			 * are sent to core/api/subscription, where if checks update is for
			 * credit card or plan
			 */
			updateCreditCard : function()
			{
				var card_details = new Base_Model_View(
						{
							url : "core/api/subscription",
							template : "subscription-card-detail",
							window : 'subscribe',
							postRenderCallback : function(el)
							{

								// Load date and year for card expiry
								card_expiry(el);

								// To deserialize
								var card_detail_form = el
										.find('form.card_details'), card_data = card_details.model
										.toJSON().billingData;

								// Load countries and respective states
								head.js(LIB_PATH + 'lib/countries.js',
										function()
										{
											print_country($("#country", el));

											// Deserialize card details
											if (!$.isEmptyObject(card_data))
											{
												// Deserialize method defined in
												// agile_billing.js
												deserialize_card_details(JSON
														.parse(card_data),
														$(card_detail_form));
											}
										});

							}
						});

				$('#content').html(card_details.render().el);
			},

			/**
			 * Shows form the update plan, uses the same url used to create new
			 * subscription/update credit card of plan, deserializes the current
			 * plan
			 */
			updatePlan : function()
			{
				var update_plan = new Base_Model_View({
					url : "core/api/subscription",
					template : "update-plan",
					window : 'subscribe'
				});

				$('#content').html(update_plan.render().el);
			},

			/**
			 * Fetches the invoices and displays as list.
			 */
			invoice : function()
			{
				this.invoice = new Base_Collection_View({
					url : "core/api/subscription/invoices",
					templateKey : "invoice",
					window : 'subscribe',
					individual_tag_name : 'tr'
				})

				// Fetches the invoice payments
				this.invoice.collection.fetch();

				$('#content').html(this.invoice.el);
			},

			/**
			 * Displays detailed invoice, when selected from the invoice list
			 */
			invoiceDetails : function(id)
			{

				// Checks whether invoice list is defined, if list is not
				// defined get the list of invoices
				if (!this.invoice || !this.invoice.collection
						|| this.invoice.collection == 0
						|| this.invoice.collection.get(id) == null)
				{
					this.navigate("invoice", {
						trigger : true
					});
					return;
				}

				// Gets invoice item from the collection
				var model = this.invoice.collection.get(id);

				// Displays detailed invoice
				var invoice_details = new Base_Model_View({
					// url: "core/api/subscription/invoice",
					model : model,
					template : "invoice-detail",
					window : 'invoice',
					isNew : true
				});

				$('#content').html(invoice_details.render().el);
			}
		});