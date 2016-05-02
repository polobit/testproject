{
    "name": "Email Group",
    "thumbnail": "json/nodes/images/ticket/email-group.png",
    "icon": "json/nodes/icons/ticket/email-group.png",
    "info": "Send an email to assigned ticket group.",
    "help": "Send an email to assigned ticket group.",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.TicketEmailGroup",
    "category": "Tickets",
    "ui": [
           {
               "label": "Email Group",
               "required": "Yes",
               "category": "Info",
               "name": "email-group",
               "id": "email-group",
               "title": "Select group",
               "url": "/core/api/tickets/groups",
               "dynamicName": "email",
               "dynamicValue": "id",
               "options": {
            	   "Ticket Assignee Group": "{{ticket.groupID}}"
			    },
               "appendToDynamicName": "group_name", 
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
               "cols": "75",
               "rows": "13",
               "type": "text"
           },
           {
               "label": "Send an email to assigned ticket group.",
               "category": "Help",
               "fieldType": "label",
               "type": "label"
           }
       ]
}