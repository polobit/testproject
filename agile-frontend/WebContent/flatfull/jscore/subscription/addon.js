var ADDON_BLOCK_REASONS = ["FAILED2", "FAILED3", "DELETED"];
var ACL_Addon_Events_Model_View = Base_Model_View.extend({
    events: {
        
        "change input[type='checkbox']" : 'updatePrice',
        'click .cancel_addon' : 'cancelAclAddOn'

    },

    updatePrice :  function(e)
    {
        e.preventDefault();
        var target_el = $(e.currentTarget);
        var quantity = $(target_el).closest(".multiple-checkbox").find("input:checked").length;
        updatePriceAndQuantity(quantity, $("#acl-addon-content"));
        changeSaveBtnStatus(target_el, quantity);
    },
    cancelAclAddOn :  function(e)
    {
        e.preventDefault();
        var target_el = $(e.currentTarget);
        $(target_el).attr("disabled", "disabled");
        var el = $(target_el).closest("#acl-addon-content");
        cancelAddOn("core/api/addon/acl", $(target_el), function(){
        	$(".multiple-checkbox", el).find("input").removeAttr("checked").trigger("change");
        }, "acl");
    }
});

var Campaign_Addon_Events_Model_View = Base_Model_View.extend({
    events: {
        
        'change .campaign_quantity' : 'updatePrice',
        'click .cancel_addon' : 'cancelCampaignAddOn'

    },

    updatePrice :  function(e)
    {
        e.preventDefault();
        var target_el = $(e.currentTarget);
        var quantity = $(target_el).val();
        updatePriceAndQuantity(quantity, $("#campaign-addon-content"));
        changeSaveBtnStatus(target_el, quantity);
    },
    cancelCampaignAddOn :  function(e)
    {
        e.preventDefault();
        var target_el = $(e.currentTarget);
        $(target_el).attr("disabled", "disabled");
        var el = $(target_el).closest("#campaign-addon-content");
        cancelAddOn("core/api/addon/campaign", $(target_el), function(){
        	$(".campaign_quantity", el).val("0").trigger("change");
        }, "campaigns");
    }
});

var Trigger_Addon_Events_Model_View = Base_Model_View.extend({
    events: {
        
        'change .trigger_quantity' : 'updatePrice',
        'click .cancel_addon' : 'cancelTriggerAddOn'

    },

    updatePrice :  function(e)
    {
        e.preventDefault();
        var target_el = $(e.currentTarget);
        var quantity = $(target_el).val();
        updatePriceAndQuantity(quantity, $("#trigger-addon-content"));
        changeSaveBtnStatus(target_el, quantity);
    },
    cancelTriggerAddOn :  function(e)
    {
        e.preventDefault();
        var target_el = $(e.currentTarget);
        $(target_el).attr("disabled", "disabled");
        var el = $(target_el).closest("#trigger-addon-content");
        cancelAddOn("core/api/addon/trigger", $(target_el), function(){
        	$(".trigger_quantity", el).val("0").trigger("change");
        }, "triggers");
    }
});

function updatePriceAndQuantity(quantity, el){
    $(".quantity", el).html(quantity);
    var cost = $(".cost",el).text();
    var total_cost = (cost * quantity * 12).toFixed(2);
    $(".total_cost", el).html(total_cost);
}
function cancelAddOn(url, el, callback, type){
	showAlertModal("delete_"+type+"_subscription", "confirm", function(){
		$.ajax({url : url,
			type : 'DELETE',
			success: function()
			{
				$(el).remove();
				showNotyPopUp("information", "You have successfully canceled your Add-on subscription.", "top");
				if(callback && typeof(callback == "function")){
					callback();
				}
			},error : function(data)
			{
				$(el).removeAttr("disabled");
				showNotyPopUp("warning", data.responseText, "top");
				console.log(response);
			}
		
		});
	}, function(){
        $(el).removeAttr("disabled");
    });
}

