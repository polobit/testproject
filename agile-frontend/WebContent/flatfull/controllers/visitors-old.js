var VisitorsRouter = Backbone.Router.extend({

routes : { "visitors-old" : "loadGmap" },

initialize : function()
{

},

loadGmap : function()
{
	head.js(LIB_PATH + 'lib/date-charts-'+_LANGUAGE+'.js', LIB_PATH + 'lib/date-range-picker.js' + '?_=' + _agile_get_file_hash('date-range-picker.js'),LIB_PATH + 'lib/markerclusterer.js', function()
	{

		var view = new Base_Model_View({ model : new BaseModel(), template : "gmap-html-page",
		// gmap main template id path
		isNew : true, postRenderCallback : function(el)
		{

			try
			{
				if (google.maps)
				{
					gmap_initialize(el);
				}
			}
			catch (err)
			{

				gmap_load_script(el);
			}
		} });

		$('#content').html(view.render().el);
	});

}

});
