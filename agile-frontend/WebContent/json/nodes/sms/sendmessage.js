{
    "name": "Send Message",
    "thumbnail": "json/nodes/images/sms/sendmessage.png",
    "icon": "json/nodes/icons/sms/sendmessage.png",
    "info": "Send SMS to the contact using SMS Gateway Integration",
    "help": "You can enable SMS Gateway Integration from Admin settings -> Integrations",
    "author": "Bhasuri",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.sms.SendMessage",
    "category": "URL",
    "ui": [{
			"label": " From:",
			"required": "required",	
            "category": "Settings",
			"name": "from",
            "id":"from",
           	"title": "Select Number",
			"fieldType": "incoming_list",
            "type": "select",
            "style": {
                "width": "66%"
                }
			
		},{
			"label": "To:",
			"required": "required",	
            "category": "Settings",
			"name": "to",
            "id":"to",
           	"title": "Enter the recipient number or {{phone}}",
			"fieldType": "input",
            "type": "text",
            "placeholder":"{{phone}}",
            "style": {
                "width": "64%"
            }
		},
		{   
			"label": "Message",
           "required": "required",
            "category": "Settings",
            "name": "message",
            "id": "message",
            "title": "Enter your message.",
			"cols": "50",
            "rows": "10",
			"fieldType": "textarea",
			"type": "textarea" 
         },
         {
             "label": "Track Clicks:",
             "required": "No",
             "category": "Settings",
             "name": "track_clicks",
             "title": "Enable tracking for sms link clicks. Use \"Yes &amp; Push\" if you want to push contact data to your website (to enable web activity tracking)",
             "options": {
                 "*No": "no",
                 "Yes": "yes",
                 "Yes & Push": "yes_and_push",
                 "Yes & Push (Email only)": "yes_and_push_email_only"
             },
             "fieldType": "select",
             "type": "select"
         },
         {
            "label": "Send SMS to the contact using the SMS Gateway Integration.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}