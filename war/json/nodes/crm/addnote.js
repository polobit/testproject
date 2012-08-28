{
    "name": "Add note",
    "thumbnail": "json/nodes/images/crm/addnote.png",
    "icon": "json/nodes/icons/crm/addnote.png",
    "info": "Add a note for your existing lead in your CRM",
    "help": "Add a note for your existing lead in your CRM",
    "author": "john",
    "company": "Invox",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.crm.AddNote",
    "category": "CRM",
    "ui": [
        {
            "label": "CRM",
            "required": "required",
            "category": "Settings",
            "name": "crm_type",
            "title": "CRM type.",
            "multiple": "multiple",
            "ismultiple": "true",
            "value": "salesforce",
            "options": {
                "Salesforce": "salesforce",
                "Zoho": "zoho"
            },
            "fieldType": "select",
            "type": "select" 
        },
        {
            "label": "User Name",
            "required": "required",
            "category": "Settings",
            "value": "",
            "name": "username",
            "title": "User Name",
            "fieldType": "input",
            "type": "text" 
        },
        {
            "label": "Password",
            "required": "required",
            "category": "Settings",
            "value": "",
            "name": "password",
            "title": "Please enter your CRM Password",
            "fieldType": "input",
            "type": "password" 
        },
        {
            "label": "API Key",
            "required": "required",
            "category": "Settings",
            "value": "",
            "name": "api_key",
            "title": "API Key",
            "fieldType": "input",
            "type": "password" 
        },
        {
            "label": "URL (For Sugar)",
            "category": "Settings",
            "value": "",
            "name": "url",
            "title": "URL",
            "fieldType": "input",
            "type": "text" 
        },
        {
            "label": "Note Title:",
            "required": "required",
            "category": "Note",
            "value": "Please enter a valid note title",
            "name": "note_title",
            "title": "Note Title",
            "fieldType": "input",
            "type": "text" 
        },
        {   
			"label": "Note Content",
           "required": "required",
            "category": "Note",
            "name": "note_content",
            "id": "note_content",
            "title": "Enter your note message.",
			"cols": "50",
            "rows": "10",
			"fieldType": "textarea",
			"type": "textarea" 
         },
         {
             "label": "Search Field",
             "required": "required",
             "category": "Search",
             "name": "search_field",
             "title": "Search Field - Email or Number. This will be searched in CRM and when matched, a note is added",
             "multiple": "multiple",
             "ismultiple": "true",
             "value": "email",
             "options": {
                 "Email": "email",
                 "Number": "number"
             },
             "fieldType": "select",
             "type": "select" 
         },
         {
             "label": "Search Value:",
             "required": "required",
             "category": "Search",
             "value": "$subscriber.Email",
             "name": "search_value",
             "title": "Search Value",
             "fieldType": "input",
             "type": "text" 
         } 
    ]
}