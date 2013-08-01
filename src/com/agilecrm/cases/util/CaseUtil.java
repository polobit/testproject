package com.agilecrm.cases.util;

import java.util.List;

import com.agilecrm.cases.Case;
import com.agilecrm.contact.Contact;
import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

/**
 * Provides additional functions for interacting with {@link Case}
 * 
 * @author Chandan
 * 
 */
public class CaseUtil
{
	// dao
	private static ObjectifyGenericDao<Case> dao = new ObjectifyGenericDao<Case>(Case.class);

	/**
	 * Gets Case Entity base on id
	 * 
	 * @param id
	 *            - id of Case Entity to fetch
	 * @return Case entity
	 */
	public static Case getCase(Long id)
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
	 * Fetch All Cases
	 * 
	 * @return Cases as List
	 */
	public static List<Case> getCases()
	{
		return dao.fetchAll();
	}

	/**
	 * Saves the entity
	 * 
	 * @param newCase
	 *            - entity to save
	 * @return - null if save fails
	 */
	public static Case save(Case newCase)
	{
		dao.put(newCase);

		if (newCase.id == null)
		{
			return null;
		}
		return newCase;
	}

	/**
	 * Gets all cases related to a contact, i.e. all cases which have this
	 * contact in 'Relate to' field. Necessary for showing in Contact/Company
	 * details page
	 * 
	 * @param id
	 *            - id of contact
	 * @return list of contacts
	 */
	public static List<Case> getCasesByContactId(Long id)
	{
		Objectify ofy = ObjectifyService.begin();
		List<Case> casesList = ofy.query(Case.class)
				.filter("related_contacts_key = ", new Key<Contact>(Contact.class, id)).list();
		return casesList;
	}

	/**
	 * Remove a case
	 * 
	 * @param id
	 *            - id of case entity o delete
	 */
	public static void delete(Long id)
	{
		dao.deleteKey(Key.create(Case.class, id));
	}
}
