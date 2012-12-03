{
    "name": "Tasks",
    "thumbnail": "json/nodes/images/email/tags.png",
    "icon": "json/nodes/icons/email/tags.png",
    "info": "Get the tasks based upon Due Days.",
    "help": "Get the tasks based upon Due Days.",
    "author": "Naresh",
    "company": "mantra",
    "language": "en",
    "branches": "no,yes",
    "workflow_tasklet_class_name":"com.campaignio.tasklets.agile.Tasks",
    "category": "Utilities",
    "ui": [{
			"label": "Due Days",
			"required":"required",
			"category": "Info",
			"name": "due_days",
            "id":"due_days",
			"title": "Enter the number of Due Days",
			"fieldType": "input",
			"type":"number"
			
		},{
            "label": "Get the tasks based upon Due Days.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}