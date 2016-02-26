package com.agilecrm.deals;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deals.util.MilestoneUtil;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>Milestone</code> is the base class for milestones set for any deal.
 * Milestones indicates at what stage the Deal present. 'Lost', 'Open', 'Won'
 * and 'Stage1' are taken as default milestones.
 * <p>
 * Milestones can be given by Domain user through admin-settings in client-side.
 * The given milestones are displayed under select for every deal. Milestones
 * describes the Deal's stage and can be changed for a deal whenever required.
 * </p>
 * 
 * @author Yaswanth
 * 
 */
@XmlRootElement
@Cached
public class Milestone
{
    /**
     * Milestone Id
     */
    @Id
    public Long id;

    /**
     * Milestones
     */
    public String milestones;

    /**
     * Name of Pipeline
     */
    @NotSaved(IfDefault.class)
    public String name;

    public boolean isDefault = false;

    public String lost_milestone = null;

    public String won_milestone = null;
    
    @NotSaved
    public boolean deals_exist = false ; 

    /**
     * Milestone Dao
     */
    public static ObjectifyGenericDao<Milestone> dao = new ObjectifyGenericDao<Milestone>(Milestone.class);

    /**
     * Default Milestone
     */
    Milestone()
    {
    }

    /**
     * Constructs a new {@link Milestone}
     * 
     * @param milestones
     *            - Milestones of a deal
     */
    public Milestone(String milestones)
    {
	this.milestones = milestones;
    }

    /**
     * Saves milestone in datastore
     */
    public void save()
    {
	Milestone old = null;
	if (this.id != null)
	{
	    old = MilestoneUtil.getMilestone(this.id);
	    if (old.isDefault)
		this.isDefault = true;
	}
	dao.put(this);
    }

    /**
     * Deletes the milestone from database
     */
    public void delete()
    {
	dao.delete(this);
    }
}