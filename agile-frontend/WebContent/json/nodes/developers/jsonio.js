{
    "name": "JSON IO",
    "thumbnail": "json/nodes/images/common/jsonio.png",
    "icon": "json/nodes/icons/common/jsonio.png",
    "info": "Integrate your workflow with your web infrastructure using JSON. Push or retrieve data to/from your other applications.",
    "help": "Integrate your workflow with your web infrastructure using JSON. Push or retrieve data to/from your other applications.",
    "author": "Manohar",
    "company": "Invox",
    "language": "en",
    "branches": "failure,success",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.JSONNode",
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
                "Post": "post"
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
            "label": "Integrate your workflow with your web infrastructure using JSON IO. You can retrive or post information with a JSON Http call to a given URL and defined URL parameters. <br/><br/>The returned JSON will be merged and this can be used in the rest of the workflow. <br/><br/>You can find more documentation with an example <a href='https://github.com/agilecrm/agile-crm-json-io-node' target='_blank'>here</a>",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}