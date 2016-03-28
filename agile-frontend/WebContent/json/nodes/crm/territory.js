{
    "name": "Territory",
    "thumbnail": "json/nodes/images/crm/territory.png",
    "icon": "json/nodes/icons/crm/territory.png",
    "info": "Compares given location conditions across territories.",
    "help": "Compares the contact’s address against the territories defined. Each territory can have multiple criteria and the Operator (And/OR) with in each territory can also be defined. If No Match happens, then a Default Nomatch Route will be taken.",
    "author": "Naresh",
    "company": "Agile CRM",
    "language": "en",
    "branches": "",
    "dynamicports":"yes",
    "dynamicportkey":"territories",
    "unique_branches":"yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.Territory",
    "category": "Utilities",
    "ui": [
      {
			"label"   : "Territories Comparison",
			"category": "Settings",
			"name"    : "territories",
			"type"    : "grid",
      "required": "required",
			"ui":[
             {
                "label": "Territory",
                "name": "dynamicgrid",
                "name_on_error": "territory",
    					  "required":"required",
    					  "title":"Enter territory name",
                "fieldType": "input",
                "type": "text",
                "category": "Settings" 
             }, 
             {
                "label": "Type",
                "category": "Settings",
                "title": "Select a type",
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
                  "title": "E.g. {{your custom field}}",
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
                  "title": "Enter a value. Please make sure that codes (e.g., IN) are compared by default for country type.",
                  "fieldType": "input",                    
                  "type": "text"
              },
              {
                "label": "Within Territory",
                "name" : "in_zone_compare",
                "fieldType":"select",
                "type": "select",
                "required":"required",
                "options": {
                  "And": "and",
                  "Or": "or"
                },
                "title":"Select within territory condition.",
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
            "label": "Compares the contact’s address against the territories defined. Each territory can take multiple criteria and also allows defining the operator (AND/OR) within each territory. If there’s no match, then a default No match route will be taken.<br/><br/> In Agile, countries are saved with their respective 2 letter codes by default as per ISO 3166-1 standard (e.g., IN for India, AU for Australia etc).",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}