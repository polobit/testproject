(function(COMPANY_SORT_FIELDS_VIEW, $, undefined) {
	var config = null;
	COMPANY_SORT_FIELDS_VIEW.view = function ()
	{
		if(config)
			return config;

		config = company_sort_configuration.SORT_FIELDS_VIEW().extend ({
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
				
			}
		});

		return config;
	}
}(window.COMPANY_SORT_FIELDS_VIEW = window.COMPANY_SORT_FIELDS_VIEW || {}, $));