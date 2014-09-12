{
    "name": "Get Message",
    "thumbnail": "json/nodes/images/sms/getmessage.png",
    "icon": "json/nodes/icons/sms/getmessage.png",
    "info": "Get Message will return the content in text message starting from (startwordcount).",
    "help": "Get Message will return the content in text message starting from (startwordcount).",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches": "success, timeout", 
    "category": "Standard PBX, Recommended",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.sms.GetMessage",
    "ui": [
		 {   "label": "Start Word At",
                    "name": "word_from",
                    "id": "word_from",
                    "title": "Select number to start count.",
					"options": {"*0":"0",
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
            "title": "The result is stored in this variable..",
            "cols": "50", 
            "rows": "5",
            "fieldType": "input",
            "type": "text" 

        },
        {
            "label": "Get Message will return the content in text message starting from (startwordcount)<br>",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}