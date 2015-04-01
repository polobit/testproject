(function(deal_bulk_actions, $, undefined) {
	
	var changOwner = null;
	var archiveDeals = null;
	var restoreDeals = null;
	var deleteDeals = null;
	var filterJSON = null;
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

			if (callback && typeof (callback) === "function")
				callback(data);

			// On save back to deals list
			//Backbone.history.navigate("deals", { trigger : true });  
			App_Deals.deals();
			
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
		filterJSON = $.parseJSON(readCookie('deal-filters'));

		changeOwner.die().live('click',function(e){
			e.preventDefault();
			bulkOwnerChangeDeals();
		});
		
		archiveDeals.die().live('click',function(e){
			e.preventDefault();
			bulkArchiveDeals();
		});
		
		restoreDeals.die().live('click',function(e){
			e.preventDefault();
			bulkRestoreDeals();
		});
		
		deleteDeals.die().live('click',function(e){
			e.preventDefault();
			bulkDeleteDeals();
		});
		
		$("#deal_bulk_delete_modal,#deal_owner_change_modal,#deal_mile_change_modal,#deal_bulk_archive_modal,#deal_bulk_restore_modal").on('show',function(){
			if(deal_bulk_actions.SELECT_ALL_DEALS)
				$(this).find('span.count').text(numberWithCommas(getAvailableDeals()));
			else
				$(this).find('span.count').text(numberWithCommas(getDealsBulkIds().length));
		})
		
		$("#pipeline-list-bulk").die().live('change',function(e){
			populateMilestones($("#deal_mile_change_modal"), undefined,$(this).val(), undefined, function(data){
				$("#milestone-list-bulk").html(data);
				$("#milestone-list-bulk").closest('div').find('.loading-img').hide();
				$('#pipeline-name').val($("#pipeline-list-bulk option:selected").text());
			});
		});
		
		$('#deal-bulk-mile').die().live('click',function(e){
			e.preventDefault();
			bulkMilestoneChange($(this));
		});
		
		$('#select-all-available-deals').die().live('click',function(e){
			e.preventDefault();
			deal_bulk_actions.SELECT_ALL_DEALS = true;
			$('body').find('#bulk-select').html("Selected " + numberWithCommas(getAvailableDeals()) + " deals. <a id='select-choosen-deals' href='#'>Select choosen deals only.</a>");
		});
		
		$('#select-choosen-deals').die().live('click',function(e){
			e.preventDefault();
			deal_bulk_actions.SELECT_ALL_DEALS = false;
			$('body').find('#bulk-select').html("Selected " + numberWithCommas(App_Deals.opportunityCollectionView.collection.length) + " deals. <a id='select-all-available-deals' href='#'>Select all " + numberWithCommas(getAvailableDeals()) + " deals</a>");
		});
		
		
	};
	
	deal_bulk_actions.fillPipelineList = function(pipelines){
		var html = '<option value="">Select</option>';
		$.each(pipelines,function(index,value){
			html += '<option value="'+value.id+'" data="'+value.milestones+'">'+value.name+'</option>'
		});
		$("#deal_mile_change_modal").find("#pipeline-list-bulk").html(html);
	};

	deal_bulk_actions.toggle_deals_bulk_actions_dropdown = function(clicked_ele, isBulk, isCampaign)
	{
		
		if (!readCookie("agile_deal_view")){
			return;
		}
		
		deal_bulk_actions.SELECT_ALL_DEALS = false;
		_BULK_DEALS = undefined;
		console.log('deal bulk actions.');
		
		var total_available_deals = getAvailableDeals();

		console.log(filterJSON);
		if ($(clicked_ele).attr('checked') == 'checked')
		{
			$('body').find('#bulk-actions').css('display', 'block');

			if (isBulk && total_available_deals != App_Deals.opportunityCollectionView.collection.length)
				$('body')
						.find('#bulk-select')
						.show()
						.html(
								"Selected " + numberWithCommas(App_Deals.opportunityCollectionView.collection.length) + " deals. <a id='select-all-available-deals' href='#'>Select all " + numberWithCommas(total_available_deals) + " deals</a>");
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

