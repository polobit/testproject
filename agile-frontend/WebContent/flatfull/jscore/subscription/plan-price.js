var plan_json = {};
var email_json = {};
var PLAN_DETAILS = { getPlanPrice : function(plan_name)
{
	return PLANS_COSTS_JSON[plan_name];
}, getDiscountedPrice : function(plan_name, interval)
{
	var price = this.getPlanPrice(plan_name);
	var discount = PLANS_DISCOUNTS_JSON_NEW[plan_name][interval];
	return price * (100 - discount) / 100;
}, getDiscount : function(plan_name, interval)
{
	return PLANS_DISCOUNTS_JSON_NEW[plan_name][interval];
} }

// User existing plan name
var user_existing_plan_name = "";
var USER_CREDIRCARD_DETAILS = {};
var USER_BILLING_PREFS;

var USER_DETAILS = { getCurrentPlanName : function(userJSON)
{
	if (userJSON.plan.plan_type == "FREE")
		return "free";
	return userJSON.plan.plan_type;
},

getDomainName : function(userJSON)
{
	if (userJSON.plan.plan_type == "FREE")
		return "free";
	return userJSON.domain_name;
},

getCurrentPlanId : function(userJSON)
{
	if (userJSON.plan.plan_type == "FREE")
		return "free";
	return userJSON.plan.plan_id;
}, getPlanType : function(userJSON)
{
	if (userJSON.plan.plan_type == "FREE")
		return "free";

	if (userJSON.plan.plan_type)
	{
		if (userJSON.plan.plan_type.split("_").length == 1)
			return userJSON.plan.plan_type;

		// Returns lite-yearly....
		return userJSON.plan.plan_type.split("_")[0];
	}
	return "LITE"
}, getPlanInterval : function(userJSON)
{

	if (!userJSON || !userJSON.plan.plan_type || userJSON.plan.plan_type == "FREE")
		return "MONTHLY";

	var plan = userJSON.plan.plan_type

	if (plan)
		return plan.split("_")[1];

}, getQuantity : function(userJSON)
{

	if (!userJSON || !userJSON.plan || userJSON.plan.plan_type == "FREE")
		return 2;

	return userJSON.plan.quantity;
}, getPlanTypeByStripe : function(userJSON)
{
	var billing_data = JSON.parse(userJSON.billingData);
	if (!billing_data.subscription)
		return "free";

	if (billing_data.subscription.plan.name)
	{
		if (billing_data.subscription.plan.name.toUpperCase().replace(/\s/g, '').split("-").length == 1)
			return billing_data.subscription.plan.name.toUpperCase().replace(/\s/g, '').replace("-", '_');

		// Returns lite-yearly....
		return billing_data.subscription.plan.name.toUpperCase().replace(/\s/g, '').split("-")[0];
	}
	return "LITE"
}, getPlanIntervalByStripe : function(userJSON)
{
	if (!userJSON)
		return "MONTHLY";
	var billing_data = JSON.parse(userJSON.billingData);
	if (!billing_data.subscription || !billing_data.subscription.plan.name)
		return "MONTHLY";

	var plan = billing_data.subscription.plan.name;

	if (plan)
		return billing_data.subscription.plan.name.toUpperCase().replace(/\s/g, '').split("-")[1];

}

}

function load_slider(el)
{
	$("#users_select_slider", el).slider({ from : 1, to : 20, step : 1, skin : "plastic", onstatechange : function(value)
	{
		$("#users_quantity", el).text(value);
		price = update_price();
		$("#users_total_cost", el).text((value * price).toFixed(2));
	} });
}

function setCost(price)
{
	return $("#users_total_cost").text(($("#users_quantity").text() * price).toFixed(2));
}

