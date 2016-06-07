package com.agilecrm.ipaccess;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.NamespaceManager;

public class AllowAccessMailServlet extends HttpServlet{
	
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws IOException, ServletException {
		doGet(request, response);
	}
	
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws IOException, ServletException {
		
	}
	
	public static void accessMail(HttpServletRequest request){
		
		String adminMail = DomainUserUtil.getDomainOwner(NamespaceManager.get()).email;
		IpAccess ipAccess = IpAccessUtil.getIPListByDomainName(NamespaceManager.get());
		//SendMail.sendMail(adminMail,SendMail.ALLOW_IP_ACCESS , SendMail.ALLOW_IP_ACCESS_SUBJECT, ipAccess);	
		String userIP = request.getRemoteAddr();
		ipAccess.save();	
	
	}
}
