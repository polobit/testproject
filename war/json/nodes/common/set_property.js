{
    "name": "Set Property",
    "thumbnail": "json/nodes/images/common/SetProperty.png",
    "icon": "json/nodes/icons/common/SetProperty.png",
    "info": "Change the value of a specific property for the Contact",
    "help": "Change the value of a specific property for the Contact",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.SetProperty",
    "category": "Utilities",
    "ui": [
        {
            "label": " Update Filed",
            "required": "required",
            "category": "Settings", 
            "name": "updated_field",
            "id": "updated_field",
            "title": "Select the field.",
            "fieldType": "update_field",
            "type": "select"
        },
        {
            "label": "Value",
            "required": "required",
            "category": "Settings",
            "name": "updated_value",
            "id": "updated_value",
            "title": "Enter the value",
            "fieldType": "input",
            "type": "text"
        },
        {
        	"label": "Change the value of a specific property for the Contact",
            "category": "Help",
            "componet": "label",
            "type": "label" 
        }
    ]
}