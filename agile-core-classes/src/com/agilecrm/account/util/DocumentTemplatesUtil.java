package com.agilecrm.account.util;

import java.util.List;

import com.agilecrm.account.DocumentTemplates;
import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.Query;

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
	
	// find template by template name
	private static List<DocumentTemplates> getTemplateByName(String name){
		Query<DocumentTemplates> qdt = dao.ofy().query(DocumentTemplates.class).filter("name", name);
		return dao.fetchAll(qdt);
	}
	
	public static void findDuplicate(String... strings){
		for(String s : strings){
			int i =1;
			List<DocumentTemplates> sameNameTemplate = getTemplateByName(s);
			if(sameNameTemplate.size()>1){
				for(;i<sameNameTemplate.size();i++){
					sameNameTemplate.get(i).delete();
				}
			}
		}
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
