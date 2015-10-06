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
    "macro_tasklet_class_name": "TicketAssignee",
    "category": "Assignee",
    "ui": [
           
          {
              "label": "Assign to user",
              "required": "required",
              "category": "Info",
              "name": "assignee-user",
              "id": "assignee-user",
              "title": "Select Assignee",
              "options": {
            	  "User1": "user1",
			       "User2": "user2",
			       "User3": "user3"
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
               "options": {
            	   "User1": "user1",
			       "User2": "user2",
			       "User3": "user3"
               },
               "fieldType": "select",
               "type": "select"
           },
           {
               "label": "Write label for assignee",
               "category": "Help",
               "fieldType": "label",
               "type": "label"
           }
         ]

}