function update_price(text)
{
	// Get the selected plan cost
	var plan_name = $("#plan_type").val();
	if(!text){
		if(_billing_restriction.currentLimits.planName == "FREE")
		{
			if(plan_name == "starter")
				$("#purchase-plan").text("{{agile_lng_translate 'plan-and-upgrade' 'proceed-to-pay'}}");
			else if(IS_TRIAL && IS_ALLOWED_TRIAL)
				$("#purchase-plan").text("{{agile_lng_translate 'plan-and-upgrade' 'proceed-to-trial'}}");
			else
				$("#purchase-plan").text("{{agile_lng_translate 'plan-and-upgrade' 'proceed-to-pay'}}");
		}else
			$("#purchase-plan").text("{{agile_lng_translate 'plan-and-upgrade' 'proceed-to-pay'}}");
	}
	return $("#" + plan_name + "_plan_price").text();
}

function setPriceTemplete(user_plan, element)
{

	var interval = "yearly", plan_type = "pro", quantity = 1;

	if (user_plan != "free" && user_plan != "super")
	{
		plan_type = USER_DETAILS.getPlanType(USER_BILLING_PREFS);
		interval = USER_DETAILS.getPlanInterval(USER_BILLING_PREFS);
		quantity = USER_DETAILS.getQuantity(USER_BILLING_PREFS);

		plan_type = plan_type.toLowerCase();
		interval = interval.toLowerCase();
	}

	if (IS_NEW_USER && _plan_on_signup)
	{
		quantity = _plan_on_signup.quantity;
	}

	$(element).find('#' + plan_type + '_plan_select').attr('checked', 'checked');
	$(element).find('.' + interval).addClass("plan-select");
	$(element).find('#users_select_slider').val(quantity);
	$(element).find('#billing_cycle').val(interval);
	return element;

}

function setPlan(user_plan)
{

	try
	{
		var interval = "yearly", plan_type = "regular";
		if (IS_NEW_USER && _plan_on_signup)
		{
			plan_type = _plan_on_signup.plan_type.toLowerCase();
			interval = "yearly";
		}
		else if (user_plan != "free" && user_plan != "super")
		{
			var stripe_subscription = getSubscription(user_plan.billingData, user_plan.plan);
			if (stripe_subscription || CURRENT_DOMAIN_USER.domain == "admin")
			{
				plan_type = USER_DETAILS.getPlanTypeByStripe(USER_BILLING_PREFS);
				interval = USER_DETAILS.getPlanIntervalByStripe(USER_BILLING_PREFS);

				plan_type = plan_type.toLowerCase();
				interval = interval.toLowerCase();
			}
			else
			{
				interval = "yearly";
				plan_type = "free";
			}
		}

		$("#plan_type").val(plan_type).trigger("change");

		// $("ul.tagsli a." + interval).trigger("click");
		$("#billing_cycle").val(interval).trigger("change");

	}
	catch (err)
	{
		console.log(err);
		// alert(err);
	}
}

