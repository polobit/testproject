/**
 * Creates a backbone router to perform config activities (onboarding and etc..).
 * 
 */
var AgileConfigRouter = Backbone.Router.extend({

	routes : {
	/* Admin-Settings */
	"onboarding/:link" : "onBoarding",
	},
	
	onBoarding : function(link)
	{
		if (!CURRENT_DOMAIN_USER.is_admin)
		{
			$('#content').html(getTemplate('others-not-allowed',{}));
			return;
		}
		$("#content").html(getTemplate("admin-settings"), {});
		head.js(LIB_PATH + 'lib/prettify-min.js','../lib/zeroclipboard/ZeroClipboard.js', function()
		{
			var view = new Base_Model_View({ url : '/core/api/api-key', template : "admin-settings-api-key-model", postRenderCallback : function(el)
			{
				prettyPrint();
				console.log(link+"link is");
				if(link)
				{
					$(el).find('#APITab a[href="#'+ link +'"]').trigger('click');
				}
				
				initZeroClipboard("saas_api_track_code_icon", "saas_api_track_code");
				

			} });
			$('#content').find('#admin-prefs-tabs-content').html(view.render().el);
			$('#content').find('#AdminPrefsTab .active').removeClass('active');
			$('#content').find('.analytics-code-tab').addClass('active');
			// $('#content').html(view.el);
		});
		
		$.getJSON("core/api/api-key", function(data)
			    {
					console.log(data);
					$("#content").html(getTemplate("onboarding-"+ link, data));
			    });
		
	}
	
});