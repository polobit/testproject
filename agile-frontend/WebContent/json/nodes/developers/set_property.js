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
            "label": "Set",
            "category": "Settings",
            "name": "action",
            "event":"onclick",
            "eventHandler":"remove_property",
            "options": {
            "SET_NULL": "set to null (blank)"
            },
            "title": "Select set button to set the Select Property <br/> Select Set to null(blank) button to remove the Select Property ",
            "type": "radio",
            "fieldType":"radio"   
        },
        {
            "category": "Settings",
            "name": "action",
            "event":"onclick",
            "eventHandler":"add_property",
            "options": {
            "SET": "set"
            },
            "title": "Select set button to add the Select Property <br/> Select Set to null(blank) button to remove the Select Property ",
            "type": "radio",
            "fieldType": "radio"
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