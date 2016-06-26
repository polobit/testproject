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
                    "start": "PBXTZN4cXkWsG"
                }
            ]
        },
        {
            "NodeDefinition": {
                "name": "Email Group",
                "thumbnail": "json/nodes/images/ticket/email-group.png",
                "icon": "json/nodes/icons/ticket/email-group.png",
                "info": "Send an email to assigned ticket group.",
                "help": "Send an email to assigned ticket group.",
                "author": "John",
                "company": "mantra",
                "language": "en",
                "branches": "yes",
                "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.TicketEmailGroup",
                "category": "Tickets",
                "ui": [
                        {
                          "label": "From (Name):",
                          "category": "Info",
                          "name": "from_name",
                          "id": "from_name",
                          "title": "Enter your name.",
                          "required": "required",
                          "fieldType": "input",
                          "type": "text"
                        },
                        {
                          "label": "From (Email)",
                          "category": "Info",
                          "name": "from_address",
                          "id": "from_address",
                          "value": "",
                          "required": "required",
                          "title": "Enter from email address",
                          "fieldType": "input",
                          "type": "email"
                        },
                    {
                        "label": "Email Group",
                        "required": "Yes",
                        "category": "Info",
                        "name": "email-group",
                        "id": "email-group",
                        "title": "Select group",
                        "url": "/core/api/tickets/groups",
                        "dynamicName": "email",
                        "dynamicValue": "id",
                        "appendToDynamicName": "group_name",
                        "options": {
                            "Ticket Assignee Group": "{{ticket.groupID}}"
                        },
                        "fieldType": "dynamicselect",
                        "type": "select"
                    },
                    {
                        "label": "Subject",
                        "required": "required",
                        "category": "Info",
                        "name": "subject",
                        "id": "subject",
                        "title": "Write subject",
                        "fieldType": "input",
                        "type": "text"
                    },
                    {
                        "label": "Email",
                        "required": "required",
                        "category": "Info",
                        "name": "email-body",
                        "id": "email-body",
                        "title": "Write Email",
                        "fieldType": "textarea",
                        "cols": "75",
                        "rows": "7",
                        "type": "text"
                    },
                    {
                        "label": "Send an email to assigned ticket group.",
                        "category": "Help",
                        "fieldType": "label",
                        "type": "label"
                    }
                ]
            },
            "id": "PBXTZN4cXkWsG",
            "xPosition": 477,
            "yPosition": 149,
            "displayname": "Email Group",
            "JsonValues": [
                {
                    "name": "nodename",
                    "value": "Email Group"
                },
                {
                    "name": "from_name",
                    "value": "Agile CRM"
                },
                {
                    "name": "from_address",
                    "value": "noreply@agilecrm.com"
                },
                {
                    "name": "email-group",
                    "value": "{{ticket.groupID}}"
                },
                {
                    "name": "subject",
                    "value": "We have received an email from {{ticket.requester_name}}"
                },
                {
                    "name": "email-body",
                    "value": "We have received an email from {{ticket.requester_name}},\r\n\r\nPlease respond within 24 hours."
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