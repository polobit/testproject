{
    "name": "Replied?",
    "thumbnail": "json/nodes/images/email/replied.png",
    "icon": "json/nodes/icons/email/replied.png",
    "info": "Check if the contact has replied any of the previous emails sent in the campaign.",
    "help": "Check if the contact has replied any of the previous emails sent in the campaign",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches":"no,yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.Replied",
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
            "label": "Check if any of the emails sent earlier in the campaign has been replied. You need to define a maximum wait duration before it proceeds to the next step. <br/><br/>This node has 2 exit paths - Yes and No.<br/><ul><li>If the email is replied, then the campaign moves through the 'Yes' path immediately.</li><br/><li>If the recipient did not reply the email, it waits here for the specified duration and then moves through the 'No' path.</li></ul>Note: For Agile CRM to recognize your emails, please setup <a class=\"inbound-help-text\">{{inboundMail}}</a> as forwarding email at your email server",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}