{
    "name": "Opened?",
    "thumbnail": "json/nodes/images/email/opened.png",
    "icon": "json/nodes/icons/email/opened.png",
    "info": "Check if the contact has opened any of the previous emails sent in the campaign.",
    "help": "Check if the contact has opened any of the previous emails sent in the campaign",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches":"no,yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.Opened",
    "category": "Email",
    "ui": [{
			"label": " Max wait time",
			"required": "required",
            "category": "Info",
			"name": "duration",
            "id":"duration",
			"title": "Enter the max wait time.",
			"fieldType": "input",
            "type": "number",
            "min": "0"
			
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
            "label": "Check if any of the emails sent earlier in the campaign has been opened. You need to define a maximum wait duration before it proceeds to the next step. <br/><br/>This node has 2 exit paths - Yes and No.<br/><ul><li>If the email is opened, then the campaign moves through the 'Yes' path immediately.</li><br/><li>If the recipient did not open the email, it waits here for the specified duration and then moves through the 'No' path.</li></ul>Note: Email open checking is not 100% accurate. For some email clients or web email services (like Gmail) it is not possible to know if the recipient has opened the email. In which case, it waits here for max wait duration and takes the 'No' path, while the recipient may have actually opened the email.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}