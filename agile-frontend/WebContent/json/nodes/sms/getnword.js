{
    "name": "Get N Word",
    "thumbnail": "json/nodes/images/sms/getnword.png",
    "icon": "json/nodes/icons/sms/getmessage.png",
    "info": "This returns the nth word in a message.",
    "help": "This returns the nth word in a message.",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches": "yes,no",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.sms.GetNWord", 
    "category": "Mobile",
    "ui": [
		{   "label": "Word At",
            "name": "n_word",
            "id": "n_word",
            "title": "Select nth number.",
			"options": {
			            "1":"1",
			            "2":"2",
			            "3":"3",
			            "4":"4",
			            "5":"5",
			            "6":"6",
			            "7":"7",
						"8":"8",
						"9":"9"
			            },
			"fieldType": "select",
			"type": "select" 
        },
        {
			"label": "Variable Name",
            "required": "required",
            "category": "Settings",
            "name": "variable_name",
            "id": "variable_name",
            "required": "required",
            "title": "The result is stored in this variable.",
            "cols": "50", 
            "rows": "5",
            "fieldType": "input",
            "type": "text"
        },
        {
            "label": "This returns the nth word<br>",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}