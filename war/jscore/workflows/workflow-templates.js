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
	$.each(templates_json_array, function(index, category_templates_json){
		build_template(category_templates_json, workflow_templates_template);
	});
}

/**
 * Arranges templates UI w.r.t category like general, saas etc.
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
	        "icon": "icon-globe",
	        "title": "Newsletter",
	        "name": "newsletter",
	        "description": "Send newsletter and track campaign email open and click rate."
	    },
	    "auto_responder": {
	        "icon": "icon-magic",
	        "title": "Auto Responder",
	        "name": "auto_responder",
	        "description": "Send email automatically after certain waiting period."
	    },
	    "lead_scoring": {
	        "icon": "icon-flag-checkered",
	        "title": "Lead Scoring",
	        "name": "lead_scoring",
	        "description": "Increase score of your lead on a fly when email-link clicked."
	    },
	    "cart_abandonment": {
	        "icon": "icon-shopping-cart",
	        "title": "Cart Abandonment",
	        "name": "cart_abandonment",
	        "description": "Get back your customer by sending discount coupons."
	    },
	    "targeted_promo": {
	        "icon": "icon-bullseye",
	        "title": "Targeted Promo",
	        "name": "targeted_promo",
	        "description": "Promote your product so that it reach right customers."
	    },
	    "user_onboarding": {
	        "icon": "icon-level-up",
	        "title": "User Onboarding",
	        "name": "user_onboarding",
	        "description": "Make your customer feel comfortable with your product/service."
	    },
	    "trial_conversion": {
	        "icon": "icon-gift",
	        "title": "Trial Conversion",
	        "name": "trial_conversion",
	        "description": "Convert your trial customers into paid ones."
	    }
	}