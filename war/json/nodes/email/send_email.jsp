		{
		    "name": "Send E-mail",
		    "thumbnail": "json/nodes/images/email/sendemail.png",
		    "icon": "json/nodes/icons/email/sendemail.png",
		    "info": "Send email in text or HTML format. You can choose your delivery day and time.",
		    "help": "Send email in text or HTML format. You can choose your delivery day and time.",
		    "author": "John",
		    "company": "mantra",
		    "language": "en",
		    "branches": "yes",
		    "workflow_tasklet_class_name": "com.campaignio.tasklets.email.SendEmail",
		    "category": "Email",
		    "ui": [{
					"label": "From (Name):",
					"category": "Info",
					"name": "from_name",
		            "id":"from_name",
					"title": "Enter your name.",
					"required": "required",
					"fieldType": "input",
		            "type": "text" 
				},
				{
					"label": "From (Email):",
					"category": "Info",
					"name": "from_email",
		            "id":"from_email",
		            "required": "required",
					"title": "Enter your email address.",
					"fieldType": "input",
		            "type": "email" 					
				},
				{
					"label": "To",
					"category": "Info",
					"name": "to_email",
		            "id":"to_email",
		            "value":"$subscriber.Email",
		            "required": "required",
					"title": "Enter your subscriber E-mail ID. If you are using a list, you can use $subscriber.Email",
					"fieldType": "input",
		            "type": "email"
				},
				{
					"label": "Subject",
					"category": "Info",
					"name": "subject",
		            "id":"subject",
		            "required": "required",
					"title": "Enter your subject for your email.",
					"fieldType": "input",
		            "type": "text"
				},{
					"label": "Reply To",
					"category": "Info",
					"name": "replyto_email",
		            "id":"replyto_email",
		            "required": "required",
					"title": "Enter email you need your subscribers to reply.",
					"fieldType": "input",
		            "type": "text"	
				},
		        {
		            "label": "Text",
					"category": "Text",
		            "name": "text_email",
		            "title": "Enter text content here.",
		            "cols": "75",
		            "rows": "13",
		            "required": "required",
		            "fieldType": "textarea",
		            "type": "textarea" 
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
		            "label": "Track Clicks:",
		            "required": "No",
		            "category": "Settings",
		            "name": "track_clicks",
		            "title": "ContactSpot will track your Clicks.",
		            "options": {
		                "*No": "no",
		                "Yes": "yes"
		            },
		            "fieldType": "select",
		            "type": "select" 
		        },
		        {
		           "label": "Purl Keyword:",
					"category": "Settings",
					"name": "purl_keyword",
		            "id":"purl_keyword",
					"title": "While tracking clicks, ContactSpot can show a keyword in the URL. Valid only when you are tracking clicks.",
					"fieldType": "input",
		            "type": "text" 
		        },
		        {
		            "label": "Time zone",
		            "required": "No",
		            "category": "Settings",
		            "value": "(GMT-06:00) Central Time (US & Canada)",
		            "name": "time_zone",
		            "title": "Select the time zone for your email delivery.",
		            "options": {
		            							<%@page import="java.util.Arrays"%>
<%@page import="java.util.TimeZone"%>
<%
						String[] allTimeZones = TimeZone.getAvailableIDs();    
						Arrays.sort(allTimeZones);  
						  

						for (int i = 0; i < allTimeZones.length; i++) {  
							String option = allTimeZones[i];
							
							if(i == allTimeZones.length -1 )
							out.println("\"" + option +  "\":\"" + option + "\"");
							else
								out.println("\"" + option +  "\":\"" + option + "\",");
								
						}  
						%>
		            	
		                
		            },
		            "fieldType": "select",
		            "type": "select" 
		        }
		        ,
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
	                    "9:00 AM": "9:00",
	                    "9:30 AM": "9:30",
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
		            "label": "Send email in text or HTML format. You can choose your delivery day and time.<br/><br/>Links can be automatically tracked for clicks. Optional Personalized links can be created while shortening the links.",
		            "category": "Help",
		            "fieldType": "label",
		            "type": "label" 
		        }
		    ]
		}