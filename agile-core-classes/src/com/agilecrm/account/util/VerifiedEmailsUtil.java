package com.agilecrm.account.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.account.VerifiedEmails;
import com.agilecrm.account.VerifiedEmails.Verified;
import com.agilecrm.db.ObjectifyGenericDao;

public class VerifiedEmailsUtil
{

	public static ObjectifyGenericDao<VerifiedEmails> dao = new ObjectifyGenericDao<VerifiedEmails>(VerifiedEmails.class);
	
	public static List<VerifiedEmails> getAllEmails()
	{
		return dao.fetchAll();
	}
	
	public static List<VerifiedEmails> getVerifiedEmails()
	{
		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("verified", Verified.YES);
		return dao.listByProperty(searchMap);
	}
	
	public static VerifiedEmails getVerifiedEmailByToken(String token)
	{
		// if token is blank
		if(StringUtils.isBlank(token))
			return null;
		
		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("token",token);
		
		return dao.getByProperty(searchMap);
	}
	
	public static VerifiedEmails getVerifiedEmailsByEmail(String email)
	{
		// if email is blank
		if(StringUtils.isBlank(email))
			return null;
		
		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("email", email.toLowerCase());
		
		return dao.getByProperty(searchMap);
	}
	
}

