{
    "name": "Push Notification",
    "thumbnail": "json/nodes/images/common/push.png",
    "icon": "json/nodes/icons/common/push.png",
    "info": "Send a browser push notification to your contacts.",
    "help": "Send a browser push notification to your contacts.",
    "author": "Prashannjeet",
    "company": "Invox",
    "language": "en",
    "branches": "Yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.PushNotification",
    "category": "web",
    "ui": [
         {
            "label": "Push Notification Template",
            "category": "Info",
            "name": "push_notification_template_name",
            "id": "push_notification_template_id",
            "required": "required",
            "title": "Select Push Notification Template",
            "url": "/core/api/push/notifications",
            "dynamicName": "notificationName",
            "dynamicValue": "id",
            "appendToDynamicName": "name",
            "options": {
                "Select Push Notification Template": ""
            },
            "fieldType": "dynamicselect",
            "type": "select"
        },
        {
            "label": "Browser push notifications are shown on the browser of contact. Make sure that you have the following setup.<br/> <br/>   1.  Import the required files on to your web hosting domain.<br/><br/>   2.    Create a web rule with Action : Enable Push Notification. <br/><br/>Note: Currently it will work only for Chrome and Mozilla browsers. For Mozilla, If the user’ browser is active then only the messages will be shown. ",
            "category": "Help",
            "componet": "label",
            "type": "label"
        }
    ]
}