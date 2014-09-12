{
    "name": "Menu",
    "thumbnail": "json/nodes/images/menusms.png",
    "icon": "json/nodes/icons/Menu.png",
    "info": "Match your incoming message with SMS Menu options",
    "help": "Match your incoming message with SMS Menu options",
    "author": "Manohar",
    "company": "Invox",
    "language": "en",
    "branches": "",
    "dynamicports":"yes",
    "dynamicportkey":"storelocatorgrid",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.sms.Menu",
    "category": "Mobile",
    "ui": [ 	
    	{
			"label": "Variable Name",
            "required": "required",
            "category": "Settings",
            "name": "variable_name",
			"minlength" : "4",
			"maxlength" : "25",
            "required": "required",
            "title": "Provide the Variable name (starting with $) in which the desired result was stored.<br><br> Tip: Provide the same variable name as you gathered in GetMessage.",
            "fieldType": "input",
            "type": "text"
        },       
        {
           "label":"Menus",
           "required": "required",
           "type": "grid",
           "category": "Settings",
           "name" : "storelocatorgrid",           	       
           "ui": [
                  {
                    "label":"Option",
                    "required": "required",
                    "name": "dynamicgrid",
                    "id": "ZIP",
                    "title": "Enter the option for your SMS Menu.",
                    "fieldType": "input",
                    "type": "text" 
                  }
           ],
           "defaultvalues": [
                             {
                                 "Name": "Nomatch"
                             } 
                             ]
        },
        {
            "label": "Allow your callers to reach an extension by sms.",
            "category": "Help",
            "componet": "label",
            "type": "label" 
        } 
    ]
}