function addonsExists(){
	if(ADDON_INFO.aclInfo.quantity > 0 || ADDON_INFO.campaignInfo.quantity > 0 || ADDON_INFO.triggerInfo.quantity > 0)
		return true;
	return false;
}

function hasAddonDues(){
	if(ADDON_INFO.aclInfo.quantity > 0 && $.inArray(ADDON_INFO.aclInfo.subscriptionId, ADDON_BLOCK_REASONS) != -1)
		return true;
	if(ADDON_INFO.campaignInfo.quantity > 0 && $.inArray(ADDON_INFO.campaignInfo.subscriptionId, ADDON_BLOCK_REASONS) != -1)
		return true;
	if(ADDON_INFO.triggerInfo.quantity > 0 && $.inArray(ADDON_INFO.triggerInfo.subscriptionId, ADDON_BLOCK_REASONS) != -1)
		return true;
	return false;
}

function changeSaveBtnStatus(target, quantity){
    var btn = $(target).closest("form").find(".save");
    if(quantity == 0)
        $(btn).attr("disabled", "disabled");
    else
        $(btn).removeAttr("disabled");
}

function getAddonPriceJson(el, data){
    var price_json = {};
    price_json.plan_name = $(".panel-heading", el).text();
    price_json.duration = "Yearly";
    price_json.quantity = $(".quantity:first", el).text();
    price_json.cost = $(".cost:first", el).text();
    if(data && data.lines){
        price_json.amount_due = (data.amountDue/100).toFixed(2);
        price_json.final_amount_due = (data.amountDue/100).toFixed(2);
        
        if(data.lines.data.length > 1){
            var old_plan = data.lines.data[0];
            var new_plan = data.lines.data[1];
            price_json.period_end = new_plan.period.end;
            price_json.old_plan_amount = ((old_plan.amount * (-1))/100).toFixed(2);
            price_json.new_plan_amount = (new_plan.amount/100).toFixed(2);
            price_json.amount_due = price_json.new_plan_amount;
            price_json.final_amount_due = (price_json.new_plan_amount - price_json.old_plan_amount).toFixed(2);
        }else{
            price_json.period_end = data.lines.data[0].period.end
        }
        // Check if credit exists for fustomer
        if(data.startingBalance && data.startingBalance != 0){
            price_json.starting_balance = ((data.startingBalance/100) * (-1)).toFixed(2);
            // If credit exists dedect it from final_amount_due
            price_json.final_amount_due -= price_json.starting_balance;
            var remaining_starting_balance = price_json.starting_balance - price_json.amount_due;
            if(remaining_starting_balance > 0)
                price_json.remaining_starting_balance = remaining_starting_balance;
        }
        if(price_json.final_amount_due < 0)
                price_json.final_amount_due = 0;
    }else{
        price_json.amount_due = $(".total_cost", el).text();
        price_json.final_amount_due = price_json.amount_due;
        price_json.period_end = parseInt(new Date().setMonth(new Date().getMonth() + 12) / 1000);
    }
    return price_json;
}

function addonPaymentPreprocess(el, url){
    var btn = $(".save", el);
    var json = serializeForms(el);
    if(json == undefined){
        enable_save_button(btn);
        return;
    }
    $.ajax({
        url : url,
        type : "POST",
        dataType: "json",
        contentType : "application/json; charset=utf-8",
        data : JSON.stringify(json),
        success : function(data){
            var price_json = getAddonPriceJson(el,data);
            getTemplate("addon-show-price-model", price_json, undefined, function(template_ui){
                if(!template_ui)
                      return;
                $('#addon-show-price-modal', el).html($(template_ui)).modal('show');
                $('[data-toggle="tooltip"]', el).tooltip();
                enable_save_button(btn);
            }, null);
        },
        error : function(data){
            enable_save_button(btn);
            showNotyPopUp("warning", data.responseText, "top");
        }
    });
}