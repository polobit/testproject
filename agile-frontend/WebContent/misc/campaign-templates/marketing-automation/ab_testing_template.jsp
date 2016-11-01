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
            "yPosition": 22,
            "displayname": "Start",
            "JsonValues": [],
            "States": [
                {
                    "start": "PBXpU9eGA61uF"
                }
            ]
        },
        {
            "NodeDefinition": {
                "name": "A/B",
                "thumbnail": "json/nodes/images/email/abtesting.png",
                "icon": "json/nodes/icons/email/abtesting.png",
                "info": "A/B testing can be used to test contact response with different messages in your email.",
                "help": "A/B testing can be used to test contact response with different messages in your email.",
                "author": "John",
                "company": "mantra",
                "language": "en",
                "branches": "A,B",
                "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.AB",
                "category": "Email",
                "ui": [
                    {
                        "label": "Frequency (Less than 1 - eg: 0.5)",
                        "required": "required",
                        "category": "Info",
                        "name": "frequency",
                        "id": "frequency",
                        "value": "0.5",
                        "title": "Enter the frequency for your A/B testing. Eg: 0.5 for 50%",
                        "fieldType": "input",
                        "type": "number",
                        "max": "1"
                    },
                    {
                        "label": "This is useful when you want to test what messages/content in the email gives you maximum clicks.<br/><br/>This node has two exit paths - A and B.<br/>So, if you have 1000 users going through this campaign, some users will be taken through path A, and some through path B. How many, will depend on the 'Frequency' parameter you set.<br/>If you set the Frequency to 0.6, approximately 600 will go through path A.",
                        "category": "Help",
                        "fieldType": "label",
                        "type": "label"
                    }
                ],
                "url": "json/nodes/email/ab.js"
            },
            "id": "PBXpU9eGA61uF",
            "xPosition": 501,
            "yPosition": 131,
            "displayname": "A/B",
            "JsonValues": [
                {
                    "name": "nodename",
                    "value": "A/B"
                },
                {
                    "name": "frequency",
                    "value": "0.5"
                }
            ],
            "States": [
                {
                    "A": "PBXXraTdnwfgy"
                },
                {
                    "B": "PBXPoNuVXePmu"
                }
            ]
        },
        {
            "NodeDefinition": {
                "name": "Send Email",
                "thumbnail": "json/nodes/images/email/sendemail.png",
                "icon": "json/nodes/icons/email/sendemail.png",
                "info": "Send email in text or HTML format. You can choose your delivery day and time.",
                "help": "Send email in text or HTML format. You can choose your delivery day and time.",
                "author": "John",
                "company": "mantra",
                "language": "en",
                "branches": "yes",
                "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.SendEmail",
                "category": "Email",
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
                "url": "json/nodes/email/send_email.jsp"
            },
            "id": "PBXXraTdnwfgy",
            "xPosition": 342,
            "yPosition": 271,
            "displayname": "Send Email - A",
            "JsonValues": [
                {
                    "name": "nodename",
                    "value": "Send Email - A"
                },
                {
                    "name": "from_name",
                    "value": "Me"
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
                    "value": "Subject Test - A"
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
                    "value": "Mail test - A"
                },
                {
                    "name": "merge_fields",
                    "value": ""
                },
                {
                    "name": "html_email",
                    "value": "Mail test - A"
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
                    "yes": "PBXOFanCdMqz3"
                }
            ]
        },
        {
            "NodeDefinition": {
                "name": "Send Email",
                "thumbnail": "json/nodes/images/email/sendemail.png",
                "icon": "json/nodes/icons/email/sendemail.png",
                "info": "Send email in text or HTML format. You can choose your delivery day and time.",
                "help": "Send email in text or HTML format. You can choose your delivery day and time.",
                "author": "John",
                "company": "mantra",
                "language": "en",
                "branches": "yes",
                "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.SendEmail",
                "category": "Email",
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
                "url": "json/nodes/email/send_email.jsp"
            },
            "id": "PBXPoNuVXePmu",
            "xPosition": 612,
            "yPosition": 275,
            "displayname": "Send Email - B",
            "JsonValues": [
                {
                    "name": "nodename",
                    "value": "Send Email - B"
                },
                {
                    "name": "from_name",
                    "value": "Me"
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
                    "value": "Subject Test - B"
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
                    "value": "Mail test - B"
                },
                {
                    "name": "merge_fields",
                    "value": ""
                },
                {
                    "name": "html_email",
                    "value": "Mail test - B"
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
                    "yes": "PBXZs9mUniNL0"
                }
            ]
        },
        {
            "NodeDefinition": {
                "name": "Tags",
                "thumbnail": "json/nodes/images/email/tags.png",
                "icon": "json/nodes/icons/email/tags.png",
                "info": "Add or delete tag for your customer. You can sort your customers based on tags or generate reports accordingly.",
                "help": "Add or delete tag for your customer. You can sort your customers based on tags or generate reports accordingly.",
                "author": "John",
                "company": "mantra",
                "language": "en",
                "branches": "yes",
                "type": "voice",
                "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.Tags",
                "category": "Utilities",
                "ui": [
                    {
                        "label": "Type",
                        "required": "required",
                        "category": "Info",
                        "name": "type",
                        "id": "type",
                        "title": "Select the operation type.",
                        "options": {
                            "Add": "add",
                            "Delete": "delete"
                        },
                        "fieldType": "select",
                        "type": "select"
                    },
                    {
                        "label": "Tag",
                        "required": "required",
                        "category": "Info",
                        "name": "tag_names",
                        "id": "tag_names",
                        "title": "Enter the tag values separated by comma",
                        "fieldType": "input",
                        "type": "text"
                    },
                    {
                        "label": "Add/remove tags to a contact.<br/><br/>For example, if a customer visits a particular product page on your website, you may add a tag with the product name to the contact.",
                        "category": "Help",
                        "fieldType": "label",
                        "type": "label"
                    }
                ],
                "url": "json/nodes/crm/tags.js"
            },
            "id": "PBXOFanCdMqz3",
            "xPosition": 348,
            "yPosition": 378,
            "displayname": "Tag - Sent-A",
            "JsonValues": [
                {
                    "name": "nodename",
                    "value": "Tag - Sent-A"
                },
                {
                    "name": "type",
                    "value": "add"
                },
                {
                    "name": "tag_names",
                    "value": "Sent-A"
                }
            ],
            "States": [
                {
                    "yes": "PBX8DTgEwvMbv"
                }
            ]
        },
        {
            "NodeDefinition": {
                "name": "Tags",
                "thumbnail": "json/nodes/images/email/tags.png",
                "icon": "json/nodes/icons/email/tags.png",
                "info": "Add or delete tag for your customer. You can sort your customers based on tags or generate reports accordingly.",
                "help": "Add or delete tag for your customer. You can sort your customers based on tags or generate reports accordingly.",
                "author": "John",
                "company": "mantra",
                "language": "en",
                "branches": "yes",
                "type": "voice",
                "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.Tags",
                "category": "Utilities",
                "ui": [
                    {
                        "label": "Type",
                        "required": "required",
                        "category": "Info",
                        "name": "type",
                        "id": "type",
                        "title": "Select the operation type.",
                        "options": {
                            "Add": "add",
                            "Delete": "delete"
                        },
                        "fieldType": "select",
                        "type": "select"
                    },
                    {
                        "label": "Tag",
                        "required": "required",
                        "category": "Info",
                        "name": "tag_names",
                        "id": "tag_names",
                        "title": "Enter the tag values separated by comma",
                        "fieldType": "input",
                        "type": "text"
                    },
                    {
                        "label": "Add/remove tags to a contact.<br/><br/>For example, if a customer visits a particular product page on your website, you may add a tag with the product name to the contact.",
                        "category": "Help",
                        "fieldType": "label",
                        "type": "label"
                    }
                ],
                "url": "json/nodes/crm/tags.js"
            },
            "id": "PBXZs9mUniNL0",
            "xPosition": 619,
            "yPosition": 379,
            "displayname": "Tag - Sent-B",
            "JsonValues": [
                {
                    "name": "nodename",
                    "value": "Tag - Sent-B"
                },
                {
                    "name": "type",
                    "value": "add"
                },
                {
                    "name": "tag_names",
                    "value": "Sent-B"
                }
            ],
            "States": [
                {
                    "yes": "PBXyFFVgT3d3T"
                }
            ]
        },
        {
            "NodeDefinition": {
                "name": "Clicked?",
                "thumbnail": "json/nodes/images/email/clicked.png",
                "icon": "json/nodes/icons/email/clicked.png",
                "info": "Check if a link in the email is clicked within a specified duration.",
                "help": "Check if a link in the email is clicked within a specified duration.",
                "author": "John",
                "company": "mantra",
                "language": "en",
                "branches": "no,yes",
                "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.Clicked",
                "category": "Email",
                "ui": [
                    {
                        "label": " Max wait time",
                        "required": "required",
                        "category": "Info",
                        "name": "duration",
                        "id": "duration",
                        "title": "Enter the max wait time.",
                        "fieldType": "input",
                        "type": "number",
                        "min": "0"
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
                            "Hours": "hours",
                            "Minutes": "mins"
                        },
                        "fieldType": "select",
                        "type": "select"
                    },
                    {
                        "label": "Check if the email recepient has clicked on a link in the email. Here, you need to mention the maximum waiting period before it proceeds to the next step. <br/><br/>This node has 2 exit paths - Yes and No.<br/><ul><li>If there is a click, then the control moves through the 'Yes' path without waiting any further.</li><br/><li> If the recepient did not click any link in the preceding email, it waits here for specified time. If there is no click till the max wait time, it moves through the 'No' path. </li></ul>",
                        "category": "Help",
                        "fieldType": "label",
                        "type": "label"
                    }
                ],
                "url": "json/nodes/email/clicked.js"
            },
            "id": "PBX8DTgEwvMbv",
            "xPosition": 325,
            "yPosition": 481,
            "displayname": "Clicked Email Link?",
            "JsonValues": [
                {
                    "name": "nodename",
                    "value": "Clicked Email Link?"
                },
                {
                    "name": "duration",
                    "value": "3"
                },
                {
                    "name": "duration_type",
                    "value": "days"
                }
            ],
            "States": [
                {
                    "no": "hangup"
                },
                {
                    "yes": "PBXc4ucTy8OhO"
                }
            ]
        },
        {
            "NodeDefinition": {
                "name": "Clicked?",
                "thumbnail": "json/nodes/images/email/clicked.png",
                "icon": "json/nodes/icons/email/clicked.png",
                "info": "Check if a link in the email is clicked within a specified duration.",
                "help": "Check if a link in the email is clicked within a specified duration.",
                "author": "John",
                "company": "mantra",
                "language": "en",
                "branches": "no,yes",
                "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.Clicked",
                "category": "Email",
                "ui": [
                    {
                        "label": " Max wait time",
                        "required": "required",
                        "category": "Info",
                        "name": "duration",
                        "id": "duration",
                        "title": "Enter the max wait time.",
                        "fieldType": "input",
                        "type": "number",
                        "min": "0"
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
                            "Hours": "hours",
                            "Minutes": "mins"
                        },
                        "fieldType": "select",
                        "type": "select"
                    },
                    {
                        "label": "Check if the email recepient has clicked on a link in the email. Here, you need to mention the maximum waiting period before it proceeds to the next step. <br/><br/>This node has 2 exit paths - Yes and No.<br/><ul><li>If there is a click, then the control moves through the 'Yes' path without waiting any further.</li><br/><li> If the recepient did not click any link in the preceding email, it waits here for specified time. If there is no click till the max wait time, it moves through the 'No' path. </li></ul>",
                        "category": "Help",
                        "fieldType": "label",
                        "type": "label"
                    }
                ],
                "url": "json/nodes/email/clicked.js"
            },
            "id": "PBXyFFVgT3d3T",
            "xPosition": 597,
            "yPosition": 485,
            "displayname": "Clicked Email link?",
            "JsonValues": [
                {
                    "name": "nodename",
                    "value": "Clicked Email link?"
                },
                {
                    "name": "duration",
                    "value": "3"
                },
                {
                    "name": "duration_type",
                    "value": "days"
                }
            ],
            "States": [
                {
                    "no": "hangup"
                },
                {
                    "yes": "PBXlWKhwzSkZT"
                }
            ]
        },
        {
            "NodeDefinition": {
                "name": "Tags",
                "thumbnail": "json/nodes/images/email/tags.png",
                "icon": "json/nodes/icons/email/tags.png",
                "info": "Add or delete tag for your customer. You can sort your customers based on tags or generate reports accordingly.",
                "help": "Add or delete tag for your customer. You can sort your customers based on tags or generate reports accordingly.",
                "author": "John",
                "company": "mantra",
                "language": "en",
                "branches": "yes",
                "type": "voice",
                "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.Tags",
                "category": "Utilities",
                "ui": [
                    {
                        "label": "Type",
                        "required": "required",
                        "category": "Info",
                        "name": "type",
                        "id": "type",
                        "title": "Select the operation type.",
                        "options": {
                            "Add": "add",
                            "Delete": "delete"
                        },
                        "fieldType": "select",
                        "type": "select"
                    },
                    {
                        "label": "Tag",
                        "required": "required",
                        "category": "Info",
                        "name": "tag_names",
                        "id": "tag_names",
                        "title": "Enter the tag values separated by comma",
                        "fieldType": "input",
                        "type": "text"
                    },
                    {
                        "label": "Add/remove tags to a contact.<br/><br/>For example, if a customer visits a particular product page on your website, you may add a tag with the product name to the contact.",
                        "category": "Help",
                        "fieldType": "label",
                        "type": "label"
                    }
                ],
                "url": "json/nodes/crm/tags.js"
            },
            "id": "PBXc4ucTy8OhO",
            "xPosition": 356,
            "yPosition": 608,
            "displayname": "Tag - Opened-A",
            "JsonValues": [
                {
                    "name": "nodename",
                    "value": "Tag - Opened-A"
                },
                {
                    "name": "type",
                    "value": "add"
                },
                {
                    "name": "tag_names",
                    "value": "Opened-A"
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
                "name": "Tags",
                "thumbnail": "json/nodes/images/email/tags.png",
                "icon": "json/nodes/icons/email/tags.png",
                "info": "Add or delete tag for your customer. You can sort your customers based on tags or generate reports accordingly.",
                "help": "Add or delete tag for your customer. You can sort your customers based on tags or generate reports accordingly.",
                "author": "John",
                "company": "mantra",
                "language": "en",
                "branches": "yes",
                "type": "voice",
                "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.Tags",
                "category": "Utilities",
                "ui": [
                    {
                        "label": "Type",
                        "required": "required",
                        "category": "Info",
                        "name": "type",
                        "id": "type",
                        "title": "Select the operation type.",
                        "options": {
                            "Add": "add",
                            "Delete": "delete"
                        },
                        "fieldType": "select",
                        "type": "select"
                    },
                    {
                        "label": "Tag",
                        "required": "required",
                        "category": "Info",
                        "name": "tag_names",
                        "id": "tag_names",
                        "title": "Enter the tag values separated by comma",
                        "fieldType": "input",
                        "type": "text"
                    },
                    {
                        "label": "Add/remove tags to a contact.<br/><br/>For example, if a customer visits a particular product page on your website, you may add a tag with the product name to the contact.",
                        "category": "Help",
                        "fieldType": "label",
                        "type": "label"
                    }
                ],
                "url": "json/nodes/crm/tags.js"
            },
            "id": "PBXlWKhwzSkZT",
            "xPosition": 627,
            "yPosition": 610,
            "displayname": "Tag - Opened-B",
            "JsonValues": [
                {
                    "name": "nodename",
                    "value": "Tag - Opened-B"
                },
                {
                    "name": "type",
                    "value": "add"
                },
                {
                    "name": "tag_names",
                    "value": "Opened-B"
                }
            ],
            "States": [
                {
                    "yes": "hangup"
                }
            ]
        }
    ]
}