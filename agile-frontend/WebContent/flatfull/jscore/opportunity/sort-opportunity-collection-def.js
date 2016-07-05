(function(DEAL_SORT_FIELDS_VIEW, $, undefined) {
	var config = null;
	DEAL_SORT_FIELDS_VIEW.view = function ()
	{
		if(config)
			return config;

		config = contact_sort_configuration.SORT_FIELDS_VIEW().extend ({
			resetLocalStorage :function(e)
			{
				_agile_delete_prefs(this.options.sortPrefsName);
			},
			updateLocalStorage : function(sort_by)
			{
				_agile_set_prefs(this.options.sortPrefsName, sort_by);
			},
			sort_collection : function(e)
			{
				DEALS_HARD_RELOAD=true;
				if(_agile_get_prefs("agile_deal_view"))
				{
					fetchDealsList();
				}
				else
				{
					//setupDealsTracksList();
					startGettingDeals();
				}				
			}
		});

		return config;
	}
}(window.DEAL_SORT_FIELDS_VIEW = window.DEAL_SORT_FIELDS_VIEW || {}, $));