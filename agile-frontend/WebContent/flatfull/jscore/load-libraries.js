var _agile_library_loader = {
	load_fullcalendar_libs : function(callback){
        head.js(LIB_PATH + 'lib/jquery-ui.min.js', LIB_PATH + 'lib/fullcalendar.min.js', function()
		{
			// LIB_PATH + 'lib/fullcalendar-locales/' + _LANGUAGE +'.js', 
			if(callback)
				 callback();
		});
	},
};