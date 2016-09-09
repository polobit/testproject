package com.agilecrm.web.stats;

import java.io.IOException;
import java.util.Map;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;

import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import static com.googlecode.objectify.ObjectifyService.ofy;

public class StatsServerApiServlet extends HttpServlet
{
    /**
     * 
     */
    private static final long serialVersionUID = 978387456346548066L;
    
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException
    {
	doPost(request, response);
    }
    
    public void doPost(HttpServletRequest req, HttpServletResponse res)
    {
	try
	{
	    Map<String, String> map = StatsUtil.readPostData(req);
	    if (map != null && map.size() > 0)
	    {
		String reqAuth = map.get("psd");
		String domain = map.get("domain");
		if (StringUtils.isNotBlank(reqAuth) && StringUtils.isNotBlank(domain) && StatsUtil.isValidRequest(reqAuth))
		{
		    String blocked_ips = map.get("blocked_ips");
		    StatsAccess statsAccess = null;
		    //Objectify ofy = ObjectifyService.ofy();
		    statsAccess = ofy().load().type(StatsAccess.class).filter("domain", domain).first().now();
		    if (statsAccess == null)
			statsAccess = new StatsAccess(domain, blocked_ips);
		    else
			statsAccess.blocked_ips = blocked_ips;
		    ofy().save().entity(statsAccess).now();
		}
	    }
	}
	catch (Exception e)
	{
	    System.err.println(e.getMessage());
	}
    }
}
