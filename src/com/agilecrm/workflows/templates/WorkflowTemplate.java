package com.agilecrm.workflows.templates;

import javax.persistence.Id;

import com.agilecrm.db.ObjectifyGenericDao;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Unindexed;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>WorkflowTemplate</code> is the base class for workflow templates or
 * campaign templates. WorkflowTemplate Object encapsulates template details
 * like category, template_name and rules (or workflow json)
 * 
 * @author Naresh
 * 
 */
@Unindexed
@Cached
public class WorkflowTemplate
{
    /**
     * Id
     */
    @Id
    public Long id;

    /**
     * Workflow template resource name excluding _template.js
     */
    @Indexed
    @NotSaved(IfDefault.class)
    public String template_name = null;

    /**
     * Workflow template json
     */
    @NotSaved(IfDefault.class)
    public String rules = null;

    /**
     * DAO
     */
    public static ObjectifyGenericDao<WorkflowTemplate> dao = new ObjectifyGenericDao<WorkflowTemplate>(
	    WorkflowTemplate.class);

    /**
     * Default WorkflowTemplate
     */
    WorkflowTemplate()
    {
    }

    /**
     * Constructs a new {@link WorkflowTemplate} with category, name and rules
     * 
     * @param category
     *            - Category or sub-folder name
     * @param templateName
     *            - Template name excluding _template.js extension
     * @param rules
     *            - workflow json
     */
    public WorkflowTemplate(String templateName, String rules)
    {
	this.template_name = templateName;
	this.rules = rules;
    }

    /**
     * Saves WorkflowTemplate to datastore in empty namespace as templates are
     * common at app level
     */
    public void save()
    {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    dao.put(this);
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
    }
}
