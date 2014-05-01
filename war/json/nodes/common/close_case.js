{
    "name": "Close Case",
    "thumbnail": "json/nodes/images/crm/addcase.png",
    "icon": "json/nodes/icons/crm/close_case.png",
    "info": "Close cases related to this contact.",
    "help": "Close cases related to this contact.",
    "author": "Naresh",
    "company": "Agilecrm",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.CloseCase",
    "category": "crm",
    "ui": [
        {
            "label": "Case Owner",
            "category": "Info",
            "name": "owner_id",
            "id": "owner_id",
            "title": "Select owner of the case",
            "url": "/core/api/users",
            "dynamicName": "email",
            "dynamicValue": "id",
            "appendToDynamicName": "name",
            "options": {
            	"Any Owner": "any_owner",
            	"Contact's Owner": "contact_owner"
            },
            "fieldType": "dynamicselect",
            "type": "select"
        },
        {
            "label": "Close cases that are in 'Open' state for the campaign subscriber. You can choose to close cases based on a specific owner.",
            "category": "Help",
            "fieldType": "label",
            "type": "label"
        }
    ]
}