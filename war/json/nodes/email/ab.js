{
    "name": "A/B",
    "thumbnail": "json/nodes/images/email/abtesting.png",
    "icon": "json/nodes/icons/email/abtesting.png",
    "info": "A/B testing can be used to test your various messages.",
    "help": "A/B testing can be used to test your various messages.",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches":"A,B",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.AB",
    "category": "Email",
    "ui": [{
			"label": "Frequency (Less than 1 - eg: 0.5)",
			"required": "required",
            "category": "Info",
			"name": "frequency",
            "id":"frequency",
			"value":"0.5",
			"title": "Enter the frequency for your A/B testing. Eg: 0.5 for 50%",
			"fieldType": "input",
            "type": "number",
            "max": "1"
			
		},
		{
            "label": "A/B testing can be used to test your various messages.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}