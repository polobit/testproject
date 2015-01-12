{
    "name": "Wait",
    "thumbnail": "json/nodes/images/common/wait.png",
    "icon": "json/nodes/icons/common/wait.png",
    "info": "Wait for a specified duration before next action. Useful for responders and periodic emails.",
    "help": "Wait for a specified duration before next action. Useful for responders and periodic emails.",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.Wait",
    "category": "Utilities",
    "ui": [{
			"label": " Duration",
			"required": "required",
            "category": "Settings",
			"name": "duration",
            "id":"duration",
			"title": "Enter the duration period.",
			"fieldType": "input",
            "type": "number"
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
            "label": "Wait for a specified duration before proceeding to the next step.<br/>For example, send email-1, wait for 2 days and then send email-2.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}