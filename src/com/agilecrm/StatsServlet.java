package com.agilecrm;

import java.io.IOException;
import java.util.Date;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.db.GoogleSQL;
import com.google.appengine.api.NamespaceManager;

/**
 * <code>StatsServlet</code> handles page-view requests from javascript.It
 * handles page-views analysis. It will store the obtained values from query
 * string into google cloud sql. Fetches remote ip address to save in database.
 * 
 * @author Naresh
 * 
 */
public class StatsServlet extends HttpServlet
{
    public void doGet(HttpServletRequest request, HttpServletResponse response)
	    throws IOException
    {
	doPost(request, response);
    }

    public void doPost(HttpServletRequest req, HttpServletResponse res)
	    throws IOException
    {
	// Domain
	String domain = NamespaceManager.get();

	System.out.println("Namespace in StatsServlet: " + domain);

	String guid = req.getParameter("guid");
	String sid = req.getParameter("sid");
	String url = req.getParameter("url");
	String email = req.getParameter("email");

	String ip = null;
	String newOne = null;
	String ref = null;
	String userAgent = null;
	String country = null;
	String region = null;
	String city = null;
	String cityLatLong = null;

	// If new
	if (!StringUtils.isEmpty(req.getParameter("new")))
	{
	    newOne = req.getParameter("new");
	    ref = req.getParameter("ref");

	    // If ref is empty
	    if (StringUtils.isEmpty(ref))
		ref = "ref";

	    ip = getClientIP(req);

	    // Get Visitor Info
	    userAgent = req.getHeader("User-Agent");

	    // App-Engine Headers
	    country = req.getHeader("X-AppEngine-Country");
	    region = req.getHeader("X-AppEngine-Region");
	    city = req.getHeader("X-AppEngine-City");
	    cityLatLong = req.getHeader("X-AppEngine-CityLatLong");
	}

	// Get request time
	Date date = new Date();
	long reqTime = date.getTime() / 1000;

	// Insert into table
	GoogleSQL.addToPageViews(domain, guid, email, sid, url, ip, newOne,
		ref, userAgent, country, region, city, cityLatLong, reqTime);
    }

    /**
     * Gets client IP address using request header 'X-Forwarded-For'. If it is
     * not empty, gets ip address from forwarded ip, otherwise gets remote
     * address.
     * 
     * @param req
     *            - HttpRequest
     * @return ip address string.
     */
    private static String getClientIP(HttpServletRequest req)
    {
	String ipAddress = null;

	String forwardedIpsStr = req.getHeader("X-Forwarded-For");

	// Check if forwardedIps not empty
	if (!StringUtils.isEmpty(forwardedIpsStr))
	{
	    // 'x-forwarded-for' header may return multiple IP addresses in
	    // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
	    // the first one
	    String[] forwardedIps = forwardedIpsStr.split(",");
	    ipAddress = forwardedIps[0];
	}

	// If ipAddress is empty, get remote address
	if (StringUtils.isEmpty(ipAddress))
	    ipAddress = req.getRemoteAddr();

	return ipAddress;
    }

}
