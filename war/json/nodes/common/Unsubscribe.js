{
    "name": "Unsubscribe",
    "thumbnail": "json/nodes/images/common/unsubscribe.png",
    "icon": "json/nodes/icons/common/unsubscribe.png",
    "info": "Unsubscribe info",
    "help": "Unsubscribe help",
    "author": "Bhasuri",
    "company": "Agile",
    "language": "en",
    "branches": "No,Yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.Unsubscribe",
    "category": "Utilities",
    "ui": [
        {
            "label": "Select a campaign to unsubscribe",
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
            "height": "24px"

            	}
        },
        {
            "label": "help text for unsubscribe",
            "category": "Help",
            "componet": "label",
            "type": "label"
        }
    ]
}