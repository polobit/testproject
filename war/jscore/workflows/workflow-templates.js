/**
 * Constructs templates UI from templates json array.
 * 
 * @param templates_json_array - complete templates json array.
 * 
 * @param workflow_templates_template - UI template to append individual template.
 * 
 **/
function build_workflow_templates(templates_json_array, workflow_templates_template)
{
	// Add default template before adding dynamic templates
	//$(workflow_templates_template).find('#general').append(getTemplate('workflow-template-attributes', workflow_template_attributes["custom"]));
	
	$.each(templates_json_array, function(index, category_templates_json){
		build_template(category_templates_json, workflow_templates_template);
	});
}

/**
 * Arranges templates UI w.r.t category like general, saas etc. The category name should 
 * match with id in the template.
 * 
 * @param category_templates_json - Category json having list of templates.
 * 
 * @param content - UI template to append individual template.
 * 
 **/
function build_template(category_templates_json, workflow_templates_template)
{
	var category = category_templates_json["category"];
	var templates = category_templates_json["templates"];
	
	// Initialize template attributes with workflow_template_attributes
	$.each(templates, function(index, value){
		$(workflow_templates_template).find('#'+category).append(getTemplate('workflow-template-attributes', workflow_template_attributes[value["template"]]));
	});
	
}

/**
 * Returns workflow json that matches with the given template name from templates list json.
 * 
 * @param templates_json - complete default templates json
 * 
 * @param template_name - template name like newsletter, autoresponder etc.
 * 
 ***/
function get_template_json(templates_json, template_name)
{
	var template_json = undefined;
	
	$.each(templates_json, function(index, json){
		
		// temporary flag to exit loop whenever condition met.
		var flag = true;
		
		$.each(json["templates"], function(index, value){
			if(value["template"] === template_name)
			{
				flag = false;
				template_json = value["json"];
				return false;
			}
		});
		
		return flag;
	});
   
    return template_json;
}

/**
 * Attributes json of each template with icon, title, name and description.
 * Keyname of each template should match with filename. For e.g. newsletter 
 * should match in the newsletter_template.js
 * 
 * icon - font-awesome icon.
 * title - template title.
 * name - it is used to fetch workflow json from complete list of templates. 
 *        It should be same as respective key.
 * description - workflow template description.
 * 
 **/
var workflow_template_attributes=
{
	    "newsletter": {
	        "icon": "icon-file-text",
	        "title": "Newsletter",
	        "name": "newsletter",
	        "description": "Send a newsletter and see reports on opens and clicks"
	    },
	    "auto_responder": {
	        "icon": "icon-time",
	        "title": "Autoresponder",
	        "name": "auto_responder",
	        "description": "Send emails and follow-up automatically after a specified duration"
	    },
	    "lead_scoring": {
	        "icon": "icon-star-half-full",
	        "title": "Lead Scoring",
	        "name": "lead_scoring",
	        "description": "Score your leads when they click email links and browse the website"
	    },
	    "cart_abandonment": {
	        "icon": "icon-shopping-cart",
	        "title": "Cart Abandonment",
	        "name": "cart_abandonment",
	        "description": "Detect when your users abandon cart and send them relavent communication"
	    },
	    "targeted_promo": {
	        "icon": "icon-bullseye",
	        "title": "Targeted Promo",
	        "name": "targeted_promo",
	        "description": "Send relevant and timely promotional communication to users based on their interests and actions"
	    },
	    "user_onboarding": {
	        "icon": "icon-plane",
	        "title": "User Onboarding",
	        "name": "user_onboarding",
	        "description": "Help your users with timely communication to bring them onboard and improve retention"
	    },
	    "trial_conversion": {
	        "icon": "icon-level-up",
	        "title": "Trial Conversion",
	        "name": "trial_conversion",
	        "description": "Identify who among your free/trial users are ready to convert and reach out to them"
	    },
	    "social_campaign":{
	    	"icon":"icon-twitter",
	    	"title": "Social Campaign",
	    	"name": "social_campaign",
	    	"description": "Reach out to prospects on social media. Send automated Tweets"
	    },
	    "ab_testing":{
	    	"icon":"icon-beaker",
	    	"title": "A/B Test",
	    	"name": "ab_testing",
	    	"description": "A/B test your emails. Compare results and optimize messages"
	    },
	    "signup_welcome":{
	    	"icon": "icon-gift",
	    	"title": "Signup Welcome",
	    	"name": "signup_welcome",
	    	"description": "Send a welcome email after users signup"
	    }
	};