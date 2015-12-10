{
    "name": "Change Deal Milestone",
    "thumbnail": "json/nodes/images/crm/change_deal_milestone.png",
    "icon": "json/nodes/icons/crm/change_deal_milestone.png",
    "info": "Change the milestone for Deal(s) related to this contact.",
    "help": "Change the milestone for Deal(s) related to this contact.",
    "author": "Naresh",
    "company": "AgileCRM",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name":"com.campaignio.tasklets.agile.ChangeDealMilestone",
    "category": "crm",
    "ui": [
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
            	"Any Owner":"any_owner",
            	"Contact's Owner": "contact_owner"
            },
            "fieldType": "dynamicselect",
            "type": "select"
        },
        {
		    "label": "Current Track & Milestone",
		    "category": "Info",
		    "name": "current_milestone",
		    "id": "current_milestone",
		    "title": "Select current milestone",
            "required": "required",
            "options": {
            	"*Any": "any_milestone"
            },
		    "fieldType":"milestones",
		    "type": "select"
		},
{
		    "label": "New Track & Milestone",
		    "category": "Info",
		    "name": "new_milestone",
		    "id": "new_milestone",
		    "title": "Select track and milestone to convert.",
            "required": "required",
		    "fieldType":"milestones",
		    "type": "select"
		},
		{
            "label": "Change the milestone for Deal(s) related to this contact. You can choose a specific Owner and Current Milestone.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        }
    ]
}