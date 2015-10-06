{
    "name": "Priority",
    "thumbnail": "json/nodes/images/ticket/priority.png",
    "icon": "json/nodes/icons/ticket/priority.png",
    "info": "Check if a link in the email is clicked within a specified duration.",
    "help": "Check if a link in the email is clicked within a specified duration.",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "macro_tasklet_class_name": "TicketPriority",
    "category": "Priority",
    "ui": [
           {
               "label": "Priority",
               "required": "required",
               "category": "Info",
               "name": "priority",
               "id": "priority",
               "title": "Select priority",
               "options": {
                   "Low": "low",
                   "Medium": "medium",
                   "High": "high"
               },
               "fieldType": "select",
               "type": "select"
           },
           {
               "label": "Write a label for priority",
               "category": "Help",
               "fieldType": "label",
               "type": "label"
           }
       ]
}