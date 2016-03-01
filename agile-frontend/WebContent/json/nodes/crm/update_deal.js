{
    "name": "Update Deal",
    "thumbnail": "json/nodes/images/crm/update_deal.png",
    "icon": "json/nodes/icons/crm/update_deal.png",
    "info": "Update your latest deal.",
    "help": "Update your latest deal.",
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
            "label": " Update your latest deal with Milestone/Value or both.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        }
        
    ]
}
