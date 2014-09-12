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
            "label": "Checks whether given tag exists for a contact. If multiple tags separated by comma are given, then the condition will be evaluated to Yes only when ALL tags exists for that contact.<br/><br/>For example, if 'lead, paid' are given then the condition will be evaluated to Yes only if both lead and paid exists, otherwise No if only lead exists.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}
