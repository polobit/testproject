{
    "name": "Say",
    "thumbnail": "json/nodes/images/email/score.png",
    "icon": "json/nodes/icons/email/score.png",
    "info": "Play a message using Text to Speech",
    "help": "Play a message using Text to Speech",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "type":"voice",
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
            "id":"Value",
			"title": "Enter the value.",
			"fieldType": "input",
            "type": "text" 
			
		},{
            "label": "Add or subtract a score for your subscriber. You can sort your customers based on score or generate reports accordingly.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}