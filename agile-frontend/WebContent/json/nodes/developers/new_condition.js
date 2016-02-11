{
    "name": "Condition",
    "thumbnail": "json/nodes/images/sms/Condition.png",
    "icon": "json/nodes/icons/sms/Condition.png",
    "info": "Check for Multiple Conditions in Your Workflow.",
    "help": "Check for Multiple Conditions in Your Workflow.",
    "author": "john",
    "company": "Invox",
    "language": "en",
    "branches": "No,Yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.NewCondition",
    "category": "Developers",
    "ui": [
        {
			"label"   : "And",
			"category": "Settings",
			"name"    : "and_key_grid",
			"type"    : "grid",
			"style": {
				"overflow-y":"scroll"
            }, 
			"ui":[
			       {
			    	   "label": "If",
			            "required": "required",
			            "category": "Settings",
			            "name": "and_if_type",
			            "title": "Variable type.",
			            "multiple": "multiple",
			            "ismultiple": "true",
			            "value": "value",
			            "options": {
			                "value": "value",
			                "strlen": "strlen"
			            },
			            "fieldType": "select",
			            "type": "select"
                  },
                  {
                	  "label": "of",
                      "category": "Settings",
                      "id": "condition_merge",
                      "title": "Select required merge field.",
                      "fieldType": "merge_fields",
                      "target_type": ".new_field1",
                      "type": "select",
                      "event": "onchange",
                      "eventHandler": "insertSelectedOption1",
                      "invisible": "true",
                      "style": {
                          "float": "none"
                      } 
                  },
                  {
                	"label": "variable",
                  	"required": "required",
                    "category": "Settings",
                    "id": "new_field1",
                    "class":"new_field1",
                    "name": "and_variable_1",
                    "title": "E.g. {{score}}, {{company}}, <br>{{your custom field}}",
                    "fieldType": "input",                    
                    "type": "text"
                },
                {
                    "label": "compare this",
                    "required": "required",
                    "category": "Settings",
                    "name": "and_comparator",
                    "title": "Operation type.",
                    "multiple": "multiple",
                    "ismultiple": "true",
                    "value": "<",
                    "options": {
                        "less than": "less_than",
                        "greater than": "greater_than",
                        "less than or equals": "less_than_or_equals",
                        "greater than or equals": "greater_than_or_equals",
                        "not equal to": "not_equal_to",
                        "equal to": "equal_to",
                        "contains": "contains"
                    },
                    "fieldType": "select",
                    "type": "select" 
                },
                {
                    "label": "with",
                    "required": "required",
                    "category": "Settings",
                    "name": "and_variable_2",
                    "title": "Enter a value. For Date value enter in 'mm/dd/yyyy'",
                    "fieldType": "input",
                    "type": "text" 
                }
				]
		},{
			"label"   : "Or",
			"category": "Settings",
			"name"    : "or_key_grid",
			"type"    : "grid",
			"style": {
				"overflow-y":"scroll"
            },
			"ui":[
			       {
			    	   "label": "If",
			            "required": "required",
			            "category": "Settings",
			            "name": "or_if_type",
			            "title": "Variable type.",
			            "multiple": "multiple",
			            "ismultiple": "true",
			            "value": "value",
			            "options": {
			                "value": "value",
			                "strlen": "strlen"
			            },
			            "fieldType": "select",
			            "type": "select"
                 },
                 {
               	  "label": "of",
                     "category": "Settings",
                     "name": "or_condition_merge",
                     "id": "condition_merge",
                     "title": "Select required merge field.",
                     "fieldType": "merge_fields",
                     "target_type": ".new_field2",
                     "type": "select",
                     "event": "onchange",
                     "eventHandler": "insertSelectedOption1",
                     "invisible": "true",
                     "style": {
                         "float": "none"
                     } 
                 },
                 {
                	"label": "variable",
                 	"required": "required",
                   "category": "Settings",
                   "id": "new_field2",
                   "class":"new_field2",
                   "name": "or_variable_1",
                   "title": "E.g. {{score}}, {{company}}, <br>{{your custom field}}",
                   "fieldType": "input",
                   "type": "text"
               },
               {
                   "label": "compare this",
                   "required": "required",
                   "category": "Settings",
                   "name": "or_comparator",
                   "title": "Operation type.",
                   "multiple": "multiple",
                   "ismultiple": "true",
                   "value": "<",
                   "options": {
                       "less than": "less_than",
                       "greater than": "greater_than",
                       "less than or equals": "less_than_or_equals",
                       "greater than or equals": "greater_than_or_equals",
                       "not equal to": "not_equal_to",
                       "equal to": "equal_to",
                       "contains": "contains"
                   },
                   "fieldType": "select",
                   "type": "select" 
               },
               {
                   "label": "with",
                   "required": "required",
                   "category": "Settings",
                   "name": "or_variable_2",
                   "title": "Enter a value. For Date value enter in 'mm/dd/yyyy'",
                   "fieldType": "input",
                   "type": "text" 
               }
				]
		},
        {
            "label": "Check for Multiple Conditions in Your Workflow.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}