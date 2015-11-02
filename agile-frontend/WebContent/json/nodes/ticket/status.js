{
    "name": "Status",
    "thumbnail": "json/nodes/images/ticket/status.png",
    "icon": "json/nodes/icons/ticket/status.png",
    "info": "Check if a link in the email is clicked within a specified duration.",
    "help": "Check if a link in the email is clicked within a specified duration.",
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
                "Closed": "CLOSED"
            },
            "fieldType": "select",
            "type": "select"
        },
        {
            "label": "Check if the email recepient has clicked on a link in the email. Here, you need to mention the maximum waiting period before it proceeds to the next step. <br/><br/>This node has 2 exit paths - Yes and No.<br/><ul><li>If there is a click, then the control moves through the 'Yes' path without waiting any further.</li><br/><li> If the recepient did not click any link in the preceding email, it waits here for specified time. If there is no click till the max wait time, it moves through the 'No' path. </li></ul>",
            "category": "Help",
            "fieldType": "label",
            "type": "label"
        }
    ]
}