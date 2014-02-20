package com.agilecrm.core.api.campaigns;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.workflows.templates.WorkflowTemplate;
import com.agilecrm.workflows.templates.util.WorkflowTemplateUtil;

/**
 * <code>WorkflowTemplatesAPI</code> perform CRUD operations for
 * {@link WorkflowTemplate}.
 * 
 * @author Naresh
 * 
 */
@Path("/api/workflow-templates")
public class WorkflowTemplatesAPI
{

    /**
     * Returns WorkflowTemplate object based on category and template name
     * 
     * @param category
     *            - category of workflow templates
     * @param name
     *            - template name
     * @return WorkflowTemplate object
     */
    @Path("/{category}/{name}")
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public WorkflowTemplate getWorkflowTemplate(@PathParam("category") String category, @PathParam("name") String name)
    {
	return WorkflowTemplateUtil.getWorkflowTemplate(category, name);
    }
}
