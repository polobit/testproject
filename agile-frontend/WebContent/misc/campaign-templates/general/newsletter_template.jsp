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
                    "start": "PBXHWo1PHDnoJ"
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
            "xPosition": 460,
            "yPosition": 144,
            "displayname": "Send Newsletter ",
            "JsonValues": [
                {
                    "name": "nodename",
                    "value": "Send Newsletter "
                },
                {
                    "name": "from_name",
                    "value": "Updates"
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
                    "value": "Here what's happening from our end"
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
                    "value": "\r\nText version of newsletter here."
                },
                {
                    "name": "merge_fields",
                    "value": ""
                },
                {
                    "name": "html_email",
                    "value": "<div style=\"background-color: #f2f2f2; margin: 0; padding: 0; min-height: 100%!important; width: 100%!important;\"><center>\r\n<table style=\"background-color: #f2f2f2; margin: 0px; padding: 0px; border-collapse: collapse !important; min-height: 100% !important; width: 100% !important;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n<tbody>\r\n<tr>\r\n<td style=\"padding: 40px 20px; margin: 0; min-height: 100%!important; width: 100%!important;\" align=\"center\" valign=\"top\">\r\n<table style=\"width: 600px; border-collapse: collapse!important;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n<tbody>\r\n<tr>\r\n<td align=\"center\" valign=\"top\"><a style=\"text-decoration: none;\" title=\"Your Logo here\" href=\"https://www.yoursite.com\" target=\"_blank\"> <img style=\"border: 0; color: #6dc6dd!important; font-family: Helvetica,Arial,sans-serif; font-size: 60px; font-weight: bold; min-height: auto!important; letter-spacing: -4px; line-height: 100%; outline: none; text-align: center; text-decoration: none;\" src=\"https://www.MYSITE.com/img/logo.png\" alt=\"Your Logo here\" /> </a></td>\r\n</tr>\r\n<tr>\r\n<td style=\"padding-top: 30px; padding-bottom: 30px;\" align=\"center\" valign=\"top\">\r\n<table style=\"background-color: #ffffff; border-collapse: separate !important; border-top-left-radius: 4px; border-top-right-radius: 4px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px; width: 100%;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n<tbody>\r\n<tr>\r\n<td style=\"padding-right: 40px; padding-left: 40px;\" align=\"center\" valign=\"top\">\r\n<table style=\"border-collapse: collapse !important; width: 100%;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n<tbody>\r\n<tr>\r\n<td align=\"center\" valign=\"top\" width=\"\">\r\n<table style=\"border-collapse: collapse !important; width: 100%;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n<tbody>\r\n<tr>\r\n<td align=\"left\" valign=\"top\" width=\"75px\">\r\n<table style=\"border-collapse: collapse !important; background-color: #6dc6dd; width: 75px;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n<tbody>\r\n<tr>\r\n<td style=\"padding: 40px 15px 5px; text-align: center; color: #ffffff; line-height: 100%; font-family: Helvetica,Arial,sans-serif; font-size: 14px; font-weight: bold;\" align=\"center\" valign=\"bottom\">Digest</td>\r\n</tr>\r\n<tr>\r\n<td style=\"padding: 5px 15px 20px; text-align: center; color: #ffffff; line-height: 100%; font-family: Helvetica,Arial,sans-serif; font-size: 40px; font-weight: bold;\" align=\"center\" valign=\"top\">1</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</td>\r\n<td style=\"padding-top: 40px; padding-left: 40px; color: #606060; font-family: Helvetica,Arial,sans-serif; font-size: 15px; line-height: 150%; text-align: left;\" align=\"left\" valign=\"top\">\r\n<h1 style=\"font-family: Helvetica,Arial,sans-serif; font-size: 40px; font-weight: bold; letter-spacing: -1px; line-height: 115%; margin: 0; padding: 0; text-align: left; color: #606060!important; text-decoration: none!important;\">Title</h1>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td style=\"color: #606060; font-family: Helvetica,Arial,sans-serif; font-size: 15px; line-height: 150%; text-align: left; padding: 40px;\" align=\"center\" valign=\"top\">\r\n<p>Hello&nbsp;{{first_name}},</p>\r\n<p>Some introductory text</p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td style=\"padding-bottom: 30px;\" align=\"center\" valign=\"top\">\r\n<table style=\"border-collapse: collapse !important; width: 100%;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n<tbody>\r\n<tr>\r\n<td style=\"border-top: 2px solid #f2f2f2; padding-top: 40px; padding-right: 40px; padding-bottom: 30px; padding-left: 40px; color: #606060; font-family: Helvetica,Arial,sans-serif; font-size: 15px; line-height: 150%; text-align: left;\" align=\"center\" valign=\"top\">\r\n<h3 style=\"font-family: Helvetica,Arial,sans-serif; font-size: 18px; font-weight: bold; letter-spacing: -.5px; line-height: 115%; margin: 0; padding: 0; text-align: center; color: #606060!important; text-decoration: none!important;\">News Item 1</h3>\r\n<p>Text here.</p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td style=\"padding-right: 40px; padding-left: 40px;\" align=\"center\" valign=\"top\"><img style=\"border: 1px solid #c8c8c8; border-radius: 5px;\" src=\"https://www.yoursite.com/image1.png\" alt=\"insert image 1\" /></td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td style=\"padding-bottom: 30px;\" align=\"center\" valign=\"top\">\r\n<table style=\"border-collapse: collapse !important; width: 100%;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n<tbody>\r\n<tr>\r\n<td style=\"border-top: 2px solid #f2f2f2; padding-top: 40px; padding-right: 40px; padding-bottom: 30px; padding-left: 40px; color: #606060; font-family: Helvetica,Arial,sans-serif; font-size: 15px; line-height: 150%; text-align: left;\" align=\"center\" valign=\"top\">\r\n<h3 style=\"font-family: Helvetica,Arial,sans-serif; font-size: 18px; font-weight: bold; letter-spacing: -.5px; line-height: 115%; margin: 0; padding: 0; text-align: center; color: #606060!important; text-decoration: none!important;\">News Item 2</h3>\r\n<p>Text here.</p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td style=\"padding-right: 40px; padding-left: 40px;\" align=\"center\" valign=\"top\"><img style=\"border: 1px solid #c8c8c8; border-radius: 5px;\" src=\"https://www.agilecrm.com/img/email-images/ScreenShot2013-09-02at20334PM.png\" alt=\"Triggers\" /></td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td style=\"padding-bottom: 30px;\" align=\"center\" valign=\"top\">\r\n<table style=\"border-collapse: collapse !important; width: 100%;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n<tbody>\r\n<tr>\r\n<td style=\"border-top: 2px solid #f2f2f2; padding-top: 40px; padding-right: 40px; padding-bottom: 30px; padding-left: 40px; color: #606060; font-family: Helvetica,Arial,sans-serif; font-size: 15px; line-height: 150%; text-align: left;\" align=\"center\" valign=\"top\">\r\n<h3 style=\"font-family: Helvetica,Arial,sans-serif; font-size: 18px; font-weight: bold; letter-spacing: -.5px; line-height: 115%; margin: 0; padding: 0; text-align: center; color: #606060!important; text-decoration: none!important;\">News Item 3</h3>\r\n<p>Text here.</p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td style=\"padding-right: 40px; padding-left: 40px;\" align=\"center\" valign=\"top\"><img style=\"border: 1px solid #c8c8c8; border-radius: 5px;\" src=\"https://www.agilecrm.com/img/email-images/users.png\" alt=\"Campaign Authentication\" /></td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td style=\"padding-right: 40px; padding-bottom: 40px; padding-left: 40px;\" align=\"center\" valign=\"middle\">\r\n<table style=\"background-color: #6dc6dd; border-collapse: separate!important; border-radius: 3px;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n<tbody>\r\n<tr>\r\n<td style=\"color: #ffffff; font-family: Helvetica,Arial,sans-serif; font-size: 15px; font-weight: bold; line-height: 100%; padding-top: 18px; padding-right: 15px; padding-bottom: 15px; padding-left: 15px;\" align=\"center\" valign=\"middle\"><a style=\"color: #ffffff; text-decoration: none;\" href=\"https://www.MYSITE.com/newsletter\" target=\"_blank\">C</a>all To Action</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td align=\"center\" valign=\"top\">\r\n<table style=\"border-collapse: collapse !important; width: 100%;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\r\n<tbody>\r\n<tr>\r\n<td style=\"color: #606060; font-family: Helvetica,Arial,sans-serif; font-size: 13px; line-height: 125%;\" align=\"center\" valign=\"top\">\r\n<p style=\"margin: -5px;\"><img style=\"vertical-align: middle;\" src=\"https://www.MYSITE.com/logo.png\" alt=\"\" /> Your Caption</p>\r\n<p style=\"margin: 10px;\"><a style=\"padding: 6px; color: black; border: none;\" href=\"https://twitter.com/agile_crm\" target=\"_blank\"><img style=\"border: none;\" src=\"https://www.agilecrm.com/img/twitter-icon.png\" alt=\"twitter\" /></a> <a style=\"padding: 6px; border: none;\" href=\"https://www.facebook.com/CRM.Agile\" target=\"_blank\"><img style=\"border: none;\" src=\"https://www.agilecrm.com/img/facebook-icon.png\" alt=\"fb\" /></a> <a style=\"padding: 6px; border: none;\" href=\"https://plus.google.com/109484059291748745615/posts\" target=\"_blank\"><img style=\"border: none;\" src=\"https://www.agilecrm.com/img/googleplus-icon.png\" alt=\"gplus\" /></a></p>\r\n<p><a href=\"https://www.agilecrm.com\" target=\"_blank\">www.mysite.com</a></p>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td align=\"center\" valign=\"top\">&nbsp;</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</center></div>"
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
        }
    ]
}
