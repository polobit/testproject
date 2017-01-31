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
	
	/**
	 * This method will add email address as a verified email address
	 * If email address is old then it will update
	 * 
	 * @param emails
	 * 				- String
	 * @param verified
	 * 				- Verified
	 * @author Prashannjeet
	 */
	public static void addVerifiedEmail(String email, Verified verified){
		// if email is blank
		if(StringUtils.isBlank(email))
			return;
		
		try{	
			VerifiedEmails verifiedEmails = getVerifiedEmailsByEmail(email);
			
			if(verifiedEmails !=null)
				verifiedEmails.verified = verified;
			else
			{
				verifiedEmails = new VerifiedEmails(email, String.valueOf(System.currentTimeMillis()/1000L));
				verifiedEmails.verified = verified;
			}
			verifiedEmails.save();
		}
		catch(Exception e){
			System.out.println("Exception ocurred while adding verifiy email address : " + e.getMessage());
		}
	}
	
	/**
	 * This method will delete verified email address
	 * 
	 * @param user_name
	 */
	public static void deleteVerifiedEmail(String email){
		
		try{
			  VerifiedEmails verifiedEmails = getVerifiedEmailsByEmail(email);
			
			if(verifiedEmails !=null)
				dao.delete(verifiedEmails);
		}
		catch(Exception e){
			System.out.println("Exception ocurred while deleting verifiy email address : " + e.getMessage());
		}
	}
}

