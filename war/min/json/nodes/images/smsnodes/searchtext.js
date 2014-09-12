{
    "name": "Search Text ",
    "thumbnail": "json/nodes/images/sms/searchtext.png",
    "icon": "json/nodes/icons/sms/searchtext.png",
    "info": "It will search if a token is present.",
    "help": "It will search if a token is present.",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches": "yes,no",
    "type": "voice",
    "phonesystem": {
                    "type": "static-vxml-form-url",
                    "url": "/vxml/searchtext.jsp" 
                }, 
    "category": "Standard PBX, Recommended",
    "ui": [
        {
			"label": "Message",
            "required": "required",
            "category": "Settings",
            "name": "searchtoken",
            "title": "It will search if a token is present.",
            "cols": "50", 
            "rows": "5",
            "fieldType": "textarea",
            "type": "textarea" 

        },
        {
            "label": "It will search if a token is present.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}