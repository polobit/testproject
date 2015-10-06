{
    "name": "Group",
    "thumbnail": "json/nodes/images/ticket/group.png",
    "icon": "json/nodes/icons/ticket/group.png",
    "info": "Check if a link in the email is clicked within a specified duration.",
    "help": "Check if a link in the email is clicked within a specified duration.",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "macro_tasklet_class_name": "TicketGroup",
    "category": "Group",
    "ui": [
           {
               "label": "Assign to",
               "required": "required",
               "category": "Info",
               "name": "group",
               "id": "group",
               "title": "Select Group",
               "options": {
			        "Sales": "sales",
			        "Support": "support"
			    },
               "fieldType": "select",
               "type": "select"
           },
           {
               "label": "Write label for group",
               "category": "Help",
               "fieldType": "label",
               "type": "label"
           }
       
          ]
}