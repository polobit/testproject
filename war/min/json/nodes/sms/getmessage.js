{
    "name": "Get Message",
    "thumbnail": "json/nodes/images/sms/getmessage.png",
    "icon": "json/nodes/icons/sms/getmessage.png",
    "info": "Get the content of an incoming text message (SMS).",
    "help": "Get the content of an incoming text message (SMS).",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches": "success, timeout", 
    "category": "Mobile",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.sms.GetMessage",
    "ui": [
		 {   "label": "Start Word At",
                    "name": "word_from",
                    "id": "word_from",
                    "title": "Select number to start count. Eg: 1 will return the entire text starting from second word. 0 will return the entire content.",
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
            "title": "Store the result into a variable. Start with $",
            "cols": "50", 
            "rows": "5",
            "fieldType": "input",
            "type": "text" 
        },
        {
			"label": " From:",
			"required": "required",	
            "category": "Advanced",
			"name": "from",
            "id":"from",
			"value": "$subscriber.Number",
           	"title": "Enter the number of the sender",
			"fieldType": "input",
            "type": "text"
		},{
			"label": "To:",
			"required": "required",	
            "category": "Advanced",
			"name": "to",
            "id":"to",
			"value": "$subscriber.Sender",
           	"title": "Enter the number of the recipient",
			"fieldType": "input",
            "type": "text"
		},
        {
			"label": "Max Wait Duration",
			"required": "required",
            "category": "Advanced",
			"name": "duration",
            "id":"duration",
			"title": "Enter the max wait time before timeout is issued",
			"fieldType": "input",
            "type": "number",
            "value" : "2"
		},{   
			"label": "Type",
           "required": "required",
            "category": "Advanced",
            "name": "duration_type",
            "id": "duration_type",
            "title": "Select the type of duration.",
            "options": {
				        "Hours":"hours",
				        "Days":"days",
				        "Minutes":"mins"
			          },
			"fieldType": "select",
			"type": "select" 
         }
		,
		 {
            "label": "Get Message will return the content in text message starting from (start-word-count)<br>",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        }
    ]
}