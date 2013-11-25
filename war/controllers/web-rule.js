/**
 * Creates backbone router to access preferences of the user (email templates,
 * email (gmail/IMAP), notifications and etc..).
 */
var WebreportsRouter = Backbone.Router.extend({

	routes : {
		/* Settings */
		"webrules-add" : "web_reports_add"
	},
	web_reports_add : function()
	{
		var web_reports_add = new Base_Model_View({ 
			url : 'core/api/webrule', 
			template : "webrules-add", 
			window : "webrules", 
			isNew : true, 
			postRenderCallback : function(el)
			{
				head.js('lib/agile.jquery.chained.min.js', function()
						{
							
					
					
							chainFilters(el, undefined, function(){
								chainWebRules(el);
								$("#content").html(el);
							});

						})
			}
		});		
		
		web_reports_add.render();
	}
});
	