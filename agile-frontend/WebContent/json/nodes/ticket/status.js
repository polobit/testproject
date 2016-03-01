{
    "name": "Status",
    "thumbnail": "json/nodes/images/ticket/status.png",
    "icon": "json/nodes/icons/ticket/status.png",
    "info": "Change the status of a ticket as open,pending or closed.",
    "help": "",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.TicketStatus",
    "category": "Tickets",
    "ui": [
        {
            "label": "Status",
            "required": "required",
            "category": "Info",
            "name": "status",
            "id": "status",
            "title": "Select status",
            "options": {
                "Open": "OPEN",
                "Pending": "PENDING",
                "Closed": "CLOSED"
            },
            "fieldType": "select",
            "type": "select"
        },
        {
            "label": "",
            "category": "Help",
            "fieldType": "label",
            "type": "label"
        }
    ]
}