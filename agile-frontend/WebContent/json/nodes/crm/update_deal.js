{
    "name": "Update Deal",
    "thumbnail": "json/nodes/images/crm/update_deal.png",
    "icon": "json/nodes/icons/crm/update_deal.png",
    "info": "Update your deals here.",
    "help": "Update your deals here.",
    "author": "sonali",
    "company": "agilecrm",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.UpdateDealNode",
    "category": "crm",
    "ui": [{
        
        "label": "Track & Milestone",
        "category": "Info",
        "name": "milestone",
        "id": "milestone",
        "title": "Select milestone from the list.",
        "options": {
              "Select": ""
            },
        "fieldType":"milestones",
        "type": "select",
         "required": "required"
       
       
    },
    {
            "label": "Expected_Value",
              "category": "Info",
              "name": "expected_value",
              "id": "expected_value",
              "title": "Enter Value",
              "fieldType":"input",
              "type": "text"
             
       },
       
    {
            "label": "You can update deal for a specific milestone or owner.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        }
        
    ]
}
