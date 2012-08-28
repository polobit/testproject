{
    "name": "URL Visited",
    "thumbnail": "json/nodes/images/common/url.png",
    "icon": "json/nodes/icons/common/url.png",
    "info": "Check if the URL has been visited in a workflow",
    "help": "ContactSpot can check if the subscriber (Email address) has visited a web page (URL).",
    "author": "John",
    "company": "Invox",
    "language": "en",
    "branches": "No,Yes",
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
		    "label": "Identifier",
		    "required": "required",
		    "category": "Settings",
		    "name": "identifier",
		    "title": "Enter a valid Identifier.",
		    "fieldType": "input",
		    "type": "text",
		    "value": "$subscriber.Email"
		},
		{   
			"label": "Type",
		   "required": "required",
		    "category": "Settings",
		    "name": "account",
		    "id": "account",
		    "title": "Select the type of Account.",
		    "options": {"Piwik":"piwik",
				        "GetClicky":"getclicky",
				        "Minutes":"mins"
			          },
			"fieldType": "select",
			"type": "select" 
		 },
        {
            "label": "Username",
            "required": "required",
            "category": "Settings",
            "name": "username",
            "title": "Enter a valid username.",
            "fieldType": "input",
            "type": "text" 
        },{
            "label": "Password",
            "required": "required",
            "category": "Settings",
            "name": "password",
            "title": "Enter a valid password.",
            "fieldType": "input",
            "type": "password" 
        },
        {
            "label": "Specify your visited url.",
            "category": "Help",
            "componet": "label",
            "type": "label" 
        } 
    ]
}