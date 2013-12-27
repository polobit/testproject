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
            "yPosition": 18,
            "displayname": "Start",
            "JsonValues": [],
            "States": [
                {
                    "start": "PBXaWNs0qaJkZ"
                }
            ]
        },
        {
            "NodeDefinition": {
                "name": "Tweet",
                "thumbnail": "json/nodes/images/social/twitter.png",
                "icon": "json/nodes/icons/social/twitter.png",
                "info": "Tweet or mention automatically.",
                "help": "Tweet or mention automatically.",
                "author": "John",
                "company": "mantra",
                "language": "en",
                "branches": "yes",
                "category": "Mobile",
                "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.TwitterSendMessage",
                "ui": [
                    {
                        "label": "Please allow AgileCRM to <a href=\"javascript:openTwitter()\">access your account</a>",
                        "category": "Settings",
                        "fieldType": "label",
                        "type": "label"
                    },
                    {
                        "label": "UserId:",
                        "required": "required",
                        "category": "Settings",
                        "name": "twitter_account",
                        "id": "twitter_account",
                        "title": "You cannot edit this field. Please allow access using the option listed above.",
                        "fieldType": "input",
                        "type": "text",
                        "readonly": "readonly"
                    },
                    {
                        "label": "Token:",
                        "required": "required",
                        "category": "Settings",
                        "name": "twitter_token",
                        "id": "twitter_token",
                        "title": "You cannot edit this field. Please allow access using the option listed above.",
                        "fieldType": "input",
                        "type": "text",
                        "readonly": "readonly"
                    },
                    {
                        "label": "Token Secret:",
                        "required": "required",
                        "category": "Settings",
                        "name": "twitter_token_secret",
                        "id": "twitter_token_secret",
                        "title": "You cannot edit this field. Please allow access using the option listed above.",
                        "fieldType": "input",
                        "type": "text",
                        "readonly": "readonly"
                    },
                    {
                        "label": "Message: (Status)",
                        "required": "required",
                        "category": "Settings",
                        "name": "message",
                        "id": "message",
                        "title": "Enter your message.",
                        "fieldType": "textarea",
                        "type": "textarea",
                        "rows": "5",
                        "cols": "58"
                    },
                    {
                        "label": "Rate Limit (Hourly):",
                        "required": "required",
                        "category": "Advanced",
                        "name": "rate_limit",
                        "id": "rate_limit",
                        "title": "Rate Limit for posting.",
                        "options": {
                            "5": "5",
                            "10": "10",
                            "20": "20"
                        },
                        "fieldType": "select",
                        "type": "select"
                    },
                    {
                        "label": "Automatically send tweets (@mention) to contacts using your/company twitter account.<br/><br/>You need to give access to Agile CRM to your account and provide a message to be posted. The message you provide will be preceded with a @contactTwitterId and posted as status message in your/company Twitter.",
                        "category": "Help",
                        "fieldType": "label",
                        "type": "label"
                    }
                ],
                "url": "json/nodes/social/tweet.js"
            },
            "id": "PBXaWNs0qaJkZ",
            "xPosition": 472,
            "yPosition": 181,
            "displayname": "Send a Tweet",
            "JsonValues": [
                {
                    "name": "nodename",
                    "value": "Tweet"
                },
                {
                    "name": "twitter_account",
                    "value": ""
                },
                {
                    "name": "twitter_token",
                    "value": ""
                },
                {
                    "name": "twitter_token_secret",
                    "value": ""
                },
                {
                    "name": "message",
                    "value": "Hey {{first_name}}, you had a chance to checkout our offers? \r\nhttp://www.mycompany.com/product/offers.html"
                },
                {
                    "name": "rate_limit",
                    "value": "5"
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