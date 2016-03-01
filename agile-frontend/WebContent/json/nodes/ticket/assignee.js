{
    "name": "Assignee",
    "thumbnail": "json/nodes/images/ticket/assignee.png",
    "icon": "json/nodes/icons/ticket/assignee.png",
    "info": "You can change the group and assignee  for a ticket.",
    "help": "",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.TicketAssignee",
    "category": "Tickets",
    "ui": [
           
           {
               "label": "Assigned to group",
               "required": "required",
               "category": "Info",
               "name": "group-id",
               "id": "group-id",
               "title": "Select Group",
               "url": "/core/api/tickets/groups",
               "dynamicName": "group_name",
               "dynamicValue": "id",
               "appendToDynamicName": "name",
               "options": {
            	   "--Select--": ""
               },
               "fieldType": "dynamicselect",
               "type": "select",
               "event": "onchange",
               "eventHandler": "getUsersFromGroup(this)",
               "eventHandlerOnLoad": "getUsersFromGroup",
               "triggerEventOnLoad": "true"
           },
           {
               "label": "Assignee",
               "required": "required",
               "category": "Info",
               "name": "assignee-id",
               "id": "assignee-id",
               "title": "Select Assignee",
               "options": {},
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