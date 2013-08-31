{
    "name": "URL Visited?",
    "thumbnail": "json/nodes/images/common/url.png",
    "icon": "json/nodes/icons/common/url.png",
    "info": "Check if a URL has been visited by the contact earlier.",
    "help": "Check if a URL has been visited by the contact earlier.",
    "author": "John",
    "company": "Invox",
    "language": "en",
    "branches": "No,Yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.URLVisited",
    "category": "URL",
    "ui": [
		{
		    "label": "URL",
		    "required": "required",
		    "category": "Settings",
		    "name": "url_value",
		    "id":"url_value",
		    "title": "Enter a valid URL.",
		    "fieldType": "input",
		    "type": "url" 
		},
		{
			"label": "Type",
			"required": "required",
			"category": "Settings",
			"name": "type",
			"id": "type-select",
			"title": "Select the given URL type.",
			"options": {
				"Exact Match": "exact_match",
		        "Contains": "contains"    
	          },
	          "fieldType": "select",
			  "type": "select",
			  "target_type":"url_value",
			  "select_event_callback":"url_visited_select_callback"
		},
        {
            "label": "Check if a URL (on your website) has been visited by the contact. This works when you have the tracking code setup on your web page.<br/><br/>The 'Type' option allows you to specify a partial match of url. For example, if you just mention 'product' in the URL field and select Type as 'Contains', then the condition will be evaluated to True if the user visited any page containing 'product' in the URL",
            "category": "Help",
            "componet": "label",
            "type": "label" 
        } 
    ]
}