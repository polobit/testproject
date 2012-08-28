{
    "name": "Sex",
    "thumbnail": "json/nodes/images/common/sex.png",
    "icon": "json/nodes/icons/common/sex.png",
    "info": "Retrieve the gender of the subscriber based on email address.",
    "help": "ContactSpot uses Rapleaf to retrieve the gender of the subscriber based on the email address.",
    "author": "John",
    "company": "Invox",
    "language": "en",
    "branches": "Male,Female,Unknown",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.basic.Sex",
    "category": "Email",
    "ui": [
        
        {
            "label": "Email ID",
            "required": "required",
            "category": "Settings",
            "name": "email",
            "title": "Enter a valid email ID.",
            "fieldType": "input",
            "type": "email",
            "value": "$subscriber.Email"
        },
        {
            "label": "ContactSpot uses Rapleaf to retrieve the gender of the subscriber based on the email address.",
            "category": "Help",
            "componet": "label",
            "type": "label" 
        } 
    ]
}