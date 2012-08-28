{
    "name": "Tweet",
    "thumbnail": "json/nodes/images/social/twitter.png",
    "icon": "json/nodes/icons/social/twitter.png",
    "info": "Tweet or mention automatically",
    "help": "Tweet or mention automatically",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches": "yes", 
    "category": "Mobile",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.social.TwitterSendMessage",
    "ui": [
		{
		    "label": "Please allow ContactSpot to <a href=\"javascript:openTwitter()\">access your account</a>",
		    "category": "Settings",
		    "fieldType": "label",
		    "type": "label" 
		},
		{
			"label": "UserId:",
            "required": "required",
            "category": "Settings",
            "name": "twitter_account",
            "id": "twitter_account",
            "title": "You cannot edit this field. Please allow access using the option listed above.",
            "fieldType": "input",
            "type": "text",
            "readonly":"readonly"
        },
        {
			"label": "Token:",
            "required": "required",
            "category": "Settings",
            "name": "twitter_token",
            "id": "twitter_token",
            "title": "You cannot edit this field. Please allow access using the option listed above.",
            "fieldType": "input",
            "type": "text",
            "readonly":"readonly"
        },
        {
			"label": "Token Secret:",
			"required": "required",	
            "category": "Settings",
			"name": "twitter_token_secret",
            "id":"twitter_token_secret",
           	"title": "You cannot edit this field. Please allow access using the option listed above.",
			"fieldType": "input",
            "type": "text",
            "readonly":"readonly"
		},
		{   
			"label": "Message: (Status)",
           "required": "required",
            "category": "Settings",
            "name": "message",
            "id": "message",
            "title": "Enter your message.",
			"fieldType": "textarea",
			"type": "textarea" 
         },
        {   
			"label": "Rate Limit (Hourly):",
           "required": "required",
            "category": "Advanced",
            "name": "rate_limit",
            "id": "rate_limit",
            "title": "Rate Limit for posting.",
            "options": {
				        "5":"5",
				        "10":"10",
				        "20":"20"
			          },
			"fieldType": "select",
			"type": "select" 
         }
		,
		 {
            "label": "Tweet or send mentions automatically to your prospect. Please note that ContactSpot will not tweet more than 500 tweets a day.<br>",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        }
    ]
}