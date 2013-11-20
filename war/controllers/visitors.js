




var VisitorsRouter = Backbone.Router
.extend({

	routes : { "visitors" : "loadGmap" },
	
	initialize : function(){
		
	},
	
	loadGmap : function(){
				head.js(LIB_PATH + 'lib/date-charts.js', LIB_PATH
				+ 'lib/date-range-picker.js', function(){
					
					var view = new Base_Model_View({
						model : new BaseModel(),
						template : "gmap-html-page",	// gmap main template id path
						isNew : true,
						postRenderCallback : function(el){
							
							try {
								if (google.maps) {
									agile_initialize_gmap();
								}
							} catch (err) {

								agile_gmap_load_script();
							}
							
							agile_gmap_date_range(el);
						}
					});
					
					$('#content').html(view.render().el);
				});
					
					
	}
	
});