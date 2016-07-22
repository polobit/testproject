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
            "label": "Browser push notifications are shown on the browser of contact. Make sure that you have the following setup.<br/> <br/>   1.  Import the required files on to your web hosting domain.<br/><br/>   2.    Create a web rule with Action : Enable Push Notification. <br/><br/>Note: Currently it will work only for Chrome and Mozilla browsers. For Mozilla, If the user’ browser is active then only the messages will be shown. ",
            "category": "Help",
            "componet": "label",
            "type": "label"
        }
    ]
}