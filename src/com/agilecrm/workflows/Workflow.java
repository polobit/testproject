package com.agilecrm.workflows;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.cursor.Cursor;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
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
public class Workflow extends Cursor
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
     * Initialize DataAccessObject.
     */
    public static ObjectifyGenericDao<Workflow> dao = new ObjectifyGenericDao<Workflow>(
	    Workflow.class);

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
     * Saves the workflow object.
     */
    public void save()
    {
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
	    creator_key = new Key<DomainUser>(DomainUser.class, SessionManager
		    .get().getDomainId());
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
	return "Name: " + name + " Rules: " + rules + " created_time: "
		+ created_time + " updated_time" + updated_time;
    }
}