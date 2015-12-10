{
    "name": "A/B",
    "thumbnail": "json/nodes/images/email/abtesting.png",
    "icon": "json/nodes/icons/email/abtesting.png",
    "info": "A/B testing can be used to test contact response with different messages in your email.",
    "help": "A/B testing can be used to test contact response with different messages in your email.",
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
            "label": "This is useful when you want to test what messages/content in the email gives you maximum clicks.<br/><br/>This node has two exit paths - A and B.<br/>So, if you have 1000 users going through this campaign, some users will be taken through path A, and some through path B. How many, will depend on the 'Frequency' parameter you set.<br/>If you set the Frequency to 0.6, approximately 600 will go through path A.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}