{
    "name": "Send Message",
    "thumbnail": "json/nodes/images/sms/sendmessage.png",
    "icon": "json/nodes/icons/sms/sendmessage.png",
    "info": "Send text messages (SMS) anywhere in the world",
    "help": "Send text messages (SMS) anywhere in the world. ",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.sms.SendMessage",
    "category": "Mobile",
    "ui": [{
			"label": " From:",
			"required": "required",	
            "category": "Settings",
			"name": "from",
            "id":"from",
			"value": "$subscriber.Sender",
           	"title": "Enter 'From' CallerId should match the numbers on your account.",
			"fieldType": "input",
            "type": "text"		
		},{
			"label": "To:",
			"required": "required",	
            "category": "Settings",
			"name": "to",
            "id":"to",
			"value": "$subscriber.Number",
           	"title": "Enter the recipient number. If you are using a list - you can use $subscriber.Number",
			"fieldType": "input",
            "type": "text"
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
         },{
            "label": "ContactSpot can send text messages anywhere in the world.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}