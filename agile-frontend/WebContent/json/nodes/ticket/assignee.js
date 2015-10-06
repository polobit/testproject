{
    "name": "Assignee",
    "thumbnail": "json/nodes/images/ticket/assignee.png",
    "icon": "json/nodes/icons/ticket/assignee.png",
    "info": "Check if a link in the email is clicked within a specified duration.",
    "help": "Check if a link in the email is clicked within a specified duration.",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.TicketAssignee",
    "category": "Assignee",
    "ui": [
           
           {
               "label": "Assigned to user",
               "required": "required",
               "category": "Info",
               "name": "assignee-user",
               "id": "assignee-user",
               "title": "Select Assignee",
               "options": {
            	   "User 1": "user 1",
			       "User 2": "user 2",
			       "User 3": "user 3"
               },
               "fieldType": "select",
               "type": "select",
               "event": "onchange",
               "eventHandler": "getUserTicketGroups(this)",
               "select_event_callback": "getUserTicketGroups"
           },
           {
               "label": "group",
               "required": "required",
               "category": "Info",
               "name": "assignee-group",
               "id": "assignee-group",
               "title": "Select Group",
               "options": {},
               "fieldType": "select",
               "type": "select"
           },
           {
               "label": "Write label for Assignee",
               "category": "Help",
               "fieldType": "label",
               "type": "label"
           }
         ]
}