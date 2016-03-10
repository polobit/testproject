{
    "name": "Update Deal",
    "thumbnail": "json/nodes/images/crm/update_deal.png",
    "icon": "json/nodes/icons/crm/update_deal.png",
    "info": "Updates latest deal of contact with Milestone/Value or both.",
    "help": "Updates latest deal of contact with Milestone/Value or both.",
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
        "type": "select"          
    
    },
    {
              "label": "Value",
              "category": "Info",
              "name": "expected_value",
              "id": "expected_value",
              "title": "Enter value or merge field",
              "fieldType":"input", 
              "type": "text"
             
       },
       
    {
            "label": "Updates latest deal of contact with Milestone/Value or both.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        }
        
    ]
}
