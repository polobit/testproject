package com.agilecrm;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.core.DomainUser;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.AgileUser;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.users.User;

@SuppressWarnings("serial")
public class HomeServlet extends HttpServlet
{
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
	    throws IOException, ServletException
    {

	// First Time User
	boolean isFirstTimeUser = false;

	// Get Agile User
	AgileUser agileUser = AgileUser.getCurrentAgileUser();
	if (agileUser == null)
	{
	    isFirstTimeUser = true;

	    // Create New User - AgileUser (for this namespace)
	    agileUser = new AgileUser(SessionManager.get().getDomainId());
	    agileUser.save();

	    System.out.println(agileUser);

	    req.getRequestDispatcher("/home").forward(req, resp);
	    return;
	}

	// Logged in time
	DomainUser domainUser = DomainUser.getDomainCurrentUser();
	domainUser.logged_in_date = System.currentTimeMillis() / 1000;

	// Save Logged in time
	try
	{
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
	List<DomainUser> listOfUsers = DomainUser.getUsers(domain);
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
