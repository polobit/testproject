{
    "name": "Bounced",
    "thumbnail": "json/nodes/images/email/bounced.png",
    "icon": "json/nodes/icons/email/bounced.png",
    "info": "Triggered when email is bounced back during delivery",
    "help": "Triggered when email is bounced back during delivery",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches":"no,yes",
    "type":"voice",
     "phonesystem": {
                    "type": "static-vxml-form-url",
                    "url": "/vxml/wait.jsp" 
                },
    "category": "Email",
    "ui": [{
			"label": " Max wait time",
			"required": "required",
            "category": "Info",
			"name": "wait_time",
            "id":"wait_time",
			"value":"1",
			"title": "Enter the max wait time.",
			"fieldType": "input",
            "type": "text" 
			
		},{   
			"label": "Type",
           "required": "required",
            "category": "Info",
            "name": "duration_type",
            "id": "duration_type",
            "title": "Select the type of duration.",
            "options": {"Days":"days",
				        "Hours":"hours",
				        "Minutes":"mins"
			          },
			"fieldType": "select",
			"type": "select" 
         },{
            "label": "Event is triggered when emailed bounced back due to deliverability issues.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}