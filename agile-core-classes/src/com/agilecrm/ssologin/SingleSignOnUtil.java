package com.agilecrm.ssologin;

import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.core.Response;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.webhooks.triggers.util.Webhook;
import com.google.appengine.api.NamespaceManager;

public class SingleSignOnUtil {
    
    public static ObjectifyGenericDao<SingleSignOn> dao = new ObjectifyGenericDao<SingleSignOn>(SingleSignOn.class);

    public static SingleSignOn getSecreteKey() {
	
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    Map map = new HashMap();
	    if (StringUtils.isNotBlank(oldNamespace))
		map.put("domain", oldNamespace);

	    SingleSignOn sso = dao.getByProperty(map);
	    System.out.println("secret  = = " + sso);
	    return sso;
	}
	catch (Exception e)
	{
	    return null;
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}
	
    }

    public static SingleSignOn createSingleSignOnKey() {
	SingleSignOn sso = new SingleSignOn();
	
	SecureRandom random = new SecureRandom();
	String secret = new BigInteger(130, random).toString(32);
	
	String domain = NamespaceManager.get();
	sso.domain = domain;
	sso.secretKey = secret;

	sso.save();
	
	System.out.println("seeeee == "+ sso.toString());
	return sso;
    }

    public static void deleteSecreteKey(Long id) {
	String oldNamespace = NamespaceManager.get();
	NamespaceManager.set("");

	try
	{
	    dao.delete(dao.get(id));
	}
	catch (Exception e)
	{
	    System.out.println("Delete failed");
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}	
    }

}