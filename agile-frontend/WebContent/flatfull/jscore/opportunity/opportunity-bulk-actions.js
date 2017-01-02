var RELOAD_DEALS = false;
var SELECT_ALL_DEALS = false;
var DEALS_BULK_MESSAGE = '{{agile_lng_translate "bulk-actions" "in-progress"}}';

var deal_bulk_actions = {
	
	numberWithCommas : function(num) {
	    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	},
	
	postBulkActionDealsData : function(url, form_id, callback, error_message){
		
		var input = {};
		if(!SELECT_ALL_DEALS)
			input.ids = JSON.stringify(deal_bulk_actions.getDealsBulkIds());
		input.filter = _agile_get_prefs('deal-filter-name');
		if(form_id){
			input.form = JSON.stringify(serializeForm(form_id));
		}
		console.log(input);
		// Ajax request to post data
		$.ajax({ url : url, type : 'POST', data : input, contentType : "application/x-www-form-urlencoded", success : function(data)
		{

			$save_info = $('<div style="display:inline-block"><small><p class="text-success"><i>'+_agile_get_translated_val('bulk-actions','task-scheduled')+'.</i></p></small></div>');

			if(form_id !== undefined)
			{
				var save_msg=$('#'+form_id).find('.form-actions');
			
				if(save_msg.find('.text-success'))
					save_msg.find('.text-success').parent().parent().remove(); // erase previous message.

				save_msg.append($save_info);
			}
			
			RELOAD_DEALS = true;

			if (callback && typeof (callback) === "function")
				callback(data);

			// On save back to deals list
			// Backbone.history.navigate("deals", { trigger : true });  
			//setTimeout(App_Deals.deals(),100);
			// If no_noty is given as error message, neglect noty
			if(error_message === "no_noty")
				return;
			
			if(!error_message)
				{
					showNotyPopUp('information', _agile_get_translated_val('bulk-actions','task-scheduled'), "top", 5000);
					return;
				}
				showNotyPopUp('information', error_message, "top", 5000);
		} });
	},
	
	bulkRestoreDeals : function(isACLCondition){
		var url = '/core/api/opportunity/bulk/restore';
		deal_bulk_actions.postBulkActionDealsData(url,undefined,function(){
			if(isACLCondition){
				$("#deal_bulk_restore_acl_modal").modal('hide');
			}else{
				$("#deal_bulk_restore_modal").modal('hide');
			}
		},DEALS_BULK_MESSAGE);
	},
	
	bulkArchiveDeals : function(isACLCondition){
		var url = '/core/api/opportunity/bulk/archive';
		deal_bulk_actions.postBulkActionDealsData(url,undefined,function(){
			if(isACLCondition){
				$("#deal_bulk_archive_acl_modal").modal('hide');
			}else{
				$("#deal_bulk_archive_modal").modal('hide');
			}
			
		},DEALS_BULK_MESSAGE);
	},
	
	bulkOwnerChangeDeals : function(){
		var owner_id = $("#owners-list-bulk", $("#deal_owner_change_modal")).val();
		var url = '/core/api/opportunity/bulk/change-owner/'+owner_id;
		deal_bulk_actions.postBulkActionDealsData(url,undefined,function(){
			$("#deal_owner_change_modal").modal('hide');
		},DEALS_BULK_MESSAGE);
	},
	
	bulkAddDealContactsToCamp : function(saveBtn){
		// Disables save button to prevent multiple click event issues
		disable_save_button(saveBtn);
		
		var workflow_id = $("#workflows-list-bulk", $("#deal_contact_add_camp_modal")).val();
		var url = '/core/api/opportunity/bulk/contacts/add-campaign/'+workflow_id;
		deal_bulk_actions.postBulkActionDealsData(url,undefined,function(){
			// Removes disabled attribute of save button
			enable_save_button(saveBtn);
			$("#deal_contact_add_camp_modal").modal('hide');
		},DEALS_BULK_MESSAGE);
	},
	
	bulkAddDealContactTags : function(saveBtn){
		
		// Returns, if the save button has disabled attribute
		if (saveBtn.attr('disabled'))
			return;

		// Disables save button to prevent multiple click event issues
		disable_save_button(saveBtn);//$(saveBtn).attr('disabled', 'disabled');
		
		var form = 'dealContactTagsBulkForm';
		
		var tags = serializeForm(form).tags;
		
		if(tags.length == 0)
		{
			$('#addBulkTags').focus();
			$('.error-tags').show().delay(3000).hide(1);
			// Removes disabled attribute of save button
			enable_save_button(saveBtn);//$(saveBtn).removeAttr('disabled');
			return false;
		}
		
		if (tags.length > 0)
		{
			var tags_valid = true;
			$.each(tags, function(index, value)
				{
					if(!isValidTag(value, false)) {
						tags_valid = false;
						return false;
					}
				});
			if(!tags_valid) {
				$('.invalid-tags').show().delay(6000).hide(1);
				enable_save_button(saveBtn);
				return false;
			}
			
			// To add input field value as tags
			var tag_input = $('#addBulkTags').val().trim();
			$('#addBulkTags').val("");
			
			if(tag_input && tag_input.length>=0 && !(/^\s*$/).test(tag_input))
			{
				var template = Handlebars.compile('<li class="tag" style="display: inline-block;" data="{{name}}">{{name}}<a class="close" id="remove_tag" tag="{{name}}">&times</a></li>');

			 	// Adds contact name to tags ul as li element
				$('#addBulkTags').closest(".control-group").find('ul.tags').append(template({name : tag_input}));
			}
		
			var url = '/core/api/opportunity/bulk/contacts/add-tag';
			deal_bulk_actions.postBulkActionDealsData(url,form,function(){
				enable_save_button(saveBtn);
				$('ul.tagsinput',$("#deal_contact_add_tag_modal")).html('');
				$("#deal_contact_add_tag_modal").modal('hide');
			},DEALS_BULK_MESSAGE);
		}
	},
	
	bulkDeleteDeals : function(isACLCondition){
		var url = '/core/api/opportunity/bulk';
		deal_bulk_actions.postBulkActionDealsData(url,undefined,function(){
			if(isACLCondition)
			{
				$("#deal_bulk_delete_acl_modal").modal('hide');
			}
			else
			{
				$("#deal_bulk_delete_modal").modal('hide');
			}
		},DEALS_BULK_MESSAGE);
	},
	bulkExportDeals : function(isACLCondition){
		var url = '/core/api/opportunity/exportList';
		deal_bulk_actions.postBulkActionDealsData(url,undefined,function(){
			if(isACLCondition)
			{
				$("#deal_bulk_export_acl_modal").modal('hide');
			}
			else
			{
				$("#deal_bulk_export_modal").modal('hide');
			}
		},DEALS_BULK_MESSAGE);
	},	
	bulkMilestoneChange : function(saveBtn){
		// Returns, if the save button has disabled attribute
		if (saveBtn.attr('disabled'))
			return;

		// Disables save button to prevent multiple click event issues
		disable_save_button(saveBtn);//$(saveBtn).attr('disabled', 'disabled');
		
		var form = 'bulk_mile_Form';
		if(!isValidForm('#'+form)){
			// Removes disabled attribute of save button
			enable_save_button(saveBtn);//$(saveBtn).removeAttr('disabled');
			return false;
		}
		var url = '/core/api/opportunity/bulk/change-milestone';
		deal_bulk_actions.postBulkActionDealsData(url,form,function(){
			enable_save_button(saveBtn);
			$("#deal_mile_change_modal").modal('hide');
		},DEALS_BULK_MESSAGE);
	},
	
	getAvailableDeals : function(callback) {

		if(App_Deals.opportunityCollectionView && App_Deals.opportunityCollectionView.collection.length > 0){
			var temp = 	App_Deals.opportunityCollectionView.collection.models[0].toJSON();
			if(temp.count && callback)
				return callback(temp.count);
		}

		var query = ''
		if (_agile_get_prefs('deal-filters'))
		{
			query = '&filters=' + encodeURIComponent(getDealFilters());
		}
		var dealCount = new Base_Model_View({ url : 'core/api/opportunity/based/count?pipeline_id=' + pipeline_id + query, template : "", isNew : true });

		dealCount.model.fetch({ success : function(data)
		{
			hideTransitionBar();
			var count = data.get("count") ? data.get("count") : 0;

			if(App_Deals.opportunityCollectionView.collection && App_Deals.opportunityCollectionView.collection.models[0])
			{
				App_Deals.opportunityCollectionView.collection.models[0].set({ "count" : count }, { silent : true })
			}

			if(count && callback){
				return callback(count);
			}
			if(!count && callback){
				return callback(App_Deals.opportunityCollectionView.collection.length);
			}
		} });

	},
	
	getDealsBulkIds : function(){
		var check_count = 0
		var id_array = [];
		$.each($('.tbody_check',$("#opportunity-listners")), function(index, element)
		{
			if ($(element).is(':checked'))
			{
				check_count++;
				id_array.push($(element).closest('tr').data().get('id'));
			}
			// return;
		});
		console.log('Number of deals selected = ',check_count);
		return id_array;
	},

	fillCampaignsList : function(el){
		$.ajax({
			url: 'core/api/workflows',
			type: 'GET',
			dataType: 'json',
			success: function(campaigns){
				var html = '';
				$.each(campaigns, function(index,camp){
					var option = '<option value="{{id}}">{{name}}</option></th>';
					if(camp.is_disabled){
						option = '<option value="{{id}}" disabled = disabled>{{name}} ('+_agile_get_translated_val('campaigns','disabled')+')</option>';
 					} 
					html += Handlebars.compile(option)({id : camp.id, name : camp.name});
				});
				el.html(html);
				return campaigns;
			}
		});
	},

	toggle_deals_bulk_actions_dropdown : function(clicked_ele, isBulk, isCampaign)
	{
		
		if (!_agile_get_prefs("agile_deal_view")){
			return;
		}
		
		SELECT_ALL_DEALS = false;
		_BULK_DEALS = undefined;
		console.log('deal bulk actions.');
		
		deal_bulk_actions.getAvailableDeals(function(deals_cnt){
			var total_available_deals = deals_cnt;
			if ($(clicked_ele).is(':checked'))
			{
				$('body').find('#bulk-actions').css('display', 'inline-block');
				var deals_count_with_commas = deal_bulk_actions.numberWithCommas(total_available_deals);
				if(total_available_deals > 1000)
				{
					deals_count_with_commas = deal_bulk_actions.numberWithCommas(total_available_deals - 1)+"+";
				}

				if (isBulk && total_available_deals != App_Deals.opportunityCollectionView.collection.length)
					$('body')
							.find('#bulk-select')
							.show()
							.html(
									"{{agile_lng_translate 'companies-view' 'selected'}} " + deal_bulk_actions.numberWithCommas(App_Deals.opportunityCollectionView.collection.length) + " {{agile_lng_translate 'deals' 'deals-sm'}}. <a id='select-all-available-deals' class='text-info' href='#'>{{agile_lng_translate 'portlets' 'select-all'}} " + deals_count_with_commas + " deals</a>");
			}
			else
			{
				if (isBulk)
				{
					$('#bulk-actions,#bulk-select').css('display', 'none');
					return;
				} else if($('#bulk-select').is(":visible")){
					$('#bulk-select').css('display', 'none');
				}

				var check_count = 0
				$.each($('.tbody_check'), function(index, element)
				{
					if ($(element).is(':checked'))
					{
						check_count++;
						return false;
					}
					// return;
				});

				if (check_count == 0)
				{
					$('#bulk-actions').css('display', 'none');
				}
			}
		});
	}
};

