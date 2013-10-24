{
    "name": "Set Owner",
    "thumbnail": "json/nodes/images/crm/setowner.png",
    "icon": "json/nodes/icons/crm/setowner.png",
    "info": "Set owner to the contact.",
    "help": "Set owner to the contact.",
    "author": "Naresh",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name":"com.campaignio.tasklets.agile.SetOwner",
    "category": "Utilities",
    "ui": [
        {
            "label": "Owner",
            "required": "Yes",
            "category": "Settings",
            "name": "owner_id",
            "id": "owner_id",
            "title": "Select owner from the list.",
            "options": {
            	<%@page import="com.agilecrm.user.util.DomainUserUtil"%>
            	<%@page import="com.agilecrm.user.DomainUser" %>
            	<%@page import="java.util.List" %>
                <%
				List<DomainUser> domainUsers = DomainUserUtil.getUsers();

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
            "label": "Change the owner of the contact.<br/><br/>An example use case for this could be - If the contact clicks a link in email, set the owner to a sales guy so that the contact shows up in his My Contacts list.",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        }
    ]
}