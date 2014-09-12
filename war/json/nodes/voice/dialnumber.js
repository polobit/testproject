{
    "name": "Transfer",
    "thumbnail": "json/nodes/images/common/transfer.png",
    "icon": "json/nodes/icons/common/transfer.png",
    "info": "Transfer subscribers to a different list",
    "help": "Transfer subscribers to a different list",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.basic.Transfer",
    "category": "Utilities",
    "ui": [{   
			"label": "List",
           "required": "required",
            "category": "Settings",
            "name": "list",
            "id": "list",
            "title": "Choose your new list",
            "url": "/home?command=get_lists", 
			"fieldType": "dynamicselect",
			"type": "dynamicselect",
			"dynamicName":"list_name",
			"dynamicValue":"list_value"
         },
         {
            "label": "Choose the new list to transfer your subscribers.",
            "category": "Help",
            "fieldType": "label",
            "type": "Transfers the subscriber to a new list" 
        } 
    ]
}