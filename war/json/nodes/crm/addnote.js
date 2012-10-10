{
    "name": "Add Note",
    "thumbnail": "json/nodes/images/crm/addnote.png",
    "icon": "json/nodes/icons/crm/addnote.png",
    "info": "Add a note for your existing lead in your CRM",
    "help": "Add a note for your existing lead in your CRM",
    "author": "john",
    "company": "Invox",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name": "com.agilecrm.tasklets.AddNote",
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
            "required": "required",
            "category": "Info",
            "name": "add_note",
            "id": "add_note",
            "title": "Enter your note here.",
            "cols": "75",
            "rows": "13",
            "fieldType": "textarea",
            "type": "textarea" 
        },{
            "label": "Add a note for your existing lead in your CRM",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}