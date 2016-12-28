package com.agilecrm.core.api.analytics;

import java.util.Calendar;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;

import com.agilecrm.contact.filter.ContactFilter;
import com.agilecrm.visitors.VisitorResponseBuilder;
import com.analytics.util.AnalyticsUtil;
import com.analytics.util.VisitorsUtil;
import com.campaignio.reports.DateUtil;

/**
 * <code>VisitorsAPI</code> is the API class that handles visitors requests. It
 * doesn't fetch anonymous visits. It combines contact web visits and contact
 * core data when customer apply contact filters in visitors section
 * 
 * @author Ramesh
 * 
 */
@Path("/api/web-stats/visitors")
public class VisitorsAPI
{
    @POST
    @Path("/filter/dynamic-filter")
    @Consumes({ MediaType.WILDCARD })
    @Produces({ MediaType.APPLICATION_JSON + ";charset=utf-8", MediaType.APPLICATION_XML })
    public String filterCustomers(@FormParam("filter_json") String filterJson,
	    @FormParam("page_size") String countString, @FormParam("cursor") String cursorString,
	    @FormParam("start_time") Long startTime, @FormParam("end_time") Long endTime,
	    @FormParam("scanned_upto") String scannedUpto, @FormParam("time_zone") String timeZone)
    {
	JSONArray contacts = new JSONArray();
	try
	{
	    // int cursor = AnalyticsUtil.getIntegerValue(cursorString, 0);
	    // int limit = AnalyticsUtil.getIntegerValue(countString, 20);
	    
	    // checking are dynamic filters having tag filter or not
	    ContactFilter tagFilter = VisitorsUtil.getContactFilter(filterJson);
	    Boolean hasContactFilter = false;
	    if (tagFilter != null && tagFilter.rules.size() > 0)
		hasContactFilter = true;
	    
//	    if (StringUtils.isBlank(cursorString))
//		cursorString = "0";
	    
	    String startTimeString = DateUtil.getMySQLNowDateFormat(startTime, timeZone);
	    String endTimeString = DateUtil.getMySQLNowDateFormat(endTime, timeZone);
	    
	    List<String> contactEmails = null;
	    // continue fetch from previous check point (last time we fetched
	    // till 'scannedUpto')
	    // Here scannedUpto is previous checkpoint
	    if (StringUtils.isBlank(scannedUpto))
		scannedUpto = endTimeString;
	    contactEmails = VisitorsUtil.getEmailsFromWebStatsServer(filterJson, startTimeString, scannedUpto, "20", "0");
	    int totalEmailCount = 0;
	    String newScannedTime = null;
	    boolean hasEmails = (contactEmails != null && contactEmails.size() > 1);
	    
	    if (hasEmails)
	    {
		//String emailCountString = contactEmails.get(contactEmails.size() - 1);
		newScannedTime = contactEmails.get(contactEmails.size() - 1);
		newScannedTime = DateUtil.addTime(newScannedTime, Calendar.SECOND, -1);
		contactEmails.remove(contactEmails.size() - 1);
		//contactEmails.remove(contactEmails.size() - 1);
		//totalEmailCount = AnalyticsUtil.getTotalEmailCount(emailCountString);
		if (hasContactFilter)
		    contacts = VisitorsUtil.getContactsFromTextSearch(contactEmails, tagFilter, 10);
		else
		    contacts = VisitorsUtil.getContactsFromDataStore(contactEmails);
	    }
	    
	    hasEmails = (contactEmails.size() > 0);
	    
	    if (hasEmails)
	    {
		// Building response to submit client. Response includes all
		// necessary parameters to continue
		// fetch next time.
		if (contactEmails.size() < 20)
		    hasEmails = false;
		VisitorResponseBuilder responseBuilder = new VisitorResponseBuilder(contacts, hasContactFilter,
		        newScannedTime);
		//responseBuilder.setTotalContactCount(totalEmailCount);
		//responseBuilder.setCursor(cursor);
		//responseBuilder.setPageSize(limit);
		responseBuilder.setHasEmails(hasEmails);
		contacts = responseBuilder.getResponse();
	    }
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while fetching visitors " + e.getMessage());
	}
	String response = null;
	if (contacts != null)
	    response = contacts.toString();
	return response;
	
    }
}