function initializeSubscriptionListeners()
{


	$('#subscribe_plan_change').off("click");

	$('#subscribe_plan_change').on('click', '.plan-collection-in', function(e)
	{

		$(this).find("[name='pro_vs_lite']").attr('checked', 'checked');
		var plan_type = "";
		$('.plan-collection-in').each(function(index, element)
		{

			// Get plan type
			plan_type = $(element).find("#plan_name").text().toLowerCase();
			$(element).find("span.plan-collection-icon").removeClass(plan_type + "_selected");
		});

		// Get plan type
		plan_type = $(this).find("#plan_name").text().toLowerCase();
		$(this).find("span.plan-collection-icon").addClass(plan_type + "_selected");

		// Set cost based on the selected plan type
		var selected_plan = $(this).find("[name='pro_vs_lite']").val();

		removeStyleForAPlan();
		var id = $(this).parent();
		addStyleForAPlan(id, null);
		$("#plan_type").val(id.attr("id").split("_")[0]);

		// Cost
		setCost(update_price());

	});

	// Tags selection
	$('#subscribe_plan_change #plans-panel').off('click').on('click', 'ul.tagsli a', function(e)
	{

		e.preventDefault();

		$("ul.tagsli a").removeClass("plan-select");
		$(this).addClass("plan-select");

		// Get interval
		var plan_interval = $(this).attr("class");
		plan_interval = plan_interval.replace("plan-select", "");
		plan_interval = plan_interval.trim();

		for ( var key in PLANS_COSTS_JSON)
		{
			var amount = PLANS_COSTS_JSON[key];
			var discount = PLAN_DETAILS.getDiscount(key, plan_interval);
			var discount_amount = amount - ((discount / 100) * amount);
			$('#' + key + '_plan_price').html(discount_amount.toFixed(2));
		}

		// Cost
		setCost(update_price());
	});

	$('#subscribe_plan_change').on('change', '#billing_cycle', function(e)
	{
		e.preventDefault();
		var plan_interval = $(this).val();

		for ( var key in PLANS_COSTS_JSON)
		{
			var amount = PLANS_COSTS_JSON[key];
			var discount = PLAN_DETAILS.getDiscount(key, plan_interval);
			var discount_amount = amount - ((discount / 100) * amount);
			$('#' + key + '_plan_price').html(discount_amount.toFixed(2));
		}
		var price = update_price();
		if (!price)
			return;
		var value = $("#user_quantity").val();
		$("#users_quantity").text(value);
		$("#users_total_cost").text((value * price).toFixed(2));

	});
	$('#subscribe_plan_change').on('change', '#user_quantity', function(e)
	{
		e.preventDefault();
		var value = $(this).val();
		price = update_price();

		$("#users_quantity").text(value);

		$("#users_total_cost").text((value * price).toFixed(2));

		var quantity = $("#user_quantity").val();

		(quantity && quantity > 1) ? $("#users_quantity_text").text("{{agile_lng_translate 'plan-and-upgrade' 'users'}}") : $("#users_quantity_text").text("{{agile_lng_translate 'plan-and-upgrade' 'user'}}");

	});

	$('#subscribe_plan_change').on('change', '#plan_type', function(e)
	{
		var plan_type = $(this).val();
		$("#" + plan_type + "_plan > .plan-collection-in").click();
		if ($(this).val() == "free")
		{
			$("#plans-panel .plan-collection-bot").css("opacity", "0.5");
			setCost(update_price());
		}
	});

	$('#subscribe_plan_change').on('click', '#purchase-email-plan', function(e)
	{

		if (!email_validation($("#email-plan-form")))
		{
			e.preventDefault();
		}
		var emailQuantity = $("#email-quantity").val();
		var emailCost = $("#emails_total_cost").text();
		var emailRate = $("#email_rate").text();
		var currentDate = new Date();
		// email_json.billingDate =
		// currentDate.setDate(currentDate.getDate()+30) / 1000;
		email_json.billingData = App_Subscription.subscribe_plan.model.toJSON()['billingData'];
		email_json.emailRate = emailRate;
		email_json.emailCost = emailCost;
		email_json.quantity = emailQuantity;
		// console.log("email_json"+email_json);
		// if(!$.isEmptyObject(USER_CREDIRCARD_DETAILS)){
		//				    	
		// plan_json.customer = JSON.parse(USER_CREDIRCARD_DETAILS);
		// }

	});

	$('#subscribe_plan_change').on(
			'click',
			'#purchase-plan',
			function(e)
			{
				e.preventDefault();
				if(!CURRENT_DOMAIN_USER.is_admin && USER_BILLING_PREFS.billingData){
					showNotyPopUp("warning", "{{agile_lng_translate 'billing' 'cncel-voilation'}}", "top");
					return;
				}
				plan_json = {};
				var buttonText = $(this).html();
				$(this).html("<img style='padding-bottom: 2px;width: 17px;' src='img/21-0.gif'>{{agile_lng_translate 'plan-and-upgrade' 'processing'}}");
				$(this).attr("disabled","disabled");
				/*
				 * var quantity = $("#users_quantity").text(); var cost =
				 * $("#users_total_cost").text(); var plan =
				 * $("input[name='pro_vs_lite']:checked").val();
				 */

				var quantity = $("#user_quantity").val();
				var cost = $("#users_total_cost").text();
				var credit = $("#credit_amount").text();
				if(credit == "")
					credit = 0;
				var plan = $("#plan_type").val();

				/*if(plan != "regular" && addonsExists()){
					showNotyPopUp("warning", "Please cancel all your addons before change the plan.", "top");
					$(this).text("Proceed to Pay");
					$(this).removeAttr("disabled");
					return;
				}*/
				
				if("pro" == plan)
					plan = "enterprise";
				var discount = "", months = "";
				var billing_cycle = $("#billing_cycle").val();
				if (!plan || plan == "free")
				{
					showAlertModal("select_plan");
					$(this).text(buttonText).removeAttr("disabled");
					return false;
				}

				/*
				 * if($('.monthly').hasClass("plan-select")){cycle =
				 * "Monthly";months = 1; discount =
				 * PLAN_DETAILS.getDiscount(plan, "monthly")} else
				 * if($('.yearly').hasClass("plan-select")){cycle =
				 * "Yearly";months = 12;discount =
				 * PLAN_DETAILS.getDiscount(plan, "yearly")} else
				 * if($('.biennial').hasClass("plan-select")){cycle =
				 * "biennial";months = 24;discount =
				 * PLAN_DETAILS.getDiscount(plan, "biennial")}
				 */

				if (billing_cycle == "monthly")
				{
					cycle = "Monthly";
					months = 1;
					discount = PLAN_DETAILS.getDiscount(plan, "monthly")
				}
				else if (billing_cycle == "yearly")
				{
					cycle = "Yearly";
					months = 12;
					discount = PLAN_DETAILS.getDiscount(plan, "yearly")
				}
				else if (billing_cycle == "biennial")
				{
					cycle = "biennial";
					months = 24;
					discount = PLAN_DETAILS.getDiscount(plan, "biennial")
				}

				var variable = [];
				var amount = PLANS_COSTS_JSON[plan];
				for ( var interval in PLANS_DISCOUNTS_JSON_NEW[plan])
				{
					var percent = PLAN_DETAILS.getDiscount(plan, interval);
					var discount_amount = PLAN_DETAILS.getDiscountedPrice(plan, interval);
					variable[interval] = discount_amount.toFixed(2);
				}

				user_existing_plan_name = USER_DETAILS.getCurrentPlanId(USER_BILLING_PREFS);

				// Check the plan
				var selected_plan_name = amount + "-" + months;

				if (selected_plan_name.toLowerCase() + "-" + quantity == user_existing_plan_name + "-" + USER_DETAILS.getQuantity(USER_BILLING_PREFS))
				{
					showAlertModal("change_plan");
					$(this).text(buttonText).removeAttr("disabled");
					return false;
				}

				var currentDate = new Date();

				if(_billing_restriction.currentLimits.planName == "FREE")
				{
					if(plan_name == "starter")
						plan_json.date = currentDate.setMonth(currentDate.getMonth() + months) / 1000;
					else if(IS_TRIAL && IS_ALLOWED_TRIAL)
						plan_json.date = currentDate.setHours(currentDate.getHours()+168);
					else
						plan_json.date = currentDate.setMonth(currentDate.getMonth() + months) / 1000;
				}else
					plan_json.date = currentDate.setMonth(currentDate.getMonth() + months) / 1000;

				
				plan_json.new_signup = is_new_signup_payment();
				plan_json.price = update_price(true);
				plan_json.cost = (cost * months).toFixed(2);
				if(credit > 0){
					plan_json.costWithCredit = plan_json.cost;
					plan_json.credit = credit;
					plan_json.cost = (plan_json.cost - credit).toFixed(2);
				}
				plan_json.months = months;
				plan_json.plan = plan;
				plan_json.plan_type = plan.toUpperCase() + "_" + cycle.toUpperCase();
				plan_json.cycle = cycle;
				plan_json.billingData = App_Subscription.subscribe_plan.model.toJSON()['billingData'];
				// Set coupon Only for Pro users
				delete plan_json["coupon_code"];
				var couponCode = $("#coupon_code").val();
				if (couponCode)
					plan_json.coupon_code = couponCode;

				if (cycle != "biennial")
				{
					plan_json.yearly_discount = ([
						cost * 12
					] - [
						variable.yearly * quantity * 12
					]).toFixed(2);
					plan_json.bi_yearly_discount = ([
						cost * 24
					] - [
						variable.biennial * quantity * 24
					]).toFixed(2);
				}

				if ((USER_DETAILS.getPlanType(USER_BILLING_PREFS) + "-" + USER_DETAILS.getQuantity(USER_BILLING_PREFS) + "-" + USER_DETAILS
						.getPlanInterval(USER_BILLING_PREFS)) == (plan.toUpperCase() + "-" + quantity + "-" + cycle.toUpperCase()))
				{

					showAlertModal("change_plan");
					$(this).text(buttonText).removeAttr("disabled");
					return false;
				}

				var plan_id = (months > 1) ? PLANS_COSTS_JSON[plan] + "-" + months : PLANS_COSTS_JSON[plan];

				plan_json.plan_id = plan_id;
				plan_json.discount = discount;
				plan_json.quantity = quantity;
				plan_json.current_plan = USER_DETAILS.getCurrentPlanName(USER_BILLING_PREFS);
				plan_json.domain_name = USER_DETAILS.getDomainName(USER_BILLING_PREFS);
				if(IS_TRIAL)
					plan_json.trialStatus = "apply";
				if (!$.isEmptyObject(USER_CREDIRCARD_DETAILS))
				{

					plan_json.customer = JSON.parse(USER_CREDIRCARD_DETAILS);
				}
				var that = this;
				// Get plan restrictions and check downgrade conditions.
				$.ajax({
					url :"/core/api/subscription/planRestrictions" ,
					type : "POST",
					dataType: "json",
					contentType : "application/json; charset=utf-8",
					data : JSON.stringify(plan_json),
					success : function(data){
						var errorsCount = 0;
						$(that).text(buttonText).removeAttr("disabled");
						data.plan = plan.substr(0, 1).toUpperCase() + plan.substr(1);
						if(data.is_more_users)
						{
							errorsCount++;
							data.newCount = quantity;
							data.errorsCount = errorsCount;
							getTemplate("subscribe-error-modal",data , undefined, function(template_ui){
								if(!template_ui)
									  return;
								$(template_ui).modal('show');
							}, null);
							return;
						}else if(data.is_allowed_plan){
							Backbone.history.navigate("purchase-plan", { trigger : true });
						}else if(data.lines){
							$.each( JSON.parse(USER_BILLING_PREFS.billingData).subscriptions.data, function( key, value ) {
							  if(value.plan.id.indexOf("email") == -1 && value.plan.id.indexOf("addon") == -1)
							  {
							  	if((cost * months).toFixed(2) > value.quantity*(value.plan.amount/100))
							  	{
							  		plan_json.unUsedCost = data.lines.data[0].amount*(-1)/100;
							  		plan_json.remainingCost = data.lines.data[1].amount/100;
							  		plan_json.cost = (plan_json.remainingCost - plan_json.unUsedCost - credit).toFixed(2);
							  	}else
							  	{
							  		plan_json.unUsedCost = undefined;
							  		plan_json.remainingCost = undefined;
							  	}
							  }
							});
							
						}else{
							var restrictions = data.restrictions;
							var usersLimit = parseInt(plan_json.quantity);
							if(restrictions.users != undefined){
								restrictions.users.limit = usersLimit;
								if(restrictions.users.limit >= restrictions.users.count)
									delete restrictions['users'];
							}
							errorsCount = (_.size(restrictions));
							if(errorsCount >= 1)
							{
								restrictions.errorsCount = errorsCount;
								restrictions.plan = data.plan;
								var template_name = "subscribe-error-modal";
								if(errorsCount > 5)
									template_name = "subscribe-error-more-modal";
								getTemplate(template_name,restrictions , undefined, function(template_ui){
									if(!template_ui)
										  return;
									$(template_ui).modal('show');
								}, null);
								return;
							}
						}
						if(USER_DETAILS.getPlanInterval(USER_BILLING_PREFS) == cycle.toUpperCase()){
							plan_json.date = data.nextPaymentAttempt;
							if(months == 24)
							plan_json.date = plan_json.date + 31557600;
						}
						Backbone.history.navigate("purchase-plan", { trigger : true });
							
					},
					error : function(data){
						showNotyPopUp("warning", data.responseText, "top");
						$(that).text(buttonText).removeAttr("disabled");
					}
				});


			});

	// Check coupon functionality
	$('#subscribe_plan_change').on('click', '#check_valid_coupon', function(e)
	{
		// Get coupon input value
		var couponId = $("#coupon_code").val();
		if (!couponId)
		{
			$("#coupon_code_container").find(".error").html("Invalid Coupon");
			return false;
		}

		$("#coupon_code_container i").removeAttr("class");
		var iconClass = "icon-", that = $(this);

		// Check coupon status
		checkValidCoupon(couponId, function(response)
		{
			iconClass += (response) ? "ok" : "remove";
			$("#coupon_code_container i").removeAttr("class").addClass(iconClass);
		});

	});

	$('#subscribe_plan_change').on("keyup", '#email-quantity', function(e)
	{
		// console.log(e.which);
		var quantity = $(this).val();
		if (isNaN(quantity))
			return;

		var emails = quantity * 1000;

		if (IS_HAVING_MANDRILL)
		{
			if(emails < 5000)
			{
				$("#emails_total_cost").html(quantity * 0);
				$("#email_rate").html("$2");
			}
			else
			{
				$("#emails_total_cost").html(quantity * 2);
				$("#email_rate").html("$2");
			}
		}
		else
		{
		if(emails < 5000)
		{
			$("#emails_total_cost").html(quantity * 0);
			$("#email_rate").html("$3");
		}
		else if (emails < 100000)
		{
			$("#emails_total_cost").html(quantity * 3);
			$("#email_rate").html("$3");
		}

		else if (emails < 1000000)
		{
			$("#emails_total_cost").html((quantity * 2.5).toFixed(2));
			$("#email_rate").html("$2.50");
		}
		else if (emails >= 1000000)
		{
			$("#emails_total_cost").html((quantity * 1.5).toFixed(2));
			$("#email_rate").html("$1.50");
		}
		}
		email_validation($("#email-plan-form"));
		jQuery.validator.addMethod("email_plan_minimum", function(value, element)
		{

			if (this.optional(element))
				return true;

			return parseInt(value) >= 5;
		}, " {{agile_lng_translate 'billing' 'should-purchase-5000'}}");
	});

	$("#subscribe_plan_change").on("click","#cancel_free_trial",function(e){
		e.preventDefault();
		showAlertModal("delete_free_trial", "confirm", function(){
			$.ajax({url:'core/api/subscription/cancel/trial',
				type:'GET',
				success:function(data){
					if(data && JSON.parse(data).is_success)
					{
						add_tag_our_domain("Cancelled Trial");
						document.location.reload();
					}else if(data)
					{
						getTemplate("trial-error-modal",JSON.parse(data) , undefined, function(template_ui){
							if(!template_ui)
								  return;
							$(template_ui).modal('show');
						}, null);
					}


					
				},error: function(){
					alert("Error occured, Please try again");
				}
			});
		});
		
	});

	$('#subscribe_plan_change').on('mouseenter', '.show_limits', function(e)
	{
		e.preventDefault();
		$(this).closest(".plan-collection-in").find(".plan_features").css("display","block");
		
	});
	$('#subscribe_plan_change').on('mouseleave', '.show_limits', function(e)
	{
		e.preventDefault();
		$(this).closest(".plan-collection-in").find(".plan_features").css("display","none");
	});

	$("#subscribe_plan_change").on("click","#cancel_email_plan",function(e){
		e.preventDefault();
		getTemplate("cancel-email-conformation-modal",{} , undefined, function(template_ui){
			if(!template_ui)
				  return;
			$(template_ui).modal('show');
		}, null);
	});

	//From modal popup
	$("#cancel_email_plan_conform").off("click");
	$("body").on("click","#cancel_email_plan_conform",function(e){
		e.preventDefault();
		$.ajax({url:'core/api/subscription/cancel/email',
			type:'GET',
			success:function(data){
				showNotyPopUp("information", "{{agile_lng_translate 'billing' 'email-subscription-canceled'}}", "top"); 
				setTimeout(function(){ 
					document.location.reload();
				}, 1000);				
			},error: function(){
				showAlertModal("retry");
			}
		});
	});
	$("#purchase_credits").off("click");
	$("#email-content").on("click","#purchase_credits", function(e){
		e.preventDefault();
		getTemplate("purchase-credits-info-modal",{} , undefined, function(template_ui){
			if(!template_ui)
				  return;
			$("#purchase-credits-info-modal").html($(template_ui)).modal('show');
		}, null);
			
	});

	$('#purchase-credits-info-modal').on("keyup", '#email_credits_count', function(e)
	{
		var quantity = $(this).val();
		if(quantity == ""){
			$("#total_credits_cost").html(quantity*10);
			return;
		}
		if (isNaN(quantity) || quantity < 0)
			return;
		$("#total_credits_cost").html(quantity*4);
	});

	$("#manage_auto_recharge").off("click");
	$("#email-content").on("click","#manage_auto_recharge", function(e){
		e.preventDefault();
		var data = {};
		if(_billing_restriction.nextRechargeCount != undefined)
			data.nextRechargeCount = _billing_restriction.nextRechargeCount;
		if(_billing_restriction.autoRenewalPoint != undefined)
			data.autoRenewalPoint = _billing_restriction.autoRenewalPoint;
		if(_billing_restriction.isAutoRenewalEnabled != undefined)
			data.isAutoRenewalEnabled = _billing_restriction.isAutoRenewalEnabled;
		getTemplate("auto-recharge",data , undefined, function(template_ui){
			if(!template_ui)
				  return;
			$("#auto-recharge-modal").html($(template_ui)).modal("show");
		}, null);
			
	});

	$("#subscribe_plan_change #addontab").off("click");
	$("#subscribe_plan_change").on("click", "#addontab",function(e){
		App_Subscription.aclAddon();
		App_Subscription.campaignAddon();
		App_Subscription.triggerAddon();
	});

}

