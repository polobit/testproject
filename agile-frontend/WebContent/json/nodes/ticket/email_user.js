{
    "name": "Email User",
    "thumbnail": "json/nodes/images/ticket/email-user.png",
    "icon": "json/nodes/icons/ticket/email-user.png",
    "info": "Check if a link in the email is clicked within a specified duration.",
    "help": "Check if a link in the email is clicked within a specified duration.",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.TicketEmailUser",
    "category": "Email User",
    "ui": [
           {
               "label": "Email User",
               "required": "required",
               "category": "Info",
               "name": "email-user",
               "id": "email-user",
               "title": "Select email user",
               "optgroup" : [
					{
					    "label": "--Users--",
					    "options": {
					        "User 1": "user 1",
					        "User 2": "user 2"
					    }
					}
               ],
               "options": {
                   "(requester)": "(requester)"
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
               "label": "Write label for email user",
               "category": "Help",
               "fieldType": "label",
               "type": "label"
           }
       ]
}