var plan_json = [];
//Plans with costs
var PLANS_COSTS_JSON = {};
PLANS_COSTS_JSON.basic = "24.99";
PLANS_COSTS_JSON.professional = "49.99";
PLANS_COSTS_JSON.enterprise = "99.99";

// Plans intervals JSON
var PLANS_DISCOUNTS_JSON = {};
PLANS_DISCOUNTS_JSON.monthly = "0";
PLANS_DISCOUNTS_JSON.yearly = "20";
PLANS_DISCOUNTS_JSON.twoyears = "30";

// User existing plan name
var user_existing_plan_name = "";
var USER_CREDIRCARD_DETAILS = {};
var USER_BILLING_PREFS;

var USER_DETAILS = {
		getCurrentPlanName : function(userJSON){
			if(!userJSON)
				return "free";
			return userJSON.plan.PlanType;
		},
		getCurrentPlanId: function(userJSON)
		{
			if(!userJSON)
				return "free";
			return userJSON.plan.plan_id;
		},
		getPlanType : function(userJSON){
			if(!userJSON)
			return "free";
		
			if(userJSON.plan.plan_type)
			{			
				if(userJSON.plan.plan_type.split("_").length == 1) return plan;
	
				// Returns lite-yearly....
				return userJSON.plan.plan_type.split("_")[0];
			}
			return "LITE"
		},
		getPlanInterval : function(userJSON){
			
			if(!userJSON || !userJSON.plan.plan_type)
				return "MONTHLY";

			var plan = userJSON.plan.plan_type
			
			if(plan)
				return plan.split("_")[1];
			
		},
		getQuantity : function(userJSON){
			
			if(!userJSON)
				return 2;
			
			return userJSON.plan.quantity;
		}
}


function load_slider(el)
{
		  	$("#users_select_slider", el).slider({ 
			     	  from: 1,
			     	     to: 20, 
			     	     step: 1,
			     	     skin: "plastic",
			     	     onstatechange: function( value ) 
			     	     {
			     	     	$( "#users_quantity", el).text(value);
			     	     	price = update_price();
			     	     	$("#users_total_cost", el).text((value * price).toFixed(2));
					     }	
			     });	
}

function setCost(price)
{
	return $("#users_total_cost").text(($( "#users_quantity" ).text() * price).toFixed(2)); 
}

function update_price()
{	
	// Get the selected plan cost
	var plan_name = $("[name='pro_vs_lite']:checked").val();
	return $("#" + plan_name + "_plan_price").text();	
}


function setPriceTemplete(user_plan, element)
{

		var interval = "yearly", plan_type = "pro", quantity = 1;
		
		if(user_plan != "free" && user_plan != "super")
		{
			plan_type = USER_DETAILS.getPlanType(USER_BILLING_PREFS);
			interval = USER_DETAILS.getPlanInterval(USER_BILLING_PREFS);
			quantity = USER_DETAILS.getQuantity(USER_BILLING_PREFS);
				
			plan_type = plan_type.toLowerCase();
			interval = interval.toLowerCase();
		}
		
		$(element).find('#' + plan_type + '_plan_select').attr('checked','checked');
		$(element).find('.'+ interval).addClass("plan-select");
		$(element).find('#users_select_slider').attr('value', quantity);
		
		return element;	
	
	
}

function setPlan(user_plan)
{
	try{
		var interval = "yearly", plan_type = "pro";
		if(user_plan != "free" && user_plan != "super")
		{
			plan_type = USER_DETAILS.getPlanType(USER_BILLING_PREFS);
			interval = USER_DETAILS.getPlanInterval(USER_BILLING_PREFS);
			
			plan_type = plan_type.toLowerCase();
			interval = interval.toLowerCase();
		}
	
		
		$("ul.tagsli a." + interval).trigger("click");
		$("input[value='" + plan_type + "']").trigger("click");
		
		
	}catch(err){
		console.log(err);
		// alert(err);
	}
}



