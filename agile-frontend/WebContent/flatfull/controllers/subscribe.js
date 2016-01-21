/**
 * Creates Backbone Router for subscription operations, defines routes for
 * subscribe, updating creditcard/plan, invoice, invoice detailed view
 * 
 * @module Subscription
 * @author Yaswanth
 */
var _data = null;
var IS_TRIAL = false;
_IS_EMAIL_PLAN_ACTIVE = false;
var IS_ALLOWED_TRIAL = false;
var SubscribeRouter = Backbone.Router
		.extend({

			routes : {

			/* Subscription page */

			"subscribe" : "subscribe",

			"trial-subscribe" : "trialSubscribe",

			"subscribe/:id/:plan" : "subscribe",

			"subscribe-plan" : "subscribePlan",

			"subscribe-plan/:id" : "subscribePlan",

			/* billing settings */

			"billing-settings" : "billingSettings",

			"account-details" : "accountDetails",

			"invoice-details" : "invoiceDetailsList",

			/* Updating subscription details */

			"updateplan" : "updatePlan",

			"purchase-plan" : "purchasePlan",

			"purchase-email" : "purchaseEmail",

			"updateCreditCard" : "cardUpdation",

			/* Invoices */

			"invoice" : "invoice",

			"invoice/:id" : "getInvoiceDetails",

			"getInvoiceDetails/:id" : "getInvoiceDetails",

			},

			subscribePlan : function()
			{
				Backbone.history.navigate("subscribe", { trigger : true });
			},

			cardUpdation : function()
			{

				var card_details = new Base_Model_View({ url : "core/api/subscription", template : "creditcard-update", window : 'subscribe',
					saveCallback : function()
					{
						showNotyPopUp("information", "Card has been updated successfully.", "top");
					}, errorCallback : function(data)
					{
						showNotyPopUp("warning", data.responseText, "top");
					}, postRenderCallback : function(el)
					{

						// Load date and year for card expiry
						card_expiry(el);

						// To deserialize
						var card_detail_form = el.find('form.card_details'), card_data = card_details.model.toJSON().billingData;

						USER_CREDIRCARD_DETAILS = card_data;
						plan_json.customer = JSON.parse(USER_CREDIRCARD_DETAILS);

						var activeCard = getActiveCard(plan_json.customer);

						// Load countries and respective states
						// Deserialize card details
						if (!$.isEmptyObject(card_data))
						{
							// Deserialize method defined in
							// agile_billing.js
							deserialize_card_details(activeCard, $(card_detail_form));
						}

					} });
				$("#content").html(card_details.render().el);
			},

			billingSettings : function()
			{
				getTemplate('billing-settings', {}, undefined, function(template_ui)
				{
					if (!template_ui)
						return;
					$('#content').html($(template_ui));

					var view = new Base_Model_View({ url : '/core/api/subscription', template : "account-details", postRenderCallback : function()
					{
					} });
					$('#content').find('#billing-settings-tab-content').html(view.render().el);
					$('#content').find('#BillingSettingsTab .select').removeClass('select');
					$('#content').find('.account-details-tab').addClass('select');

				}, "#content");

				$(".active").removeClass("active");

			},

			accountDetails : function()
			{
				getTemplate('billing-settings', {}, undefined, function(template_ui)
				{
					if (!template_ui)
						return;
					$('#content').html($(template_ui));
					
					
				}, "#content");
				var view = new Base_Model_View({ url : '/core/api/subscription', template : "account-details", postRenderCallback : function()
				{
				} });
				$('#content').find('#billing-settings-tab-content').html(view.render().el);
				$('#content').find('#BillingSettingsTab .select').removeClass('select');
				$('#content').find('.account-details-tab').addClass('select');
				$(".active").removeClass("active");

			},

			invoiceDetailsList : function()
			{
				var that = this;
				getTemplate('billing-settings', {}, undefined, function(template_ui)
				{
					if (!template_ui)
						return;
					$('#content').html($(template_ui));
					
					getTemplate('invoice-details', {}, undefined, function(template_ui)
					{
						if (!template_ui)
							return;
						$('#billing-settings-tab-content').html($(template_ui));
						$("#invoice-details-holder").html(getRandomLoadingImg());
						
					}, "#billing-settings-tab-content");
					
					var subscribe_plan = new Base_Model_View({ url : "core/api/subscription?reload=true", template : "subscribe-new", window : 'subscribe',

					postRenderCallback : function(el)
					{

						var data = subscribe_plan.model.toJSON();
						var subscription_model = new BaseModel(data);
						that.recent_invoice(subscription_model);

					} });
					
				}, "#content");
				
				
				

			},

			purchaseEmail : function()
			{

				if (!email_json.quantity)
				{
					this.navigate("subscribe", { trigger : true });

					return;
				}
				var plan = email_json;
				var update_email = new Base_Model_View({ url : "core/api/subscription", data : email_json, template : "purchase-emails", window : 'subscribe',

				saveCallback : function()
				{
					showNotyPopUp("information", "Emails have been purchased successfully.", "top");
				}, postRenderCallback : function(el)
				{
					_IS_EMAIL_PLAN_ACTIVE = true;
					card_expiry(el);
					head.js(LIB_PATH + 'lib/countries.js', function()
					{
						print_country($("#country", el));
					});

				}, errorCallback : function(data)
				{
					showNotyPopUp("warning", data.responseText, "top");
				}
				/*
				 * prePersist : function(el) { console.log(el); }
				 */
				});

				$('#content').html(update_email.render().el);
				$(".active").removeClass("active");
				$("#planView").addClass("active");

			},
			/**
			 * Shows the subscription details(If subscribed ) of subscription
			 * form, this function also sets account statistics in the
			 * subscription page, using post render callback of the
			 * Base_Model_View
			 */
			subscribe : function(id, plan)
			{

				IS_HAVING_MANDRILL = false;
				if(window.location.href.split("#")[1] == "subscribe")
            		IS_TRIAL = false;
				$("#content").html("<div id='subscribe_plan_change'></div>");

				if (IS_NEW_USER && _plan_on_signup && _plan_on_signup.plan_type && _plan_on_signup.plan_type == "FREE")
				{
					 _plan_on_signup = null;
					Backbone.history.navigate("dashboard", { trigger : true });
					return;
				}
				
				if (!$.isEmptyObject(USER_CREDIRCARD_DETAILS))
				{

					plan_json.customer = JSON.parse(USER_CREDIRCARD_DETAILS);
				}
				var that = this;
				var counter = 0;
				showTransitionBar();
				var planDetails;

				this.subscribe_plan = new Base_Model_View({ url : "core/api/subscription?reload=true", template : "subscribe-new", window : 'subscribe',

				postRenderCallback : function(el)
				{
					var data = that.subscribe_plan.model.toJSON();
					_data = that.subscribe_plan.model.toJSON();

					initializeSubscriptionListeners()

					var _window = window;
					// Setup account statistics
					set_up_account_stats(el);

					USER_BILLING_PREFS = data;

					USER_CREDIRCARD_DETAILS = that.subscribe_plan.model.toJSON().billingData;

					if (data && data.billingData)
					{
						var billing_data = JSON.parse(data.billingData);
						var stripe_subscription = getSubscription(data.billingData, data.plan);
					}

					var planType = "";

					var quantity;
					if (stripe_subscription == null)
					{
						quantity = "2";
						planType = "FREE";
					}
					else
					{
						quantity = data.plan.quantity;
						planType = data.plan.plan_type.toUpperCase();
//						if("PRO_MONTHLY" == planType)
//							planType = "ENTERPRISE_MONTHLY";
//						else if("PRO_YEARLY" == planType)
//							planType = "ENTERPRISE_YEARLY";
					}
					planDetails = "<span class='text-head-black'>Current Plan</span></br><span class='text-head-black'>" + quantity + " Users</span>";
					if (planType.indexOf('STARTER') == 0)
					{
						id = $('#starter_plan');
					}
					else if (planType.indexOf('REGULAR') == 0)
					{
						id = $('#regular_plan');
					}
					else if (planType.indexOf('ENTERPRISE') == 0 || planType.indexOf('PRO') == 0)
					{
						id = $('#pro_plan');
					}

					if (id)
					{
						$("#plan_type").val(id.attr("id").split("_")[0]);
					}
					element = setPriceTemplete(data.plan.plan_type, el);
					addStyleForAPlan(id, planDetails);
					// Show Coupon code input field
					id = (id && id == "coupon") ? id : "";
					showCouponCodeContainer(id);
					price = update_price();
					$("#user_quantity").val(quantity);
					$("#users_quantity").text(quantity);
					(quantity && quantity > 1) ? $("#users_quantity_text").text("Users") : $("#users_quantity_text").text("User");
					$("#users_total_cost").text((quantity * price).toFixed(2));
					if ($.isEmptyObject(data))
						setPlan("free");
					else
						setPlan(data);

					data = _data;
					_billing_restriction = _data.cachedData;
					init_acl_restriction();

					var subscription_model = new BaseModel(data);

					that.setup_email_plan(subscription_model);

					that.show_card_details(subscription_model);

					that.invoice_latest(subscription_model);

					hideTransitionBar();
					document.getElementById('email-quantity').value = "";
					$('.selected-plan', el).trigger('click');
					if (_IS_EMAIL_PLAN_ACTIVE)
					{
						$(".nav-tabs li").removeClass("active");
						$("#users-content").removeClass("active");
						$("#emailtab").addClass("active");
						$("#email-content").addClass("active");
					}

				} });

				addStyleForAPlan(id, planDetails);
				$('#subscribe_plan_change').html(that.subscribe_plan.render().el);
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

				accessUrlUsingAjax('core/api/subscription/getinvoice?d=' + invoice_id, function(data)
				{
					console.log("Invoice object");
					console.log(data);
					invoicedata = data;

					accessUrlUsingAjax('/core/api/account-prefs', function(data)
					{
						console.log("Account prefs");
						console.log(data);
						companydata = data;

						obj = { "invoice" : invoicedata, "company" : companydata }
						console.log("xxxxxxxxxxxxxxx");
						console.log(obj);
						head.js(LIB_PATH + 'jscore/handlebars/handlebars-helpers.js', function()
						{
							getTemplate('invoice-detail', obj, undefined, function(template_ui)
							{
								if (!template_ui)
									return;
								$('#content').html($(template_ui));
								$('[data-toggle="tooltip"]').tooltip();
							}, "#content");
						});

					}, function(response)
					{
						showNotyPopUp("information", "error occured please try again", "top");
					});

				}, function(response)
				{
					showNotyPopUp("information", "error occured please try again", "top");
				});

			},

			/**
			 * Shows form the update plan, uses the same url used to create new
			 * subscription/update credit card of plan, deserializes the current
			 * plan
			 */
			updatePlan : function()
			{
				var update_plan = new Base_Model_View({
					url : "core/api/subscription-addon/subscribe",
					template : "purchase-email-plan",

					saveCallback : function()
					{
						window.navigate("subscribe", { trigger : true });
						showNotyPopUp("information", "Your plan has been updated successfully. Please logout and login again for the new changes to apply.",
								"top");
					}, postRenderCallback : function(el)
					{
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
				Backbone.history.navigate("invoice-details", { trigger : true });
				this.invoice = new Base_Collection_View({ url : "core/api/subscription/invoices", templateKey : "invoice", window : 'subscribe',
					individual_tag_name : 'tr' })

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

				if (!this.invoice || !this.invoice.collection || this.invoice.collection == 0 || !this.invoice.collection.get(id))
				{
					this.navigate("invoice", { trigger : true });
					return;
				}
				if (id)
				{
					// Gets invoice item from the collection
					var model = this.invoice.collection.get(id);

					// Displays detailed invoice
					var invoice_detail_model = new Base_Model_View({ url : "core/api/subscription/getinvoice", model : model, template : "invoice-detail",
						postRenderCallback : function(el)
						{
						} });
					$("#billing-settings-tab-content").html("");
					$("#billing-settings-tab-content").html(invoice_detail_model.render().el);
				}
				else
					return;
			},

			/**
			 * After selecting plan, page is navigated to purchase plan where
			 * user enter his credit card details. It shows a form with
			 * countries and states and fields to enter credit card details
			 */
			purchasePlan : function()
			{

				// If plan is not defined i.e., reloaded, or plan not chosen
				// properly,
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
				var upgrade_plan = new Base_Model_View(
						{
							url : "core/api/subscription",
							template : "purchase-plan",
							isNew : true,
							data : plan,
							postRenderCallback : function(el)
							{
								initializeSubscriptionListeners();
								_IS_EMAIL_PLAN_ACTIVE = false;
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
								catch (err)
								{
									console.log(err);
								}

							},
							errorCallback : function(data)
							{
								if (data.responseText)
									showNotyPopUp("warning", data.responseText, "top");
							}

						});

				// Prepend Loading
				$('#content').html(upgrade_plan.render().el);
				$('[data-toggle="tooltip"]').tooltip();
				$(".active").removeClass("active");
				$("#planView").addClass("active");
			},

			setup_email_plan : function(subscription)
			{
				var counter = 0;
				var that = this;
				IS_HAVING_MANDRILL = false;
				$.ajax({ url : "core/api/email-gateway", type : "GET", success : function(data)
				{
					if (data && data.email_api)
						IS_HAVING_MANDRILL = true;

				}

				});

				/*
				 * Creates new view with a render callback to setup expiry dates
				 * field(show dropdown of month and year), countries list and
				 * respective states list using countries.js plugin account
				 * stats in subscription page
				 */
				var subscribe_email_plan = new Base_Model_View({ url : "core/api/subscription", template : "email-update", model : subscription,
					window : 'subscribe',

					postRenderCallback : function(el)
					{

					} });

				$('#purchase-email').html(subscribe_email_plan.render(true).el);
			},

			show_card_details : function(subscription)
			{
				var that = this;
				var counter = 0;
				/*
				 * Creates new view with a render callback to setup expiry dates
				 * field(show dropdown of month and year), countries list and
				 * respective states list using countries.js plugin account
				 * stats in subscription page
				 */
				var stripe_customer_details = new Base_Model_View({ url : "core/api/subscription", model : subscription, template : "customer-details-block",

				postRenderCallback : function(el)
				{
				} });

				$('#customer-details-holder').html(stripe_customer_details.render(true).el);
			},

			invoice_latest : function(subscription)
			{
				$('#recent_invoice').html(getRandomLoadingImg());
				if (!subscription.get("billingData"))
				{
					$("#invoice-details-holder").html("");
					$('#invoice-details-holder').append("<div class='text-lg p-l-sm p-t-sm'>No invoices</div>");
					return;
				}

				// Send an ajax request

				$.get("core/api/subscription/invoices", {}, function(invoice)
				{

					if (!invoice || invoice.length <= 0)
						return;

					// Sort invoice
					invoice = new BaseCollection(invoice, { sortKey : "created", descending : true }).toJSON();
//					var object = JSON.parse(JSON.stringify(invoice[0]));
					// Send data to a template
					getTemplate('latest-invoice', invoice[0] , undefined, function(template_ui)
					{
						if (!template_ui)
							return;
						$('#recent_invoice').html(template_ui);
						
					}, "#recent_invoice");
					
				})
				.fail(function() {
					$('#recent_invoice').html("You do not have any invoices yet.");
				});

			},

			// gets collection of charges of aa paricular customer based on
			recent_invoice : function(subscription)
			{
				if (!subscription.get("billingData"))
				{
					$("#invoice-details-holder").html("");
					$('#invoice-details-holder')
							.append(
									"<div class='text-lg p-l-sm p-t-sm'>Invoices</div><hr><div class='text-center p-b-lg'><p class='m-b-none' style='font-size: 18px;'>You do not have any invoices yet</p><p>Generated invoices will be shown here.</p></div>");
					return;
				}

				this.invoice = new Base_Collection_View({ url : "core/api/subscription/invoices" + "?page_size=20", templateKey : "invoice",
					window : 'subscribe', individual_tag_name : 'tr', sortKey : 'created', descending : true });

				// Fetches the invoice payments
				this.invoice.collection.fetch();

				$("#invoice-details-holder").html(this.invoice.render().el);

			},

			trialSubscribe: function()
			{
				IS_TRIAL = true;
				var that = this;
				if(!IS_ALLOWED_TRIAL)
				{
					$.ajax({ url : "core/api/subscription/agileTags?email="+CURRENT_DOMAIN_USER.email,
					 type : "GET",
					 dataType: "json",
					 contentType : "application/json; charset=utf-8",
					 success : function(data)
						{
							console.log(data);
							if(data && data.tags)
							{
								if ( $.inArray('Cancellation Request', data.tags) == -1 && $.inArray('Cancelled Trial', data.tags) == -1 && $.inArray('Trial', data.tags) != -1) {
								    IS_ALLOWED_TRIAL = true;
								}
							}
							that.subscribe();
						},error : function(){
							alert("Error occured. Please Reload the page.")
						}
					});	
				}
				else{
					that.subscribe();
				}
			}

		});

function getPendingEmails()
{
	var count = _billing_restriction.one_time_emails_count;

	var max = getMaxEmailsLimit();

	// if max is greater than zero, we consider user is subscrbed to email plan
	if (max > 0)
	{
		// In case of count is less than zero we return 0;
		if (count < 0)
			return 0;

		return count;
	}

	// If max is zero then it is free plan
	if (max == 0)
	{
		// Count comes as a negavie value here
		var remaining = 5000 + count;
		if (remaining < 0)
			return 0;

		return remaining;
	}

	return count;
}

function getMaxEmailsLimit()
{
	var max = _billing_restriction.max_emails_count;

	if (max == undefined)
		max = 0;

	return max;
}
function canSendEmails(emails_to_send)
{
	var pending = getPendingEmails();
	if (pending >= emails_to_send)
		return true;

	return false;
}

function is_free_plan()
{
	return _IS_FREE_PLAN;
}

/**
 * This function is used to add the style for price panels.
 * 
 * @param id
 * @param description
 */
function addStyleForAPlan(id, planDetails)
{
	if (id)
	{

		if (($('selected-plan')) != ($('#email-div')))
		{
			$(".plan-collection-in").removeClass('selected-plan');
			id.find('.plan-collection-in').addClass('selected-plan');
		}
		else
		{
			$('#email-div').addClass('selected-plan');
		}

	}
}

function removeStyleForAPlan(id)
{
	var id = $('#plans-panel');

	id.find(".plan-collection-bot").css("opacity", "0.5");

	if (($('selected-plan')) != ($('#email-div')))
		$(".plan-collection-in").removeClass('selected-plan');

}

function getEmailsNextRenewalTime()
{
	var last_renewal_time = _billing_restriction.last_renewal_time;
	if(last_renewal_time == undefined || last_renewal_time == null){
		$.getJSON("core/api/users/current-owner", function(data){
			$("#next_emails_renewal").html(new Date((data.createdTime+2592000)*1000).format("mmm dd, yyyy"));
		  return;
		});
	}else{
		return new Date((last_renewal_time+2592000)*1000).format("mmm dd, yyyy");
	}

}

function getEmailCreditsCount()
{
	var count = _billing_restriction.email_credits_count;

	if (count == undefined)
		count = 0;

	return count;
}