$(function(){
	$(".deal_bulk_modal").on('show.bs.modal',function(){
		var that = this;
		deal_bulk_actions.getAvailableDeals(function(deals_cnt){
			var total_available_deals = deals_cnt;
			var deals_count_with_commas = deal_bulk_actions.numberWithCommas(total_available_deals);
			if(total_available_deals > 1000)
			{
				deals_count_with_commas = deal_bulk_actions.numberWithCommas(total_available_deals - 1)+"+";
			}
			if(SELECT_ALL_DEALS)
				$(that).find('span.count').text(deals_count_with_commas);
			else
				$(that).find('span.count').text(deal_bulk_actions.numberWithCommas(deal_bulk_actions.getDealsBulkIds().length));
			
			RELOAD_DEALS = false;
		});
	});
	
	$(".deal_bulk_modal").on('hidden.bs.modal', function (e) {
		if(RELOAD_DEALS){
			fetchDealsList();
		}
		
		$(this).find('.help-line').remove();
	});
});

function getSelectedDealsCount(callback)
{
	deal_bulk_actions.getAvailableDeals(function(deals_cnt){
		var total_available_deals = deals_cnt;
		var deals_count_with_commas = deal_bulk_actions.numberWithCommas(total_available_deals);
		if(total_available_deals > 1000)
		{
			deals_count_with_commas = deal_bulk_actions.numberWithCommas(total_available_deals - 1)+"+";
		}

		RELOAD_DEALS = false;

		var count = 0;
		if(SELECT_ALL_DEALS)
		{
			count = deals_count_with_commas;
		}
		else
		{
			count = deal_bulk_actions.numberWithCommas(deal_bulk_actions.getDealsBulkIds().length);
		}
		if(callback && typeof callback == "function")
		{
			return callback(count);
		}
	});
}
