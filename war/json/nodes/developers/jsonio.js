{
    "name": "JSON IO",
    "thumbnail": "json/nodes/images/common/jsonio.png",
    "icon": "json/nodes/icons/common/jsonio.png",
    "info": "Integrate your workflow with your web infrastructure using JSON.",
    "help": "ContactSpot can query your URL to retrieve or update information.",
    "author": "Manohar",
    "company": "Invox",
    "language": "en",
    "branches": "failure,success",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.basic.JSONNode",
    "category": "Developers",
    "ui": [
        {
            "label": "URL:",
            "category": "Settings",
			"required":"required",
            "name": "rest_url",
            "title": "Please enter a valid REST URL",
            "fieldType": "input",
            "type": "url" 
        },{
            "label": "Method type:",
            "required": "No",
            "category": "Settings",
            "name": "method_type",
            "title": "Select the appropriate type for accessing the URL, POST or GET.",
            "options": {
                "*Get": "get",
                "Post": "post",
                "Delete": "delete",
                "Put": "put" 
            },
            "fieldType": "select",
            "type": "select" 
        },{
			"label"   : "Params",
			"category": "Settings",
			"name"    : "rest_key_grid",
			"type"    : "grid",
			"ui":[
			       {
				     "label": "Key",
                     "name": "rest_key",
					 "required":"required",
					 "title":"Please enter keyname",
                     "fieldType": "input",
                     "type": "text" 
                  },
                  {
                      "label": "Value",
                      "name": "rest_value",
					  "required":"required",
					  "title":"Please enter value",
                      "fieldType": "input",
                      "type": "text" 
                  }
				],
			"defaultvalues":
					[
			           {
                          "keyName":"email",
						  "valueName":"{{email}}"
					   }
					 ]
		},
        {
            "label": "ContactSpot can query given URL by posting desired parameters. The returned JSON values can be used in rest of the workflow. Eg: $retVal1",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}