function is_new_signup_payment()
{
	return IS_NEW_USER && _plan_on_signup;
}

function email_validation(form)
{

	$(form).validate(
			{ rules : { atleastThreeMonths : true, multipleEmails : true, email : true, phone : true }, debug : true, errorElement : 'span',
				errorClass : 'help-inline',

				// Higlights the field and addsClass error if validation failed
				highlight : function(element, errorClass)
				{
					$(element).closest('#email_validation_container').addClass('single-error');
				},

				// Unhiglights and remove error field if validation check passes
				unhighlight : function(element, errorClass)
				{
					$(element).closest('#email_validation_container').removeClass('single-error');
				},

				errorPlacement : function(error, element)
				{
					console.log(error);
					console.log($(element).closest('#email_validation_container').length);

					try
					{
						if ($(element).closest('#email_validation_container').length)
						{
							error.insertAfter($(element).closest('#email_validation_container'));
						}
						else
						{
							error.insertAfter($(element).closest(element));
						}
					}
					catch (err)
					{
						console.log(err);
					}

				} });
	return $(form).valid();
}

function emailClickEvent() {
	$('ul.nav.nav-tabs').removeClass("hide");
	$("#email").addClass("hide");
	$("#currentPlan").addClass("p-t-md");
	$("#usertab").removeClass("active");
	$("#emailtab").addClass("active");
	$("#users-content").removeClass("active");
	$("#email-content").addClass("active");
}

