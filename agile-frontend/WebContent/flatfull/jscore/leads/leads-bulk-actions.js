/*
 * Creates a class with necessary functions 
 * to perform leads bulk action operations.
 *
 * @module Leads
 */
var LeadsBulkActions = (function(){

	function LeadsBulkActions() {};

	LeadsBulkActions.prototype.SELECT_ALL_LEADS = false;
	LeadsBulkActions.prototype.BULK_LEADS = undefined;

	/*
	 * To enable/disable bulk actions like add tags, remove tags etc...
	 * and enable/disable selection criteria.
	 *
	 * @param {Element} clicked_ele - represents the current element
	 * @param {Boolean} isBulk - represents all leads are selected or not
	 * @param {Boolean} isCampaign
	 */
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

	/*
	 * To get available leads count
	 *
	 * @return leads count
	 */
	LeadsBulkActions.prototype.getAvailableLeads = function()
	{
		if(App_Leads.leadsListView && App_Leads.leadsListView.collection && App_Leads.leadsListView.collection.length > 0)
		{
			return App_Leads.leadsListView.collection.toJSON()[0].count;
		}
		
		return 0;
	}

	/*
	 * To get selected lead ids, if all leads are not selected
	 *
	 * @return {JSONArray} id_array
	 */
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

	/*
	 * Creates a bulk operation request and send
	 * it to back end.
	 *
	 * @param {String} url - url to send request
	 * @param {Object} data - data to send back end contains filter information or ids
	 * @param {String} form - bulk action form id
	 * @param {String} contentType - represents content type
	 * @param {Function} callback - callback function
	 * @param {String} error_message - to show the error message, if any
	 */
	LeadsBulkActions.prototype.postBulkOperationData = function(url, data, form, contentType, callback, error_message)
	{
		var id_array = data.contact_ids;
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

		if(url && url.indexOf("/core/api/contacts/delete?action=DELETE") == 0)
		{
			data.ids = data.contact_ids;
		}

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

			if(url && url.indexOf("/core/api/contacts/delete?action=DELETE") == 0)
			{
				var $trEle = $("#leads-table > tbody > tr");
				if(id_array && id_array.length > 0)
				{
					for(var i=0;i<id_array.length;i++)
					{
						App_Leads.leadsListView.collection.remove(id_array[i]);
						$trEle.find("td[data="+id_array[i]+"]:first").parent().fadeOut(300, function() { $(this).remove(); });
					}
				}
				else
				{
					$trEle.each(function(){
						$(this).fadeOut(300, function() { $(this).remove(); });
					});
				}
				$("#bulk-delete", $("#bulk-action-btns")).find("img").remove();
				if($(".thead_check").is(":checked"))
				{
					$(".thead_check").trigger("click");
				}
				else
				{
					$("#bulk-action-btns button").addClass("disabled");
				}
				
				$('body').find('#bulk-select').css('display', 'none');

				if((App_Leads.leadsListView.collection.models.length > 0 && !App_Leads.leadsListView.collection.models[0].get("count")) || App_Leads.leadsListView.collection.models.length == 0)
				{
					// Call to get Count 
					getAndUpdateCollectionCount("leads", $("#content"));					
				}
				else
				{
					App_Leads.leadsViewLoader.setUpLeadsCount($("#content"));
				}
			}
		} });
	}

	/*
	 * Get lhs filters data as JSON string. It will help
	 * to perform bulk action based on lhs filters, if any.
	 *
	 * @return {String} dynamic_filter
	 */
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

	/*
	 * Get the applied static filter id to perform 
	 * bulk action based on static filter.
	 *
	 * @return {String} filter_id
	 */
	LeadsBulkActions.prototype.getSelectionCriteria = function()
	{
		var filter_id = $('.filter-criteria', $(App_Leads.leadsListView.el)).attr("_filter");;

		if (filter_id)
		{
			return filter_id;
		}
		
		return "Leads";
	}

	/*
	 * To show send email form with selected leads.
	 *
	 * @param {JSONArray} id_arry - lead ids to perform bulk action as array
	 */
	LeadsBulkActions.prototype.showBulkEmailForm = function(id_array)
	{
		var count = 0;
		if(id_array && id_array.length == 0)
		{
			id_array = this.getLeadsBulkIds();
		}
		Backbone.history.navigate("lead-bulk-email", { trigger : true });
		this.fillEmails(id_array);
	}

	/*
	 * To fill verified emails list in send email form.
	 *
	 * @param {JSONArray} id_arry - lead ids to perform bulk action as array
	 */
	LeadsBulkActions.prototype.fillEmails = function(id_array)
	{
		var $emailForm = $('#emailForm');

		// Populate from address and templates
		populate_send_email_details();

		// Setup HTML Editor
		setupTinyMCEEditor('textarea#email-body', false, undefined, function()
		{
			// Reset tinymce content
			set_tinymce_content('email-body', '');
		});

		// when SELECT_ALL is true i.e., all contacts are selected.
		if (id_array.length === 0)
			count = this.getAvailableLeads();
		else
			count = id_array.length;

		// Shows selected contacts count in Send-email page.
		$emailForm.find('div#bulk-count').css('display', 'inline-block');
		
		$emailForm.find('div#bulk-count p').html(_agile_get_translated_val('companies-view','selected') + " <b>" + count + "{{agile_lng_translate 'leads-view' 'leads'}}" + " </b> " + _agile_get_translated_val('companies-view','for-sending-email'));

		// Hide to,cc and bcc
		$emailForm.find('input[name="to"]').closest('.control-group').attr('class', 'hidden');
		$emailForm.find('a#cc-link').closest('.control-group').attr('class', 'hidden');

		// Change ids of Send and Close button, to avoid normal send-email
		// actions.
		$emailForm.find('.form-actions a#sendEmail').removeAttr('id').attr('id', 'bulk-send-email');
	}

	return LeadsBulkActions;

})();