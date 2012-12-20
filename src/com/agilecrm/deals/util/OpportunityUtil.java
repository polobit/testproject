package com.agilecrm.deals.util;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import net.sf.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.deals.Milestone;
import com.agilecrm.deals.Opportunity;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

public class OpportunityUtil
{

    public static Opportunity getOpportunity(Long id)
    {
	try
	{
	    return Opportunity.dao.get(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    public static List<Opportunity> getOpportunities()
    {
	return Opportunity.dao.fetchAll();
    }

    // Get deals of contact in contact details: Yaswanth - 08/24/12
    public static List<Opportunity> getCurrentContactDeals(Long id)
    {
	Objectify ofy = ObjectifyService.begin();

	Key<Contact> contact_key = new Key<Contact>(Contact.class, id);

	return ofy.query(Opportunity.class)
		.filter("related_contacts = ", contact_key).list();

    }

    // Get Opportunities based on time
    public static List<Opportunity> getOpportunities(long minTime, long maxTime)
    {
	return Opportunity.dao.ofy().query(Opportunity.class)
		.filter("close_date >= ", minTime)
		.filter("close_date <= ", maxTime).list();
    }

    // Get map of total and pipelines
    // Author: Yaswanth - 07/30/2012
    @SuppressWarnings("unused")
    public static JSONObject getDealsDetails(long minTime, long maxTime)
    {

	// Final JSON Constants
	String TOTAL = "total";
	String PIPELINE = "pipeline";

	// Deals Object
	JSONObject dealsObject = new JSONObject();

	// Returns month (key) and total and pipeline
	List<Opportunity> opportunitiesList = getOpportunities(minTime, maxTime);
	for (Opportunity opportunity : opportunitiesList)
	{
	    try
	    {
		// Total and Pipeline (total * probability)
		long total = opportunity.expected_value;
		long pipeline = opportunity.expected_value
			* opportunity.probability / 100;

		// mm-yy
		DateFormat formatter = new SimpleDateFormat("MM-yy");

		// Get mm/yy
		// String mmYY = formatter.format(new
		// Date(opportunity.close_date * 1000));
		Date opportunityDate = new Date(opportunity.close_date * 1000);
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(opportunityDate);

		calendar.set(Calendar.DAY_OF_MONTH, 1);

		Date firstDayOfMonth = calendar.getTime();
		String mmYY = Math.round(firstDayOfMonth.getTime() / 1000) + "";

		Long oldTotal = 0L, oldPipeline = 0L;

		// Read from previous object if present
		if (dealsObject.containsKey(mmYY))
		{
		    JSONObject totalAndPipeline = dealsObject
			    .getJSONObject(mmYY);
		    oldTotal = totalAndPipeline.getLong(TOTAL);
		    oldPipeline = totalAndPipeline.getLong(PIPELINE);
		}

		// If already present, get the previous one and add total and
		// pipeline
		JSONObject totalAndPipeline;

		// Check whether dealsObject is null
		if (dealsObject.containsKey(mmYY)
			&& dealsObject.getJSONObject(mmYY) == null)
		{
		    totalAndPipeline = dealsObject.getJSONObject(mmYY);
		}
		else
		{
		    totalAndPipeline = new JSONObject();
		}

		// Update the mmYY with the new totals
		totalAndPipeline.put(TOTAL, total + oldTotal);
		totalAndPipeline.put(PIPELINE, pipeline + oldPipeline);
		dealsObject.put(mmYY, totalAndPipeline);

	    }
	    catch (Exception e)
	    {
		System.out.println("Exception :" + e);
	    }
	}

	// System.out.println(dealsObject);

	return dealsObject;
    }

    // Get Total Number of Milestones in a given period
    public static int getTotalNumberOfMilestones(long minTime, long maxTime,
	    String milestone)
    {
	return Opportunity.dao.ofy().query(Opportunity.class)
		.filter("close_date >= ", minTime)
		.filter("close_date <= ", maxTime)
		.filter("milestone", milestone).count();

    }

    // To get Milestones of deals
    // Author:yaswanth 07/30/2012
    public static JSONObject getMilestones(long minTime, long maxTime)
    {

	// Milestones object
	JSONObject milestonesObject = new JSONObject();

	// Array of milestones
	Opportunity.MILESTONES = Milestone.getMilestonesArray();

	// Iterate through all possible milestones
	for (String milestone : Opportunity.MILESTONES)
	{

	    int numOpportunities = getTotalNumberOfMilestones(minTime, maxTime,
		    milestone.trim());
	    milestonesObject.put(milestone, numOpportunities);
	}

	System.out.println(milestonesObject);
	return milestonesObject;
    }

    // To get the conversions rate in particular period - Total Closed/Total
    // Author:yaswanth 07/30/2012
    public static JSONObject getConversionDetails(long minTime, long maxTime)
    {

	// Get Total
	int numOpportunities = Opportunity.dao.ofy().query(Opportunity.class)
		.filter("close_date >= ", minTime)
		.filter("close_date <= ", maxTime).count();

	JSONObject converstionObject = new JSONObject();

	// Get Closed Total
	int closedNumOpportunities = getTotalNumberOfMilestones(minTime,
		maxTime, "won");

	converstionObject.put("conversion", (closedNumOpportunities * 100)
		/ numOpportunities);

	System.out.println(converstionObject);
	return converstionObject;
    }

}
