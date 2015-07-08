package com.agilecrm.account.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.account.VerifiedEmails;
import com.agilecrm.account.VerifiedEmails.Verified;
import com.agilecrm.db.ObjectifyGenericDao;

public class VerifiedEmailsUtil
{

	public static ObjectifyGenericDao<VerifiedEmails> dao = new ObjectifyGenericDao<VerifiedEmails>(VerifiedEmails.class);
	
	public static List<VerifiedEmails> getVerifiedEmails()
	{
		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("verified", Verified.YES);
		return dao.listByProperty(searchMap);
	}
	
	public static VerifiedEmails getVerifiedEmailByToken(String token)
	{
		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("token",token);
		
		return dao.getByProperty(searchMap);
	}
	
}

