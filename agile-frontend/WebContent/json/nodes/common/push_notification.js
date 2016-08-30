{
    "name": "Push Notification",
    "thumbnail": "json/nodes/images/common/push.png",
    "icon": "json/nodes/icons/common/push.png",
    "info": "Engage with your audience through Browser Push notification.",
    "help": "Engage with your audience through Browser Push notification.",
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
            "label": "Engage with your audience easily through Browser notification. Schedule and send messages to engage the right users at the most relevant time through our Marketing Campaigns.. <br/><br/>Note: Currently it will work only for Chrome 42 or above and Firefox browser. For Firefox, If the audience browser is active then only the messages will be shown. ",
            "category": "Help",
            "componet": "label",
            "type": "label"
        }
    ]
}