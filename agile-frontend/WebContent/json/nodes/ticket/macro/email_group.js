{
    "name": "Email Group",
    "thumbnail": "json/nodes/images/ticket/email-group.png",
    "icon": "json/nodes/icons/ticket/email-group.png",
    "info": "Check if a link in the email is clicked within a specified duration.",
    "help": "Check if a link in the email is clicked within a specified duration.",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "macro_tasklet_class_name": "TicketEmailGroup",
    "category": "Email Group",
    "ui": [
           {
               "label": "Group",
               "required": "required",
               "category": "Info",
               "name": "email-group",
               "id": "email-group",
               "title": "Select group",
               "options": {
			        "Sales": "sales",
			        "Support": "support"
			    },
               "fieldType": "select",
               "type": "select"
           },
           {
               "label": "Subject",
               "required": "required",
               "category": "Info",
               "name": "subject",
               "id": "subject",
               "title": "Write subject",
               "fieldType": "input",
               "type": "text"
           },
           {
               "label": "Email",
               "required": "required",
               "category": "Info",
               "name": "email-body",
               "id": "email-body",
               "title": "Write Email",
               "fieldType": "textarea",
               "type": "text"
           },
           {
               "label": "Write label for email group",
               "category": "Help",
               "fieldType": "label",
               "type": "label"
           }
       ]
}