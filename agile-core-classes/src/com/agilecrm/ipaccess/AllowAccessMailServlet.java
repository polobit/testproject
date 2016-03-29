package com.agilecrm.ipaccess;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.NamespaceManager;

public class AllowAccessMailServlet {
	
	public static void allowIPMail(HttpServletRequest req, HttpServletResponse resp){
		
			String adminMail = DomainUserUtil.getDomainOwner(NamespaceManager.get()).email;
			IpAccess ipAccess = IpAccessUtil.getIPListByDomainName(NamespaceManager.get());
			SendMail.sendMail(adminMail,SendMail.ALLOW_IP_ACCESS , SendMail.ALLOW_IP_ACCESS_SUBJECT, ipAccess);	
			String userIP = req.getRemoteAddr();
			ipAccess.Save();		
	
	}
}
