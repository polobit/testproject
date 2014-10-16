package com.agilecrm.deals.util;

import java.util.ArrayList;
import java.util.List;

import com.agilecrm.core.api.deals.MilestoneAPI;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deals.Milestone;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

/**
 * <code>MilestoneUtil</code> is the utility class for milestones. It handles
 * some of the REST calls of {@link MilestoneAPI}. It fetches existing
 * milestones, otherwise return default milestones.
 * <p>
 * Milestones are saved as a string each separated by comma. The milestone
 * string is split into individual milestones and saved in an array.
 * </p>
 * 
 * @author Yaswanth
 * 
 */
public class MilestoneUtil
{

    // Dao
    private static ObjectifyGenericDao<Milestone> dao = new ObjectifyGenericDao<Milestone>(Milestone.class);

    /**
     * Returns milestone object saved in datastore, otherwise returns default
     * milestone
     * 
     * @return milestone object
     */
    public static Milestone getMilestones()
    {
	Objectify ofy = ObjectifyService.begin();
	Milestone milestone = null;
	if (ofy.query(Milestone.class).count() == 1)
	    milestone = ofy.query(Milestone.class).get();
	else
	    milestone = ofy.query(Milestone.class).filter("name", "Default").get();
	if (milestone == null)
	    return getDefaultMilestones();

	return milestone;
    }

    /**
     * Returns default milestone
     * 
     * @return milestone object
     */
    public static Milestone getDefaultMilestones()
    {
	Milestone milestone = new Milestone("New,Prospect,Proposal,Won,Lost");
	milestone.name = "Default";
	milestone.save();
	return milestone;
    }

    /**
     * Returns milestone object saved in datastore, otherwise returns default
     * milestone
     * 
     * @return milestone object
     */
    public static List<Milestone> getMilestonesList()
    {
	List<Milestone> milestone = dao.fetchAll();
	if (milestone == null)
	{
	    milestone = new ArrayList<>();
	    milestone.add(getDefaultMilestones());
	}

	return milestone;
    }

    /**
     * Get list of milestone based on track name
     * 
     */
    public static List<Milestone> getMilestonesList(String track)
    {
	return dao.listByProperty("name", track);

    }

    /**
     * Get milestones of Pipeline with given Id.
     * 
     * @param id
     *            id of the pipeline.
     * @return Milestone
     */
    public static Milestone getMilestone(Long id)
    {
	try
	{
	    if (id == 0L)
		return getMilestones();
	    return dao.get(id);
	}
	catch (EntityNotFoundException e)
	{
	    e.printStackTrace();
	    return null;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    public static boolean isDuplicate(Milestone milestone, boolean isUpdate)
    {
	List<Milestone> milestones = getMilestonesList();
	int count = 0;
	if (milestones.size() > 0)
	    for (Milestone track : milestones)
	    {
		if (milestone.name.equals(track.name))
		    count++;
	    }
	if ((isUpdate && count == 1) || count == 0)
	    return false;

	return true;
    }

}