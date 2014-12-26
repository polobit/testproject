{
    "name": "Close Task",
    "thumbnail": "json/nodes/images/crm/close_task.png",
    "icon": "json/nodes/icons/crm/close_task.png",
    "info": "Close task info",
    "help": "Close task help1",
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
            "label": "help2",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        }
    ]
}