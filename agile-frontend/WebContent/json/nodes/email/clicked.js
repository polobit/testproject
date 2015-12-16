{
    "name": "Clicked?",
    "thumbnail": "json/nodes/images/email/clicked.png",
    "icon": "json/nodes/icons/email/clicked.png",
    "info": "Check if a link in the email/sms is clicked within a specified duration.",
    "help": "Check if a link in the email/sms is clicked within a specified duration.",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches": "no,yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.Clicked",
    "category": "Email",
    "ui": [
        {
            "label": " Max wait time",
            "required": "required",
            "category": "Info",
            "name": "duration",
            "id": "duration",
            "title": "Enter the max wait time.",
            "fieldType": "input",
            "type": "number",
            "min": "0"
        },
        {
            "label": "Type",
            "required": "required",
            "category": "Info",
            "name": "duration_type",
            "id": "duration_type",
            "title": "Select the type of duration.",
            "options": {
                "Days": "days",
                "Hours": "hours",
                "Minutes": "mins"
            },
            "fieldType": "select",
            "type": "select"
        },
        {
            "label": "Check if the email/sms recepient has clicked on a link in the email/sms. Here, you need to mention the maximum waiting period before it proceeds to the next step. <br/><br/>This node has 2 exit paths - Yes and No.<br/><ul><li>If there is a click, then the control moves through the 'Yes' path without waiting any further.</li><br/><li> If the recepient did not click any link in the preceding email/sms, it waits here for specified time. If there is no click till the max wait time, it moves through the 'No' path. </li></ul>",
            "category": "Help",
            "fieldType": "label",
            "type": "label"
        }
    ]
}