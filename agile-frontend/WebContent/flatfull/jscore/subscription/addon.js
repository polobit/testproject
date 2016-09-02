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
    },
    cancelAclAddOn :  function(e)
    {
        e.preventDefault();
        var target_el = $(e.currentTarget);
        $(target_el).attr("disabled", "disabled");
        var el = $(target_el).closest("#acl-addon-content");
        cancelAddOn("core/api/addon/acl", $(target_el), function(){
        	$(".multiple-checkbox", el).find("input").removeAttr("checked").trigger("change");
        });
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
    },
    cancelCampaignAddOn :  function(e)
    {
        e.preventDefault();
        var target_el = $(e.currentTarget);
        $(target_el).attr("disabled", "disabled");
        var el = $(target_el).closest("#campaign-addon-content");
        cancelAddOn("core/api/addon/campaign", $(target_el), function(){
        	$(".campaign_quantity", el).val("0").trigger("change");
        });
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
    },
    cancelTriggerAddOn :  function(e)
    {
        e.preventDefault();
        var target_el = $(e.currentTarget);
        $(target_el).attr("disabled", "disabled");
        var el = $(target_el).closest("#trigger-addon-content");
        cancelAddOn("core/api/addon/trigger", $(target_el), function(){
        	$(".trigger_quantity", el).val("0").trigger("change");
        });
    }
});

function updatePriceAndQuantity(quantity, el){
    $(".quantity", el).html(quantity);
    var cost = $(".cost",el).text();
    var total_cost = (cost * quantity).toFixed(2);
    $(".total_cost", el).html(total_cost);
}
function cancelAddOn(url, el, callback){
	showAlertModal("delete_subscription", "confirm", function(){
		$.ajax({url : url,
			type : 'DELETE',
			success: function()
			{
				$(el).remove();
				showNotyPopUp("information", "Your plan has been deleted successfully", "top");
				if(callback && typeof(callback == "function")){
					callback();
				}
			},error : function(data)
			{
				$(el).removeAttr("disabled");
				showNotyPopUp("information", data.responseText, "top");
				console.log(response);
			}
		
		});
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