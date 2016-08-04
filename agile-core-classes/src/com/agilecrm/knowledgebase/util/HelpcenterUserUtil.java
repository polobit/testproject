package com.agilecrm.knowledgebase.util;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

import com.agilecrm.knowledgebase.entity.HelpcenterUser;
import com.agilecrm.util.VersioningUtil;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.EntityNotFoundException;

/**
 * 
 * @author Sasi
 * 
 */
public class HelpcenterUserUtil
{
	public static HelpcenterUser getUser(Long id) throws EntityNotFoundException
	{
		return HelpcenterUser.dao.get(id);
	}
	
	public static HelpcenterUser getUser(String email)
	{
		return HelpcenterUser.dao.getByProperty("email", email);
	}

	public static void sendVerificationEmail(HelpcenterUser user)
	{
		Map<String, String> data = new HashMap<String, String>();

		try
		{
			data.put("name", user.name);
			data.put("domain", NamespaceManager.get());
			data.put("verify_link", VersioningUtil.getHostURLByApp(NamespaceManager.get())
					+ "/helpcenter/verify_email?tid=" + URLEncoder.encode(user.created_time + "", "UTF-8") + "&id="
					+ user.id);
		}
		catch (UnsupportedEncodingException e)
		{
			e.printStackTrace();
		}

		SendMail.sendMail(user.email, SendMail.HELPCENTER_VERIFICATION_SUBJECT, SendMail.HELPCENTER_VERIFICATION, data);
	}
}
