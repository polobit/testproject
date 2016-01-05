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
                    "start": "PBXApmJu0LQA4"
                }
            ]
        },
        {
            "NodeDefinition": {
                "name": "Email User",
                "thumbnail": "json/nodes/images/ticket/email-user.png",
                "icon": "json/nodes/icons/ticket/email-user.png",
                "info": "Check if a link in the email is clicked within a specified duration.",
                "help": "Check if a link in the email is clicked within a specified duration.",
                "author": "John",
                "company": "mantra",
                "language": "en",
                "branches": "yes",
                "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.TicketEmailUser",
                "category": "Tickets",
                "ui": [
                    {
                        "label": "Email User",
                        "required": "Yes",
                        "category": "Info",
                        "name": "email-user",
                        "id": "email-user",
                        "title": "Select email user",
                        "url": "/core/api/users",
                        "dynamicName": "email",
                        "dynamicValue": "email",
                        "appendToDynamicName": "name",
                        "options": {
                            "(requester)": "{{ticket.requester_email}}",
                            "Ticket Assignee User": "{{ticket.assigneeID}}"
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
                        "rows": "13",
                        "type": "text"
                    },
                    {
                        "label": "Write label for email user",
                        "category": "Help",
                        "fieldType": "label",
                        "type": "label"
                    }
                ]
            },
            "id": "PBXApmJu0LQA4",
            "xPosition": 483,
            "yPosition": 145,
            "displayname": "Email User",
            "JsonValues": [
                {
                    "name": "nodename",
                    "value": "Email User"
                },
                {
                    "name": "email-user",
                    "value": "{{ticket.requester_email}}"
                },
                {
                    "name": "subject",
                    "value": "Auto generated email"
                },
                {
                    "name": "email-body",
                    "value": "Dear {{ticket.requester_name}},\r\n\r\nWe have received your Email and your request number is {{ticket.id}}.\r\n\r\nOne of our agent will be respond within 24 hours."
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