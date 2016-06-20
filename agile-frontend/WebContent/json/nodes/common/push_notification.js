{
    "name": "Push Notification",
    "thumbnail": "json/nodes/images/common/push.png",
    "icon": "json/nodes/icons/common/push.png",
    "info": "Send a push notification to contact and also track click event in a specified duration.",
    "help": "Send a push notification to contact and also track click event in a specified duration.",
    "author": "Prashannjeet",
    "company": "Invox",
    "language": "en",
    "branches": "Yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.PushNotification",
    "category": "web",
    "ui": [
        {
            "label": "Title",
            "required": "required",
            "category": "Info",
            "name": "notification_title",
            "id": "notification_title_value",
            "title": "Enter a Title for push notification",
            "fieldType": "input",
            "type": "text"
        },
         {
            "label": "Message",
            "required": "required",
            "category": "Info",
            "name": "notification_message",
            "id": "notification_message_value",
            "title": "Enter a Message for push notification",
            "fieldType": "input",
            "type": "text"
        },
         {
            "label": "Link URL",
            "required": "required",
            "category": "Info",
            "name": "notification_url",
            "id": "notification_url_value",
            "title": "Enter a link url for push notification",
            "fieldType": "input",
            "type": "url"
        },
         {
            "label": "Icon URL",
            "required": "required",
            "category": "Info",
            "name": "notification_icon",
            "id": "notification_icon_value",
            "title": "Enter a link url for push notification",
            "fieldType": "input",
            "type": "url"
        },
        {
            "label": "Push notification is worked through webrules",
            "category": "Help",
            "componet": "label",
            "type": "label"
        }
    ]
}