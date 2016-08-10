var LeadsBulkActions = (function(){

	function LeadsBulkActions() {};

	LeadsBulkActions.prototype.SELECT_ALL_LEADS = false;
	LeadsBulkActions.prototype.BULK_LEADS = undefined;

	LeadsBulkActions.prototype.toggleLeadsBulkActions = function(clicked_ele, isBulk, isCampaign)
	{
		this.SELECT_ALL_LEADS = false;
		this.BULK_LEADS = undefined;

		var total_available_leads = this.getAvailableLeads();

		$('body').find('#bulk-select').css('display', 'none')
		if ($(clicked_ele).is(':checked'))
		{
			var resultCount = 0;
			var appCount = 0;
			var limitValue = 10000;		

			$("#bulk-action-btns button").removeClass("disabled");
			resultCount = App_Leads.leadsListView.collection.length;
			appCount = total_available_leads;

			if (isBulk && appCount != resultCount)
			{
				if(localStorage.getItem("dynamic_lead_filter") != null || localStorage.getItem("lead_filter") != null)
				{				
					if(resultCount > limitValue)
					{
						resultCount = limitValue + "+";
					}
					if(appCount > limitValue)
					{
						appCount = limitValue + "+";
					}
				}

				$('body').find('#bulk-select').css('display', 'block').html("Selected " + resultCount + " leads. <a id='select-all-available-leads' class='c-p text-info' href='#'>Select all " + appCount + " leads</a>");
				$('#bulk-select').css("display","block");
			}
		}
		else
		{
			if (isBulk)
			{
				$("#bulk-action-btns button").addClass("disabled");
				$("#leadTabelView").removeClass("disabled");
					
				return;
			}

			var check_count = 0
			$.each($('.tbody_check'), function(index, element)
			{
				if ($(element).is(':checked'))
				{
					check_count++;
					return false;
				}
			});

			if (check_count == 0)
			{
				$("#bulk-action-btns button").addClass("disabled");
			}
		}
	}

	LeadsBulkActions.prototype.getAvailableLeads = function()
	{
		if(App_Leads.leadsListView && App_Leads.leadsListView.collection && App_Leads.leadsListView.collection.length > 0)
		{
			return App_Leads.leadsListView.collection.toJSON()[0].count;
		}
		
		return 0;
	}

	LeadsBulkActions.prototype.getLeadsBulkIds = function()
	{
		var id_array = [];
		if (this.SELECT_ALL_LEADS == true)
			return id_array;

		var table = $('body').find('.showCheckboxes');

		if ($(".grid-view").length != 0)
		{
			$(table).find('.tbody_check').each(function(index, element)
			{
				// If element is checked add store it's id in an array
				if ($(element).is(':checked'))
				{
					id_array.push($(element).parent().parent().parent('div').attr('id'));
				}
			});
			return id_array;
		}

		$(table).find('tr .tbody_check').each(function(index, element)
		{
			if ($(element).is(':checked'))
			{
				id_array.push($(element).closest('tr').data().get('id'));
			}
		});
		return id_array;
	}

	LeadsBulkActions.prototype.postBulkOperationData = function(url, data, form, contentType, callback, error_message)
	{
		var that = this;
		var count = data.contact_ids.length;
		var dynamic_filter = this.getDynamicFilters();
		if (dynamic_filter != null)
		{
			data.dynamic_filter = dynamic_filter;
		}
		if (data.contact_ids && data.contact_ids.length == 0)
		{
			console.log(data.contact_ids);
			console.log(this.getSelectionCriteria());
			if (dynamic_filter == null)
			{
				url = url + "&filter=" + encodeURIComponent(this.getSelectionCriteria());
			}
			console.log(url);
		}
		else
			data.contact_ids = JSON.stringify(data.contact_ids);

		data.tracker = Math.floor(Math.random() * (10000 - 1)) + 1;
		contentType = contentType != undefined ? contentType : "application/x-www-form-urlencoded";
		
		// Ajax request to post data
		$.ajax({ url : url, type : 'POST', data : data, contentType : contentType, success : function(data)
		{

			$save_info = $('<div style="display:inline-block"><small><p class="text-success"><i>' +_agile_get_translated_val('bulk-actions','task-scheduled')+'.</i></p></small></div>');

			if (form !== undefined)
			{
				var save_msg = $(form).find('.form-actions');

				if (save_msg.find('.text-success'))
					save_msg.find('.text-success').parent().parent().remove(); 

				save_msg.append($save_info);
			}

			if (callback && typeof (callback) === "function")
				callback(data);

			Backbone.history.navigate("leads", { trigger : true });
				

			// If no_noty is given as error message, neglect noty
			if (error_message === "no_noty")
				return;

			if (!error_message)
			{
				showNotyPopUp('information', _agile_get_translated_val('bulk-actions','task-scheduled'), "top", 5000);
				return;
			}
			if(count > 20 || count == 0)
				showNotyPopUp('information', error_message, "top", 5000);

			if(url == "/core/api/bulk/update?action_type=DELETE")
			{
				$("#leads-table > tbody > tr").fadeOut(300, function() { $(this).remove(); });
				$("#bulk-delete", $("#leads-table")).find("img").remove();
				that.toggleLeadsBulkActions();
			}
		} });
	}

	LeadsBulkActions.prototype.getDynamicFilters = function()
	{
		if(!App_Leads.leadsListView || !App_Leads.leadsListView.post_data)
		{
			return null;
		}
		
		var dynamic_filter = App_Leads.leadsListView.post_data.filterJson;

		if (!dynamic_filter || dynamic_filter == null)
		{
			return null;
		}
		else
		{
			if (JSON.parse(dynamic_filter).rules.length > 0)
			{
				return dynamic_filter;
			}
			else
			{
				return null;
			}
		}
	}

	LeadsBulkActions.prototype.getSelectionCriteria = function()
	{
		var filter_id = $('.filter-criteria', $(App_Leads.leadsListView.el)).attr("_filter");;

		if (filter_id)
		{
			return filter_id;
		}
		
		return "Leads";
	}

	return LeadsBulkActions;

})();