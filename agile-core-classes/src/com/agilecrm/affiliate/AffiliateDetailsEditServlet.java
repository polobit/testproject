package com.agilecrm.affiliate;

import java.io.IOException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.affiliate.util.AffiliateDetailsUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;


/**
 * @author Santhosh
 * 
 * Servlet implementation class AffiliateDetailsEditServlet
 * 
 * Servlet to edit the AffiliateDetail entities  
 */
public class AffiliateDetailsEditServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public AffiliateDetailsEditServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		NamespaceManager.set("");
		List<AffiliateDetails> list = AffiliateDetailsUtil.getAllUsersAffiliateDetails();
		System.out.println("list size is: "+list.size());
		for(AffiliateDetails details : list){
			DomainUser user = DomainUserUtil.getDomainUser(details.getUserId());
			if(user != null){
				System.out.println("User: "+user);
				details.setEmail(user.email);
				details.setDomain(user.domain);
				details.setLastAffiliateAddedTime(System.currentTimeMillis()/1000);
				AffiliateDetailsUtil.save(details);
			}
		}
		
	}

}
