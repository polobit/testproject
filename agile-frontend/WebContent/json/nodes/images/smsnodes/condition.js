{
    "name": "Condition",
    "thumbnail": "json/nodes/images/sms/Condition.png",
    "icon": "json/nodes/icons/sms/Condition.png",
    "info": "This will check answer given by contestant is currect or not.",
    "help": "This will check answer given by contestant is currect or not.",
    "author": "john",
    "company": "Invox",
    "language": "en",
    "branches": "No,Yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.sms.Condition",
    "category": "Voice Automation-IVR, Developers",
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
            "required": "required",
            "category": "Settings",
            "value": "",
            "name": "variable_1",
            "title": "Variable name (eg: $variable) or value (eg: 5).",
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
                "equal to": "equal_to"
            },
            "fieldType": "select",
            "type": "select" 
        },
        {
            "label": "with",
            "required": "required",
            "category": "Settings",
            "name": "variable_2",
            "title": "Variable name (eg: $variable) or value (eg: 5).",
            "fieldType": "input",
            "type": "text" 
        },
        {
            "label": "Invox lets you check conditions between a literal and another literal -- or between a literal and a constant. (The conditions are: greater than, less than, equal to, and not equal to.) <br><br>There is no need to add $ before the variable name. For a constant, please enclose your value in quotes () if it is a string.<br><br>Strlen (String length) allows you to check for empty variables (When you are retrieving data from the database or REST, variables may be empty). <br><br>This is also useful when checking the length of a variable from Get Input if you want to restrict your callers to entering a fixed number of digits from the keypad.</br>",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}