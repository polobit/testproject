{
    "name": "URL Visited",
    "thumbnail": "json/nodes/images/common/url.png",
    "icon": "json/nodes/icons/common/url.png",
    "info": "Check if the URL has been visited in a workflow",
    "help": "AgileCRM can check if the subscriber (Email address) has visited a web page (URL).",
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
		    "name": "url",
		    "title": "Enter a valid URL.",
		    "fieldType": "input",
		    "type": "url" 
		},
        {
            "label": "Specify your visited url.",
            "category": "Help",
            "componet": "label",
            "type": "label" 
        } 
    ]
}