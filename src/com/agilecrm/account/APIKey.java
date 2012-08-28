package com.agilecrm.account;

import java.math.BigInteger;
import java.security.SecureRandom;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

@XmlRootElement
public class APIKey
{

	// Key
	@Id
	public Long id;

	// Api Key
	public String api_key;
	
	// Dao
	private static ObjectifyGenericDao<APIKey> dao = new ObjectifyGenericDao<APIKey>(APIKey.class);
	

	APIKey()
	{

	}
	
	APIKey(String randomNumber)
	{
		this.api_key = randomNumber;
	}
	

	// Get API Key
	public static APIKey getAPIKey()
	{
		Objectify ofy = ObjectifyService.begin();
		APIKey apiKey = ofy.query(APIKey.class).get();
		if (apiKey == null)
		{
			// Generate API key and save
			return generateAPIKey();
		}

		return apiKey;
	}

	// Generaet API Key
	private static APIKey generateAPIKey()
	{
		
		SecureRandom random = new SecureRandom();
		String randomNumber = new BigInteger(130, random).toString(32);
		
		APIKey apiKey = new APIKey(randomNumber);

		dao.put(apiKey);
		return apiKey;
	}

}
