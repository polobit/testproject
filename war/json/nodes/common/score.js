{
    "name": "Score",
    "thumbnail": "json/nodes/images/email/score.png",
    "icon": "json/nodes/icons/email/score.png",
    "info": "Add or subtract score to your contact to identify hot leads based on total score.",
    "help": "Add or subtract score to your contact to identify hot leads based on total score.",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "type":"voice",
    "workflow_tasklet_class_name":"com.campaignio.tasklets.agile.Score",
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
			"required": "required",
			"category": "Info",
			"name": "Value",
            "id": "Value",
            "title": "Enter the value.",
			"fieldType": "input",
            "type": "number"
            },{
            "label": "You can increase or decrease the Lead Score using this option.<br/><br/>For example, if the user opened your email, add a score of 5 and on clicking a link add 10.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}