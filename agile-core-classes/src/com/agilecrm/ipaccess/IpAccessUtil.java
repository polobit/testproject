package com.agilecrm.ipaccess;

import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.db.ObjectifyGenericDao;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.utils.SystemProperty;

/**
 * 
 * @author agile
 *
 */
public class IpAccessUtil {

	public static ObjectifyGenericDao<IpAccess> dao = new ObjectifyGenericDao<IpAccess>(IpAccess.class);

	/**
	 * 
	 * @param domain
	 * @return
	 */
	public static IpAccess getIPListByDomainName(String domain) {
		String oldNamespace = NamespaceManager.get();
		NamespaceManager.set("");
		try {
			return dao.getByProperty("domain", domain);
		} finally {
			NamespaceManager.set(oldNamespace);
		}

	}
	
	public static String getPanelIpAccessNamespaceName(){
		if(SystemProperty.environment.value() == SystemProperty.Environment.Value.Production)
			 return "localhost";
		else 
			return NamespaceManager.get();
	}

	/**
	 * 
	 * @param request
	 * @return
	 */
	public static  boolean isValidIpOpenPanel(HttpServletRequest request){
		
		// Gets the IP's
		IpAccess ipAccess = IpAccessUtil.getIPListByDomainName(NamespaceManager.get());
		
		//Checks the wheather iplist is null or not  
		if(ipAccess == null || ipAccess.ipList == null || ipAccess.ipList.size() == 0)
			 return true;
		
		// Gets the userIp from request
		String userIp = request.getRemoteAddr();
		
		// Checks the condition is userIp present in the list or not
		Set<String> iplist = ipAccess.ipList;
		for (String ip : iplist) {
			if(ip.trim().equalsIgnoreCase(userIp))
				  return true;
		}
		
		return false;
	}
	
}
