{
    "name": "Transfer",
    "thumbnail": "json/nodes/images/common/transfer.png",
    "icon": "json/nodes/icons/common/transfer.png",
    "info": "Transfer the contact into a different campaign.",
    "help": "Transfer the contact into a different campaign.",
    "author": "Naresh",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.Transfer",
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
            "dynamicValue": "id",
            "fieldType": "dynamicselect",
            "callback": "update_list_with_disabled",
            "type": "select"
        },
        {
            "label": "Transfer the contact into a different campaign. For example, if a contact completes a purchase on your website, you can transfer the contact to a \"Welcome Customer\" campaign!",
            "category": "Help",
            "fieldType": "label",
            "type": "label"
        }
    ]
}