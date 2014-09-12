{
    "name": "Add Deal",
    "thumbnail": "json/nodes/images/crm/adddeal.png",
    "icon": "json/nodes/icons/crm/adddeal.png",
    "info": "Add a deal in Agile related to the contact.",
    "help": "Add a deal in Agile related to the contact.",
    "author": "Naresh",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name":"com.campaignio.tasklets.agile.AddDeal",
    "category": "Utilities",
    "ui": [{
			"label": "Deal Title",
			"required": "required",
            "category": "Info",
            "name": "deal_name",
            "id": "deal_name",
            "title": "Enter the name of a deal.",
            "required": "required",
			"fieldType": "input",
			"type": "text" 

		},{
			"label": "Value",
			"category": "Info",
			"name": "expected_value",
            "id":"expected_value",
			"title": "Enter the expected value of a deal.",
			"required": "required",
	        "fieldType": "input",
	        "type": "number",
	        "min": "0",
	        "max": "1000000000000" 

		},{
			"label": "Probability (%)",
			"category": "Info",
			"name": "probability",
            "id":"probability",
			"title": "Enter the probability value less than 100. Eg. 50",
			"required": "required",
	        "fieldType": "input",
	        "type": "number",
	        "min": "0",
	        "max": "100" 
		},
		{
			"label": "Expected closure (in Days)",
			"required":"required",
			"category": "Info",
			"name": "days_to_close",
            "id":"close_date",
			"title": "Expected close date of the deal from the time it is created.",
			"required": "required",
			"fieldType": "input",
			"type":"number",
			"min":"0"

		},{
		    "label": "Description",
			"category": "More details",
		    "name": "description",
		    "id": "description",
		    "title": "Describe the deal.",
		    "cols": "58",
		    "rows": "3",
		    "fieldType": "textarea",
		    "type": "textarea" 
		},{
		    
		    "label": "Milestone",
		    "category": "More details",
		    "name": "milestone",
		    "id": "milestone",
		    "title": "Select milestone from the list.",
		    "options":{
            	<%@page import="com.agilecrm.deals.util.MilestoneUtil"%>
            	<%@page import="com.agilecrm.deals.Milestone" %>
            	<%@page import="java.util.List" %>
            	<%@page import="com.google.appengine.api.NamespaceManager" %>
                <%

                Milestone milestone = MilestoneUtil.getMilestones();
				String milestones = milestone.milestones;
				String[] milestonesArr = milestones.split(",");
				
				for (int i = 0; i < milestonesArr.length; i++)
				{
				    if (i == milestonesArr.length - 1)
					out.println("\"" + milestonesArr[i] + "\":\"" + milestonesArr[i] + "\"");
				    else
				    out.println("\"" + milestonesArr[i] + "\":\"" + milestonesArr[i] + "\",");
				}
				%>
            	
            },
            "required": "required",
		    "fieldType":"select",
		    "type": "select"
		},
        {
            "label": "Owner",
            "required": "Yes",
            "category": "More details",
            "name": "owner_id",
            "title": "Select Owner of the deal.",
            "options": {
            	<%@page import="com.agilecrm.user.util.DomainUserUtil"%>
            	<%@page import="com.agilecrm.user.DomainUser" %>
            	<%@page import="java.util.List" %>
            	<%@page import="com.google.appengine.api.NamespaceManager" %>
                <%
                String domain = NamespaceManager.get();
                
				List<DomainUser> domainUsers = DomainUserUtil.getUsers(domain);
				
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
            "required": "required",
            "fieldType": "select",
            "type": "select" 
        },{
            "label": "Add a deal related to a contact in the CRM.<br/><br/>For example, if a contact opens and clicks a link in your email, then you might want to add a deal. <br/><br/>When this deal is created, the contact is automatically added to the 'Related to' field in the deal.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        }
    ]
}