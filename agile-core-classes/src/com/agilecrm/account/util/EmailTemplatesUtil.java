package com.agilecrm.account.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
		return getAllEmailTemplates(null);
	}
	
	
	/**
	 * Gets EmailTemplates with respect to emailTemplate_category_id.
	 * 
	 * @param category_id
	 *            - EmailTemplateCategory id.
	 * @return EmailTemplates List
	 */
	public static List<EmailTemplates> getAllEmailTemplates(Long category_id)
	{
		if(category_id != null && category_id != 0L){
			try {
				return dao.ofy().query(EmailTemplates.class).filter("emailTemplate_category_id",category_id).list();
			} catch (Exception e) {
				e.printStackTrace();
				return null;
			}
		}
		
		return dao.fetchAll();
	}
	
	/**
	 * Returns list of emailTemplates based on page size & category.
	 * 
	 * @param max
	 *            Maximum number of emailTemplates list based on page size query
	 *            param.
	 * @param cursor
	 *            Cursor string that points the list that exceeds page_size.
	 * @param category_id
	 *            EmailTemplateCategory id.
	 * @return Returns list of emailTemplates with respective to page size,
	 *         cursor and category.
	 */
	
	public static List<EmailTemplates> getAllEmailTemplates(int max, String cursor, Long category_id)
	{
		if(category_id != null && category_id != 0L){
			Map map = new HashMap();
			map.put("emailTemplate_category_id", category_id);
			return dao.fetchAll(max, cursor, map);
		}
		
		return dao.fetchAll(max, cursor);
	}
	
	
	/**
	 * Gets EmailTemplates with respect to emailTemplate_category_id.
	 * 
	 * @param category_id
	 *            - EmailTemplateCategory id.
	 * @return EmailTemplates List
	 */
	public static List<EmailTemplates> getEmailTemplatesBasedOnCategory(Long category_id)
	{
		try {
			return dao.ofy().query(EmailTemplates.class).filter("emailTemplate_category_id",category_id).list();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
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
