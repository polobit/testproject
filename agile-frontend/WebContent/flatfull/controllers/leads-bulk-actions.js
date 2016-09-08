var LeadsBulkActionRouter = Backbone.Router.extend({

	routes : {
		
		"lead-bulk-tags" : "addBulkTags",
		"lead-bulk-tags-remove" : "removeBulkTags",
		"lead-bulk-owner" : "bulkOwnerChange",
		"lead-bulk-email" : "bulkEmailsSend"
		
	},

	/**
	 * Loads the tags template to add tags to the selected leads
	 */
	addBulkTags : function()
	{
		// On reloading redirecting to leads list
		if (!App_Leads.leadsListView)
		{
			Backbone.history.navigate("leads", { trigger : true });
		}
		else
		{
			var addBulkTagsView = new Leads_Bulk_Action_Events_View({ data : {}, template : "bulk-actions-leads-tags", isNew : true,
				postRenderCallback : function(el)
				{
					setup_tags_typeahead(undefined, el);
				} 
			});
			$('#content').html(addBulkTagsView.render().el);
		}
	},

	/**
	 * Loads the tags template to remove tags to the selected leads
	 */
	removeBulkTags : function()
	{
		// On reloading redirecting to leads list
		if (!App_Leads.leadsListView)
		{
			Backbone.history.navigate("leads", { trigger : true });
		}
		else
		{
			var removeBulkTagsView = new Leads_Bulk_Action_Events_View({ data : {}, template : "bulk-actions-leads-tags-remove", isNew : true,
				postRenderCallback : function(el)
				{
					setup_tags_typeahead(undefined, el);
				} 
			});
			$('#content').html(removeBulkTagsView.render().el);
		}
	},

	bulkOwnerChange : function(e)
	{
		// On reloading redirecting to leads list
		if (!App_Leads.leadsListView)
		{
			Backbone.history.navigate("leads", { trigger : true });
		}
		else
		{
			var bulkOwnerChangeView = new Leads_Bulk_Action_Events_View({ data : {}, template : "bulk-actions-lead-owner", isNew : true,
				postRenderCallback : function(el)
				{
					var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
					fillSelect('ownerBulkSelect', '/core/api/users/partial', 'domainUsers', 'no-callback ', optionsTemplate, undefined, el);
				} 
			});
			$('#content').html(bulkOwnerChangeView.render().el);
		}
	},

	bulkEmailsSend : function(e)
	{
		// On reloading redirecting to leads list
		if (!App_Leads.leadsListView)
		{
			Backbone.history.navigate("leads", { trigger : true });
			return;
		}
		
		var bulkEmailsSendView = new Leads_Bulk_Action_Events_View({ data : {}, template : "send-email", isNew : true,
			postRenderCallback : function(el)
			{
				$("#emailForm").find('.add-attachment-select').hide();
			} 
		});
		$('#content').html(bulkEmailsSendView.render().el);

		var options = {};
		options[_agile_get_translated_val('others','add-new')] = "verify_email";

		fetchAndFillSelect(
			'core/api/account-prefs/verified-emails/all',
			"email",
			"email",
			undefined,
			options,
			$('#from_email'),
			"prepend",
			function($select, data) {
				if($select.find('option').size()===1)
				{
					$select.find("option:first").before("<option value='NOEMAIL'>- No Verified Email -</option>");
					$select.find('option[value ="NOEMAIL"]').attr("selected", "selected");
				}
				else
				{
					var ownerEmail = $select.find('option[value = \"'+CURRENT_DOMAIN_USER.email+'\"]').val();
					if(typeof(ownerEmail) !== "undefined")
						$select.find('option[value = \"'+CURRENT_DOMAIN_USER.email+'\"]').attr("selected", "selected");
					else
					{
						$select.find("option:first").before("<option value='SELECTEMAIL'>- Select one Email -</option>");
						$select.find('option[value ="SELECTEMAIL"]').attr("selected", "selected");	
					}	
				}	
				rearrange_from_email_options($select, data);
			});
	}
	
});