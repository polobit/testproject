{
    "name": "Tags",
    "thumbnail": "json/nodes/images/email/tags.png",
    "icon": "json/nodes/icons/email/tags.png",
    "info": "Add or delete tag for your customer. You can sort your customers based on tags or generate reports accordingly.",
    "help": "Add or delete tag for your customer. You can sort your customers based on tags or generate reports accordingly.",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "type":"voice",
     "phonesystem": {
                    "type": "static-vxml-form-url",
                    "url": "/vxml/wait.jsp" 
                },
    "category": "Utilities",
    "ui": [{
			"label": "Type",
			"required": "required",
            "category": "Info",
            "name": "type",
            "id": "type",
            "title": "Select the operation type.",
            "options": {"Add":"add",
				        "Delete":"delete"
				       
			          },
			"fieldType": "select",
			"type": "select" 
			
		},{
			"label": "Tag",
			"category": "Info",
			"name": "tag_name",
            "id":"tag_name",
			"title": "Enter the tag value.",
			"fieldType": "input",
            "type": "text" 
			
		},{
            "label": "Add or delete tag for your customer. You can sort your customers based on tags or generate reports accordingly.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}