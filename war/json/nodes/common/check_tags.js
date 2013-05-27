{
	"name": "Check Tags",
	"thumbnail": "json/nodes/images/email/checktags.png",
    "icon": "json/nodes/icons/email/checktags.png",
    "info": "Verify whether given tag exists for a contact in Agile.",
    "help": "Verify whether given tag exists for a contact in Agile.",
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
            "label": "Check whether given tag exists on a contact.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}
