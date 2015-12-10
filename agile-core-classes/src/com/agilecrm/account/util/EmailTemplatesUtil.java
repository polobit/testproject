package com.agilecrm.account.util;

import java.util.List;

import com.agilecrm.account.EmailTemplates;
import com.agilecrm.db.ObjectifyGenericDao;

/**
 * <code>EmailTemplatesUtil</code> is the utility class for
 * {@link EmailTemplates}. It fetches EmailTemplates with respect to id and also
 * all EmailTemplates at a time.
 * 
 */
public class EmailTemplatesUtil
{
	/**
	 * EmailTemplates Dao.
	 */
	private static ObjectifyGenericDao<EmailTemplates> dao = new ObjectifyGenericDao<EmailTemplates>(
			EmailTemplates.class);

	/**
	 * Returns EmailTemplate with respect to id, otherwise null for exception.
	 * 
	 * @param id
	 *            - EmailTemplate Id.
	 * @return EmailTemplates.
	 */
	public static EmailTemplates getEmailTemplate(Long id)
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

	/**
	 * Returns list of all EmailTemplates that are saved.
	 * 
	 * @return EmailTemplates.
	 */
	public static List<EmailTemplates> getAllEmailTemplates()
	{
		return dao.fetchAll();
	}

	/**
	 * Retuns count of email templates
	 * 
	 * @return int
	 */
	public static int getCount()
	{
		return EmailTemplates.dao.count();
	}
}
