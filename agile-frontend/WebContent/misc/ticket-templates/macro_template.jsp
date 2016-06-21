{
  "actions":  {
    "nodes": [
        {
            "NodeDefinition": {
                "name": "Start",
                "thumbnail": "json/nodes/images/common/Start.png",
                "icon": "json/nodes/icons/common/Start.png",
                "info": "Entry point of your campaign. Please create workflow for your campaign starting from here.",
                "help": "Start point in your campaign workflow.",
                "author": "John",
                "company": "Invox",
                "language": "en",
                "branches": "start",
                "ticket_macro_task_name": "start",
                "category": "Basic",
                "ui": [
                    {
                        "label": "Entry point of your campaign. Please create workflow for your campaign starting from here.",
                        "category": "Help",
                        "componet": "label",
                        "type": "label"
                    }
                ]
            },
            "id": "PBXNODE1",
            "xPosition": 500,
            "yPosition": 10,
            "displayname": "Start",
            "JsonValues": [],
            "States": [
                {
                    "start": "PBX0v2xqbpENn"
                }
            ]
        },
        {
            "NodeDefinition": {
                "name": "Tags",
                "thumbnail": "json/nodes/images/ticket/tags.png",
                "icon": "json/nodes/icons/ticket/tags.png",
                "info": "Add or delete tag for your customer. You can sort your tickets based on tags or generate reports accordingly.",
                "help": "Add or delete tag for your customer. You can sort your tickets based on tags or generate reports accordingly.",
                "author": "Vaishnavi",
                "company": "mantra",
                "language": "en",
                "branches": "yes",
                "type": "voice",
                "ticket_macro_task_name": "update_tags",
                "category": "Utilities",
                "ui": [
                    {
                        "label": "Type",
                        "required": "required",
                        "category": "Info",
                        "name": "type",
                        "id": "type",
                        "title": "Select the operation type.",
                        "options": {
                            "Add": "add",
                            "Delete": "delete"
                        },
                        "fieldType": "select",
                        "type": "select"
                    },
                    {
                        "label": "Tag",
                        "required": "required",
                        "category": "Info",
                        "name": "tag_names",
                        "id": "tag_names",
                        "title": "Enter the tag values separated by comma",
                        "fieldType": "input",
                        "type": "text"
                    },
                    {
                        "label": "Add/remove tags to a ticket.",
                        "category": "Help",
                        "fieldType": "label",
                        "type": "label"
                    }
                ],
                "url": "json/nodes/ticket/macro/tags.js"
            },
            "id": "PBX0v2xqbpENn",
            "xPosition": 526,
            "yPosition": 136,
            "displayname": "Tags",
            "JsonValues": [
                {
                    "name": "nodename",
                    "value": "Tags"
                },
                {
                    "name": "type",
                    "value": "add"
                },
                {
                    "name": "tag_names",
                    "value": "test"
                }
            ],
            "States": [
                {
                    "yes": "hangup"
                }
            ]
        }
    ]
}
}