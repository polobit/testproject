package com.agilecrm;


import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
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
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
		// TODO Auto-generated method stub
		doPost(request, response);
	}

	/**
	 * @throws IOException 
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
		// TODO Auto-generated method stub
		String domainKeyString = request.getParameter("d");
		System.out.println("Domain Key::: "+domainKeyString);
		if(StringUtils.isEmpty(domainKeyString))
		{
			response.getWriter().print("User not exists");
			return;
		}
		Long domainKey = Long.valueOf(domainKeyString);
		DomainUser user = DomainUserUtil.getDomainUser(domainKey);
		if(user != null){
			NamespaceManager.set(user.domain);
			SessionManager.set(new UserInfo(user));
			String url = VersioningUtil.getURL(user.domain, request);
			url = url + "?sp=true";
			response.sendRedirect(url);
		}
		
	}

}
