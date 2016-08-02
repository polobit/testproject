var Calendar_Sync_Settings_View = Base_Model_View.extend({
	events : {
		'click .save' : "save_calendar_prefs",
		'click .delete' : "delete_calendar_prefs",
	},
	options :{
		errorCallback : function(data){							
			$('.tab-content').removeClass('c-progress');		
			showNotyPopUp("error", "Invalid Details", "bottomRight", 1000);
		}
	},
	save_calendar_prefs : function (e, data)
	{
		e.preventDefault();
		$('.tab-content').addClass('c-progress');
		this.options.prePersist = this.prePersist;
		this.options.saveCallback = this.saveCallback;
		this.save(e);
	},
	saveCallback : function(data)
	{		
		App_Datasync.dataSync();
		Backbone.history.navigate('sync');
		$('.tab-content').removeClass('c-progress');
	},
	delete_calendar_prefs : function(e, data)
	{
		e.preventDefault();
		var _that = this;
		showAlertModal("delete_calendar_prefs", "confirm", function(){
			if(_that.model.get("calendar_type") == "OFFICE365"){


			_that.model.destroy({success: function(){			
				_that.model.clear();
				//_that.render(true);				
			}});
				var eventFilters = JSON.parse(_agile_get_prefs('event-lhs-filters'));
				if(eventFilters){
				var userBasedFilter = eventFilters[CURRENT_AGILE_USER.id];

				if(userBasedFilter){
					eventFilters = userBasedFilter;
				}

				var filtterList = eventFilters.cal_type;
				if(filtterList){
				var indexOf = filtterList.indexOf("office");
				
				if( indexOf >= 0){
					var calendarItem = "office" ;
			        var removeItem = "light";
			        eventFilters.cal_type = $.grep(filtterList, function(value){
			         return value != calendarItem;
			       });

			        var eventData = JSON.parse(_agile_get_prefs('event-lhs-filters'));	
					eventData[CURRENT_AGILE_USER.id] = eventFilters;

					/*
					 * if (event_list_type) json_obj.event_type = event_list_type;
					 */
					_agile_set_prefs('event-lhs-filters', JSON.stringify(eventData));
					}		        
				}
			}
			}

		});
		
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