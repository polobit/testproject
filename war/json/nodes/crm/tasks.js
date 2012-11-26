{
    "name": "Tasks",
    "thumbnail": "json/nodes/images/email/tags.png",
    "icon": "json/nodes/icons/email/tags.png",
    "info": "Tasks are like to-dos. Result oriented. You can assign a category such as call,email etc",
    "help": "Tasks are like to-dos. Result oriented. You can assign a category such as call,email etc",
    "author": "Naresh",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name":"com.campaignio.tasklets.agile.Tasks",
    "category": "Utilities",
    "ui": [{
			"label": "Task",
			"required": "required",
            "category": "Info",
            "name": "task_name",
            "id": "task_name",
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
			"label": "Due Date",
			"required":"required",
			"category": "Info",
			"name": "due_date",
            "id":"due_date",
			"title": "Enter the Due Date.",
			"fieldType": "input",
			"type":"date"
			
		},{
            "label": "Tasks are like to-dos. Result oriented. You can assign a category such as call,email etc",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}