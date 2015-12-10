{
    "name": "Notify",
    "thumbnail": "json/nodes/images/crm/notify.png",
    "icon": "json/nodes/icons/crm/notify.png",
    "info": "Show notification to user(s)",
    "help": "Show notification to specified user(s)",
    "author": "Naresh",
    "company": "Agilecrm",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.Notify",
    "category": "Crm",
    "ui": [
        {
            "label": "Notification Name:",
            "category": "Info",
            "name": "notify_name",
            "id": "notify_name",
            "required": "required",
            "title": "Enter content of notification",
            "fieldType": "input",
            "type": "text"
        },
        {
            "label": "Users",
            "category": "Info",
            "name": "owner_id",
            "id": "owner_id",
            "title": "Select user",
            "url": "/core/api/users",
            "dynamicName": "email",
            "dynamicValue": "id",
            "appendToDynamicName": "name",
            "options": {
                "All": "any_owner",
                "Contact's Owner": "contact_owner"
            },
            "fieldType": "dynamicselect",
            "type": "select"
        },
        {
            "label": "Show notification to specified user(s)",
            "category": "Help",
            "fieldType": "label",
            "type": "label"
        }
    ]
}