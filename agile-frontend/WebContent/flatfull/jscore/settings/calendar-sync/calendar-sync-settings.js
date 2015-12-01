var Calendar_Sync_Settings_View = Base_Model_View.extend({
	events : {
		'click .save' : "save_calendar_prefs"
	},

	save_calendar_prefs : function (e)
	{
		e.preventDefault();
		alert("saving");
		this.options.prePersist = this.prePersist;
		this.save(e);
	},
	prePersist : function(data)
	{
		if(!data || !data.prefs)
			return;

		data.prefs = JSON.stringify(data.prefs);
		console.log(data);
	},
	show_loading : function(el)
	{

	}

});