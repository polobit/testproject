package com.agilecrm.voicemail.util;

import java.util.List;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.DomainUser;
import com.agilecrm.voicemail.VoiceMail;
import com.googlecode.objectify.Key;

public class VoiceMailUtil
{
	/**
	 * ObjectifyDao of VoiceMail.
	 */
	public static ObjectifyGenericDao<VoiceMail> dao = new ObjectifyGenericDao<VoiceMail>(VoiceMail.class);

	public static VoiceMail getVoiceMail(Long id)
	{
		try
		{
			return dao.get(id);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}

	public static List<VoiceMail> getVoiceMails()
	{
		try
		{
//			return dao.fetchAll();
			return dao.ofy().query(VoiceMail.class)
				    .filter("ownerKey", new Key<DomainUser>(DomainUser.class, SessionManager.get().getDomainId())).list();
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return null;
		}
	}

	public static List<VoiceMail> getVoiceMails(int max, String cursor)
	{
//		if (max != 0)
//			return dao.fetchAll(max, cursor);
		return getVoiceMails();
	}

	public static int getCount()
	{
		return VoiceMail.dao.count();
	}
	
	
}
