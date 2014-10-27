{
    "name": "Wait Till",
    "thumbnail": "json/nodes/images/common/WaitTill.png",
    "icon": "json/nodes/icons/common/WaitTill.png",
    "info": "Wait till a specified date and time before proceeding to the next step.",
    "help": "Wait till a specified date and time before proceeding to the next step. Useful if you want to send new year offers or birthday wishes.",
    "author": "John",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.WaitTill",
    "category": "Utilities",
    "ui": [{
			"label": " Day",
			"required": "required",
            "category": "Settings",
			"name": "duration",
            "id":"duration",
			"title": "Choose a date or add a merge field like {{custom_date_field}}",
			"fieldType": "input",
            "type": "datePicker",
            "onfocus" : "getDate()"
    },{
                "label": "Time",
                "required": "required",
                "category": "Settings",
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
	            "category": "Settings",
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
	        }, {
            "label": "Wait till a specified date and time before proceeding to the next step. Useful if you want to send new year offers or birthday wishes.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        } 
    ]
}