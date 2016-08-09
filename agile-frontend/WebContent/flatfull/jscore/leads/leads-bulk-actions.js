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

	return LeadsBulkActions;

})();