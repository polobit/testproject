{
    "name": "Condition",
    "thumbnail": "json/nodes/images/sms/Condition.png",
    "icon": "json/nodes/icons/sms/Condition.png",
    "info": "Check for a condition (IF/Value) in your workflow on ticket.",
    "help": "Check for a condition (IF/Value) in your workflow on ticket.",
    "author": "john",
    "company": "Invox",
    "language": "en",
    "branches": "No,Yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.TicketCondition",
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
                "value": "value"
            },
            "fieldType": "select",
            "type": "select" 
        },
        
        {
        	"label": "of",
            "required": "required",
            "category": "Settings",
            "name": "variable_1",
            "title": "Check value on.",
            "multiple": "multiple",
            "ismultiple": "true",
            "value": "",
            "options": {
                "Ticket Id": "{{ticket.id}}",
                "Requester Name": "{{ticket.requester_name}}",
                "Requester Email": "{{ticket.requester_email}}",
                "Status": "{{ticket.status}}",
                "Priority": "{{ticket.priority}}",
                "Ticket Type": "{{ticket.type}}",
                "Subject": "{{ticket.subject}}",
                "Last Updated By": "{{ticket.last_updated_by}}"
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
            "title": "Enter a value.<br><br> Status possible values 'OPEN,PENDING,CLOSED' <br> Priority possible values 'LOW, MEDIUM, HIGH' <br> Ticket Type possible values 'INCIDENT, QUESTION, TASK, PROBLEM' <br> Last Updated By possible values 'AGENT, REQUESTER'",
            "fieldType": "input",
            "type": "text" 
        },
        {
            "label": "Check for a condition (if/value/len) in your workflow.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}