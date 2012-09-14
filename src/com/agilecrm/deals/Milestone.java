package com.agilecrm.deals;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

@XmlRootElement
public class Milestone
{

    // Key
    @Id
    public Long id;

    public String milestones;

    private static ObjectifyGenericDao<Milestone> dao = new ObjectifyGenericDao<Milestone>(
	    Milestone.class);

    Milestone()
    {

    }

    Milestone(String milestones)
    {
	this.milestones = milestones;
    }

    public void save()
    {
	dao.put(this);
    }

    public static Milestone getMilestones()
    {
	Objectify ofy = ObjectifyService.begin();
	Milestone milestone = ofy.query(Milestone.class).get();
	if (milestone == null)
	    return getDefaultMilestone();

	return milestone;
    }

    public static Milestone getDefaultMilestone()
    {
	Milestone milestone = new Milestone("Lost, Open, Won, Stage 1");
	milestone.save();
	return milestone;
    }

    public static String[] getMilestonesArray()
    {
	Objectify ofy = ObjectifyService.begin();
	Milestone milestone = ofy.query(Milestone.class).get();

	// Send default milestones if not available
	if (milestone == null)
	    return getDefaultMilestone().milestones.split(",");

	return milestone.milestones.split(",");
    }
}
