{
    "name": "Score",
    "thumbnail": "json/nodes/images/email/score.png",
    "icon": "json/nodes/icons/email/score.png",
    "info": "Add or subtract a score for your customer. You can sort your subscribers based on score or generate reports accordingly.",
    "help": "Add or subtract a score for your customer. You can sort your subscribers based on score or generate reports accordingly. ",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "type":"voice",
    "workflow_tasklet_class_name":"com.agilecrm.tasklets.Score",
    "category": "Utilities",
    "ui": [{
			"label": "Type",
			"required": "required",
            "category": "Info",
            "name": "type",
            "id": "type",
            "title": "Select the operation type.",
            "options": {"Add":"add",
				        "Subtract":"subtract"    
			          },
			"fieldType": "select",
			"type": "select" 
		},{
			"label": "Value",
			"category": "Info",
			"name": "Value",
            "id": "Value",
            "value" : "0", 
			"title": "Enter the value.",
			"fieldType": "input",
            "type": "number" 
			
		},{
            "label": "Add or subtract a score for your subscriber. You can sort your customers based on score or generate reports accordingly.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}