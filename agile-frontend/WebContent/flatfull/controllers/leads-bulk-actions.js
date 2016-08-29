var LeadsBulkActionRouter = Backbone.Router.extend({

	routes : {
		
		"lead-bulk-tags" : "addBulkTags",
		"lead-bulk-tags-remove" : "removeBulkTags",
		"lead-bulk-owner" : "bulkOwnerChange"
		
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
	}
	
});