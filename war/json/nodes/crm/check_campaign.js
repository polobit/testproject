{
    "name": "Check Campaign",
    "thumbnail": "json/nodes/images/common/check_campaign.png",
    "icon": "json/nodes/icons/common/check_campaign.png",
    "info": "Check Campaign info",
    "help": "Check Campaign help 1",
    "author": "Kona",
    "company": "mantra",
    "language": "en",
    "branches": "yes,no",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.CheckCampaign",
    "category": "Utilities",
    "ui": [
        {
            "label": "Campaigns",
            "required": "Yes",
            "category": "Settings",
            "name": "campaign_id",
            "id": "campaign_id",
            "title": "Select campaign from the list.",
            "url": "/core/api/workflows",
            "dynamicName": "name",
            "options": {
            	"Any": "any_campaign"
            },
            "dynamicValue": "id",
            "fieldType": "dynamicselect",
            "type": "select"
        },{
		    
		    "label": "Status",
		    "category": "Settings",
		    "name": "campaign_status",
		    "id": "campaign_status",
		    "title": "Select status from the list.",
            "required": "required",
            "options": {
            	"Any": "any_status",
            	"Active": "active",
            	"Completed": "done"
            },
		    "fieldType":"select",
		    "type": "select"
		},
        {
            "label": "help2",
            "category": "Help",
            "fieldType": "label",
            "type": "label"
        }
    ]
}