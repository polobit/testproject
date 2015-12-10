var Calendar_Sync_Settings_View = Base_Model_View.extend({
	events : {
		'click .save' : "save_calendar_prefs",
		'click .delete' : "delete_calendar_prefs",
	},

	save_calendar_prefs : function (e, data)
	{
		e.preventDefault();

		this.options.prePersist = this.prePersist;

		this.save(e);
	},
	delete_calendar_prefs : function(e, data)
	{
		e.preventDefault();
		var _that = this;
		this.model.destroy({success: function(){
			_that.model.clear();
			//_that.render(true);	
		}});
		
	},
	prePersist : function(data)
	{
		if(!data || !data.get("prefs"))
			return;

		data.set("prefs", JSON.stringify(data.get("prefs")), {silent: true});
		console.log(data);
	},
	show_loading : function(el)
	{
		this.model.destroy();
	}	


});