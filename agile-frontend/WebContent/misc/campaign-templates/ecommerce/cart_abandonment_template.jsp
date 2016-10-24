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
                    "start": "PBXwN0qNaUu3s"
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
            "id": "PBXX5ZT1pPMmU",
            "xPosition": 486,
            "yPosition": 335,
            "displayname": "Went to Checkout page?",
            "JsonValues": [
                {
                    "name": "nodename",
                    "value": "Went to Checkout page?"
                },
                {
                    "name": "url_value",
                    "value": "http://www.mysite.com/checkout.php"
                },
                {
                    "name": "type",
                    "value": "exact_match"
                }
            ],
            "States": [
                {
                    "No": "hangup"
                },
                {
                    "Yes": "PBXdxs6W1ofwu"
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
            "id": "PBXzQoHkiO5Sx",
            "xPosition": 544,
            "yPosition": 544,
            "displayname": "Purchase Completed?",
            "JsonValues": [
                {
                    "name": "nodename",
                    "value": "Purchase Completed?"
                },
                {
                    "name": "url_value",
                    "value": "www.mycompany.com/purchase-thankyou.html"
                },
                {
                    "name": "type",
                    "value": "exact_match"
                }
            ],
            "States": [
                {
                    "No": "PBX0QB6ShuwNE"
                },
                {
                    "Yes": "hangup"
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
            "id": "PBX0QB6ShuwNE",
            "xPosition": 503,
            "yPosition": 672,
            "displayname": "Send Coupon",
            "JsonValues": [
                {
                    "name": "nodename",
                    "value": "Send Coupon"
                },
                {
                    "name": "from_name",
                    "value": "Animal Chow Promotional Offers"
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
                    "name": "subject",
                    "value": "30% Discount Coupon"
                },
                {
                    "name": "replyto_email",
                    "value": ""
                },
                {
                    "name": "text_email",
                    "value": "Hello {{first_name}},\r\n\r\nWe noticed that you were interested in our product Purina Puppy Food. To encourage you to go ahead and try out our product, we are offering you 30% discount on it. \r\n\r\nPlease avail the coupon below in 7 days.\r\n\r\nCoupon code : HXDK99\r\n\r\nThe coupon can be used during checkout. \r\n\r\nEver yours,\r\nAnimal Chow"
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
            "id": "PBXndPNc0hIyP",
            "xPosition": 529,
            "yPosition": 232,
            "displayname": "Wait 2 days",
            "JsonValues": [
                {
                    "name": "nodename",
                    "value": "Wait 2 days"
                },
                {
                    "name": "duration",
                    "value": "2"
                },
                {
                    "name": "duration_type",
                    "value": "days"
                },
                {
                    "name": "timezone",
                    "value": <% out.println("\""+ TimeZoneUtil.timeZone +"\""); %>
                }
                
                
            ],
            "States": [
                {
                    "yes": "PBXX5ZT1pPMmU"
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
    "options":{
        <%= TimeZoneUtil.getJavaTimeZones(null, null, false) %>
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
            "id": "PBXdxs6W1ofwu",
            "xPosition": 583,
            "yPosition": 453,
            "displayname": "Wait 1 day",
            "JsonValues": [
                {
                    "name": "nodename",
                    "value": "Wait 1 day"
                },
                {
                    "name": "duration",
                    "value": "1"
                },
                {
                    "name": "duration_type",
                    "value": "days"
                },
                {
                    "name": "timezone",
                    "value": <%out.println("\""+ TimeZoneUtil.timeZone +"\"");%>
                }
            ],
            "States": [
                {
                    "yes": "PBXzQoHkiO5Sx"
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
            "id": "PBXwN0qNaUu3s",
            "xPosition": 431,
            "yPosition": 108,
            "displayname": "Visited any product page?",
            "JsonValues": [
                {
                    "name": "nodename",
                    "value": "Visited any product page?"
                },
                {
                    "name": "url_value",
                    "value": "/show-product"
                },
                {
                    "name": "type",
                    "value": "contains"
                }
            ],
            "States": [
                {
                    "No": "hangup"
                },
                {
                    "Yes": "PBXndPNc0hIyP"
                }
            ]
        }
    ]
}