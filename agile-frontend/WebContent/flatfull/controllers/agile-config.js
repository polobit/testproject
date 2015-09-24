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
			getTemplate('others-not-allowed', {}, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$('#content').html($(template_ui));	
			}, "#content");

			return;
		}

		getTemplate("admin-settings", {}, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$('#content').html($(template_ui));	

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
				$('#content').find('#AdminPrefsTab .select').removeClass('select');
				$('#content').find('.analytics-code-tab').addClass('select');
				// $('#content').html(view.el);
			});
			
			$.getJSON("core/api/api-key", function(data)
		    {
				console.log(data);
				getTemplate("onboarding-"+ link, data, undefined, function(template_ui){
					if(!template_ui)
						  return;
					$('#content').html($(template_ui));	
				}, "#content");
		    });


		}, "#content");

	}
	
});