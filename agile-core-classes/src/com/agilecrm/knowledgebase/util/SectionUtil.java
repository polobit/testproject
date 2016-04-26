package com.agilecrm.knowledgebase.util;

import java.util.List;

import com.agilecrm.knowledgebase.entity.Categorie;
import com.agilecrm.knowledgebase.entity.Section;
import com.agilecrm.knowledgebase.entity.Section.Visible_To;
import com.googlecode.objectify.Key;

/**
 * 
 * @author Sasi
 * 
 */
public class SectionUtil
{
	public static List<Section> getSectionByCategorie(Long categorieID)
	{
		return Section.dao.listByProperty("categorie_key", new Key<>(Categorie.class, categorieID));
	}

	public static void createDefaultSections(Key<Categorie> key)
	{
		Section faqSection = new Section("FAQ", "This section contains fequently asked question by customers", key,
				Visible_To.CUSTOMER);

		faqSection.save();

		Section gettingStarted = new Section("Getting started", "This section getting started guides for all modules",
				key, Visible_To.CUSTOMER);

		gettingStarted.save();
	}
	/**
	 * Deletes Section from DB, text search and its related notes. 
	 * @param id
	 * @throws Exception
	 */
	public static void delete(Long id) throws Exception
	{
		// Deleting section
		Section.dao.deleteKey(new Key<Section>(Section.class, id));
	}
}
