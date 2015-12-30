{
    "name": "Add Task",
    "thumbnail": "json/nodes/images/common/addtask.png",
    "icon": "json/nodes/icons/common/addtask.png",
    "info": "Add a task in Agile related to the contact.",
    "help": "Add a task in Agile related to the contact.",
    "author": "Naresh",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.AddTask",
    "category": "Utilities",
    "ui": [
        {
            "label": "Task",
            "required": "required",
            "category": "Info",
            "name": "subject",
            "id": "subject",
            "title": "Enter the task name",
            "fieldType": "input",
            "type": "text"
        },
        {
			"label": "Category",
            "category": "Info",
            "name": "category",
            "id": "category",
            "title": "Select the category type",
            "fieldType": "categories",
            "type": "select"
        },
        {
            "label": "Priority",
            "category": "Info",
            "name": "priority",
            "id": "priority",
            "title": "Select the priority type",
            "options": {
            	"Normal": "NORMAL",
                "High": "HIGH",
                "Low": "LOW"
            },
            "fieldType": "select",
            "type": "select"
        },
        {
            "label": "Due Days",
            "required": "required",
            "category": "Info",
            "name": "due_days",
            "id": "due_days",
            "title": "Enter the number of Due Days.",
            "fieldType": "input",
            "type": "number",
            "min": "0"
        },
        {
            "label": "Owner",
            "required": "Yes",
            "category": "Info",
            "name": "owner_id",
            "title": "Select Owner of the task.",
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
            "label": "Add a task related to a contact in the CRM.<br/><br/>For example, if a contact opens and clicks a link in your email, then you might want to add a task to your list for Calling him/her. <br/><br/>When this task is created, the contact is automatically added to the 'Related to' field in the task.",
            "category": "Help",
            "fieldType": "label",
            "type": "label"
        }
    ]
}