$(function(){

  $("#purchase_credits_conform").off("click");
	$("#purchase-credits-info-modal").on("click","#purchase_credits_conform",function(e){
		e.preventDefault();
		var $form = $("#purchaseCreditsForm");
		if(!isValidForm($form))
			return;
		$(this).attr("disabled", "disabled").html("{{agile_lng_translate 'plan-and-upgrade' 'processing'}}");
		var credits_count = $form.find("#email_credits_count").val();
		$.ajax({url:'core/api/subscription/purchaseEmailCredits?quantity='+credits_count,
			type:'POST',
			success:function(data){
				$form.closest(".modal").modal("hide");
				showNotyPopUp("information", "{{agile_lng_translate 'billing' 'email-credits-added'}}", "top"); 
				setTimeout(function(){ 
					document.location.reload();
				}, 1000);				
			},error: function(response){
				$form.closest(".modal").modal("hide");
				showNotyPopUp("warning", response.responseText, "top"); 
			}
		});
	});

	//auto recharge related events
	$("#auto-recharge-modal #save_auto_recharge").off("click");
	$("#auto-recharge-modal").on("click","#save_auto_recharge", function(e){
		e.preventDefault();
		var $form = $("#auto-recharge-form");
		if(!isValidForm($form))
			return;
		var json = serializeForm("auto-recharge-form");
		json.isAutoRenewalEnabled = true;
		disable_save_button($(this));
		var $that = $(this);
		$.post("core/api/subscription/auto_recharge", json, function(data){
			$that.closest(".modal").modal("hide");
			_billing_restriction.isAutoRenewalEnabled = json.isAutoRenewalEnabled;
			_billing_restriction.nextRechargeCount = json.nextRechargeCount;
			_billing_restriction.autoRenewalPoint = json.autoRenewalPoint;
			$that.html("save").removeAttr("disabled");
			showNotyPopUp("information","Auto recharge has been enabled successfully.", "top");
		}).fail(function(data) {
			$that.closest(".modal").modal("hide");
		    showNotyPopUp("warning", data.responseText, "top");
  		});
			
	});

	$("#auto-recharge-modal #disable_auto_recharge").off("click");
	$("#auto-recharge-modal").on("click","#disable_auto_recharge", function(e){
		e.preventDefault();
		var json = {};
		json.isAutoRenewalEnabled = false;
		var $that = $(this);
		$.post("core/api/subscription/auto_recharge", json, function(data){
			$that.closest(".modal").modal("hide");
			_billing_restriction.isAutoRenewalEnabled = json.isAutoRenewalEnabled;
			_billing_restriction.nextRechargeCount = undefined;
			_billing_restriction.autoRenewalPoint = undefined;
			showNotyPopUp("information","Auto recharge has been disabled successfully.", "top");
		}).fail(function(data) {
			$that.closest(".modal").modal("hide");
		    showNotyPopUp("warning", data.responseText, "top");
  		});
			
	});

});

function addAsAffiliate(amount){
	$.ajax({ type : 'POST', url : '/core/api/affiliate?am='+amount,	contentType : "application/json; charset=utf-8", dataType : 'json', 
		success : function(data){

		},error : function(){

	}});
}
