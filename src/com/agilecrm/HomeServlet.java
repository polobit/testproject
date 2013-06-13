package com.agilecrm;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.session.SessionManager;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.users.User;

@SuppressWarnings("serial")
public class HomeServlet extends HttpServlet
{
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
	    throws IOException, ServletException
    {
	// First Time User
	String isFirstTimerUser = req.getParameter("w");

	// Get Agile User
	AgileUser agileUser = AgileUser.getCurrentAgileUser();

	// If agileuser is null and if it occurs after first time login,
	// redirects its to homeservlet again.
	if (agileUser == null && StringUtils.equals(isFirstTimerUser, "1"))
	{
	    req.getRequestDispatcher("/home?w=1").forward(req, resp);
	    return;
	}

	if (agileUser == null)
	{
	    // Create New User - AgileUser (for this namespace)
	    agileUser = new AgileUser(SessionManager.get().getDomainId());
	    agileUser.save();

	    System.out.println(agileUser);

	    req.getRequestDispatcher("/home?w=1").forward(req, resp);
	    return;
	}
	if (isFirstTimerUser != null && DomainUserUtil.count() == 1)
	{
	    // To get Default Samples.
	    new InitDefaults();
	}
	if (isFirstTimerUser != null)
	{
	    InitDefaults.setFirstTimerCookie(resp);
	}

	// Save Logged in time
	try
	{
	    // Logged in time
	    DomainUser domainUser = DomainUserUtil.getDomainCurrentUser();
	    domainUser.setInfo(DomainUser.LOGGED_IN_TIME,
		    new Long(System.currentTimeMillis() / 1000));

	    domainUser.save();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	req.getRequestDispatcher("home.jsp").forward(req, resp);
    }

    public void register(User user, HttpServletRequest req,
	    HttpServletResponse resp) throws Exception
    {
	// Register - check if there are any users for this domain - you cannot
	// register
	String domain = NamespaceManager.get();
	List<DomainUser> listOfUsers = DomainUserUtil.getUsers(domain);
	if (!listOfUsers.isEmpty())
	{
	    req.getRequestDispatcher("/error/auth-failed.jsp").include(req,
		    resp);
	    return;
	}

	// Create New User - AgileUser (for that namespace)
	// AgileUser agileUser = new AgileUser(user);
	// agileUser.save();

	// Create user in global namespace
	// DomainUser domainUsers = new DomainUser(user, domain, true);
	// domainUsers.save();

	resp.sendRedirect("/home");
    }
}
