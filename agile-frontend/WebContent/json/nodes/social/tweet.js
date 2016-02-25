{
    "name": "Tweet",
    "thumbnail": "json/nodes/images/social/twitter.png",
    "icon": "json/nodes/icons/social/twitter.png",
    "info": "Tweet or mention automatically.",
    "help": "Tweet or mention automatically.",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches": "yes", 
    "category": "Mobile",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.TwitterSendMessage",
    "ui": [
		{
		    "label": "Please allow AgileCRM to <a href=\"javascript:openTwitter()\">access your account</a>",
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
			"type": "textarea",
			"rows": "5",
			"cols": "58"
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
         },
         {
             "label": "Track Clicks:",
             "required": "No",
             "category": "Advanced",
             "name": "track_clicks",
             "title": "Enable tracking for tweet link clicks. Use \"Yes &amp; Push\" if you want to push contact data to your website (to enable web activity tracking)",
             "options": {
                 "*No": "no",
                 "Yes": "yes",
                 "Yes & Push (Email only)": "yes_and_push_email_only",
                 "Yes & Push": "yes_and_push"
             },
             "fieldType": "select",
             "type": "select"
         },
		 {
            "label": "Automatically send tweets (@mention) to contacts using your/company twitter account.<br/><br/>You need to give access to Agile CRM to your account and provide a message to be posted. The message you provide will be preceded with a @contactTwitterId and posted as status message in your/company Twitter.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        }
    ]
}