package com.agilecrm.user;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.utils.SystemProperty;
import com.google.appengine.labs.repackaged.org.json.JSONException;
import com.google.appengine.labs.repackaged.org.json.JSONObject;

public class RegisterVerificationServlet extends HttpServlet
{
    private static final ArrayList<String> invalid_domains = new ArrayList<String>();
    
    static {
	invalid_domains.add("gmail");
	invalid_domains.add("zoho");
	invalid_domains.add("yandex");
	invalid_domains.add("hotmail");
	invalid_domains.add("yahoo");
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

	// If Localhost - just return
	if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development)
	{
	    writeErrorMessage(response, "Not allowed in local server");
	    return;
	}
	
	if(!StringUtils.isEmpty(email))
	{
	    String emailDomainSubstring = email.split("@")[1];
	    System.out.println(emailDomainSubstring);
	    if(StringUtils.isEmpty(emailDomainSubstring))
	    {
		writeErrorMessage(response, "Agile CRM needs your business email to signup");
		    return;
	    }
	    
	    String emailDomain = emailDomainSubstring.split("\\.")[0];
	    
	    
	    if(!StringUtils.isEmpty(emailDomain))
	    {
		if(invalid_domains.contains(emailDomain.toLowerCase()))
		{
		    writeErrorMessage(response, "Agile CRM needs your business email to signup");
		    return;
		}
	    }
	}


	System.out.println("domain : " + domain + ", email" + email);
	if (DomainUserUtil.count(domain) > 0)
	{
	    System.out.println("duplicate domain");

	    JSONObject error = new JSONObject();
	    PrintWriter writer = response.getWriter();
	    writeErrorMessage(response, "Domain '" + domain
		    + "' already exists. If you already have an account, you can login <a href='https://" + domain
		    + ".agilecrm.com/login" + "'>here</a>.");
	    return;
	}

	if (!StringUtils.isEmpty(oauth))
	    return;

	DomainUser domainUser = DomainUserUtil.getDomainUserFromEmail(email);
	if (domainUser != null)
	{

	    writeErrorMessage(response, "User with same email address already exists in our system for "
		    + domainUser.domain + " domain");
	    return;
	}
	
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

}
