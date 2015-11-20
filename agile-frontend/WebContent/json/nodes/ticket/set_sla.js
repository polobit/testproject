{
    "name": "Set SLA",
    "thumbnail": "json/nodes/icons/ticket/priority.png",
    "icon": "json/nodes/icons/ticket/priority.png",
    "info": "Set SLA",
    "help": "Set SLA",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.TicketSetSLA",
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
            "options": {
				        "Hours":"hours"
			          },
			"fieldType": "select",
			"type": "select" 
         },{
            "label": "Set SLA",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}