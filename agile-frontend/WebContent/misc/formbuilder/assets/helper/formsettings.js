define([
		'jquery', 'underscore', 'backbone'
], function($, _, Backbone)
{
	return { getSetting : function(setting)
	{
		try
		{
			var values =  saveform[0].fields[setting].value;
			for(var i=0; i<values.length; i++){
				if(values[i].selected)
					return values[i].value;
			}
		}
		catch (e)
		{
			return false;
		}
	}};
});