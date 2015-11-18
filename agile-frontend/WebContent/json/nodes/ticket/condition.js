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
                "Created Time": "{{ticket.created_time}}",
                "Assigned Time": "{{ticket.assigned_time}}",
                "Closed Time": "{{ticket.closed_time}}",
                "Last Updated Time": "{{ticket.last_updated_time}}",
                "Last Updated By": "{{ticket.last_updated_by}}",
                "First Replied Time": "{{ticket.first_replied_time}}",
                "Last Agent Replied Time": "{{ticket.last_agent_replied_time}}",
                "Last Customer Replied Time": "{{ticket.last_customer_replied_time}}",
                "First Notes Text": "{{ticket.first_notes_text}}",
                "Last Notes Text": "{{ticket.last_reply_text}}"
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
            "title": "Enter a value. For Date value enter in 'mm/dd/yyyy' <br><br> Status possible values 'NEW, OPEN, CLOSED' <br> Priority possible values 'LOW, MEDIUM, HIGH' <br> Ticket Type possible values 'INCIDENT, QUESTION, TASK, PROBLEM' <br> Last Updated By possible values 'AGENT, REQUESTER'",
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