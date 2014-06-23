package com.agilecrm.user;

import java.io.IOException;
import java.io.PrintWriter;

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
