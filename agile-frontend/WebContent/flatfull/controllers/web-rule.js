/**
 * Creates backbone router to access preferences of the user (email templates,
 * email (gmail/IMAP), notifications and etc..).
 */
var WebreportsRouter = Backbone.Router.extend({

	routes : {
	/* Settings */
	"web-rules" : "webrules", "webrules-add" : "web_reports_add", "webrule-edit/:id" : "web_reports_edit" },
	webrules : function()
	{
		var that = this;
		this.webrules = new Base_Collection_View({ url : '/core/api/webrule', restKey : "webrule", templateKey : "webrule", individual_tag_name : 'tr',
			sortKey : 'position', postRenderCallback : function(el)
			{
				if (that.webrules.collection && that.webrules.collection.length == 0)
				{
					head.js(LIB_PATH + 'lib/prettify-min.js', function()
					{
						$.ajax({ url : 'core/api/api-key', type : 'GET', dataType : 'json', success : function(data)
						{
							getTemplate("webrule-collection", data, undefined, function(template_ui){
								if(!template_ui)
									  return;
								$('#content').html($(template_ui));	
								if(ACCOUNT_PREFS.plan.plan_type.split("_")[0] == "PRO")
								{
									$("#whitelist-disabled").addClass("hide");
									$("#whitelist-enabled").removeClass("hide");
								}
								prettyPrint();

							}, "#content");

							
						} });

					});
				}
				else
				{
					enableWebrulesSorting(el);
				}
			} });

		this.webrules.collection.fetch();
		$("#content").html(this.webrules.render().el);
		$(".active").removeClass("active");
		$("#web-rules-menu").addClass("active");

	},
	web_reports_add : function()
	{
		if(!tight_acl.checkPermission('WEBRULE'))
			return;
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
		if(!tight_acl.checkPermission('WEBRULE'))
			return;

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
	} });
