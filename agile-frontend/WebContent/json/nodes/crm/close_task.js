{
    "name": "Close Task",
    "thumbnail": "json/nodes/images/crm/close_task.png",
    "icon": "json/nodes/icons/crm/close_task.png",
    "info": "Mark the tasks related to the contact as completed.",
    "help": "Mark the tasks related to the contact as completed. You can optionally choose to complete only a particular user’s tasks.",
    "author": "Bhasuri",
    "company": "AgileCRM",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name":"com.campaignio.tasklets.agile.CloseTask",
    "category": "crm",
    "ui": [
		{
            "label": "Owner",
            "category": "Info",
            "name": "owner_id",
            "id": "owner_id",
            "title": "Select owner of the task",
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
            "label": "Mark the tasks related to the contact as completed.You can optionally choose to complete only a particular user’s tasks.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        }
    ]
}