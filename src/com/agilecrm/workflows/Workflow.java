package com.agilecrm.workflows;

import java.math.BigDecimal;
import java.util.List;

import javax.persistence.Embedded;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.cursor.Cursor;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.session.SessionManager;
import com.agilecrm.subscription.restrictions.BillingRestrictionManager;
import com.agilecrm.subscription.restrictions.exception.PlanRestrictedException;
import com.agilecrm.subscription.restrictions.util.BillingRestrictionUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.workflows.triggers.Trigger;
import com.agilecrm.workflows.triggers.util.TriggerUtil;
import com.agilecrm.workflows.unsubscribe.Unsubscribe;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Unindexed;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>Workflow</code> is the base class for all the workflows created at
 * client-side. Each workflow object consists of workflow-id(generated),
 * workflow name, created time, updated time, rules and name of creator. The
 * rules in workflow is a String object that takes entire workflow diagram in
 * json.
 * <p>
 * Workflow inherits {@link Cursor} to include Cursor class variables within
 * this class. Workflow class uses {@link DomainUser} to create key and to store
 * the key as the workflow's owner.
 * </p>
 * <p>
 * The <code>Workflow</code> class provides methods to create, update, delete
 * and get the workflows.
 * </p>
 * 
 * @author Manohar
 * 
 */
@XmlRootElement
@Unindexed
public class Workflow extends Cursor implements BillingRestrictionManager
{
    /**
     * Id of a workflow. Each workflow has its own and unique id.Id is system
     * generated
     */
    @Id
    public Long id;

    /**
     * Workflow Name.
     */
    @Indexed
    public String name;

    /**
     * Workflow created time (in epoch).
     */
    @Indexed
    public Long created_time = 0L;

    /**
     * Workflow updated time (in epoch).
     */
    @NotSaved(IfDefault.class)
    public Long updated_time = 0L;

    /**
     * Complete workflow diagram as json string.
     */
    @NotSaved(IfDefault.class)
    public String rules = null;

    /**
     * Creator of workflow (to be specific which domain user created).
     */
    @NotSaved(IfDefault.class)
    @Indexed
    private Key<DomainUser> creator_key = null;

    /**
     * Unsubscribe options
     */
    @NotSaved(IfDefault.class)
    @Embedded
    public Unsubscribe unsubscribe = new Unsubscribe();

    /**
     * Initialize DataAccessObject.
     */
    public static ObjectifyGenericDao<Workflow> dao = new ObjectifyGenericDao<Workflow>(Workflow.class);

    /**
     * Default Workflow.
     */
    Workflow()
    {

    }

    /**
     * Constructs new {@link Workflow} with name and rules.
     * 
     * @param name
     *            Name of workflow.
     * @param rules
     *            Workflow rules.
     */
    public Workflow(String name, String rules)
    {
	this.name = name;
	this.rules = rules;
    }

    /**
     * Returns domain user id from DomainUser Key
     * 
     * @return domain user id
     */
    public Long getDomainUserId()
    {
	if (this.creator_key == null)
	    return null;

	return this.creator_key.getId();
    }

    /**
     * Returns domain user name as an xml element who creates workflow.
     * 
     * @return Respective name of domain user who creates workflow.
     * @throws Exception
     *             when domain user doesn't exist with that id.
     */
    @XmlElement(name = "creator")
    public String getCreatorName() throws Exception
    {
	if (creator_key == null)
	{
	    return "";
	}

	DomainUser domainUser = null;

	try
	{
	    domainUser = DomainUserUtil.getDomainUser(creator_key.getId());
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	if (domainUser != null)
	    return domainUser.name;

	return "";
    }

    /**
     * Returns list of triggers with respect to campaign, so that user can know
     * triggers with respect to workflow.
     * 
     * @return - List
     */
    @XmlElement
    public List<Trigger> getTriggers()
    {
	List<Trigger> triggers = TriggerUtil.getTriggersByCampaignId(id);
	return triggers;
    }

    /**
     * Saves the workflow object. But before saving, verifies for duplicate
     * names. If given name already exists, it throws exception. Same name
     * causes confusion while assigning campaign.
     */
    public void save() throws WebApplicationException
    {

	// Verifies for duplicate workflow name before save
	checkForDuplicateName();

	dao.put(this);
    }

    /**
     * Removes the workflow object.
     */
    public void delete()
    {
	dao.delete(this);
    }

    /**
     * Verifies whether given name is equivalent to any one of the existing
     * workflow names. If names are equal, it throws exception.
     * <p>
     * For edit workflow, two cases exist. 1. If name is updated - should verify
     * with existing ones. 2. If name is not updated - no need of verification.
     * </p>
     * 
     * @throws Exception
     */
    private void checkForDuplicateName() throws WebApplicationException
    {
	// New workflow
	if (id == null)
	{
	    if (WorkflowUtil.getCampaignNameCount(name) > 0)
		throw new WebApplicationException(Response.status(Status.BAD_REQUEST).entity("Please change the given name. Same kind of name already exists.")
			.build());
	}

	// Old workflow
	if (id != null)
	{
	    // to compare given name with existing ones.
	    Workflow oldWorkflow = WorkflowUtil.getWorkflow(id);

	    // Verifies only when workflow name updated
	    if (!oldWorkflow.name.equals(name))
	    {
		// throws exception for duplicate name
		if (WorkflowUtil.getCampaignNameCount(name) == 1)
		    throw new WebApplicationException(Response.status(Status.BAD_REQUEST)
			    .entity("Please change the given name. Same kind of name already exists.").build());
	    }
	}
    }

    /**
     * Sets created time and updated time. PrePersist is called each time before
     * object gets saved. Sets creator key when it is null.
     */
    @PrePersist
    private void PrePersist()
    {
	// Set creator_key only when it is null
	if (creator_key == null)
	{
	    // Set creator(current domain user)
	    creator_key = new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId());
	}

	// Store Created and Last Updated Time
	if (created_time == 0L)
	{
	    created_time = System.currentTimeMillis() / 1000;
	}

	else
	    updated_time = System.currentTimeMillis() / 1000;
    }

    public String toString()
    {
	return "Name: " + name + " Rules: " + rules + " created_time: " + created_time + " updated_time" + updated_time;
    }

    public static void main(String[] arg)
    {
	BigDecimal b = new BigDecimal(22);
	BigDecimal b1 = new BigDecimal(7);
	System.out.println(BigDecimal.valueOf(22.0).divide(BigDecimal.valueOf(7)));

	System.out.println(22 / 7f);
    }

    @Override
    public boolean isNew()
    {
	if (id == null)
	    return true;
	// TODO Auto-generated method stub
	return false;
    }

    @Override
    public void checkLimits() throws PlanRestrictedException
    {
	// TODO Auto-generated method stub
	BillingRestrictionUtil.getInstance(true).check(dao);
    }

    @Override
    @JsonIgnore
    public ObjectifyGenericDao getDao() throws PlanRestrictedException
    {
	// TODO Auto-generated method stub
	return dao;
    }
}