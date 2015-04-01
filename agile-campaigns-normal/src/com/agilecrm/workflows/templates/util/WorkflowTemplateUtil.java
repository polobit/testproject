package com.agilecrm.workflows.templates.util;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.util.FileStreamUtil;
import com.agilecrm.workflows.templates.WorkflowTemplate;
import com.google.appengine.api.NamespaceManager;

/**
 * <code>WorkflowTemplateUtil</code> is the utility class for
 * {@link WorkflowTemplate}. It retrieves WorkflowTemplate from datastore if
 * already exists, otherwise retrieves from file resource after saving it to
 * datastore.
 * 
 * @author Naresh
 * 
 */
public class WorkflowTemplateUtil
{

    /**
     * Campaigns template path.
     */
    public static final String CAMPAIGN_TEMPLATES_PATH = "misc/campaign-templates/";

    /**
     * Campaigns template extension
     */
    public static final String CAMPAIGN_TEMPLATE_EXTENSION = "_template.js";

    /**
     * Returns WorkflowTemplate from db if exists, otherwise retrieve template
     * resource and returns after saving to db
     * 
     * @param category
     *            - template category like general, saas etc.
     * @param templateName
     *            - template name like newsletter etc
     * @return WorkflowTemplate
     */
    public static WorkflowTemplate getWorkflowTemplate(String category, String templateName)
    {
	WorkflowTemplate workflowTemplate = null;

	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    workflowTemplate = WorkflowTemplate.dao.getByProperty("template_name", templateName);

	    // If not exists in db, get from file resource
	    if (workflowTemplate == null)
	    {
		System.out.println("Retrieving template as file resource..." + templateName);
		workflowTemplate = getWorkflowTemplateResource(category, templateName);
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while retrieving workflow template " + e.getMessage());
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}

	return workflowTemplate;
    }

    /**
     * Returns WorkflowTemplate object after saving the file resource to
     * datastore.
     * 
     * @param category
     *            - template category
     * @param templateName
     *            - template name
     * @return WorkflowTemplate
     */
    public static WorkflowTemplate getWorkflowTemplateResource(String category, String templateName)
    {
	String templateString = FileStreamUtil.readResource(CAMPAIGN_TEMPLATES_PATH + category + "/" + templateName + CAMPAIGN_TEMPLATE_EXTENSION);

	// If unable to retrieve, return
	if (StringUtils.isBlank(templateString))
	{
	    System.err.println("Unable to retrieve template string...");
	    return null;
	}

	return saveTemplateToDB(templateName, templateString);
    }

    /**
     * Saves template json along with template_name to datastore.
     * 
     * @param templateName
     *            - template name
     * @param templateString
     *            - complete workflow template rules json
     * @return WorkflowTemplate
     */
    public static WorkflowTemplate saveTemplateToDB(String templateName, String templateString)
    {
	// Save
	WorkflowTemplate workflowTemplate = new WorkflowTemplate(templateName, templateString);
	workflowTemplate.save();

	return workflowTemplate;
    }
}
