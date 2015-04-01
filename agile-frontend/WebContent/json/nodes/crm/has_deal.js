{
    "name": "Has Deal?",
    "thumbnail": "json/nodes/images/crm/has_deal.png",
    "icon": "json/nodes/icons/crm/has_deal.png",
    "info": "Checks whether a Deal exists for this contact.",
    "help": "Checks whether a Deal exists for this contact.",
    "author": "Naresh",
    "company": "AgileCRM",
    "language": "en",
    "branches": "no,yes",
    "workflow_tasklet_class_name":"com.campaignio.tasklets.agile.HasDeal",
    "category": "crm",
    "ui": [{
		    
		    "label": "Track & Milestone",
		    "category": "Info",
		    "name": "milestone",
		    "id": "milestone",
		    "title": "Select milestone from the list.",
            "required": "required",
            "options": {
            	"*Any": "any_milestone"
            },
		    "fieldType":"milestones",
		    "type": "select"
		},
		{
            "label": "Deal Owner",
            "category": "Info",
            "name": "owner_id",
            "id": "owner_id",
            "title": "Select owner of the case",
            "url": "/core/api/users",
            "dynamicName": "email",
            "dynamicValue": "id",
            "appendToDynamicName": "name",
            "options": {
            	"Any Owner": "any_owner",
            	"Contact's Owner": "contact_owner"
            },
            "fieldType": "dynamicselect",
            "type": "select"
        },
		{
            "label": "Checks whether a Deal exists for this contact. You can check for a specific milestone or owner.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        }
    ]
}