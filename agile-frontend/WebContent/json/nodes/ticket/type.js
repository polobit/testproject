{
    "name": "Ticket Type",
    "thumbnail": "json/nodes/images/ticket/ticket-type.png",
    "icon": "json/nodes/icons/ticket/ticket-type.png",
    "info": "Change the type of a ticket.",
    "help": "Change the type of a ticket.",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.TicketType",
    "category": "Tickets",
    "ui": [
        {
            "label": "Type",
            "required": "required",
            "category": "Info",
            "name": "ticket-type",
            "id": "ticket-type",
            "title": "Select Ticket Type",
            "options": {
                "Question": "QUESTION",
                "Incident": "INCIDENT",
                "Problem": "PROBLEM",
                "Task": "TASK"
            },
            "fieldType": "select",
            "type": "select"
        },
        {
            "label": "Change the type of a ticket.",
            "category": "Help",
            "fieldType": "label",
            "type": "label"
        }
    ]
}