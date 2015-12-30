{
    "name": "Send Message",
    "thumbnail": "json/nodes/images/sms/sendmessage.png",
    "icon": "json/nodes/icons/sms/sms/sendmessage.png",
    "info": "You can send your message form here.",
    "help": "You can send your message form here.",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.sms.SendMessage",
    "category": "Standard PBX, Other",
    "ui": [{
			"label": " From:",
			"required": "required",	
            "category": "Settings",
			"name": "from",
            "id":"from",
			"value": "$list.callerid",
           	"title": "Enter the caller ID.",
			"fieldType": "input",
            "type": "text" 
			
		},{   
			"label": "Message",
           "required": "required",
            "category": "Settings",
            "name": "message",
            "id": "message",
            "title": "Enter Your message.",
			"cols": "50",
            "rows": "10",
			"fieldType": "textarea",
			"type": "textarea" 
         },
         {
             "label": "Track Clicks:",
             "required": "No",
             "category": "More Settings",
             "name": "track_clicks",
             "title": "Enable tracking for sms link clicks. Use \"Yes &amp; Push\" if you want to push contact data to your website (to enable web activity tracking)",
             "options": {
                 "*No": "no",
                 "Yes": "yes",
                 "Yes & Push": "yes_and_push"
             },
             "fieldType": "select",
             "type": "select"
         },
         {
            "label": "You can send your message form here.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}