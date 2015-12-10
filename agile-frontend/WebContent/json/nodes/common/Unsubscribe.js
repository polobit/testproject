{
    "name": "Unsubscribe",
    "thumbnail": "json/nodes/images/common/unsubscribe.png",
    "icon": "json/nodes/icons/common/unsubscribe.png",
    "info": "Unsubscribe the contact from selected campaign.",
    "help": "Unsubscribe the contact from selected campaigns.You can unsubscribe the contact from either a specific campaign or all the campaigns the contact is currently in.",
    "author": "Bhasuri",
    "company": "Agile",
    "language": "en",
    "branches": "Yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.Unsubscribe",
    "category": "Utilities",
    "ui": [
        {
            "label": "Select a campaign to unsubscribe",
            "title":"Unsubscribe from All Campaigns / Selected Campaigns",
            "required": "required",
            "category": "Settings",
            "name": "unsubscribe",
            "id": "unsubscribe",
            "title": "Select a campaign",
            "fieldType": "campaign_list",
            "type": "select",
            "style":
            	{
            	"margin-top": "10px",
            	"height": "100px",
            	"width":"50%"
            	}
        },
        {
            "label": "Unsubscribe the contact from selected campaigns.You can unsubscribe the contact from either a specific campaign or all the campaigns the contact is currently in.",
            "category": "Help",
            "componet": "label",
            "type": "label"
        }
    ]
}