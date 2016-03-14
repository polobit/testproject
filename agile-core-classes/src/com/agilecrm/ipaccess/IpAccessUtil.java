package com.agilecrm.ipaccess;

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
	
	
}
