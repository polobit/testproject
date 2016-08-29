(function(LEAD_SORT_FIELDS_VIEW, $, undefined) {
	var config = null;
	LEAD_SORT_FIELDS_VIEW.view = function ()
	{
		if(config)
			return config;

		config = contact_sort_configuration.SORT_FIELDS_VIEW().extend ({
			resetLocalStorage :function(e)
			{
				_agile_delete_prefs('lead_sort_field');
			},
			updateLocalStorage : function(sort_by)
			{
				_agile_set_prefs('lead_sort_field', sort_by);
			},
			sort_collection : function(e)
			{
				LEADS_HARD_RELOAD=true;
					
				// If filter is not set then show view on the default contacts
				// list
				if(!App_Leads.tag_id)
				{
					App_Leads.leadsViewLoader.getLeads(App_Leads.leadViewModel, $("#content"));
					return;
				}
					
				// If tag filter is applied send tags fetch url and tag_id, which is tobe shown on contacts table.
				App_Leads.leadsViewLoader.getLeads(App_Leads.leadViewModel, $("#content"));
			}
		});

		return config;
	}
}(window.LEAD_SORT_FIELDS_VIEW = window.LEAD_SORT_FIELDS_VIEW || {}, $));