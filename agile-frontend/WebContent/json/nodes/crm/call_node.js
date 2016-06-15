{
    "name": "Call",
    "thumbnail": "json/nodes/images/callnode.png",
    "icon": "json/nodes/icons/sms/callnode.png",
    "info": "Call and play automated voice message",
    "help": "You can enable Twilio Call widget Integration from Admin settings -> preferences",
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
            "label": "Recipient Number:",
            "required": "required", 
            "category": "Settings",
            "name": "Recipient Number",
            "id":"phonenumber1",
            "value":"{{phone}}",
            "title": "Enter the Recipient Number or {{phone}} to play the voice message.",
            "fieldType": "input",
            "type": "text",
            "style": {
                "width": "64%"
            }
        },
        {   
            "label": "Message",
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
            "label": "Redirect Number:",
            "category": "Settings",
            "name": "phonenumber2",
            "id":"phonenumber2",
            "title": "Enter the number to be connected after voice message is played.",
            "fieldType": "input",
            "type": "text",
            "placeholder":"Enter redirect number",
            "style": {
                "width": "64%"
            }
        },
         
         {
            "label": "Call and play automated voice message. Press 1 and connect the Recipient Number with the Redirect Number. ",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}