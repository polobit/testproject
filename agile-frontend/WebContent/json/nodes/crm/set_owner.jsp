{
    "name": "Set Owner",
    "thumbnail": "json/nodes/images/crm/setowner.png",
    "icon": "json/nodes/icons/crm/setowner.png",
    "info": "Set owner to the contact.",
    "help": "Set owner to the contact.",
    "author": "Naresh",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.SetOwner",
    "category": "Utilities",
    "ui": [
        {
            "label": "Owner",
            "required": "Yes",
            "category": "Settings",
            "name": "owner_id",
            "id": "owner_id",
            "title": "Select owner from the list. For Round Robin, select multiple to assign.",
            "url": "/core/api/users",
            "dynamicName": "email",
            "dynamicValue": "id",
            "appendToDynamicName": "name",
            "options": {
            	"Assign all in Round Robin": "ALL"
            },
            "fieldType": "dynamicselect",
            "type": "multiselect"
        },
        {
            "label": "Change the owner of the contact.<br/><br/>An example use case for this could be - If the contact clicks a link in email, set the owner to a sales guy so that the contact shows up in his My Contacts list.",
            "category": "Help",
            "fieldType": "label",
            "type": "label"
        }
    ]
}