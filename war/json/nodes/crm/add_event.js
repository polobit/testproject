{
    "name": "Add Event",
    "thumbnail": "json/nodes/images/crm/add_event.png",
    "icon": "json/nodes/icons/crm/add_event.png",
    "info": "Add an Event to Contact in Agile.",
    "help": "Add an Event to Contact in Agile.",
    "author": "Naresh",
    "company": "Agilecrm",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.AddEvent",
    "category": "crm",
    "ui": [
        {
            "label": "Event Name",
            "required": "required",
            "category": "Info",
            "name": "event_name",
            "id": "event-name",
            "title": "Enter name of the event",
            "fieldType": "input",
            "type": "text"
        },
        {
            "label": "Priority",
            "required": "required",
            "category": "Info",
            "name": "priority",
            "id": "priority",
            "title": "Select priority",
            "options": {
                "High": "HIGH",
                "*Normal": "NORMAL",
                "Low": "LOW"
            },
            "fieldType": "select",
            "type": "select"
        },
        {
            "label": "Start event after (in Days)",
            "required": "required",
            "category": "Info",
            "title": "Enter number of days to start",
            "name": "days_to_start",
            "id": "days_to_start",
            "fieldType": "input",
            "type": "number",
            "min": "0",
            "autocomplete": "off"
        },
        {
            "label": "Event Duration",
            "required": "required",
            "category": "Info",
            "title": "Select duration of an event",
            "name": "event_duration",
            "id": "event_duration",
            "fieldType": "select",
            "type": "select",
            "options": {
            	"All day": "all_day",
            	"15 min": "15",
            	"30 min": "30",
            	"1 hr": "60",
            	"2 hr": "120",
                "4 hr": "240",
                "8 hr": "480",
                "12 hr": "720"
            }
        },
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
                "Contact's Owner": "contact_owner"
            },
            "fieldType": "dynamicselect",
            "type": "select"
        },
        {
            "label": "Add an event to a contact in CRM. Events related to a contact can be viewed in the Events tab in Contact details page.",
            "category": "Help",
            "fieldType": "label",
            "type": "label"
        }
    ]
}