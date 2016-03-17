{
    "name": "Territory",
    "thumbnail": "json/nodes/images/crm/territory.png",
    "icon": "json/nodes/icons/crm/territory.png",
    "info": "Compares given location conditions across zones.",
    "help": "Compares given location conditions across zones and goto first true zone/branch, otherwise Nomatch branch",
    "author": "Naresh",
    "company": "Agile CRM",
    "language": "en",
    "branches": "",
    "dynamicports":"yes",
    "dynamicportkey":"zones",
    "unique_branches":"yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.Territory",
    "category": "Utilities",
    "ui": [
      {
			"label"   : "Location",
			"category": "Settings",
			"name"    : "zones",
			"type"    : "grid",
      "required": "required",
			"ui":[
             {
                "label": "Zones",
                "name": "dynamicgrid",
    					  "required":"required",
    					  "title":"Please enter value",
                "fieldType": "input",
                "type": "text",
                "category": "Settings" 
             }, 
             {
                "label": "Type",
                "category": "Settings",
                "title": "Select location",
                "options": {
                    "Select a type": "",
                    "country": "{{location.country}}",
                    "state": "{{location.state}}",
                    "city": "{{location.city}}",
                    "custom field" : "CUSTOM_FIELD"
                },
                "fieldType": "select",
                "type": "select",
                "target_type": ".location-type",
                "invisible": "true",
                "event":"onchange",
                "eventHandler":"show_location_type"
              },
              {
                  "label": "Location Type",
                  "required": "required",
                  "category": "Settings",
                  "id": "location-type",
                  "class":"location-type",
                  "name": "location_type",
                  "title": "E.g. {{score}}, {{company}}, <br>{{your custom field}}",
                  "fieldType": "input",                    
                  "type": "text"
              },
              {
               "label": "Compares",
                "category": "Settings",
                "name": "comparator",
                "options": {
                      "equal to": "equal_to",
                      "not equal to": "not_equal_to",
                      "contains": "contains"
                },
                "title": "Select condition",
                "fieldType": "select",
                "type": "select"
              },
             {
                  "label": "Value",
                  "required": "required",
                  "category": "Settings",
                  "name": "location_value",
                  "title": "You can also provide your own custom field. E.g. {{your custom field}}",
                  "fieldType": "input",                    
                  "type": "text"
              },
              {
                "label": "Within Zone",
                "name" : "in_zone_compare",
                "fieldType":"select",
                "type": "select",
                "options": {
                  "And": "and",
                  "Or": "or"
                },
                "title":"Select within zone condition.",
                "in_grid_popup" : false,
                "add_in_each_row": true
              }
				],
			"defaultvalues":
					[
			          {
                  "dynamicgrid": "Nomatch",
                  "location_type" : "-",
                  "comparator": "-",
                  "location_value" : "-",
                  "in_zone_compare": "-"
                } 
					 ]
		},
    {
            "label": "Compares given location conditions across zones and goto first true zone/branch, otherwise Nomatch branch.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}