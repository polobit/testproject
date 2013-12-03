{
    "name": "Opened?",
    "thumbnail": "json/nodes/images/email/opened.png",
    "icon": "json/nodes/icons/email/opened.png",
    "info": "Event is triggered when customer opens your email. Only emails in HTML format can be tracked.",
    "help": "Event is triggered when customer opens your email. Only emails in HTML format can be tracked.",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches":"no,yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.Opened",
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
            "label": "Event is triggered when customer opens your email in HTML format.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}