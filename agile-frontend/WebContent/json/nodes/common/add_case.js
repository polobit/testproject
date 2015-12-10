{
    "name": "Add Case",
    "thumbnail": "json/nodes/images/crm/addcase.png",
    "icon": "json/nodes/icons/crm/addcase.png",
    "info": "Add a case to the contact in Agile.",
    "help": "Add a case to the contact in Agile.",
    "author": "Naresh",
    "company": "Agilecrm",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.AddCase",
    "category": "crm",
    "ui": [
        {
            "label": "Title",
            "required": "required",
            "category": "Info",
            "name": "title",
            "id": "title",
            "title": "Enter title of the case",
            "fieldType": "input",
            "type": "text"
        },
        {
            "label": "Status",
            "required": "required",
            "category": "Info",
            "name": "status",
            "id": "status",
            "title": "Select status",
            "options": {
                "Open": "OPEN",
                "Closed": "CLOSE"
            },
            "fieldType": "select",
            "type": "select"
        },
        {
            "label": "Owner",
            "category": "Info",
            "name": "owner_id",
            "id": "owner_id",
            "title": "Select owner of the case",
            "url": "/core/api/users",
            "dynamicName": "email",
            "dynamicValue": "id",
            "appendToDynamicName": "name",
            "options": {
            	"Contact's Owner": "contact_owner"
            },
            "fieldType": "dynamicselect",
            "type": "select"
        },
        {
            "label": "Description",
            "category": "Info",
            "name": "description",
            "id": "description",
            "title": "Enter description for the case.",
            "cols": "58",
            "rows": "3",
            "fieldType": "textarea",
            "type": "textarea"
        },
        {
            "label": "Add a case to a contact in CRM. Cases related to a contact can be viewed in the Cases tab in Contact details page.",
            "category": "Help",
            "fieldType": "label",
            "type": "label"
        }
    ]
}