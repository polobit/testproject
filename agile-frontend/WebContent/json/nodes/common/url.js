{
    "name": "URL Visited?",
    "thumbnail": "json/nodes/images/common/url.png",
    "icon": "json/nodes/icons/common/url.png",
    "info": "Check if a URL has been visited by the contact earlier or in a specified duration.",
    "help": "Check if a URL has been visited by the contact earlier or in a specified duration.",
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
            "id": "url_value",
            "title": "Enter a valid URL.",
            "fieldType": "input",
            "type": "url"
        },
        {
            "label": "Match type",
            "required": "required",
            "category": "Settings",
            "name": "type",
            "id": "type-select",
            "title": "Select the given URL type.",
            "options": {
                "Contains": "contains",
                "Exact Match": "exact_match"
            },
            "fieldType": "select",
            "type": "select",
            "target_type": "url_value",
            "select_event_callback": "url_visited_select_callback"
        },
        {
            "label": " Visited in last ",
            "required": "required",
            "category": "Settings",
            "name": "duration",
            "id": "duration",
            "title": "Enter the duration in days or hours. Leave as zero if you don't want time limit.",
            "fieldType": "input",
            "type": "number",
            "placeholder": "0",
            "min": "0",
            "style": {
                "width": "17%",
                "min": "0"
            }
        },
        {
            "required": "required",
            "category": "Settings",
            "name": "duration_type",
            "id": "duration_type",
            "title": "Select the type of duration.",
            "options": {
                "Days": "day",
                "Hours": "hour"
            },
            "fieldType": "select",
            "type": "select"
        },
        {
            "label": "Check if a URL (on your website) has been visited by the contact. This works when you have the tracking code setup on your web page.<br/><br/>The 'Match type' option allows you to specify a partial match of url. For example, if you just mention 'product' in the URL field and select Type as 'Contains', then the condition will be evaluated to True if the user visited any page containing 'product' in the URL.<br/><br/> You can optionally give a time duration for the visit. Ex: Check if they visited your pricing page in last 3 days ",
            "category": "Help",
            "componet": "label",
            "type": "label"
        }
    ]
}