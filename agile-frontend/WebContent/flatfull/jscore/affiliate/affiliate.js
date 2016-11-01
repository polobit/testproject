function checkForAffiliateDetails(callback1, callback2){
	if(AFFILIATE_DETAILS){
		callback1();
		return;
	}
	$.ajax({ url : 'core/api/affiliate_details', type : 'GET', success : function(data)
		{
			if(data && data.id){
				AFFILIATE_DETAILS = data;
				callback1();
			}
			else
				callback2();
		}});
}

function getTimeFromDatePicker(){
	var range = $('#range').html().split("-");
    
	    var start_time = getUTCMidNightEpochFromDate(new Date(range[0]));
	    var d = new Date();
	    start_time=start_time+(d.getTimezoneOffset()*60*1000);
	    start_time=start_time/1000;
	    var end_value = $.trim(range[1]);

	    // To make end value as end time of day
	    if (end_value)
	        end_value = end_value + " 23:59:59";

	    // Returns milliseconds from end date.
	    //var end_time = Date.parse(end_value).valueOf();
	    //Get the GMT end time
	    var status = $('#status').find('option:selected').val();
	    var end_time = getUTCMidNightEpochFromDate(new Date(end_value));

	    end_time += (((23*60*60)+(59*60)+59)*1000);
	    end_time=end_time+(d.getTimezoneOffset()*60*1000);
	    end_time=end_time/1000;
	    var time = {"start":start_time, "end":end_time};
	    return time;
}

function showCommission(userId, time, el){
	getCommission(userId, time, function(data){
		$("#aff-count", el).html(data.count);
		$("#aff-commission", el).html((data.commission/100).toFixed(2));
	});
}

function getCommission(userId, time, callback){
	var url = 'core/api/affiliate/total?startTime='+time.start+'&endTime='+time.end;
	if(CURRENT_DOMAIN_USER.domain == "admin"){
		url = url + '&domain='+admin_affiliate_domain;
	}
	if(userId)
		url = url + '&userId='+userId;
	$.ajax({ url : url, type : 'GET', success : function(data)
		{
			if(callback && typeof(callback == "function"))
				callback(data);
		}});
}

$(document).ready(function(){
	$("#register_deal_modal").on("click","#deal_register_validate", function(e){
		e.preventDefault();
		var modal_id = $(this).closest('.modal').attr("id");
		var form_id = $(this).closest('.modal').find('form').attr("id");
		var json = serializeForm(form_id);
		registerDeal(form_id, modal_id, $(this), json);
	});
});

function registerDeal(formId, modalId, saveBtn, json)
{
	// Returns, if the save button has disabled attribute
	if ($(saveBtn).attr('disabled'))
		return;

	// Disables save button to prevent multiple click event issues
	disable_save_button($(saveBtn));

	if (!isValidForm('#' + formId))
	{
		enable_save_button($(saveBtn));
		// Removes disabled attribute of save
		// button
		return false;
	}

	var newEntry = false; // test if this model is new, true => new model
	if (json.id === undefined)
		newEntry = true;

	var newRegisterDeal = new Backbone.Model();
	newRegisterDeal.url = 'core/api/affiliate/deals';
	newRegisterDeal.save(json, { success : function(data)
	{
		// Removes disabled attribute of save button
		enable_save_button($(saveBtn));// $(saveBtn).removeAttr('disabled');

		// $('#' + modalId).find('span.save-status img').remove();
		$('#' + modalId).modal('hide');

		var registeredDeal = data.toJSON();

		add_recent_view(new BaseModel(registeredDeal));

			// On cases page.. adjust current model
			if (newEntry == true)
				App_Affiliate.registeredDealsCollectionView.collection.add(data);
			else
			{
				App_Affiliate.registeredDealsCollectionView.collection.remove(json);
				App_Affiliate.registeredDealsCollectionView.collection.add(data);
			}
			App_Affiliate.registeredDealsCollectionView.render(true);
	}, error : function(data, response)
	{
		enable_save_button($(saveBtn));
	} });
}

function loadAdminAffiliateDetailListeners(){
	$("#admin-affiliate-detail-container").on("click", "ul#affiliate_filter_list li a", function(e)
	{
		e.preventDefault();
		var name = $(this).html();
		var filter_key = $(this).attr("data");
		_agile_set_prefs(CURRENT_DOMAIN_USER.domain+"affiliate_details_filter", filter_key);
		$(this).closest(".btn-group").find("#affiliate_filter_btn").text(name);
		$(this).closest(".btn-group").find("#affiliate_filter_btn").attr("data", filter_key);
		var data = getAdminAffiliateFilterParameters();
		App_Affiliate.showAffiliateDetailCollection(data);
	});
}

function getAdminAffiliateFilterParameters(){
	var time = getTimeFromDatePicker();
	var filter_by = $("#affiliate_filter_btn").attr("data");
	var data={"startTime":time.start,"endTime":time.end,"filter_by":filter_by};
	return data;
}

var admin_affiliate_id;
var admin_affiliate_domain;
var Admin_Affiliate_Detail_Collection_View = Base_Collection_View.extend({
    events: {
    	'click #admin-affiliate-detail-model-list > tr' : 'listAffiliatesInAdminPanel'
    },
    
    listAffiliatesInAdminPanel : function(e){
		var targetEle= $(e.currentTarget);
		admin_affiliate_id = $(targetEle).find("td:first").attr("data");
		admin_affiliate_domain = $(targetEle).find("td:first").attr("domain");
		window.location.href='#admin-affiliate-referrals';
    }
});

function setAffiliateDetailsFilter(){
	var filterJson = {"createdTime":"Created Time","lastAffiliateAddedTime":"Last Affiliate Added Time"};
	var filter_key = _agile_get_prefs(CURRENT_DOMAIN_USER.domain+"affiliate_details_filter");
	if(filter_key == null || filter_key == undefined){
		filter_key = "createdTime";
		_agile_set_prefs(CURRENT_DOMAIN_USER.domain+"affiliate_details_filter", filter_key);
	}
	$("#affiliate_filter_btn").attr("data",filter).html(filterJson[filter_key]);
}


