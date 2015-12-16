{
    "name": "Condition",
    "thumbnail": "json/nodes/images/sms/Condition.png",
    "icon": "json/nodes/icons/sms/Condition.png",
    "info": "Check for a condition (IF/Value/Len) in your workflow.",
    "help": "Check for a condition (if/value/len) in your workflow.",
    "author": "john",
    "company": "Invox",
    "language": "en",
    "branches": "No,Yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.Condition",
    "category": "Developers",
    "ui": [
        {
            "label": "IF",
            "required": "required",
            "category": "Settings",
            "name": "if_type",
            "title": "Variable type.",
            "multiple": "multiple",
            "ismultiple": "true",
            "value": "value",
            "options": {
                "value": "value",
                "strlen": "strlen"
            },
            "fieldType": "select",
            "type": "select" 
        },
        {
        	"label": "of",
            "category": "Settings",
            "name": "condition_merge",
            "id": "condition_merge",
            "title": "Select required merge field.",
            "fieldType": "merge_fields",
            "target_type": "new_field",
            "type": "select",
            "event": "onchange",
            "eventHandler": "insertSelectedOption",
            "style": {
                "float": "none"
            }
            	
        },
        
        {
        	
            "category": "Settings",
            "required": "required",
            "id": "new_field",
            "name": "variable_1",
            "title": "E.g. {{score}}, {{company}}, <br>{{your custom field}}",
            "fieldType": "input",
            "type": "text" 
        },
        {
            "label": "compare this",
            "required": "required",
            "category": "Settings",
            "name": "comparator",
            "title": "Operation type.",
            "multiple": "multiple",
            "ismultiple": "true",
            "value": "<",
            "options": {
                "less than": "less_than",
                "greater than": "greater_than",
                "less than or equals": "less_than_or_equals",
                "greater than or equals": "greater_than_or_equals",
                "not equal to": "not_equal_to",
                "equal to": "equal_to",
                "contains": "contains"
            },
            "fieldType": "select",
            "type": "select" 
        },
        {
            "label": "with",
            "required": "required",
            "category": "Settings",
            "name": "variable_2",
            "title": "Enter a value. For Date value enter in 'mm/dd/yyyy'",
            "fieldType": "input",
            "type": "text" 
        },
        {
            "label": "Check for a condition (IF/Value/Len) in your workflow.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}