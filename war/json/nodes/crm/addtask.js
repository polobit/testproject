{
    "name": "Add Task",
    "thumbnail": "json/nodes/images/email/abtesting.png",
    "icon": "json/nodes/icons/email/abtesting.png",
    "info": "Tasks are like to-dos. Result oriented. You can assign a category such as call, email etc.",
    "help": "Tasks are like to-dos. Result oriented. You can assign a category such as call, email etc.",
    "author": "Naresh",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name":"com.campaignio.tasklets.agile.AddTask",
    "category": "Utilities",
    "ui": [{
			"label": "Task",
			"required": "required",
            "category": "Info",
            "name": "subject",
            "id": "subject",
            "title": "Enter the task name",
			"fieldType": "input",
			"type": "text" 

		},{
			"label": "Category",
			"category": "Info",
			"name": "category",
            "id":"category",
			"title": "Select the category type",
			"options": {"Call":"CALL",
		        "Email":"EMAIL",
		        "Follow-up":"FOLLOW_UP",
		        "Meeting":"MEETING",
		        "Milestone":"MILESTONE",
		        "Send":"SEND",
		        "Tweet":"TWEET"

	          },
	         "fieldType": "select",
	          "type": "select" 

		},{
			"label": "Priority",
			"category": "Info",
			"name": "priority",
            "id":"priority",
			"title": "Select the priority type",
			"options": {"High":"HIGH",
		        "Normal":"NORMAL",
		        "Low":"LOW"

	          },
	         "fieldType": "select",
	          "type": "select" 

		},{
			"label": "Due Days",
			"required":"required",
			"category": "Info",
			"name": "due_days",
            "id":"due_days",
			"title": "Enter the number of Due Days.",
			"fieldType": "input",
			"type":"number",
			"min":"0"

		},{
            "label": "Tasks are like to-dos. Result oriented. You can assign a category such as call, email etc.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}