$(function()
		{
		
		$('.plan-collection-in').die().live('click', function(e){
	  		
			$(this).find("[name='pro_vs_lite']").attr('checked','checked');
			var plan_type = "";
	  		$('.plan-collection-in').each(function(index, element){
	  			
	  			// Get plan type
	  			plan_type = $(element).find("#plan_name").text().toLowerCase();
	  			$(element).find("span.plan-collection-icon").removeClass(plan_type + "_selected");
	  		});
	  		
	  		// Get plan type
	  		plan_type = $(this).find("#plan_name").text().toLowerCase();
	  		$(this).find("span.plan-collection-icon").addClass(plan_type + "_selected");
	
	  		// Set cost based on the selected plan type
	  		var selected_plan = $(this).find("[name='pro_vs_lite']").val();
	  			 
	      	// Cost
	  		setCost(update_price());
	  		
	  	});

		// Tags selection
		$("ul.tagsli a").die().live("click", function(e){
			
			e.preventDefault();
			
			$("ul.tagsli a").removeClass("plan-select");
			$(this).addClass("plan-select");
			
			// Get interval
			var plan_interval = $(this).attr("class");
			plan_interval = plan_interval.replace("plan-select", "");
			plan_interval = plan_interval.trim();
			
			var discount = PLANS_DISCOUNTS_JSON[plan_interval];
			for(var key in PLANS_COSTS_JSON){
				var amount = PLANS_COSTS_JSON[key];
				
				var discount_amount = amount - ((discount/100) * amount);
				$('#'+ key +'_plan_price').html(discount_amount.toFixed(2));
			}
			
			// Cost
	  		setCost(update_price());
		});
	    
      	$('#purchase-plan').die().live('click', function(e){
	          var quantity = $("#users_quantity").text();
	          var cost = $("#users_total_cost").text();
	          var plan = $("input[name='pro_vs_lite']:checked").val();
	          var discount = "", months = "";
	          
	          if($('.monthly').hasClass("plan-select")){cycle = "Monthly";months = 1; discount = PLANS_DISCOUNTS_JSON["monthly"];}
	          else if($('.yearly').hasClass("plan-select")){cycle = "Yearly";months = 12;discount = PLANS_DISCOUNTS_JSON["yearly"];}
	          else if($('.twoyears').hasClass("plan-select")){cycle = "Two Years";months = 24;discount = PLANS_DISCOUNTS_JSON["twoyears"];}
	          
	          var variable = [];
			  var amount = PLANS_COSTS_JSON[plan];
			  for(var percent in PLANS_DISCOUNTS_JSON)
			    {
					value = PLANS_DISCOUNTS_JSON[percent];
					var discount_amount = amount - ((value/100) * amount);
					variable[percent] = discount_amount.toFixed(2);
				}
		
			  user_existing_plan_name = USER_DETAILS.getCurrentPlanId(USER_BILLING_PREFS);
			 
			  // Check the plan
	          var selected_plan_name = amount +"-"+ months;
	          
	          if(selected_plan_name.toLowerCase()+"-" + quantity == user_existing_plan_name+"-"+USER_DETAILS.getQuantity(USER_BILLING_PREFS))
	          {
	        	  alert("Please change your plan to proceed");
	        	  return false;
	          }
	          
	        var currentDate = new Date(); 
	        plan_json.date = currentDate.setMonth(currentDate.getMonth()+months) / 1000;
	        
	        plan_json.price = update_price();
	        plan_json.cost = (cost * months).toFixed(2);
	        plan_json.months = months;
	        plan_json.plan = plan;
	        plan_json.plan_type = plan.toUpperCase()+"_"+ cycle.toUpperCase();
	        plan_json.cycle = cycle;
	        
	        if(cycle != "Two Years")
	        	{
	        	 	plan_json.yearly_discount = ([cost * 12] - [variable.yearly * quantity * 12]).toFixed(2);
	        	 	plan_json.bi_yearly_discount = ([cost * 24] - [variable.twoyears * quantity * 24]).toFixed(2);
	        	}
	        
	        if((USER_DETAILS.getPlanType(USER_BILLING_PREFS) + "-" + USER_DETAILS.getQuantity(USER_BILLING_PREFS) + "-" + USER_DETAILS.getPlanInterval(USER_BILLING_PREFS)) == (plan + "-" + quantity + "-" + cycle)){
	        	
	        	alert("Please change the plan to proceed");
	        	return false;
	        }
	        
	        
	        
	        var plan_id = (months > 1) ? PLANS_COSTS_JSON[plan] + "-" + months : PLANS_COSTS_JSON[plan];
	        
	        
	        plan_json.plan_id = plan_id;
	        plan_json.discount = discount;
		    plan_json.quantity = quantity;
		    plan_json.current_plan = USER_DETAILS.getCurrentPlanName(USER_BILLING_PREFS);
		    console.log(plan_json);
		    if(!$.isEmptyObject(USER_CREDIRCARD_DETAILS)){
		    	
		    	console.log(USER_CREDIRCARD_DETAILS);
		    	plan_json.customer = JSON.parse(USER_CREDIRCARD_DETAILS);
		    }
		    
      	});
    	
});	   