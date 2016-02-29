package com.agilecrm.web.stats;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;

/**
 * <code>AnalyticsServlet</code> handles page-view requests from javascript.It
 * handles page-views analysis. It will store the obtained values from query
 * string into google cloud sql. Fetches remote ip address to save in database.
 * 
 * @author Naresh
 * 
 */
@SuppressWarnings("serial")
public class StatsServlet extends HttpServlet
{
    public static enum ACTIONS
    {
	ADD, FETCH_PAGE_XVIEWS, FETCH_XACTIVITIES, FETCH_XLIMITED_VIEWS, URL_VISITED_XCOUNT, ERADICATEX
    }
    
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException
    {
	doPost(request, response);
    }
    
    /*
     * (non-Javadoc)
     * 
     * @see
     * javax.servlet.http.HttpServlet#doPost(javax.servlet.http.HttpServletRequest
     * , javax.servlet.http.HttpServletResponse)
     */
    public void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException
    {
	String action = req.getParameter("action");
	String domain = req.getParameter("domain");
	if (StringUtils.isNotBlank(action) && StringUtils.isNotBlank(domain))
	{
	    ACTIONS routeAction = ACTIONS.valueOf(action);
	    switch (routeAction)
	    {
	    case ADD:
		StatsUtil.insertPageVisit(req, res);
		break;
	    case FETCH_PAGE_XVIEWS:
		if (StatsUtil.isValidRequest(req.getParameter("psd")))
		    StatsSQLUtil.getAnalyticsOfAContact(req, res, domain);
		break;
	    case FETCH_XACTIVITIES:
		if (StatsUtil.isValidRequest(req.getParameter("psd")))
		    StatsSQLUtil.getContactActivitiesLogs(req, res, domain);
		break;
	    case FETCH_XLIMITED_VIEWS:
		if (StatsUtil.isValidRequest(req.getParameter("psd")))
		    StatsSQLUtil.getLimitedPageViews(req, res, domain);
		break;
	    case URL_VISITED_XCOUNT:
		if (StatsUtil.isValidRequest(req.getParameter("psd")))
		    StatsSQLUtil.getCountForGivenURL(req, res, domain);
		break;
	    case ERADICATEX:
		if (StatsUtil.isValidRequest(req.getParameter("psd")))
		    StatsSQLUtil.deleteStatsBasedOnNamespace(domain);
		break;
	    default:
		break;
	    }
	}
    }
}