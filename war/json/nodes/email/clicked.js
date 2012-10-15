{
    "name": "Clicked",
    "thumbnail": "json/nodes/images/email/clicked.png",
    "icon": "json/nodes/icons/email/clicked.png",
    "info": "Event is triggered immediatley when your subscriber clicks a link (apart from unsubscribe link).",
    "help": "Event is triggered immediately when your subscriber clicks a link (apart from unsubscribe link).",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches":"no,yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.email.Clicked",
    "category": "Email",
    "ui": [{
			"label": " Max wait time",
			"required": "required",
            "category": "Info",
			"name": "duration",
            "id":"duration",
			"title": "Enter the max wait time.",
			"fieldType": "input",
            "type": "number",
            "min": "0"
			
		},{   
			"label": "Type",
           "required": "required",
            "category": "Info",
            "name": "duration_type",
            "id": "duration_type",
            "title": "Select the type of duration.",
            "options": {"Days":"days",
				        "Hours":"hours",
				        "Minutes":"mins"
			          },
			"fieldType": "select",
			"type": "select" 
         },{
            "label": "Event is triggered immediatley when your subscriber clicks a link (apart from unsubscribe link).",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}