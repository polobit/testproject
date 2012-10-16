package com.agilecrm;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.core.DomainUser;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.AgileUser;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.users.User;

@SuppressWarnings("serial")
public class HomeServlet extends HttpServlet
{
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
	    throws IOException
    {
	resp.setContentType("text/html");

	PrintWriter out = resp.getWriter();

	// For registering all entities - AgileUser is a just a random class we
	// are using
	ObjectifyGenericDao<AgileUser> dao = new ObjectifyGenericDao<AgileUser>(
		AgileUser.class);

	// Get UserId of person who is logged in
	User user = AgileUser.getCurrentUser(); // or req.getUserPrincipal()

	// Get Namespace
	String domain = NamespaceManager.get();

	// Check if the user is authenticated
	try
	{
	    // Get AgileUser and store in session
	    AgileUser agileUser = AgileUser.getUser(user.getUserId());

	    // IF new user
	    if (agileUser == null)
	    {

		System.out.println("Cannot find user " + agileUser);

		// Register User or tell him that he is not authenticated
		register(user, req, resp);
		return;
	    }

	    // Check if the user is disabled
	    DomainUser domainUser = DomainUser.getDomainCurrentUser();
	    System.out.println("Domain User " + domainUser);

	    // Check if the domain of the user is same as namespace. Otherwise,
	    // Redirect
	    if (domainUser != null && domainUser.domain != null
		    && !domain.equalsIgnoreCase(domainUser.domain))
	    {
		// Probably forward to the domain again he registered
		System.out.println("Forwarding to actual domain "
			+ domainUser.domain);
		resp.sendRedirect("https://" + domainUser.domain
			+ ".agilecrm.com");
		return;
	    }

	    if (domainUser != null && domainUser.is_disabled)
	    {
		req.getRequestDispatcher("/error/user-disabled.jsp").include(
			req, resp);
		return;
	    }

	    // Logged in time
	    domainUser.logged_in_date = System.currentTimeMillis() / 1000;
	    // Save Logged in time
	    domainUser.save();

	    req.getRequestDispatcher("home.jsp").forward(req, resp);
	    // resp.sendRedirect("home.jsp");
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

    }

    public void register(User user, HttpServletRequest req,
	    HttpServletResponse resp) throws Exception
    {

	// Check if user has been invited
	String domain = NamespaceManager.get();
	String email = user.getEmail();
	if (email != null)
	{
	    DomainUser newUser = DomainUser.getDomainUserFromEmail(email,
		    domain);
	    if (newUser != null)
	    {
		// User has accepted the invitation
		newUser.open_id_user = user;
		newUser.save();

		// Create New User - AgileUser (for this namespace)
		AgileUser agileUser = new AgileUser(user);
		agileUser.save();

		resp.sendRedirect("/home");
	    }
	}

	// Check if this user has any other registrations before in other
	// domains
	DomainUser domainUser = DomainUser.getDomainUserFromEmail(email);
	if (domainUser != null)
	{
	    // Probably forward to the domain again he registered
	    resp.sendRedirect("https://" + domainUser.domain + ".agilecrm.com");

	    // req.getRequestDispatcher("/error/wrong-user.jsp").include(req,
	    // resp);
	    return;
	}

	// Register - check if there are any users for this domain - you cannot
	// register
	List<DomainUser> listOfUsers = DomainUser.getUsers(domain);
	if (!listOfUsers.isEmpty())
	{
	    req.getRequestDispatcher("/error/auth-failed.jsp").include(req,
		    resp);
	    return;
	}

	// Create New User - AgileUser (for that namespace)
	AgileUser agileUser = new AgileUser(user);
	agileUser.save();

	// Create user in global namespace
	DomainUser domainUsers = new DomainUser(user, domain, true);
	domainUsers.save();

	resp.sendRedirect("/home");
    }
}
