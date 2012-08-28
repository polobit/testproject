package com.agilecrm;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@SuppressWarnings("serial")
public class LoginRequiredServlet extends HttpServlet
{

	private static final Map<String, String> openIdProviders;
	static
	{
		openIdProviders = new HashMap<String, String>();
		openIdProviders.put("Google", "www.google.com/accounts/o8/id");
		openIdProviders.put("Yahoo", "yahoo.com");
		openIdProviders.put("MySpace", "myspace.com");
		openIdProviders.put("AOL", "aol.com");
		openIdProviders.put("MyOpenId.com", "myopenid.com");
	}

	@Override
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException
	{

		/*
		 * UserService userService = UserServiceFactory.getUserService(); User
		 * user = userService.getCurrentUser(); // or req.getUserPrincipal()
		 * Set<String> attributes = new HashSet();
		 * 
		 * resp.setContentType("text/html"); PrintWriter out = resp.getWriter();
		 * 
		 * if (user != null) { out.println("Hello <i>" + user.getNickname() +
		 * "</i>!"); out.println("[<a href=\"" +
		 * userService.createLogoutURL(req.getRequestURI()) +
		 * "\">sign out</a>]"); } else {
		 * out.println("Hello world! Sign in at: "); for (String providerName :
		 * openIdProviders.keySet()) { String providerUrl =
		 * openIdProviders.get(providerName); String loginUrl =
		 * userService.createLoginURL(req.getRequestURI(), null, providerUrl,
		 * attributes); out.println("[<a href=\"" + loginUrl + "\">" +
		 * providerName + "</a>] "); } }
		 */

		try
		{
			//resp.sendRedirect("/register.jsp");
			resp.sendRedirect("/login");
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}

	}
}
