package com.agilecrm.workflows.automation;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.workflows.triggers.Trigger;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * Trigger is a base class for all triggers which allow application to run
 * campaign automatically. The Trigger Object encapsulates the trigger details
 * which includes name of a trigger, type and campaign.
 * <p>
 * Trigger uses these conditions
 * <ul>
 * <li>When same tag defined in trigger is added to contact.</li>
 * <li>When same tag defined in trigger is deleted from contact.</li>
 * <li>When new contact is added.</li>
 * <li>When new deal is created.</li>
 * <li>When deal is deleted.</li>
 * <li>When score of contact reaches the trigger score.</li>
 * </ul>
 * <p>
 * Some important points to consider are campaigns should not be empty while
 * creating trigger. Trigger use DeferredTask to run different trigger tasks.
 * 
 * @author Ramesh
 * 
 */

@XmlRootElement
@Cached
public class Automation
{
    /**
     * Id of a automation. Each automation has its own and unique id.
     */
    @Id
    public Long id;

    /**
     * Name of a automation which is a valid identifier.
     */
    @NotSaved(IfDefault.class)
    public String name = null;

    /**
     * Campaign id of a campaign with respect to automation. Campaign name can be
     * retrieved using campaign id.
     */
    @NotSaved(IfDefault.class)
    public Long campaign_id = null;
    
    /**
     * ContactFilter id of a contact with respect to automation. Contact Filter details can be
     * retrieved using contact filter id.
     */
    @NotSaved(IfDefault.class)
    public Long contactFilter_id = null;
    
    /**
     * Types of Durations.
     * 
     */
    public enum Duration
    {
	DAILY, WEEKLY,MONTHLY
    };

    /**
     * Trigger type.
     */
    public Duration durationType;

    
    public static ObjectifyGenericDao<Automation> dao = new ObjectifyGenericDao<Automation>(Automation.class);

    /**
     * Default Trigger.
     */
    Automation()
    {

    }

    /**
     * Constructs new {@link Trigger} with name,type and campaign id.
     * 
     * @param name
     *            The trigger name.Required.
     * @param type
     *            The trigger condition.Required.
     * @param campaign_id
     *            The campaign id from campaign.Required.
     */
    public Automation(String name, Duration type, Long campaign_id, Long contactFilter_id)
    {
	this.name = name;
	this.durationType = type;
	this.campaign_id = campaign_id;
	
    }

    /**
     * Saves trigger in database.
     */
    public void save()
    {
	dao.put(this);
    }

    /**
     * Removes trigger from database.
     */
    public void delete()
    {
	dao.delete(this);
    }

}