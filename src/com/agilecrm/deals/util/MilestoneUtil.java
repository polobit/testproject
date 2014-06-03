package com.agilecrm.deals.util;

import com.agilecrm.core.api.deals.MilestoneAPI;
import com.agilecrm.deals.Milestone;
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
    /**
     * Returns milestone object saved in datastore, otherwise returns default
     * milestone
     * 
     * @return milestone object
     */
    public static Milestone getMilestones()
    {
	Objectify ofy = ObjectifyService.begin();
	Milestone milestone = ofy.query(Milestone.class).get();
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
	milestone.save();
	return milestone;
    }
}