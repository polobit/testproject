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
            "required": "required",
            "category": "Settings",
            "name": "variable_1",
            "title": "Select merge field.",
            "options": {
                "First Name": "{{first_name}}",
                "Last Name": "{{last_name}}",
                "Email": "{{email}}",
                "Score": "{{score}}",
                "Created Date": "{{created_date}}",
                "Modified Date": "{{modified_date}}",
                "Company": "{{company}}",
        		"Title": "{{title}}",
        		"Website": "{{website}}",
        		"Phone":"{{phone}}",
        		"City": "{{location.city}}",
        		"State":"{{location.state}}",
        		"Country":"{{location.country}}",
        		"Twitter Id":"{{twitter_id}}",
        		"LinkedIn Id":"{{linkedin_id}}",
        		"Owner Name":"{{owner.name}}",
        		"Owner Email":"{{owner.email}}"
            },
            "fieldType": "select",
            "type": "select" 
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
            "title": "Variable name (eg: {{variable}}) or value (eg: 5).",
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