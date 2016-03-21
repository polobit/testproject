{
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
                "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.Start",
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
                    "start": "PBXg0HCWJysCG"
                }
            ]
        },
        {
            "NodeDefinition": {
                "name": "Set SLA",
                "thumbnail": "json/nodes/icons/ticket/priority.png",
                "icon": "json/nodes/icons/ticket/priority.png",
                "info": "Set SLA",
                "help": "Set SLA",
                "author": "John",
                "company": "mantra",
                "language": "en",
                "branches": "yes",
                "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.TicketSetSLA",
                "category": "Utilities",
                "ui": [
                    {
                        "label": " Duration",
                        "required": "required",
                        "category": "Settings",
                        "name": "duration",
                        "id": "duration",
                        "title": "Enter the duration period.",
                        "fieldType": "input",
                        "type": "number"
                    },
                    {
                        "label": "Type",
                        "required": "required",
                        "category": "Settings",
                        "name": "duration_type",
                        "id": "duration_type",
                        "title": "Select the type of duration.",
                        "options": {
                            "Hours": "hours"
                        },
                        "fieldType": "select",
                        "type": "select"
                    },
                    {
                        "label": "Set SLA",
                        "category": "Help",
                        "fieldType": "label",
                        "type": "label"
                    }
                ]
            },
            "id": "PBXg0HCWJysCG",
            "xPosition": 491,
            "yPosition": 143,
            "displayname": "Set SLA",
            "JsonValues": [
                {
                    "name": "nodename",
                    "value": "Set SLA"
                },
                {
                    "name": "duration",
                    "value": "24"
                },
                {
                    "name": "duration_type",
                    "value": "hours"
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