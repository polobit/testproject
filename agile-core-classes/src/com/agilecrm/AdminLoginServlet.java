package com.agilecrm;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.VersioningUtil;
import com.google.appengine.api.NamespaceManager;

/**
 * Servlet implementation class InvoicePdfServlet
 */
public class AdminLoginServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public AdminLoginServlet() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @throws IOException
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		doPost(request, response);
	}

	/**
	 * @throws IOException
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		String domainKeyString = request.getParameter("d");
		System.out.println("Domain Key::: " + domainKeyString);
		if (StringUtils.isEmpty(domainKeyString)) {
			response.getWriter().print("User not exists");
			return;
		}
		Long domainKey = Long.valueOf(domainKeyString);
		DomainUser user = DomainUserUtil.getDomainUser(domainKey);
		if (user == null) {
			response.getWriter().print("User not exists");
			return;
		}
		if("admin".equals(NamespaceManager.get())){
			NamespaceManager.set(user.domain);
			HttpSession session = request.getSession();
			session.setAttribute(SessionManager.AUTH_SESSION_COOKIE_NAME, new UserInfo(user));
	
			processBeforeDomainRedirect(request);
			
			String url = "";
			if (VersioningUtil.isDevelopmentEnv())
				url = "localhost:8888";
			else
				url = VersioningUtil.getURL(user.domain, request);
	
			url = url + "?sp=true";
			response.sendRedirect(url);
		}

	}
	
	void processBeforeDomainRedirect(HttpServletRequest request) throws ServletException {
		SessionManager.set(request);
		
		Long domainuserId = SessionManager.get().getDomainId();
		AgileUser agileUser = AgileUser.getCurrentAgileUserFromDomainUser(domainuserId);
		if(agileUser == null)
			// Create new Agile User
			new AgileUser(domainuserId).save();
		
	}

}
