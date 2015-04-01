{
    "name": "Add Event",
    "thumbnail": "json/nodes/images/crm/add_event.png",
    "icon": "json/nodes/icons/crm/add_event.png",
    "info": "Add a calendar event related to the contact.",
    "help": "Add a calendar event related to the contact.",
    "author": "Naresh",
    "company": "Agilecrm",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.AddEvent",
    "category": "crm",
    "ui": [
        {
            "label": "Event Name",
            "required": "required",
            "category": "Info",
            "name": "event_name",
            "id": "event-name",
            "title": "Enter name of the event",
            "fieldType": "input",
            "type": "text"
        },
        {
            "label": "Priority",
            "required": "required",
            "category": "Info",
            "name": "priority",
            "id": "priority",
            "title": "Select priority",
            "options": {
                "High": "red",
                "*Normal": "#36C",
                "Low": "green"
            },
            "fieldType": "select",
            "type": "select"
        },
        {
			"label": "Start Date",
			"required": "required",
            "category": "Info",
			"name": "start_date",
            "id":"start-date",
			"title": "You can choose a specific calendar date, or give the number of days from campaign run time like &#39;+2&#39;, or use a merge field like {{YourCustomDateField}}",
			"fieldType": "input",
            "type": "datePicker",
            "onfocus" : "getDate(this)"
    },{
                "label": "Time",
                "required": "required",
                "category": "Info",
                "name": "at",
                "id": "at",
                "multiple": "multiple",
                "ismultiple": "true",
                "title": "Select the time ",
                "options": {
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
            },{
	            "label": "Time zone",
	            "required": "required",
	            "category": "Info",
	            "value": "(GMT-06:00) Central Time (US & Canada)",
	            "name": "time_zone",
	            "title": "Select the time zone ",
	            "options": {
	            	<%@page import="java.util.Arrays"%>
                    <%@page import="java.util.TimeZone"%>
                    <%
					String[] allTimeZones = TimeZone.getAvailableIDs();    
					Arrays.sort(allTimeZones);  
					
				    for (int i = 0; i < allTimeZones.length; i++)
				    {  
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
	        },
        {
            "label": "Event Duration",
            "required": "required",
            "category": "Info",
            "title": "Select duration of an event",
            "name": "event_duration",
            "id": "event_duration",
            "fieldType": "select",
            "type": "select",
            "options": {
            	"All day": "all_day",
            	"15 min": "15",
            	"30 min": "30",
            	"1 hr": "60",
            	"2 hr": "120",
                "4 hr": "240",
                "8 hr": "480",
                "12 hr": "720"
            }
        },
        {
            "label": "Owner",
            "category": "Info",
            "name": "owner_id",
            "id": "owner_id",
            "title": "Select owner of the event",
            "url": "/core/api/users",
            "dynamicName": "email",
            "dynamicValue": "id",
            "appendToDynamicName": "name",
            "options": {
                "Contact's Owner": "contact_owner"
            },
            "fieldType": "dynamicselect",
            "type": "select"
        },
        {
            "label": "Add a calendar event related to the contact. Use this to automatically schedule meetings or calls with customers.",
            "category": "Help",
            "fieldType": "label",
            "type": "label"
        }
    ]
}