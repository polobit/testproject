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
    "category": "Tickets",
    "ui": [
           {
               "label": "Email User",
               "required": "Yes",
               "category": "Info",
               "name": "email-user",
               "id": "email-user",
               "title": "Select email user",
               "url": "/core/api/users",
               "dynamicName": "email",
               "dynamicValue": "id",
               "appendToDynamicName": "name",
               "options": {
                   "(requester)": "{{requester}}",
                   "Ticket Assignee User": "{{ticket.assigneeID}}"
               },
               "fieldType": "dynamicselect",
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