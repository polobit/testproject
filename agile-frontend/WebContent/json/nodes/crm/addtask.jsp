{
    "name": "Add Task",
    "thumbnail": "json/nodes/images/common/addtask.png",
    "icon": "json/nodes/icons/common/addtask.png",
    "info": "Add a task in Agile related to the contact.",
    "help": "Add a task in Agile related to the contact.",
    "author": "Naresh",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name": "com.campaignio.tasklets.agile.AddTask",
    "category": "Utilities",
    "ui": [
        {
            "label": "Task",
            "required": "required",
            "category": "Info",
            "name": "subject",
            "id": "subject",
            "title": "Enter the task name",
            "fieldType": "input",
            "type": "text"
        },
        {
			"label": "Category",
            "category": "Info",
            "name": "category",
            "id": "category",
            "title": "Select the category type",
            "fieldType": "categories",
            "type": "select"
        },
        {
            "label": "Priority",
            "category": "Info",
            "name": "priority",
            "id": "priority",
            "title": "Select the priority type",
            "options": {
            	"Normal": "NORMAL",
                "High": "HIGH",
                "Low": "LOW"
            },
            "fieldType": "select",
            "type": "select"
        },
        {
            "label": "Due Days",
            "required": "required",
            "category": "Info",
            "name": "due_days",
            "id": "due_days",
            "title": "Enter the number of Due Days.",
            "fieldType": "input",
            "type": "number",
            "min": "0"
        },
        {
            "label": "Owner",
            "required": "Yes",
            "category": "Info",
            "name": "owner_id",
            "title": "Select Owner of the task.",
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
            "label": "Add a task related to a contact in the CRM.<br/><br/>For example, if a contact opens and clicks a link in your email, then you might want to add a task to your list for Calling him/her. <br/><br/>When this task is created, the contact is automatically added to the 'Related to' field in the task.",
            "category": "Help",
            "fieldType": "label",
            "type": "label"
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
                <%@page import="com.agilecrm.user.AgileUser"%>
<%@page import="com.agilecrm.user.util.UserPrefsUtil"%>
<%@page import="com.agilecrm.session.UserInfo"%>
<%@page import="com.agilecrm.session.SessionManager"%>
<%@pageimport="java.util.Arrays"%>
                <%@pageimport="java.util.TimeZone"%>
                <%@pageimport="com.agilecrm.account.util.AccountPrefsUtil"%>
                <%@pageimport="com.agilecrm.user.util.UserPrefsUtil"%>
                <%@pageimport="com.agilecrm.user.UserPrefs"%>
                <%@pageimport="com.agilecrm.user.AgileUser"%>
                <%@pageimport="org.apache.commons.lang.StringUtils"%>
                <%@pageimport="com.agilecrm.session.UserInfo"%>
                
                <%
                
                String[] allTimeZones = TimeZone.getAvailableIDs();    
				Arrays.sort(allTimeZones);  
				
				UserInfo userInfo = (UserInfo) request.getSession().getAttribute(SessionManager.AUTH_SESSION_COOKIE_NAME);
					
                AgileUser user = AgileUser.getCurrentAgileUserFromDomainUser(userInfo.getDomainId());
                 
                String timeZone = UserPrefsUtil.getUserPrefs(user).timezone;
                
                if(StringUtils.isEmpty(timeZone))
                	
                	out.println("\""+"*Select time zone"+"\":\""+"empty_timezone"+"\","); 
                
                for(int i=0; i< allTimeZones.length; i++){
                    String option= allTimeZones[i];
                    
                    if( !StringUtils.isEmpty(timeZone) && timeZone.equals(option))
                    	option = "*" + option;
                    
                    if( i == allTimeZones.length-1)
                    	out.println("\""+option+"\":\""+option+"\"");
                    else
                    	out.println("\""+option+"\":\""+option+"\",");
                }%>
            },
            "fieldType": "timezone",
            "type": "select"
        },
         
        {
            "label": "At",
            "required": "required",
            "name": "at",
            "id": "at",
            "multiple": "multiple",
            "ismultiple": "true",
            "title": "Select the time.",
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
        }
    ]
}