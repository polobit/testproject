{
    "name": "Set Property",
    "thumbnail": "json/nodes/images/common/SetProperty.png",
    "icon": "json/nodes/icons/common/SetProperty.png",
    "info": "Change the value of a specific property for the Contact",
    "help": "Change the value of a specific property for the Contact",
    "author": "Bhasuri",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.SetProperty",
    "category": "Utilities",
    "ui": [
        {
            "label": "Select Property",
            "required": "required",
            "category": "Settings", 
            "name": "updated_field",
            "id": "updated_field",
            "title": "Enter the field value. <br/>Dates as mm/dd/yyyy <br/>+1 to increment dates or numbers <br/> Check the help tab for details.",
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
        	"label": "For date fields use the format mm/dd/yyyy.<br/>It also supports incrementing number & date properties. To increment a date or number by 2, you may specify &quot;+2&quot; (without quotes). Date will be incremented by 2 days in this case.<br/>For fields of type List, the value should match one of the List values (case sensitive)",
            "category": "Help",
            "componet": "label",
            "type": "label" 
        }
    ]
}