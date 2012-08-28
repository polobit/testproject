{
    "name": "Menu",
    "thumbnail": "json/nodes/images/sms/menunodesms.png",
    "icon": "json/nodes/icons/sms/menunodesms.png",
    "info": "Allow your callers to reach an extension by sms.",
    "help": "MultiConditional lets you configure Extensions. It allows your callers to reach any extension by simply sending a sms.",
    "author": "Manohar",
    "company": "Invox",
    "language": "en",
    "branches": "",
    "dynamicports":"yes",
    "dynamicportkey":"storelocatorgrid",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.sms.Menu",
    "category": "Standard PBX, Routing",
    "ui": [
    	
    	{
			"label": "Variable Name",
            "required": "required",
            "category": "Settings",
            "name": "variable_name",
			"minlength" : "4",
			"maxlength" : "25",
            "required": "required",
            "title": "Provide the Variable name in which the desired result was stored.<br><br> Tip: you can provide the same variable name here as $var-name Which you have used in GetNWord/GetMessage to store the result.",
            "cols": "50", 
            "rows": "5",
            "fieldType": "input",
            "type": "text" 

        },
        
        {
           "label":"Names",
           "required": "required",
           "type": "grid",
           "category": "Settings",
           "name" : "storelocatorgrid",           	       
           "ui": [
                  {
                    "label":"Name",
                    "required": "required",
                    "name": "dynamicgrid",
                    "id": "ZIP",
                    "title": "Enter the name for the user at this extension.",
                    "fieldType": "input",
                    "type": "text" 
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