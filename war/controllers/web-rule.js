/**
 * Creates backbone router to access preferences of the user (email templates,
 * email (gmail/IMAP), notifications and etc..).
 */
var WebreportsRouter = Backbone.Router.extend({

	routes : {
		/* Settings */
		"webrules" : "webrules",
		"webrules-add" : "web_reports_add",
		"webrule-edit/:id" : "web_reports_edit"
	},
	webrules : function() 
	{
		this.webrules = new Base_Collection_View({ 
			url : '/core/api/webrule', 
			restKey : "webrule",
			templateKey : "webrule", 
			individual_tag_name : 'tr' 	
		});
		
		this.webrules.collection.fetch();
		$("#content").html(this.webrules.render().el);
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
	},
	
	web_reports_edit : function(id)
	{
		
		// If reports view is not defined, navigates to reports
		if (!this.webrules || !this.webrules.collection || this.webrules.collection.length == 0 || this.webrules.collection.get(id) == null)
		{
			this.navigate("webrules", { trigger : true });
			return;
		}

		// Gets a report to edit, from reports collection, based on id
		var webrule = this.webrules.collection.get(id);
		
		var web_reports_add = new Base_Model_View({ 
			url : 'core/api/webrule', 
			 model : webrule,
			template : "webrules-add", 
			window : "webrules", 
			isNew : true, 
			postRenderCallback : function(el)
			{
				head.js('lib/agile.jquery.chained.min.js', function()
						{
							
							chainFilters(el, webrule.toJSON(), function(){
								chainWebRules(el, webrule.toJSON());
								$("#content").html(el);
							});

						})
			}
		});		
		
		web_reports_add.render();
	}
});
	