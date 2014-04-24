/**
 * Creates backbone router to access preferences of the user (email templates,
 * email (gmail/IMAP), notifications and etc..).
 */
var WebreportsRouter = Backbone.Router.extend({

	routes : {
	/* Settings */
	"web-rules" : "webrules", "webrules-add" : "web_reports_add", "webrule-edit/:id" : "web_reports_edit",
	"shopify-rule-add" : "shopify_rule_add", "shopify-rule-edit/:id" : "shopify_rule_edit"
		
	},
	webrules : function()
	{
		$(".active").removeClass("active");
		$("#web-rules-menu").addClass("active");
		this.webrules = new Base_Collection_View({ url : '/core/api/webrule', restKey : "webrule", templateKey : "webrule", individual_tag_name : 'tr' });

		this.webrules.collection.fetch();
		$("#content").html(this.webrules.render().el);
	},
	web_reports_add : function()
	{
		var web_reports_add = new Base_Model_View({ url : 'core/api/webrule', template : "webrules-add", window : "web-rules", isNew : true,
			postRenderCallback : function(el)
			{
				head.js('lib/agile.jquery.chained.min.js', function()
				{

					chainFilters(el, undefined, function()
					{
						chainWebRules(el, undefined, true);
						$("#content").html(el);
					});

				})
			} });

		$("#content").html(LOADING_HTML);
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

		var count = 0;

		// Gets a report to edit, from reports collection, based on id
		var webrule = this.webrules.collection.get(id);
		
		// Default template is webrule-add. If rule is of type shopify template is changed accordingly
		var template = "webrules-add";
		if(webrule.get("rule_type") == "SHOPIFY_WEB_RULE")
			template = "shopifyrules-add";
		
		var web_reports_add = new Base_Model_View({ url : 'core/api/webrule', model : webrule, template : template, window : "web-rules",
			postRenderCallback : function(el)
			{
				if (count > 0)
					return;
				head.js('lib/agile.jquery.chained.min.js', function()
				{
					chainFilters(el, webrule.toJSON(), function()
					{
						chainWebRules(el, webrule.toJSON(), false, webrule.toJSON()["actions"]);
						$("#content").html(el);
					});

				})
				count++;
			} });

		$("#content").html(LOADING_HTML);
		web_reports_add.render();
	}, 
	shopify_rule_add : function()
	{
		var web_reports_add = new Base_Model_View({ url : 'core/api/webrule', template : "shopifyrules-add", window : "web-rules", isNew : true,
			postRenderCallback : function(el)
			{
				head.js('lib/agile.jquery.chained.min.js', function()
				{

					chainFilters(el, undefined, function()
					{
						chainWebRules(el, undefined, true);
						$("#content").html(el);
					});

				})
			} });

		$("#content").html(LOADING_HTML);
		web_reports_add.render();
	}s
});
