(function(deal_bulk_actions, $, undefined) {
	
	var changOwner = null;
	var archiveDeals = null;
	var restoreDeals = null;
	var deleteDeals = null;
	var dealConAddTag = null;
	var dealConAddCamp = null;
	var filterJSON = null;
	
	var reload_deals = false;
	deal_bulk_actions.SELECT_ALL_DEALS = false;
	var message = 'Bulk operation is in progress. You will be notified when it is done.';
	var el = null;
	
	var numberWithCommas = function(num) {
	    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	
	var postBulkActionDealsData = function(url, form_id, callback, error_message){
		
		var input = {};
		if(!deal_bulk_actions.SELECT_ALL_DEALS)
			input.ids = JSON.stringify(getDealsBulkIds());
		input.filter = JSON.stringify(filterJSON);
		if(form_id){
			input.form = JSON.stringify(serializeForm(form_id));
		}
		console.log(input);
		// Ajax request to post data
		$.ajax({ url : url, type : 'POST', data : input, contentType : "application/x-www-form-urlencoded", success : function(data)
		{

			$save_info = $('<div style="display:inline-block"><small><p class="text-success"><i>Task Scheduled.</i></p></small></div>');

			if(form_id !== undefined)
			{
				var save_msg=$('#'+form_id).find('.form-actions');
			
				if(save_msg.find('.text-success'))
					save_msg.find('.text-success').parent().parent().remove(); // erase previous message.

				save_msg.append($save_info);
			}
			
			reload_deals = true;

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
					showNotyPopUp('information', "Task scheduled", "top", 5000);
					return;
				}
				showNotyPopUp('information', error_message, "top", 5000);
		} });
	}
	
	var bulkRestoreDeals = function(){
		console.log('restore',getDealsBulkIds());
		console.log('archive',getDealsBulkIds());
		var url = '/core/api/opportunity/bulk/restore';
		postBulkActionDealsData(url,undefined,function(){
			$("#deal_bulk_restore_modal").modal('hide');
		},message);
	};
	
	var bulkArchiveDeals = function(){
		console.log('archive',getDealsBulkIds());
		var url = '/core/api/opportunity/bulk/archive';
		postBulkActionDealsData(url,undefined,function(){
			$("#deal_bulk_archive_modal").modal('hide');
		},message);
	};
	
	var bulkOwnerChangeDeals = function(){
		console.log('change owner',getDealsBulkIds());
		console.log('archive',getDealsBulkIds());
		var owner_id = $("#owners-list-bulk", $("#deal_owner_change_modal")).val();
		var url = '/core/api/opportunity/bulk/change-owner/'+owner_id;
		postBulkActionDealsData(url,undefined,function(){
			$("#deal_owner_change_modal").modal('hide');
		},message);
	};
	
	var bulkAddDealContactsToCamp = function(saveBtn){
		// Disables save button to prevent multiple click event issues
		disable_save_button(saveBtn);
		
		var workflow_id = $("#workflows-list-bulk", $("#deal_contact_add_camp_modal")).val();
		var url = '/core/api/opportunity/bulk/contacts/add-campaign/'+workflow_id;
		postBulkActionDealsData(url,undefined,function(){
			// Removes disabled attribute of save button
			enable_save_button(saveBtn);
			$("#deal_contact_add_camp_modal").modal('hide');
		},message);
	};
	
	var bulkAddDealContactTags = function(saveBtn){
		
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
			postBulkActionDealsData(url,form,function(){
				enable_save_button(saveBtn);
				$('ul.tagsinput',$("#deal_contact_add_tag_modal")).html('');
				$("#deal_contact_add_tag_modal").modal('hide');
			},message);
		}
	};
	
	var bulkDeleteDeals = function(){
		console.log('Delete',getDealsBulkIds());
		var url = '/core/api/opportunity/bulk';
		postBulkActionDealsData(url,undefined,function(){
			$("#deal_bulk_delete_modal").modal('hide');
		},message);
	};
	
	var bulkMilestoneChange = function(saveBtn){
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
		postBulkActionDealsData(url,form,function(){
			enable_save_button(saveBtn);
			$("#deal_mile_change_modal").modal('hide');
		},message);
	};
	
	var getAvailableDeals = function() {
		if(App_Deals.opportunityCollectionView && App_Deals.opportunityCollectionView.collection.length > 0){
			var temp = 	App_Deals.opportunityCollectionView.collection.models[0].toJSON();
			if(temp.count)
				return temp.count;
		}
		return App_Deals.opportunityCollectionView.collection.length;
	};
	
	var getDealsBulkIds = function(){
		var check_count = 0
		var id_array = [];
		$.each($('.tbody_check',el), function(index, element)
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
	};
	
	
	deal_bulk_actions.init_dom = function(ele){
		el = ele;
		changeOwner = $('#deal-bulk-owner');
		archiveDeals = $('#deal-bulk-archive');
		restoreDeals = $('#deal-bulk-restore');
		deleteDeals = $('#deal-bulk-delete');
		dealConAddTag = $('#deal-contact-add-tag');
		dealConAddCamp = $('#deal-contact-add-camp');
		bulkChangeToMilestones = $('#bulk_deals_milestone_change');
		bulkArchive = $('#bulk_deals_archive');
		bulkRestore = $('#bulk_deals_restore');
		filterJSON = $.parseJSON(_agile_get_prefs('deal-filters'));
		
		changeOwner.on('click',function(e){
			e.preventDefault();
			bulkOwnerChangeDeals();
		});
		
		archiveDeals.on('click',function(e){
			e.preventDefault();
			bulkArchiveDeals();
		});
		
		restoreDeals.on('click',function(e){
			e.preventDefault();
			bulkRestoreDeals();
		});
		
		deleteDeals.on('click',function(e){
			e.preventDefault();
			bulkDeleteDeals();
		});
		
		dealConAddTag.on('click',function(e){
			e.preventDefault();
			bulkAddDealContactTags($(this));
		});
		
		dealConAddCamp.on('click',function(e){
			e.preventDefault();
			bulkAddDealContactsToCamp($(this));
		});

		bulkChangeToMilestones.on('click',function(e){
			e.preventDefault();
			if(!hasScope("MANAGE_DEALS") && hasScope("VIEW_DEALS"))
			{
				showModalConfirmation("Bulk Update", 
						"You may not have permission to update some of the deals selected. Proceeding with this operation will update only the deals that you are permitted to update.<br/><br/> Do you want to proceed?", 
						function (){
							$('#deal_mile_change_modal').modal('show');
						});
			}else
			{
				$('#deal_mile_change_modal').modal('show');
			}
		});

		bulkArchive.on('click',function(e){
			e.preventDefault();
			if(!hasScope("MANAGE_DEALS") && hasScope("VIEW_DEALS"))
			{
				showModalConfirmation("Bulk Update", 
						"You may not have permission to archive some of the deals selected. Proceeding with this operation will archive only the deals that you are permitted to update.<br/><br/> Do you want to proceed?", 
						function (){
							$('#deal_bulk_archive_modal').modal('show');
						});
			}else
			{
				$('#deal_bulk_archive_modal').modal('show');
			}
		});

		bulkRestore.on('click',function(e){
			e.preventDefault();
			if(!hasScope("MANAGE_DEALS") && hasScope("VIEW_DEALS"))
			{
				showModalConfirmation("Bulk Update", 
						"You may not have permission to restore some of the deals selected. Proceeding with this operation will restore only the deals that you are permitted to update.<br/><br/> Do you want to proceed?", 
						function (){
							$('#deal_bulk_restore_modal').modal('show');
						});
			}else
			{
				$('#deal_bulk_restore_modal').modal('show');
			}
		});
		
		$('body').on('change', '#pipeline-list-bulk', function(e) {
			populateMilestones($("#deal_mile_change_modal"), undefined,$(this).val(), undefined, function(data){
				$("#milestone-list-bulk").html(data);
				$("#milestone-list-bulk").closest('div').find('.loading-img').hide();
				$('#pipeline-name').val($("#pipeline-list-bulk option:selected").text());
			});
		});
		
		$('body').on('click', '#deal-bulk-mile', function(e) {
			e.preventDefault();
			bulkMilestoneChange($(this));
		});
		
		$('body').on('click', '#select-all-available-deals', function(e) {
			e.preventDefault();
			deal_bulk_actions.SELECT_ALL_DEALS = true;
			$('body').find('#bulk-select').html("Selected " + numberWithCommas(getAvailableDeals()) + " deals. <a id='select-choosen-deals' href='#'>Select choosen deals only.</a>");
		});
		
		$('body').on('click', '#select-choosen-deals', function(e) {
			e.preventDefault();
			deal_bulk_actions.SELECT_ALL_DEALS = false;
			$('body').find('#bulk-select').html("Selected " + numberWithCommas(App_Deals.opportunityCollectionView.collection.length) + " deals. <a id='select-all-available-deals' class='text-info' href='#'>Select all " + numberWithCommas(getAvailableDeals()) + " deals</a>");
		});
		
		$(".deal_bulk_modal").on('show.bs.modal',function(){
			if(deal_bulk_actions.SELECT_ALL_DEALS)
				$(this).find('span.count').text(numberWithCommas(getAvailableDeals()));
			else
				$(this).find('span.count').text(numberWithCommas(getDealsBulkIds().length));
			
			reload_deals = false;
		})
		
		$(".deal_bulk_modal").on('hidden.bs.modal', function (e) {
			  // do something...
			if(reload_deals)
				App_Deals.deals();
			
			$(this).find('.help-line').remove();
		});
		
		// Initialize the add tag dialog box ui.
		setup_tags_typeahead();
		deal_bulk_actions.fillCampaignsList($('#workflows-list-bulk',el));
		
	};
	
	deal_bulk_actions.fillCampaignsList = function(el){
		$.ajax({
			url: 'core/api/workflows',
			type: 'GET',
			dataType: 'json',
			success: function(campaigns){
				var html = '';
				$.each(campaigns, function(index,camp){
					var option = '<option value="{{id}}">{{name}}</option></th>';
					if(camp.is_disabled){
						option = '<option value="{{id}}" disabled = disabled>{{name}} (Disabled)</option>';
 					} 
					html += Handlebars.compile(option)({id : camp.id, name : camp.name});
				});
				el.html(html);
				return campaigns;
			}
		});
	};
	
	deal_bulk_actions.fillPipelineList = function(pipelines){
		var html = '<option value="">Select</option>';
		$.each(pipelines,function(index,value){
			var option = '<option value="{{id}}" data="{{milestones}}">{{name}}</option>';
			html += Handlebars.compile(option)({id : value.id, milestones : value.milestones, name : value.name});
		});
		$("#deal_mile_change_modal").find("#pipeline-list-bulk").html(html);
	};

	deal_bulk_actions.toggle_deals_bulk_actions_dropdown = function(clicked_ele, isBulk, isCampaign)
	{
		
		if (!_agile_get_prefs("agile_deal_view")){
			return;
		}
		
		deal_bulk_actions.SELECT_ALL_DEALS = false;
		_BULK_DEALS = undefined;
		console.log('deal bulk actions.');
		
		var total_available_deals = getAvailableDeals();

		console.log(filterJSON);
		if ($(clicked_ele).is(':checked'))
		{
			$('body').find('#bulk-actions').css('display', 'inline-block');

			if (isBulk && total_available_deals != App_Deals.opportunityCollectionView.collection.length)
				$('body')
						.find('#bulk-select')
						.show()
						.html(
								"Selected " + numberWithCommas(App_Deals.opportunityCollectionView.collection.length) + " deals. <a id='select-all-available-deals' class='text-info' href='#'>Select all " + numberWithCommas(total_available_deals) + " deals</a>");
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
		
	};
	
}(window.deal_bulk_actions = window.deal_bulk_actions || {}, $));

