package com.agilecrm.account.util;

import java.util.List;

import com.agilecrm.account.DocumentTemplates;
import com.agilecrm.db.ObjectifyGenericDao;

/**
 * <code>DocumentTemplatesUtil</code> is the utility class for
 * {@link DocumentTemplates}. It fetches DocumentTemplates with respect to id and also
 * all DocumentTemplates at a time.
 * 
 */
public class DocumentTemplatesUtil
{
	/**
	 * DocumentTemplates Dao.
	 */
	private static ObjectifyGenericDao<DocumentTemplates> dao = new ObjectifyGenericDao<DocumentTemplates>(
			DocumentTemplates.class);

	/**
	 * Returns DocumentTemplate with respect to id, otherwise null for exception.
	 * 
	 * @param id
	 *            - DocumentTemplate Id.
	 * @return DocumentTemplates.
	 */
	public static DocumentTemplates getDocumentTemplate(Long id)
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
	 * Returns list of all DocumentTemplates that are saved.
	 * 
	 * @return DocumentTemplates.
	 */
	public static List<DocumentTemplates> getAllDocumentTemplates()
	{
		return dao.fetchAll();
	}

	/**
	 * Retuns count of document templates
	 * 
	 * @return int
	 */
	public static int getCount()
	{
		return DocumentTemplates.dao.count();
	}
}
