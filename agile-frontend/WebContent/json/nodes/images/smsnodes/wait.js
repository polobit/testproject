{
    "name": "Wait",
    "thumbnail": "json/nodes/images/wait.png",
    "icon": "json/nodes/icons/wait.png",
    "info": "Waits for specified duration.",
    "help": "Waits for specified duration.",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.sms.Wait",
    "category": "Standard PBX, Other",
    "ui": [{
			"label": " Duration",
			"required": "required",
            "category": "Settings",
			"name": "duration",
            "id":"duration",
			"title": "Enter the duration period.",
			"fieldType": "input",
            "type": "text"
		},{   
			"label": "Type",
           "required": "required",
            "category": "Settings",
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
            "label": "Waits for specified duration.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}