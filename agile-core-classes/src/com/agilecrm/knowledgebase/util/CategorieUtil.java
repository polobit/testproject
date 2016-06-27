package com.agilecrm.knowledgebase.util;

import java.util.List;

import com.agilecrm.activities.Activity.ActivityType;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.knowledgebase.entity.Categorie;
import com.agilecrm.search.document.TicketsDocument;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.utils.TicketNotesUtil;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;

/**
 * 
 * @author Mantra
 * 
 */
public class CategorieUtil
{
	public static List<Categorie> getCategories()
	{
		List<Categorie> categories = Categorie.dao.fetchAll();

		if (categories == null || categories.size() == 0)
		{
			createDefaultCategorie();

			categories = Categorie.dao.fetchAll();
		}

		return categories;
	}

	public static void createDefaultCategorie()
	{
		Categorie categorie = new Categorie("General", "General category contains FAQ'S and getting started guides.");
		Key<Categorie> key = categorie.save();

		SectionUtil.createDefaultSections(key);
	}

	/**
	 * Deletes categorie from DB, text search and its related notes. 
	 * @param id
	 * @throws Exception
	 */
	public static void delete(Long id) throws Exception
	{
		// Deleting ticket
		Categorie.dao.deleteKey(new Key<Categorie>(Categorie.class, id));
	}
}
