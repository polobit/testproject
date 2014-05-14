{
    "name": "Replied?",
    "thumbnail": "json/nodes/images/email/replied.png",
    "icon": "json/nodes/icons/email/replied.png",
    "info": "Checks if an email was replied to by the contact.",
    "help": "Checks if an email was replied to by the contact.",
    "author": "Naresh",
    "company": "Agilecrm",
    "language": "en",
    "branches": "no,yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.Replied",
    "category": "Email",
    "ui": [
        {
        	"label": "Mailbox",
        	"category": "Info",
        	"name": "mailbox",
        	"id": "mailbox",
        	"title": "Select whose mailbox (IMAP preferences) should be used.",
        	"url": "/core/api/users",
        	"dynamicName": "email",
        	"dynamicValue":"id",
        	"appendToDynamicName": "name",
        	"fieldType": "dynamicselect",
        	"type": "select"
        },
        {
            "label": "From (Email):",
            "category": "Info",
            "name": "search_from_email",
            "id": "search_from_email",
            "value":"{{email}}",
            "required": "required",
            "title": "Enter email address to search.",
            "fieldType": "input",
            "type": "email"
        },
        {
            "label": "Subject:",
            "category": "Info",
            "name": "search_subject",
            "id": "search_subject",
            "title": "Enter partial or complete email subject to search.",
            "placeholder":"Leave this empty if you want to match all emails",
            "fieldType": "input",
            "type": "text"
        },
        {
            "label": "This node searches the specified user's email account (IMAP search) for any emails from the contact with the given subject. <br/><br/>This will work only if the Agile CRM User selected here has linked his/her email account with Agile.<br><br> For Gmail accounts, we search all folders and for IMAP accounts we search the Inbox folder.",
            "category": "Help",
            "fieldType": "label",
            "type": "label"
        }
    ]
}