{
    "name": "Ticket Type",
    "thumbnail": "json/nodes/images/ticket/ticket-type.png",
    "icon": "json/nodes/icons/ticket/ticket-type.png",
    "info": "Check if a link in the email is clicked within a specified duration.",
    "help": "Check if a link in the email is clicked within a specified duration.",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.TicketType",
    "category": "type",
    "ui": [
        {
            "label": "Type",
            "required": "required",
            "category": "Info",
            "name": "ticket-type",
            "id": "ticket-type",
            "title": "Select Ticket Type",
            "options": {
                "Question": "question",
                "Incident": "incident",
                "Problem": "problem",
                "Task": "task"
            },
            "fieldType": "select",
            "type": "select"
        },
        {
            "label": "Write label for ticket type",
            "category": "Help",
            "fieldType": "label",
            "type": "label"
        }
    ]
}