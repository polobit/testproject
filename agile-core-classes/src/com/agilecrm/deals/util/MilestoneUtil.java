package com.agilecrm.deals.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import com.agilecrm.core.api.deals.MilestoneAPI;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deals.Milestone;
import com.agilecrm.subscription.restrictions.db.util.BillingRestrictionUtil;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;

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
	List<Milestone> milestones = getMilestonesList();
	for (Milestone mile : milestones)
	{
	    if (mile.isDefault)
		return mile;
	}

	if (milestones.size() > 0)
	{
	    for (Milestone mile : milestones)
	    {
		if (mile.name.equalsIgnoreCase("Default"))
		    return mile;
	    }

	    return milestones.get(0);
	}

	return getDefaultMilestones();

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
	milestone.isDefault = true;
	milestone.won_milestone = "Won";
	milestone.lost_milestone = "Lost";
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
	List<Milestone> milestone = dao.fetchAllByOrder("name");
	if (milestone == null)
	{
	    milestone = new ArrayList<>();
	    milestone.add(getDefaultMilestones());
	}
	for(Milestone temp : milestone ){
	    Long mile = temp.id;
        System.out.println("name of milestone "+mile);
		int  dealCount = OpportunityUtil.getDealsbyMilestone(mile);
		if(dealCount >0){
				temp.deals_exist =true;
				continue;
	        
		 }
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

    /**
     * Return the count tracks having the name in the given milestone.
     * 
     * @param milestone
     *            milestone object
     * @return count of tracks.
     */
    public static int countByName(Milestone milestone)
    {
	List<Milestone> milestones = getMilestonesList();
	int count = 0;
	if (milestones.size() > 0)
	    for (Milestone track : milestones)
	    {
		if (milestone.name.equals(track.name))
		    count++;
	    }
	return count;
    }

    // returns all deals count
    public static int getCount()
    {

	return Milestone.dao.count();
    }

    public static void isTracksEligible(Milestone milestone)
    {
	
	if (milestone.id == null && !BillingRestrictionUtil.getInstance().getCurrentLimits().getAddTracks())
		 throw new WebApplicationException(Response.status(Response.Status.FORBIDDEN)
				    .entity("Sorry, Your current plan does not have this option.").build());

    }

    public static Milestone saveMileston(Milestone milestone)
    {
	int count = 0;

	if (milestone.id == null)
	    milestone.name = milestone.name.trim();

	MilestoneUtil.isTracksEligible(milestone);

	if (milestone.id != null)
	{
	    Milestone oldMilestone = MilestoneUtil.getMilestone(milestone.id);
	    if (oldMilestone.name.equalsIgnoreCase(milestone.name))
		count = 1;

	    // Check whether the user is changing the name for Default track and
	    // throw exception.
	    if (oldMilestone.name.equalsIgnoreCase("Default") && MilestoneUtil.countByName(oldMilestone) <= 1)
		milestone.isDefault = true;
	}
	if (MilestoneUtil.countByName(milestone) > count)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Sorry, Track already exists with this name.").build());
	}

	milestone.save();
	return milestone;
    }

    public static void setWonMilestone(Long pipelineId, String wonMilestone) throws Exception
    {
	try
	{
	    Milestone mile = getMilestone(pipelineId);
	    if (mile == null)
		throw new Exception("Track not found. Pleas check the id.");
	    mile.won_milestone = null;
	    String[] milestones = mile.milestones.split(",");
	    for (String milestone : milestones)
	    {
		if (milestone.equalsIgnoreCase(wonMilestone))
		    mile.won_milestone = milestone;
	    }
	    if (mile.won_milestone != null)
		mile.save();
	    else
		throw new Exception("Unable to find the given milestone. Please check the input.");
	}
	catch (Exception e)
	{
	    throw e;
	}
    }

    public static void setLostMilestone(Long pipelineId, String lostMilestone) throws Exception
    {
	try
	{
	    Milestone mile = getMilestone(pipelineId);
	    if (mile == null)
		throw new Exception("Track not found. Pleas check the id.");
	    mile.lost_milestone = null;
	    String[] milestones = mile.milestones.split(",");
	    for (String milestone : milestones)
	    {
		if (milestone.equalsIgnoreCase(lostMilestone))
		    mile.lost_milestone = milestone;
	    }
	    if (mile.lost_milestone != null)
		mile.save();
	    else
		throw new Exception("Unable to find the given milestone. Please check the input.");
	}
	catch (Exception e)
	{
	    throw e;
	}
    }
}