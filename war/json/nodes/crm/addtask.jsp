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
    "workflow_tasklet_class_name":"com.campaignio.tasklets.agile.AddTask",
    "category": "Utilities",
    "ui": [{
			"label": "Task",
			"required": "required",
            "category": "Info",
            "name": "subject",
            "id": "subject",
            "title": "Enter the task name",
			"fieldType": "input",
			"type": "text" 

		},{
			"label": "Category",
			"category": "Info",
			"name": "category",
            "id":"category",
			"title": "Select the category type",
			"options": {"Call":"CALL",
		        "Email":"EMAIL",
		        "Follow-up":"FOLLOW_UP",
		        "Meeting":"MEETING",
		        "Milestone":"MILESTONE",
		        "Send":"SEND",
		        "Tweet":"TWEET",
		        "Other":"OTHER"

	          },
	         "fieldType": "select",
	          "type": "select" 

		},{
			"label": "Priority",
			"category": "Info",
			"name": "priority",
            "id":"priority",
			"title": "Select the priority type",
			"options": {"High":"HIGH",
		        "Normal":"NORMAL",
		        "Low":"LOW"

	          },
	         "fieldType": "select",
	          "type": "select" 

		},{
			"label": "Due Days",
			"required":"required",
			"category": "Info",
			"name": "due_days",
            "id":"due_days",
			"title": "Enter the number of Due Days.",
			"fieldType": "input",
			"type":"number",
			"min":"0"

		},
        {
            "label": "Owner",
            "required": "Yes",
            "category": "Info",
            "name": "owner_id",
            "title": "Select Owner of the task.",
            "options": {
            	<%@page import="com.agilecrm.user.util.DomainUserUtil"%>
            	<%@page import="com.agilecrm.user.DomainUser" %>
            	<%@page import="java.util.List" %>
            	<%@page import="com.google.appengine.api.NamespaceManager" %>
                <%
                String domain = NamespaceManager.get();
                
                System.out.println("Domain in addtask.jsp is: " + domain);
                
				List<DomainUser> domainUsers = DomainUserUtil.getUsers(domain);
				System.out.println("DomainUsers obtained in addtask.jsp are: " + domainUsers);
				
				// Contact Owner
				out.println("\"" + "Contact\'s Owner" + "\":\"" + "contact_owner" + "\",");
				
				Object arr[] = domainUsers.toArray();
				for (int i = 0; i < arr.length; i++)
				{
				    DomainUser domainUser = (DomainUser) arr[i];
				    
				    String id = domainUser.id.toString();
				    String name = domainUser.name;

				    if (i == arr.length - 1)
					out.println("\"" + name + "\":\"" + id + "\"");
				    else
				    out.println("\"" + name + "\":\"" + id + "\",");
				    
				    
				}
				%>
            	
            },
            "fieldType": "select",
            "type": "select" 
        },{
            "label": "Add a task related to a contact in the CRM.<br/><br/>For example, if a contact opens and clicks a link in your email, then you might want to add a task to your list for Calling him/her. <br/><br/>When this task is created, the contact is automatically added to the 'Related to' field in the task.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        }
    ]
}