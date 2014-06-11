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
		$("#content").html(getTemplate("onboarding-saas"), {});
	},
	
});