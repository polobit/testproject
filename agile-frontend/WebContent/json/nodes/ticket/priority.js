{
    "name": "Priority",
    "thumbnail": "json/nodes/images/ticket/priority.png",
    "icon": "json/nodes/icons/ticket/priority.png",
    "info": "Set the priority of a ticket as low,medium or high.",
    "help": "",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.TicketPriority",
    "category": "Tickets",
    "ui": [
           {
               "label": "Priority",
               "required": "required",
               "category": "Info",
               "name": "priority",
               "id": "priority",
               "title": "Select priority",
               "options": {
                   "Low": "LOW",
                   "Medium": "MEDIUM",
                   "High": "HIGH"
               },
               "fieldType": "select",
               "type": "select"
           },
           {
               "label": "",
               "category": "Help",
               "fieldType": "label",
               "type": "label"
           }
       ]
}