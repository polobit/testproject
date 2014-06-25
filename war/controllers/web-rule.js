/**
 * Creates backbone router to access preferences of the user (email templates,
 * email (gmail/IMAP), notifications and etc..).
 */
var WebreportsRouter = Backbone.Router.extend({

	routes : {
	/* Settings */
	"web-rules" : "webrules", "webrules-add" : "web_reports_add", "webrule-edit/:id" : "web_reports_edit",
	"shopify-rule-add" : "shopify_rule_add", "shopify-rule-edit/:id" : "shopify_rule_edit", "shopify/:url" : "shopify", "shopify" : "shopify"
		
	},
	webrules : function()
	{
		this.webrules = new Base_Collection_View({ url : '/core/api/webrule', restKey : "webrule", templateKey : "webrule", individual_tag_name : 'tr',
			sortKey : 'position', postRenderCallback : function(el)
			{
				head.js(LIB_PATH + 'lib/prettify-min.js', function()
				{
					enableWebruletSoring(el);
					prettyPrint();
					/*if($(el).has("#api_track_webrules_code_icon").length != 0){
						initZeroClipboard("api_track_webrules_code_icon", "api_track_webrules_code");
					}*/
				});
			}	
		});
		
		this.webrules.collection.fetch();
		$("#content").html(this.webrules.render().el);
		$(".active").removeClass("active");
		$("#web-rules-menu").addClass("active");
		
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
					}, true);

				})
			} });

		$("#content").html(getRandomLoadingImg());
		web_reports_add.render();
	},

	web_reports_edit : function(id)
	{

		// If reports view is not defined, navigates to reports
		if (!this.webrules || !this.webrules.collection || this.webrules.collection.length == 0 || this.webrules.collection.get(id) == null)
		{
			this.navigate("web-rules", { trigger : true });
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
					}, true);

				})
				count++;
			} });

		$("#content").html(getRandomLoadingImg());
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
					}, true);

				})
			} });

		$("#content").html(getRandomLoadingImg());
		web_reports_add.render();
	},
	shopify : function(url)
	{
		our_domain_set_account();
		
		if(!Agile_Contact["id"])
			{
				agile_getContact(CURRENT_DOMAIN_USER['email'], {success : function(data){
					Agile_Contact = data;
					add_property("Shopify shop", url, "CUSTOM", function(data){
						addTagAgile("Shopify");
					});
				}});
			}
		else
		add_property("Shopify shop", url, "CUSTOM", function(data){
			addTagAgile("Shopify");
		})
		
		
		
		$("#content").html(getTemplate("shopify"), {});
	}
});
