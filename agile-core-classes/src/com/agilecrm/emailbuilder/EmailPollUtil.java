package com.agilecrm.emailbuilder;

import java.io.IOException;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;

public class EmailPollUtil
{
	/**
	 * 
	 * @param req
	 * 
	 * @param resp
	 * 
	 * @param domain
	 * @throws IOException 
	 */
	public static String pollScore(String email, String tag, String url) throws IOException
	{
		
		Contact contact = ContactUtil.searchContactByEmail(email);
		String response = null;
		
		if(contact != null)
		{
			contact.addTags(tag);
			contact.save();
			response = "thank you "+contact.first_name;
			
		}else if(url == null){
				
			response = "contact with "+email+" not found";
			
		}
		return response;
		
	}
}
