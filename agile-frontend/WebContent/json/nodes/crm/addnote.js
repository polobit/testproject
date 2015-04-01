{
    "name": "Add Note",
    "thumbnail": "json/nodes/images/crm/addnote.png",
    "icon": "json/nodes/icons/crm/addnote.png",
    "info": "Add a note to the contact in Agile.",
    "help": "Add a note to the contact in Agile.",
    "author": "john",
    "company": "Invox",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.AddNote",
    "category": "Utilities",
    "ui": [
        {
          "label": "About",
          "required": "required",
          "category": "Info",
           "name": "subject",
           "id": "subject",
           "title": "Enter your subject",
           "fieldType": "input",
           "type": "text" 
        },
        {
            "label": "Add Note",
            "category": "Info",
            "name": "description",
            "id": "description",
            "title": "Enter your note here.",
            "cols": "75",
            "rows": "13",
            "fieldType": "textarea",
            "type": "textarea" 
        },{
            "label": "Add a note to a contact in CRM. <br/><br/>For example, if a contact opens and clicks a link in your email, then you might want to add a note about it.<br/><br/>Notes related to a contact can be viewed in the Notes tab in Contact details page.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}