<%@page import="com.agilecrm.util.TimeZoneUtil"%>
{
    "nodes": [
        {
            "NodeDefinition": {
                "name": "Start",
                "thumbnail": "json/nodes/images/common/Start.png",
                "icon": "json/nodes/icons/common/Start.png",
                "info": "Entry point of your campaign. Please create workflow for your campaign starting from here.",
                "help": "Start point in your campaign workflow.",
                "author": "John",
                "company": "Invox",
                "language": "en",
                "branches": "start",
                "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.Start",
                "category": "Basic",
                "ui": [
                    {
                        "label": "Entry point of your campaign. Please create workflow for your campaign starting from here.",
                        "category": "Help",
                        "componet": "label",
                        "type": "label"
                    }
                ]
            },
            "id": "PBXNODE1",
            "xPosition": 500,
            "yPosition": 10,
            "displayname": "Start",
            "JsonValues": [],
            "States": [
                {
                    "start": "PBXuTyCw5MT2x"
                }
            ]
        },
        {
            "NodeDefinition": {
                "ui": [
                       {
                           "label": "From (Name):",
                           "category": "Info",
                           "name": "from_name",
                           "id": "from_name",
                           "title": "Enter your name.",
                           "required": "required",
                           "fieldType": "input",
                           "type": "text"
                       },
                       {
    					"label": "From (Email):",
    					"category": "Info",
    					"name": "from_email",
    					"id": "from_email",
    					"required": "required",
    					"title": "Select your email address.",
    					"url": "/core/api/account-prefs/verified-emails/all",
    					"dynamicName": "email",
    					"dynamicValue": "email",
    					"arrange_type": "prepend",
    					"fieldType": "dynamicselect",
    					"type": "verified_email",
    					"options": {
        					"Contact's Owner": "{{owner.email}}",
        					"+ Add new": "verify_email"
    						},
    					"event": "onchange",
    					"eventHandler": "openVerifyEmailModal(this)",
    					"style": {
        					"width": "77.5%",
        					"padding": "0.4em"
    						}
						},  
                       {
                           "label": "To",
                           "category": "Info",
                           "name": "to_email",
                           "id": "to_email",
                           "value": "{{email}}",
                           "required": "required",
                           "title": "Enter your subscriber E-mail ID. If you are using a list, you can use {{email}}",
                           "fieldType": "input",
                           "type": "multipleEmails"
                       },
       				{
       					"label": "CC",
       					"category": "Info",
       					"name": "cc_email",
       		            "id":"cc_email",
       					"title": "Enter CC email address",
       					"fieldType": "input",
       		            "type": "multipleEmails"
       				},
       				{
       					"label": "BCC",
       					"category": "Info",
       					"name": "bcc_email",
       		            "id":"bcc_email",
       					"title": "Enter BCC email address",
       					"fieldType": "input",
       		            "type": "multipleEmails"
       				},
                       {
                           "label": "Subject",
                           "category": "Info",
                           "name": "subject",
                           "id": "subject",
                           "required": "required",
                           "title": "Enter your subject for your email.",
                           "fieldType": "input",
                           "type": "text"
                       },
                       {
                           "label": "Reply To",
                           "category": "Info",
                           "name": "replyto_email",
                           "id": "replyto_email",
                           "title": "Enter email your subscribers need to reply.",
                           "fieldType": "input",
                           "type": "email"
                       },
                       {
                           "label": "",
                           "category": "Text",
                           "name": "merge_fields",
                           "id": "merge_fields",
                           "title": "Select required merge field to insert into below Text Field.",
                           "fieldType": "merge_fields",
                           "target_type": "text_email",
                           "type": "select"
                       },
                       {
                           "label": "Text",
                           "category": "Text",
                           "name": "text_email",
                       	   "id": "text_email",
                           "title": "Enter text content here.",
                           "cols": "75",
                           "rows": "13",
                           "required": "required",
                           "fieldType": "textarea",
                           "type": "textarea"
                       },
                       {
                           "category": "Text",
                           "name": "button_email",
                           "id": "button_email",
                           "title": "Send test Email",
                           "required": "required",
                           "value": "Send Test Email",
                           "fieldType": "input",
                           "type": "button",
                           "class": "ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary",
                           "style": {
                               "float": "right",
                               "margin-right": "3px",
                               "background": "none",
                               "border": "none",
                               "text-decoration": "underline",
                               "border-bottom": "1px solid",
                               "padding": "0px 0px 1px 0px",
                               "position": "relative",
                               "outline": "none",
                               "font-size": "11px",
                               "top": "-6px"
                           }
                       },
                       {
                           "label": "",
                           "category": "HTML",
                           "name": "merge_fields",
                           "id": "merge_fields",
                           "title": "Select required merge field to insert into below HTML Field.",
                           "fieldType": "merge_fields",
                           "target_type": "tinyMCEhtml_email",
                           "type": "select"
                       },
                       {
                           "label": "HTML Editor",
                           "category": "HTML",
                           "name": "html_email",
                           "id": "html_email",
                           "title": "Enter Your HTML message.",
                           "fieldType": "html",
                           "type": "html"
                       },
                       {
                           "category": "HTML",
                           "name": "button_email_html",
                           "id": "button_email_html",
                           "title": "Send test Email",
                           "required": "required",
                           "value": "Send Test Email",
                           "fieldType": "input",
                           "type": "button",
                           "class": "ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary",
                           "style": {
                               "float": "right",
                               "margin-right": "3px",
                               "background": "none",
                               "border": "none",
                               "text-decoration": "underline",
                               "border-bottom": "1px solid",
                               "padding": "0px 0px 1px 0px",
                               "position": "relative",
                               "top": "-44px",
                               "outline": "none",
                               "font-size": "11px"
                           }
                       },
                       {
                           "label": "Track Clicks:",
                           "required": "No",
                           "category": "Settings",
                           "name": "track_clicks",
                           "title": "Enable tracking for email link clicks. Use \"Yes &amp; Push\" if you want to push contact data to your website (to enable web activity tracking)",
                           "options": {
                               "*No": "no",
                               "Yes": "yes",
                               "Yes & Push (Email only)": "yes_and_push_email_only",
                               "Yes & Push": "yes_and_push"
                           },
                           "fieldType": "select",
                           "type": "select"
                       },
                       {
                           "label": "Simply choose timezone, day and time. Agile can schedule your email delivery."
                       },
                       {
                           "label": "Time zone",
                           "required": "No",
                           "category": "Settings",
                           "value": "(GMT-06:00) Central Time (US & Canada)",
                           "name": "time_zone",
                           "title": "Select the time zone for your email delivery.",
                           "options": {
                               <%= TimeZoneUtil.getJavaTimeZones(null, null, false) %>
                           },
                           "fieldType": "select",
                           "type": "select"
                       },
                       {
                           "label": "On",
                           "required": "required",
                           "name": "on",
                           "id": "on",
                           "multiple": "multiple",
                           "ismultiple": "true",
                           "title": "Select the weekday for your email delivery.",
                           "options": {
                               "Any Day": "any_day",
                               "Mon-Fri": "Mon-Fri",
                               "Mon-Sat": "Mon-Sat",
                               "Sat-Sun": "Sat-Sun",
                               "Mon": "Mon",
                               "Tue": "Tue",
                               "Wed": "Wed",
                               "Thu": "Thu",
                               "Fri": "Fri",
                               "Sat": "Sat",
                               "Sun": "Sun"
                           },
                           "fieldType": "select",
                           "type": "select"
                       },
                       {
                           "label": "At",
                           "required": "required",
                           "name": "at",
                           "id": "at",
                           "multiple": "multiple",
                           "ismultiple": "true",
                           "title": "Select the time for your email delivery.",
                           "options": {
                               "Any Time": "any_time",
                               "9:00 AM": "09:00",
                               "9:30 AM": "09:30",
                               "10:00 AM": "10:00",
                               "10:30 AM": "10:30",
                               "11:00 AM": "11:00",
                               "11:30 AM": "11:30",
                               "12:00 PM": "12:00",
                               "12:30 PM": "12:30",
                               "1:00 PM": "13:00",
                               "1:30 PM": "13:30",
                               "2:00 PM": "14:00",
                               "2:30 PM": "14:30",
                               "3:00 PM": "15:00",
                               "3:30 PM": "15:30",
                               "4:00 PM": "16:00",
                               "4:30 PM": "16:30",
                               "5:00 PM": "17:00",
                               "5:30 PM": "17:30",
                               "6:00 PM": "18:00",
                               "6:30 PM": "18:30",
                               "7:00 PM": "19:00",
                               "7:30 PM": "19:30",
                               "8:00 PM": "20:00",
                               "8:30 PM": "20:30",
                               "9:00 PM": "21:00",
                               "9:30 PM": "21:30",
                               "10:00 PM": "22:00",
                               "10:30 PM": "22:30",
                               "11:00 PM": "23:00",
                               "11:30 PM": "23:30",
                               "12:00 AM": "00:01",
                               "12:30 AM": "00:30",
                               "1:00 AM": "01:00",
                               "1:30 AM": "01:30",
                               "2:00 AM": "02:00",
                               "2:30 AM": "02:30",
                               "3:00 AM": "03:00",
                               "3:30 AM": "03:30",
                               "4:00 AM": "04:00",
                               "4:30 AM": "04:30",
                               "5:00 AM": "05:00",
                               "5:30 AM": "05:30",
                               "6:00 AM": "06:00",
                               "6:30 AM": "06:30",
                               "7:00 AM": "07:00",
                               "7:30 AM": "07:30",
                               "8:00 AM": "08:00",
                               "8:30 AM": "08:30"
                           },
                           "fieldType": "select",
                           "type": "select"
                       },
                       {
                           "label": "Send email in TEXT or HTML format. You can choose from email-id and name, and optionally specify a different email-id the replies should go to.<br/><br/>You can track if the links in your email are clicked by the recepient. You can set a time when the email should be delivered to the recepient.",
                           "category": "Help",
                           "fieldType": "label",
                           "type": "label"
                       }
                   ],
                "icon": "json/nodes/icons/email/sendemail.png",
                "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.SendEmail",
                "url": "json/nodes/email/send_email.jsp",
                "info": "Send email in text or HTML format. You can choose your delivery day and time.",
                "author": "John",
                "help": "Send email in text or HTML format. You can choose your delivery day and time.",
                "category": "Email",
                "thumbnail": "json/nodes/images/email/sendemail.png",
                "name": "Send Email",
                "company": "mantra",
                "language": "en",
                "branches": "yes"
            },
            "id": "PBXHWo1PHDnoJ",
            "xPosition": 467,
            "yPosition": 250,
            "displayname": "Welcome email",
            "JsonValues": [
                {
                    "name": "nodename",
                    "value": "Welcome email"
                },
                {
                    "name": "from_name",
                    "value": "My Company"
                },
                {
                    "name": "from_email",
                    "value": "{{owner.email}}"
                },
                {
                    "name": "to_email",
                    "value": "{{email}}"
                },
                {
                    "name": "cc_email",
                    "value": ""
                },
                {
                    "name": "subject",
                    "value": "Thanks for signing up {{first_name}}"
                },
                {
                    "name": "replyto_email",
                    "value": ""
                },
                {
                    "name": "merge_fields",
                    "value": ""
                },
                {
                    "name": "text_email",
                    "value": "\r\nText version of message"
                },
                {
                    "name": "merge_fields",
                    "value": ""
                },
                {
                    "name": "html_email",
                    "value": "\r\nHTML version here"
                },
                {
                    "name": "track_clicks",
                    "value": "yes"
                },
                {
                    "name": "time_zone",
                    "value": "ACT"
                },
                {
                    "name": "on",
                    "value": "any_day"
                },
                {
                    "name": "at",
                    "value": "any_time"
                }
            ],
            "States": [
                {
                    "yes": "hangup"
                }
            ]
        },
        {
            "NodeDefinition": {
                "name": "Wait",
                "thumbnail": "json/nodes/images/common/wait.png",
                "icon": "json/nodes/icons/common/wait.png",
                "info": "Wait for a specified duration before next action. Useful for responders and periodic emails.",
                "help": "Wait for a specified duration before next action. Useful for responders and periodic emails.",
                "author": "John",
                "company": "mantra",
                "language": "en",
                "branches": "yes",
                "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.Wait",
                "category": "Utilities",
                "ui": [
{
    "label": " Duration",
    "required": "required",
    "category": "Info",
    "name": "duration",
    "id": "duration",
    "title": "Enter the duration period.",
    "fieldType": "input",
    "type": "number",
    "min": "1"
},
{
    "label": "Type",
    "required": "required",
    "category": "Info",
    "name": "duration_type",
    "id": "duration_type",
    "title": "Select the type of duration.",
    "options": {
        "Days": "days",
        "Business Days": "business days",
        "Hours": "hours",
        "Minutes": "mins"
    },
    "fieldType": "select",
    "type": "select"
},
{
    "label": "Time zone",
    "required": "No",
    "category": "Settings",
    "value": "(GMT-06:00 ) Central Time (US & Canada)",
    "name": "timezone",
    "id": "timezone",
    "title": "Select the time zone of your location.",
    "options": {
         <%= TimeZoneUtil.getJavaTimeZones(null, TimeZoneUtil.ACCOUNT_PREFS, true) %>
    },
    "fieldType": "timezone",
    "type": "select"
},
{
    "label": "Time",
    "required": "required",
    "category": "Settings",
    "name": "at",
    "id": "at",
    "multiple": "multiple",
    "ismultiple": "true",
    "title": "Select the time ",
    "options": {
        "Any time": "any_time",
        "9:00 AM": "09:00",
        "9:30 AM": "09:30",
        "10:00 AM": "10:00",
        "10:30 AM": "10:30",
        "11:00 AM": "11:00",
        "11:30 AM": "11:30",
        "12:00 PM": "12:00",
        "12:30 PM": "12:30",
        "1:00 PM": "13:00",
        "1:30 PM": "13:30",
        "2:00 PM": "14:00",
        "2:30 PM": "14:30",
        "3:00 PM": "15:00",
        "3:30 PM": "15:30",
        "4:00 PM": "16:00",
        "4:30 PM": "16:30",
        "5:00 PM": "17:00",
        "5:30 PM": "17:30",
        "6:00 PM": "18:00",
        "6:30 PM": "18:30",
        "7:00 PM": "19:00",
        "7:30 PM": "19:30",
        "8:00 PM": "20:00",
        "8:30 PM": "20:30",
        "9:00 PM": "21:00",
        "9:30 PM": "21:30",
        "10:00 PM": "22:00",
        "10:30 PM": "22:30",
        "11:00 PM": "23:00",
        "11:30 PM": "23:30",
        "12:00 AM": "00:01",
        "12:30 AM": "00:30",
        "1:00 AM": "01:00",
        "1:30 AM": "01:30",
        "2:00 AM": "02:00",
        "2:30 AM": "02:30",
        "3:00 AM": "03:00",
        "3:30 AM": "03:30",
        "4:00 AM": "04:00",
        "4:30 AM": "04:30",
        "5:00 AM": "05:00",
        "5:30 AM": "05:30",
        "6:00 AM": "06:00",
        "6:30 AM": "06:30",
        "7:00 AM": "07:00",
        "7:30 AM": "07:30",
        "8:00 AM": "08:00",
        "8:30 AM": "08:30"
    },
    "fieldType": "select",
    "type": "select"
},
{
    "label": "Wait for a specified duration before proceeding to the next step.<br/>For example, send email-1, wait for 2 days and then send email-2.",
    "category": "Help",
    "fieldType": "label",
    "type": "label"
}
                ],
                "url": "json/nodes/common/wait.js"
            },
            "id": "PBXuTyCw5MT2x",
            "xPosition": 443,
            "yPosition": 125,
            "displayname": "Wait 5min after Signup",
            "JsonValues": [
                {
                    "name": "nodename",
                    "value": "Wait 5min after Signup"
                },
                {
                    "name": "duration",
                    "value": "5"
                },
                {
                    "name": "duration_type",
                    "value": "mins"
                },
                {
                    "name": "timezone",
                    "value": <% out.println("\""+ TimeZoneUtil.timeZone +"\""); %>
                }
            ],
            "States": [
                {
                    "yes": "PBXHWo1PHDnoJ"
                }
            ]
        }
    ]
}