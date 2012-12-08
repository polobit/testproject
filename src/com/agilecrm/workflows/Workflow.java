package com.agilecrm.workflows;

import java.util.List;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.core.DomainUser;
import com.agilecrm.cursor.Cursor;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.session.SessionManager;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.annotation.Unindexed;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>Workflow</code> is the base class for all the workflows created at
 * client-side.Each workflow object consists of workflow-id(generated), workflow
 * name, created time, updated time, rules and name of creator.The rules in
 * workflow is a String object that takes entire workflow diagram in json.
 * <p>
 * Workflow inherits {@link Cursor} to include Cursor class variables within
 * this class.Workflow class uses {@link DomainUser} to create key and to store
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
     * Id of a workflow.Each workflow has its own and unique id.Id is system
     * generated
     */
    @Id
    public Long id;

    /**
     * Workflow Name
     */
    public String name;

    /**
     * Workflow created time(in epoch)
     */
    public Long created_time = 0L;

    /**
     * Workflow updated time(in epoch)
     */
    @NotSaved(IfDefault.class)
    public Long updated_time = 0L;

    /**
     * Complete workflow diagram as json string
     */
    @NotSaved(IfDefault.class)
    public String rules = null;

    /**
     * Creator of workflow(to be specific which domain user created)
     */
    @NotSaved(IfDefault.class)
    private Key<DomainUser> creator_key = null;

    /**
     * Initialize DataAccessObject
     */
    public static ObjectifyGenericDao<Workflow> dao = new ObjectifyGenericDao<Workflow>(
	    Workflow.class);

    /**
     * Default Workflow
     */
    Workflow()
    {

    }

    /**
     * Constructs new {@link Workflow} with name and rules.
     * 
     * @param name
     *            Name of workflow
     * @param rules
     *            Workflow rules
     */
    public Workflow(String name, String rules)
    {
	this.name = name;
	this.rules = rules;
    }

    /**
     * Locates workflow based on id
     * 
     * @param id
     *            Workflow id
     * @return workflow object with that id if exists ,otherwise null
     */
    public static Workflow getWorkflow(Long id)
    {
	try
	{
	    return dao.get(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    /**
     * Returns all workflows as a collection list
     * 
     * @return list of all workflows
     */
    public static List<Workflow> getAllWorkflows()
    {
	return dao.fetchAll();
    }

    /**
     * Returns list of workflows based on page size
     * 
     * @param max
     *            Maximum number of workflows list based on page size query
     *            param
     * @param cursor
     *            Cursor string that points the list that exceeds page_size
     * @return Returns list of workflows with respective to page size and cursor
     */
    public static List<Workflow> getAllWorkflows(int max, String cursor)
    {
	return dao.fetchAll(max, cursor);
    }

    /**
     * Returns domain user name as an xml element who creates workflow
     * 
     * @return Respective name of domain user who creates workflow.
     * @throws Exception
     *             when domain user doesn't exist with that id
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
	    domainUser = DomainUser.getDomainUser(creator_key.getId());
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
     * Saves the workflow object
     */
    public void save()
    {
	dao.put(this);
    }

    /**
     * Removes the workflow object
     */
    public void delete()
    {
	dao.delete(this);
    }

    /**
     * Sets created time and updated time.PrePersist is called each time before
     * object gets saved.Sets creator key when it is null.
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