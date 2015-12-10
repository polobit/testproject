{
    "name": "Has Event?",
    "thumbnail": "json/nodes/images/crm/has_event.png",
    "icon": "json/nodes/icons/crm/has_event.png",
    "info": "Checks whether an Event exists for this contact.",
    "help": "Checks whether an Event exists for this contact.",
    "author": "Bhasuri",
    "company": "AgileCRM",
    "language": "en",
    "branches": "no,yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.HasEvent",
    "category": "crm",
    "ui": [
        {
            "label": "Owner",
            "category": "Info",
            "name": "owner_id",
            "id": "owner_id",
            "title": "Select owner of the event",
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
            "label": "Status",
            "category": "Info",
            "name": "event_status",
            "id": "event_status",
            "title": "Select status of event from the list.",
            "required": "required",
            "options": {
                "Any": "any_status",
                "Upcoming": "upcoming_event",
                "Completed": "completed_event"
            },
            "type": "select"
        },
        {
            "label": "Type",
            "category": "Info",
            "name": "event_type",
            "id": "event_type",
            "title": "Select type of event from the list.",
            "required": "required",
            "options": {
                "Any": "any_type",
                "Online Appointments": "online_appointments"
            },
            "type": "select"
        },
        {
            "label": "Checks whether an Event exists for this contact.",
            "category": "Help",
            "fieldType": "label",
            "type": "label"
        }
    ]
}