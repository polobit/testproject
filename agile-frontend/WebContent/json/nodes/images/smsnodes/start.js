{
    "name": "Start",
    "thumbnail": "json/nodes/images/Start.png",
    "icon": "json/nodes/icons/Start.png",
    "info": "Entry point from where the actual execution of the application starts.",
    "help": "Entry point from where the actual execution of the application starts.You can specify few setting which will be applicable to whole application.",
    "author": "John",
    "company": "Invox",
    "language": "en",
    "branches": "start",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.sms.Start",
    "category": "Basic, Free application, Engilsh",
    "ui": [
        {
            "label": "<b>Language:</b>",
            "title": "Select the language you wish for speech recognisation and text to speech.",
            "name": "language",
            "fieldType": "select",
            "category": "Language",
            "type": "select",
            "value": "en-US",
            "options": {
                "US-English" : "en-US",
                "UK-English" : "en-GB",
                "French" : "fr-CA",
                "German" : "de-DE"
            } 
        },
        {
            "label": "<b>Gender:</b>",
            "title": "Select the gender for text to speech.This will be used while converting text to audio files in Play Message.",
            "name": "gender",
            "fieldType": "select",
            "category": "Language",
            "type": "select",
            "value": "Male",
            "options": {
               "Male": "male",
                "Female": "female" 
            } 
        },
        {
            "label": "Entry point from where the actual execution of the application starts. <br/>You can specify few setting which will be applicable to whole application.",
            "category": "Help",
            "componet": "label",
            "type": "label" 
        } 
    ]
}