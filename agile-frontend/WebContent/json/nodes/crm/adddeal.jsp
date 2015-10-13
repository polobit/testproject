{
    "name": "Add Deal",
    "thumbnail": "json/nodes/images/crm/adddeal.png",
    "icon": "json/nodes/icons/crm/adddeal.png",
    "info": "Add a deal in Agile related to the contact.",
    "help": "Add a deal in Agile related to the contact.",
    "author": "Naresh",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.AddDeal",
    "category": "Utilities",
    "ui": [
        {
            "label": "Deal Title",
            "required": "required",
            "category": "Info",
            "name": "deal_name",
            "id": "deal_name",
            "title": "Enter the name of a deal.",
            "fieldType": "input",
            "type": "text"
        },
        {
            "label": "Value",
            "category": "Info",
            "name": "expected_value",
            "id": "expected_value",
            "title": "Enter the expected value of a deal.",
            "required": "required",
            "fieldType": "input",
            "type": "number",
            "min": "0",
            "max": "1000000000000"
        },
        {
            "label": "Probability (%)",
            "category": "Info",
            "name": "probability",
            "id": "probability",
            "title": "Enter the probability value less than 100. Eg. 50",
            "required": "required",
            "fieldType": "input",
            "type": "number",
            "min": "0",
            "max": "100"
        },
        {
            "label": "Expected closure (in Days)",
            "required": "required",
            "category": "Info",
            "name": "days_to_close",
            "id": "close_date",
            "title": "Expected close date of the deal from the time it is created.",
            "fieldType": "input",
            "type": "number",
            "min": "0"
        },
        {
            "label": "Track & Milestone",
            "category": "More details",
            "name": "milestone",
            "id": "milestone",
            "title": "Select milestone from the list.",
            "required": "required",
            "fieldType": "milestones",
            "type": "select"
        },
        {
            "label": "Deal Source",
            "required": "Yes",
            "category": "More details",
            "name": "deal_source_id",
            "title": "Select deal source.",
            "url": "/core/api/categories?entity_type=DEAL_SOURCE",
            "dynamicName": "label",
            "dynamicValue": "id",
            "options": {
                "Select..": ""
            },
            "fieldType": "dynamicselect",
            "type": "select"
        },
        {
            "label": "Owner",
            "required": "Yes",
            "category": "More details",
            "name": "owner_id",
            "title": "Select Owner of the deal.",
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
            "category": "More details",
            "name": "description",
            "id": "description",
            "title": "Describe the deal.",
            "cols": "58",
            "rows": "3",
            "fieldType": "textarea",
            "type": "textarea"
        },
        {
            "label": "Add a deal related to a contact in the CRM.<br/><br/>For example, if a contact opens and clicks a link in your email, then you might want to add a deal. <br/><br/>When this deal is created, the contact is automatically added to the 'Related to' field in the deal.",
            "category": "Help",
            "fieldType": "label",
            "type": "label"
        }
    ]
}