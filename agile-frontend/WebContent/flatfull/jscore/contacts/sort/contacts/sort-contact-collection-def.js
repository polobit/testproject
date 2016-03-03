(function(CONTACT_SORT_FIELDS_VIEW, $, undefined) {
	var config = null;
	CONTACT_SORT_FIELDS_VIEW.view = function ()
	{
		if(config)
			return config;

		config = contact_sort_configuration.SORT_FIELDS_VIEW().extend ({
			resetLocalStorage :function(e)
			{
				_agile_delete_prefs('sort_by_name');
			},
			updateLocalStorage : function(sort_by)
			{
				_agile_set_prefs('sort_by_name', sort_by);
			},
			sort_collection : function(e)
			{
				CONTACTS_HARD_RELOAD=true;
					
				// If filter is not set then show view on the default contacts
				// list
				if(!App_Contacts.tag_id)
				{
					App_Contacts.contacts(undefined, undefined, undefined, true);
					return;
				}
					
				// If tag filter is applied send tags fetch url and tag_id, which is tobe shown on contacts table.
				App_Contacts.contacts(App_Contacts.tag_id, undefined, undefined, true);
			}
		});

		return config;
	}
}(window.CONTACT_SORT_FIELDS_VIEW = window.CONTACT_SORT_FIELDS_VIEW || {}, $));