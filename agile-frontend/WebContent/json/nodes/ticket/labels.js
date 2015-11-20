{
    "name": "Labels",
    "thumbnail": "json/nodes/images/ticket/labels.png",
    "icon": "json/nodes/icons/ticket/labels.png",
    "info": "Add or delete label for your customer. You can sort your tickets based on labels or generate reports accordingly.",
    "help": "Add or delete label for your customer. You can sort your tickets based on labels or generate reports accordingly.",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "type":"voice",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.TicketLabels",
    "category": "Tickets",
    "ui": [{
            "label": "Type",
            "required": "required",
            "category": "Info",
            "name": "type",
            "id": "type",
            "title": "Select the operation type.",
            "options": {"Add":"add",
                        "Delete":"delete"
                      },
            "fieldType": "select",
            "type": "select" 
            
        },{
            "label": "Label",
            "required": "required",
            "category": "Info",
            "name": "label_names",
            "id":"label_names",
            "title": "Enter the label values separated by comma",
            "fieldType": "input",
            "type": "text" 
            
        },{
            "label": "Add/remove labels to a ticket.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}