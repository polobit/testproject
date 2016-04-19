package com.agilecrm.ipaccess;

import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.db.ObjectifyGenericDao;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.utils.SystemProperty;
import com.itextpdf.text.log.SysoCounter;

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
			if(isDevelopmentMode()){
				List<IpAccess> list = dao.fetchAll();
				if(list == null || list.size() == 0)
					  return null;
				
				return list.get(0);
			}
			
			return dao.getByProperty("domain", domain);
		} finally {
			NamespaceManager.set(oldNamespace);
		}

	}
	
	public static boolean isDevelopmentMode(){
		return SystemProperty.environment.value() == SystemProperty.Environment.Value.Development;
	}

	/**
	 * 
	 * @param request
	 * @return
	 */
	public static  boolean isValidIpOpenPanel(HttpServletRequest request){
		
		// Gets the IP's
		IpAccess ipAccess = getIPListByDomainName(NamespaceManager.get());
		
		//Checks the wheather iplist is null or not  
		if(ipAccess == null || ipAccess.ipList == null || ipAccess.ipList.size() == 0)
			 return true;
		
		// Gets the userIp from request
		String userIp = request.getRemoteAddr();
		
		// Checks the condition is userIp present in the list or not
		Set<String> iplist = ipAccess.ipList;
		for (String ip : iplist) {
			
		 	if (StringUtils.contains(ip, "*")) {
		 		
				if (StringUtils.equals(ip, "*"))
				    return true;
				else{
					ip = ip.replace("*", "");
					ip=ip.replace(".", "");
					}
		    }
		 	System.out.println(userIp.trim());
		 	System.out.println(ip.trim());
		 	System.out.println(StringUtils.indexOf(userIp.trim(), ip.trim()));
		    if (StringUtils.indexOf(userIp.trim(), ip.trim()) != -1)
		    	return true;
			
		}
		
		return false;
	}
	
}
