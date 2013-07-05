package com.agilecrm;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.db.util.AnalyticsSQLUtil;
import com.agilecrm.user.notification.NotificationPrefs.Type;
import com.agilecrm.user.notification.util.NotificationPrefsUtil;
import com.google.appengine.api.NamespaceManager;

/**
 * <code>StatsServlet</code> handles page-view requests from javascript.It
 * handles page-views analysis. It will store the obtained values from query
 * string into google cloud sql. Fetches remote ip address to save in database.
 * 
 * @author Naresh
 * 
 */
@SuppressWarnings("serial")
public class StatsServlet extends HttpServlet
{
    public void doGet(HttpServletRequest request, HttpServletResponse response)
	    throws IOException
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
    public void doPost(HttpServletRequest req, HttpServletResponse res)
	    throws IOException
    {
	// Domain
	String domain = NamespaceManager.get();

	// Differentiates clients (browsers).
	String guid = req.getParameter("guid");

	// Session Id.
	String sid = req.getParameter("sid");

	// Request URL
	String url = req.getParameter("url");

	// Email if set in cookie.
	String email = req.getParameter("email");

	// Client IP Address
	String ip = getClientIP(req);

	// For New Session
	String isNew = null;

	// Reference URL
	String ref = null;

	// UserAgent to know browser, OS etc
	String userAgent = req.getHeader("User-Agent");

	// AppEngine Headers
	String country = req.getHeader("X-AppEngine-Country");
	String region = req.getHeader("X-AppEngine-Region");
	String city = req.getHeader("X-AppEngine-City");
	String cityLatLong = req.getHeader("X-AppEngine-CityLatLong");

	// If new session only, we get new and ref as query params.
	if (!StringUtils.isEmpty(req.getParameter("new")))
	{
	    isNew = req.getParameter("new");
	    ref = req.getParameter("ref");

	    // If ref is empty
	    if (StringUtils.isEmpty(ref))
		ref = null;
	}

	// Insert into table
	AnalyticsSQLUtil.addToPageViews(domain, guid, email, sid, url, ip,
		isNew, ref, userAgent, country, region, city, cityLatLong);

	// Show notification with url
	if (!StringUtils.isEmpty(email))
	{
	    JSONObject json = new JSONObject();
	    try
	    {
		json.put("custom_value", url);
	    }
	    catch (JSONException e)
	    {
		e.printStackTrace();
	    }

	    NotificationPrefsUtil.executeNotification(Type.IS_BROWSING,
		    ContactUtil.searchContactByEmail(email), json);
	}
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
