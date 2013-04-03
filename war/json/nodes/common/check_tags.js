{
	"name": "Check Tags",
	"thumbnail": "json/nodes/images/email/tags.png",
    "icon": "json/nodes/icons/email/tags.png",
    "info": "Verify whether given tag exists or not for your customer.",
    "help": "Verify whether given tag exists or not for your customer.",
    "author": "Naresh",
    "company": "mantra",
    "language": "en",
    "branches": "no,yes",
    "workflow_tasklet_class_name":"com.campaignio.tasklets.agile.CheckTags",
    "category": "Utilities",
    "ui": [{
			"label": "Tag",
			"required": "required",
            "category": "Info",
            "name": "tag_value",
            "id": "tag_value",
            "title": "Enter the tag values separated by comma.",
			"fieldType": "input",
			"type": "text" 
		},{
            "label": "Verify whether given tag exists or not for your customer.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}
