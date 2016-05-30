{
    "name": "Voice Call",
    "thumbnail": "json/nodes/images/sms/sendmessage.png",
    "icon": "json/nodes/icons/sms/sendmessage.png",
    "info": "Make a voice call",
    "help": "You can enable SMS Gateway Integration from Admin settings -> preferences",
    "author": "Sonali",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.CallNode",
    "category": "URL",
    "type":"voice",
    "ui": [{
            "label": " From:",
            "required": "required", 
            "category": "Settings",
            "name": "from",
            "id":"from",
            "title": "Select Number",
            "fieldType": "twilio_number",
            "type": "select",
            "style": {
                "width": "66%"
                }
            
        },{
            "label": "Customer Number:",
            "required": "required", 
            "category": "Settings",
            "name": "phonenumber1",
            "id":"phonenumber1",
            "title": "Enter the recipient number or {{phone}}",
            "fieldType": "input",
            "type": "text",
            "style": {
                "width": "64%"
            }
        },
        {   
            "label": "Message",
           "required": "required",
            "category": "Settings",
            "name": "message",
            "id": "message",
            "title": "Enter your message.",
            "cols": "50",
            "rows": "10",
            "fieldType": "textarea",
            "type": "textarea" 
         },
         {
            "label": "Owner Number:",
            "category": "Settings",
            "name": "phonenumber2",
            "id":"phonenumber2",
            "title": "Enter the recipient number",
            "fieldType": "input",
            "type": "text",
            "placeholder":"Enter your number",
            "style": {
                "width": "64%"
            }
        },
         
         {
            "label": "Forwarding a voice call using to the contac.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}