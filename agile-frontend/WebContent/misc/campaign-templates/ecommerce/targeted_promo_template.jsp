
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
                    "start": "PBXWuccsAZT7S"
                }
            ]
        },
        {
            "NodeDefinition": {
                "name": "Check Tags",
                "thumbnail": "json/nodes/images/email/checktags.png",
                "icon": "json/nodes/icons/email/checktags.png",
                "info": "Verify whether given tag exists for a contact in Agile.",
                "help": "Verify whether given tag exists for a contact in Agile.",
                "author": "Naresh",
                "company": "mantra",
                "language": "en",
                "branches": "no,yes",
                "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.CheckTags",
                "category": "Utilities",
                "ui": [
                    {
                        "label": "Tag",
                        "required": "required",
                        "category": "Info",
                        "name": "tag_value",
                        "id": "tag_value",
                        "title": "Enter the tag values separated by comma.",
                        "fieldType": "input",
                        "type": "text"
                    },
                    {
                        "label": "Checks whether given tag exists for a contact. If multiple tags separated by comma are given, then the condition will be evaluated to Yes only when ALL tags exists for that contact.<br/><br/>For example, if 'lead, paid' are given then the condition will be evaluated to Yes only if both lead and paid exists, otherwise No if only lead exists.",
                        "category": "Help",
                        "fieldType": "label",
                        "type": "label"
                    }
                ],
                "url": "json/nodes/common/check_tags.js"
            },
            "id": "PBXkRqvZJWmNA",
            "xPosition": 523,
            "yPosition": 255,
            "displayname": "Has tag - Sunglasses?",
            "JsonValues": [
                {
                    "name": "nodename",
                    "value": "Has tag - Sunglasses?"
                },
                {
                    "name": "tag_value",
                    "value": "Sunglasses"
                }
            ],
            "States": [
                {
                    "no": "PBXvkWalTUgUf"
                },
                {
                    "yes": "PBX1HW7kFJ5DH"
                }
            ]
        },
        {
            "NodeDefinition": {
                "name": "URL Visited?",
                "thumbnail": "json/nodes/images/common/url.png",
                "icon": "json/nodes/icons/common/url.png",
                "info": "Check if a URL has been visited by the contact earlier.",
                "help": "Check if a URL has been visited by the contact earlier.",
                "author": "John",
                "company": "Invox",
                "language": "en",
                "branches": "No,Yes",
                "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.URLVisited",
                "category": "URL",
                "ui": [
                       {
                       	"label": "URL",
                       	"required": "required",
                       	"category": "Settings",
                       	"name": "url_value",
                       	"id": "url_value",
                       	"title": "Enter a valid URL.",
                       	"fieldType": "input",
                       	"type": "url"
                       },
                       {
                           "label": "Match type",
                           "required": "required",
                           "category": "Settings",
                           "name": "type",
                           "id": "type",
                           "title": "Select the given URL type.",
                           "options": {
                               "Contains": "contains",
                               "Exact Match": "exact_match"
                           },
                           "fieldType": "select",
                           "type": "select",
                           "target_type": "url_value",
                           "select_event_callback": "url_visited_select_callback"
                       },
                       {
                           "label": " Visited in last ",
                           "required": "required",
                           "category": "Settings",
                           "name": "duration",
                           "id": "duration",
                           "title": "Enter the duration in days or hours. Leave as zero if you don't want time limit.",
                           "fieldType": "input",
                           "type": "number",
                           "placeholder": "0",
                           "min": "0",
                           "style": {
                               "width": "17%",
                               "min": "0"
                           }
                       },
                       {
                           "required": "required",
                           "category": "Settings",
                           "name": "duration_type",
                           "id": "duration_type",
                           "title": "Select the type of duration.",
                           "options": {
                               "Days": "day",
                               "Hours": "hour"
                           },
                           "fieldType": "select",
                           "type": "select"
                       },
                       {
                           "label": "Check if a URL (on your website) has been visited by the contact. This works when you have the tracking code setup on your web page.<br/><br/>The 'Match type' option allows you to specify a partial match of url. For example, if you just mention 'product' in the URL field and select Type as 'Contains', then the condition will be evaluated to True if the user visited any page containing 'product' in the URL.<br/><br/> You can optionally give a time duration for the visit. Ex: Check if they visited your pricing page in last 3 days ",
                           "category": "Help",
                           "componet": "label",
                           "type": "label"
                       }
                   ],
                "url": "json/nodes/common/url.js"
            },
            "id": "PBXWuccsAZT7S",
            "xPosition": 444,
            "yPosition": 113,
            "displayname": "Checked Sunglasses?",
            "JsonValues": [
                {
                    "name": "nodename",
                    "value": "Checked Sunglasses?"
                },
                {
                    "name": "url_value",
                    "value": "catalog.php?category=sunglasses"
                },
                {
                    "name": "type",
                    "value": "contains"
                }
            ],
            "States": [
                {
                    "No": "PBX1eiykK8olE"
                },
                {
                    "Yes": "PBXkRqvZJWmNA"
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
            "id": "PBX1HW7kFJ5DH",
            "xPosition": 554,
            "yPosition": 479,
            "displayname": "Send Offers Email",
            "JsonValues": [
                {
                    "name": "nodename",
                    "value": "Send Offers Email"
                },
                {
                    "name": "from_name",
                    "value": "Smart ebuy"
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
                    "value": "{{first_name}}, checkout our summer offers on Sunglasses"
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
                    "value": "Hi {{first_name}}\r\n\r\nSummer is here and we have some cool offers on Sunglasses for you. \r\n\r\nCheck them out here - http://www.smartebuy.com/summeroffers/sunglasses\r\n\r\n"
                },
                {
                    "name": "merge_fields",
                    "value": ""
                },
                {
                    "name": "html_email",
                    "value": ""
                },
                {
                    "name": "track_clicks",
                    "value": "no"
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
                    "yes": "PBXXt1fEs27iy"
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
            "id": "PBXXt1fEs27iy",
            "xPosition": 545,
            "yPosition": 574,
            "displayname": "Checked out offers?",
            "JsonValues": [
                {
                    "name": "nodename",
                    "value": "Checked out offers?"
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
                    "no": "PBXEtGSO2WDVI"
                },
                {
                    "yes": "PBXvMIaoh9orE"
                }
            ]
        },
        {
            "NodeDefinition": {
                "name": "Score",
                "thumbnail": "json/nodes/images/email/score.png",
                "icon": "json/nodes/icons/email/score.png",
                "info": "Add or subtract score to your contact to identify hot leads based on total score.",
                "help": "Add or subtract score to your contact to identify hot leads based on total score.",
                "author": "John",
                "company": "mantra",
                "language": "en",
                "branches": "yes",
                "type": "voice",
                "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.Score",
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
                            "Subtract": "subtract"
                        },
                        "fieldType": "select",
                        "type": "select"
                    },
                    {
                        "label": "Value",
                        "required": "required",
                        "category": "Info",
                        "name": "Value",
                        "id": "Value",
                        "title": "Enter the value.",
                        "fieldType": "input",
                        "type": "number"
                    },
                    {
                        "label": "You can increase or decrease the Lead Score using this option.<br/><br/>For example, if the user opened your email, add a score of 5 and on clicking a link add 10.",
                        "category": "Help",
                        "fieldType": "label",
                        "type": "label"
                    }
                ],
                "url": "json/nodes/common/score.js"
            },
            "id": "PBXvMIaoh9orE",
            "xPosition": 625,
            "yPosition": 691,
            "displayname": "Add Score - 10",
            "JsonValues": [
                {
                    "name": "nodename",
                    "value": "Add Score - 10"
                },
                {
                    "name": "type",
                    "value": "add"
                },
                {
                    "name": "Value",
                    "value": "10"
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
            "id": "PBX1eiykK8olE",
            "xPosition": 343,
            "yPosition": 254,
            "displayname": "Send Catalog Email",
            "JsonValues": [
                {
                    "name": "nodename",
                    "value": "Send Catalog Email"
                },
                {
                    "name": "from_name",
                    "value": "Smart ebuy"
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
                    "value": "{{frist_name}}, Checkout our exciting range of Sunglasses"
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
                    "value": "Hi"
                },
                {
                    "name": "merge_fields",
                    "value": ""
                },
                {
                    "name": "html_email",
                    "value": ""
                },
                {
                    "name": "track_clicks",
                    "value": "no"
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
            "id": "PBXvkWalTUgUf",
            "xPosition": 478,
            "yPosition": 378,
            "displayname": "Add Tag",
            "JsonValues": [
                {
                    "name": "nodename",
                    "value": "Add Tag"
                },
                {
                    "name": "type",
                    "value": "add"
                },
                {
                    "name": "tag_names",
                    "value": "Sunglasses"
                }
            ],
            "States": [
                {
                    "yes": "PBX1HW7kFJ5DH"
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
            "id": "PBXEtGSO2WDVI",
            "xPosition": 484,
            "yPosition": 695,
            "displayname": "Remove Tag",
            "JsonValues": [
                {
                    "name": "nodename",
                    "value": "Remove Tag"
                },
                {
                    "name": "type",
                    "value": "delete"
                },
                {
                    "name": "tag_names",
                    "value": "Sunglasses"
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