package com.agilecrm.deals;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;

/**
 * <code>Milestone</code> is the base class for milestones set for any
 * deal.Milestones indicates at what stage the Deal present.'Lost','Open','Won'
 * and 'Stage1' are taken as default milestones.
 * <p>
 * Milestones can be given by Domain user through admin-settings in
 * client-side.The given milestones are displayed under select for every
 * deal.Milestones describes the Deal's stage and can be changed for a deal
 * whenever required.
 * </p>
 * 
 * @author Yaswanth
 * 
 */
@XmlRootElement
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
     * Milestone Dao
     */
    private static ObjectifyGenericDao<Milestone> dao = new ObjectifyGenericDao<Milestone>(
	    Milestone.class);

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
	dao.put(this);
    }


}
