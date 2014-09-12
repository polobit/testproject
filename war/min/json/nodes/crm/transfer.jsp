{
    "name": "Transfer",
    "thumbnail": "json/nodes/images/common/transfer.png",
    "icon": "json/nodes/icons/common/transfer.png",
    "info": "Transfer the contact into a different campaign.",
    "help": "Transfer the contact into a different campaign.",
    "author": "Naresh",
    "company": "mantra",
    "language": "en",
    "branches": "yes",
    "workflow_tasklet_class_name":"com.campaignio.tasklets.agile.Transfer",
    "category": "Utilities",
    "ui": [
        {
            "label": "Campaigns",
            "required": "Yes",
            "category": "Settings",
            "name": "campaign_id",
            "id": "campaign_id",
            "title": "Select campaign from the list.",
            "options": {
            	<%@page import="com.agilecrm.workflows.util.WorkflowUtil"%>
            	<%@page import="com.agilecrm.workflows.Workflow" %>
            	<%@page import="java.util.List" %>
                <%
				List<Workflow> workflows = WorkflowUtil.getAllWorkflows();

				Object arr[] = workflows.toArray();
				for (int i = 0; i < arr.length; i++)
				{
				    Workflow workflow = (Workflow) arr[i];
				    
				    String id = workflow.id.toString();
				    String name = workflow.name;

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
            "label": "Transfer the contact into a different campaign. For example, if a contact completes a purchase on your website, you can transfer the contact to a \"Welcome Customer\" campaign!",
            "category": "Help",
            "fieldType": "label",
            "type": "label" 
        }
    ]
}