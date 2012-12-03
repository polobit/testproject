package com.agilecrm.workflows;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * Trigger is a base class for all triggers which allow application to run
 * campaign automatically. The Trigger Object encapsulates the trigger details
 * which includes name of a trigger,type and campaign.
 * <p>
 * Trigger uses these conditions
 * <ul>
 * <li>When same tag defined in trigger is added to contact</li>
 * <li>When same tag defined in trigger is deleted from contact</li>
 * <li>When new contact is added</li>
 * <li>When new deal is created</li>
 * <li>When deal is deleted</li>
 * <li>When score of contact reaches the trigger score</li>
 * </ul>
 * <p>
 * Some important points to consider are campaigns should not be empty while
 * creating trigger. Trigger use DeferredTask to run different trigger tasks.
 * 
 * @author Naresh
 * 
 */

@XmlRootElement
public class Trigger
{

    /**
     * Id of a trigger.Each trigger has its own and unique id.
     */
    @Id
    public Long id;

    /**
     * Name of a trigger which is a valid identifier.
     */
    @NotSaved(IfDefault.class)
    public String name = null;

    /**
     * Types of Triggers
     * 
     */
    public enum Type
    {
	TAG_IS_ADDED, TAG_IS_DELETED, CONTACT_IS_ADDED, DEAL_IS_ADDED, DEAL_IS_DELETED, ADD_SCORE
    };

    /**
     * Trigger type.
     */
    public Type type;

    /**
     * Campaign id of a campaign with respect to trigger.Campaign name can be
     * retrieved using campaign id.
     */
    @NotSaved(IfDefault.class)
    public String campaign_id = null;

    /**
     * Custom score while saving trigger with Add score type.
     */
    @NotSaved(IfDefault.class)
    public Integer custom_score = null;

    /**
     * Custom tags set while saving trigger with Tag is added and Tag is deleted
     * types.
     */
    @NotSaved(IfDefault.class)
    public Set<String> custom_tags = new HashSet<String>();

    /**
     * String array object for trigger tags
     */
    @NotSaved
    public String trigger_tags[] = null;

    /**
     * Initialize DataAccessObject
     */
    private static ObjectifyGenericDao<Trigger> dao = new ObjectifyGenericDao<Trigger>(
	    Trigger.class);

    /**
     * Default Trigger
     */
    Trigger()
    {

    }

    /**
     * Constructs new {@link Trigger} with name,type and campaign id.
     * 
     * @param name
     *            The trigger name.Required
     * @param type
     *            The trigger condition.Required
     * @param campaign_id
     *            The campaign id from campaign.Required
     */
    public Trigger(String name, Type type, String campaign_id)
    {
	this.name = name;
	this.type = type;
	this.campaign_id = campaign_id;
    }

    /**
     * Campaign name is returned as an xml element which is retrieved using
     * campaign-id
     * 
     * @return The campaign name as an xml element based on campaign id if
     *         exists otherwise return ?
     * @throws Exception
     *             When campaign doesn't exist for given campaign id.
     */
    @XmlElement(name = "campaign")
    public String getCampaign() throws Exception
    {

	if (!StringUtils.isEmpty(campaign_id))
	{
	    Workflow workflow = Workflow.getWorkflow(Long
		    .parseLong(campaign_id));

	    if (workflow != null)
		return workflow.name;
	}

	return "?";
    }

    /**
     * Return trigger custom tags.
     * 
     * @return The custom tags of a trigger as Xml element
     */
    @XmlElement
    public Set<String> getTags()
    {
	return custom_tags;
    }

    /**
     * Save trigger in database
     */
    public void save()
    {
	dao.put(this);
    }

    /**
     * Removes trigger from database
     */
    public void delete()
    {
	dao.delete(this);
    }

    /**
     * Add custom trigger tags before save.Save trigger_tags array into Set.
     */
    @PrePersist
    private void PrePersist()
    {
	// Save trigger tags into set when not null
	if (trigger_tags != null)
	{
	    for (String trigger_tag : trigger_tags)
		custom_tags.add(trigger_tag);
	}

    }

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Object#toString()
     */
    public String toString()
    {
	return "Name: " + name + " Condition: " + type + "Campaign:"
		+ campaign_id;
    }

}
