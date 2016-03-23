package com.agilecrm.user;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLDecoder;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.ipaccess.IpAccessUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.CacheUtil;
import com.analytics.servlets.AnalyticsServlet;
import com.google.appengine.api.utils.SystemProperty;
import com.google.appengine.labs.repackaged.org.json.JSONException;
import com.google.appengine.labs.repackaged.org.json.JSONObject;

public class RegisterVerificationServlet extends HttpServlet
{
    private static final ArrayList<String> invalid_domains = new ArrayList<String>();

    static
    {
	invalid_domains.add("gmail");
	invalid_domains.add("zoho");
	invalid_domains.add("yandex");
	invalid_domains.add("hotmail");
	invalid_domains.add("yahoo");
	invalid_domains.add("aol");
	invalid_domains.add("outlook");
	invalid_domains.add("rossbergercom");
	invalid_domains.add("fastmail");
	invalid_domains.add("usa.gov");
    }

    private static final ArrayList<String> IPlIST = new ArrayList<String>();

    static
    {
	IPlIST.add("49.206.56.84");
	IPlIST.add("117.247.178.90");
	IPlIST.add("183.83.0.113");
    }

    /**
     * 
     */
    private static final long serialVersionUID = 1L;

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException
    {
    	
	String domain = request.getParameter("domain");
	String oauth = request.getParameter("oauth");
	String email = request.getParameter("email");
	
	try {
		email = URLDecoder.decode(email, "UTF-8");
	} catch (Exception e) {
	}

	String userAgent = request.getHeader("User-Agent");

	// AppEngine Headers

	String userIp = AnalyticsServlet.getClientIP(request);

	System.out.println("user IP address" + userIp);

	try
	{
		if(!IpAccessUtil.isValidIpOpenPanel(request))
			throw new Exception("The IP address you have provided is not authorized to access this account.");
	    if (isTrottleLimitReached(userIp) && !IPlIST.contains(userIp))
	    {
		System.out.println("Throttle reached" + userIp);
		writeErrorMessage(
			response,
			"You seem to have registered an account very recently. Please wait for 1 day if you wish to create another or write to care@agilecrm.com.");
		return;
	    }

	    if (StringUtils.equalsIgnoreCase(request.getHeader("X-AppEngine-Country"), "BD")
		    || "180.211.195.60".equals(userIp))
	    {
		writeErrorMessage(response, "Access denied");
		return;
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	// If Localhost - just return
	if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
	{
	    // writeErrorMessage(response, "Not allowed in local server");
	    // return;
	}
	System.out.println("domain : " + domain + ", email" + email);

	if (!StringUtils.isEmpty(domain) && DomainUserUtil.count(domain) > 0)
	{
	    System.out.println("duplicate domain");

	    JSONObject error = new JSONObject();
	    PrintWriter writer = response.getWriter();
	    writeErrorMessage(response, "Domain '" + domain
		    + "' already exists. If you already have an account, you can login <a href='https://" + domain
		    + ".agilecrm.com/login" + "'>here</a>.");
	    return;
	}
	try 
	{
		validateEmailIdWhileRegister(request,response);
	} 
	catch (Exception e)
	{
		e.printStackTrace();
		writeErrorMessage(response, e.getMessage());
		return;
	}
	
	if (!StringUtils.isEmpty(oauth))
	    return;

	writeSussessMessage(response, "success");
    }

    private void writeSussessMessage(HttpServletResponse response, String message)
    {
	PrintWriter writer = null;
	try
	{
	    writer = response.getWriter();
	    JSONObject success = new JSONObject();
	    success.put("success", message);

	    writer.print(success);
	    writer.close();
	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }

    private void writeErrorMessage(HttpServletResponse response, String message)
    {
	PrintWriter writer = null;
	try
	{
	    writer = response.getWriter();
	    JSONObject error = new JSONObject();
	    error.put("error", message);

	    writer.print(error);
	    writer.close();
	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	

    }
    
    public void  validateEmailIdWhileRegister(HttpServletRequest request, HttpServletResponse response)throws Exception 
    {
    	String email = request.getParameter("email");

    	System.out.println("Email = " + email);
    	
    	if (StringUtils.isEmpty(email))
    		throw new Exception("Email should not be empty");
    	
    	String emailDomainSubstring = "";
		try {
			emailDomainSubstring = email.split("@")[1];
		} 
		catch (Exception e) 
		{
		}
		
		System.out.println(emailDomainSubstring);
		
		if (StringUtils.isEmpty(emailDomainSubstring)) 		
			throw new Exception("Agile CRM needs your business email to signup");
		
		String emailDomain = emailDomainSubstring.split("\\.")[0];
	    if (StringUtils.isEmpty(emailDomain))
				throw new Exception("Agile CRM needs your business email to signup");
	    
		if (invalid_domains.contains(emailDomain.toLowerCase())
			|| invalid_domains.contains(emailDomainSubstring))
			throw new Exception("Agile CRM needs your business email to signup");
		
		
		DomainUser domainUser = DomainUserUtil.getDomainUserFromEmail(email);
	    if (domainUser == null)
	    	 return;
	    
		throw new Exception("User with same email address already exists in our system for "
			+ domainUser.domain + " domain");
		
    	
     }
    

    public static void storeIpInMemcache(HttpServletRequest request, String domain)
    {
	try
	{
	    String ip = AnalyticsServlet.getClientIP(request);
	    if (StringUtils.isEmpty(ip))
		return;

	    CacheUtil.setCacheForNumberOfDays(ip, domain, 1);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

    }

    private boolean isTrottleLimitReached(String ip)
    {
	if (StringUtils.isEmpty(ip))
	    return false;

	String domain = (String) CacheUtil.getCache(ip);
	if (StringUtils.isEmpty(domain))
	{
	    return false;
	}

	return true;
    }

}
