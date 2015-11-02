{
    "name": "Tags",
    "thumbnail": "json/nodes/images/ticket/tags.png",
    "icon": "json/nodes/icons/ticket/tags.png",
    "info": "Add or delete tag for your customer. You can sort your tickets based on tags or generate reports accordingly.",
    "help": "Add or delete tag for your customer. You can sort your tickets based on tags or generate reports accordingly.",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "type":"voice",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.TicketTags",
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
            "label": "Tag",
            "required": "required",
            "category": "Info",
            "name": "tag_names",
            "id":"tag_names",
            "title": "Enter the tag values separated by comma",
            "fieldType": "input",
            "type": "text" 
            
        },{
            "label": "Add/remove tags to a ticket.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}