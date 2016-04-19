package com.agilecrm.ipaccess;

import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

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
	private static final String IP_PATTERN = "[a-zA-Z0-9\\-\\:\\%\\?\\&\\=_./#]*";

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
			System.out.println("ip "+ip);
			if(isValidIPWithRegex(ip, userIp))
				  return true;
		}
		
		return false;
	}
	
	static boolean isValidIPWithRegex(String matcher, String ipToCheck){
		System.out.println(StringUtils.isNotBlank(matcher));
		System.out.println(StringUtils.isNotBlank(ipToCheck));
		if(!StringUtils.isNotBlank(matcher) || !StringUtils.isNotBlank(ipToCheck))
			  return false;
		
		matcher = matcher.trim();
		ipToCheck = ipToCheck.trim();
		
		if (StringUtils.equals(ipToCheck, "*"))
			   return true;
		
		if(StringUtils.indexOf(matcher, "*") == -1)
			   return matcher.equals(ipToCheck);
		
		System.out.println("Check with regex");
		String matcher_pattern = matcher.replace("*", IP_PATTERN);
		
	    Pattern pattern = Pattern.compile(matcher_pattern);
	    Matcher matcherIns = pattern.matcher(ipToCheck);
	    
		return matcherIns.matches();
		
	}
	
	
}
