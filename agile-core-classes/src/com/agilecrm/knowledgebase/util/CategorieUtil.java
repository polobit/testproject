package com.agilecrm.knowledgebase.util;

import java.util.List;

import com.agilecrm.knowledgebase.entity.Categorie;
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
		Categorie categorie = new Categorie("General", "General categorie contains FAQ'S and getting started guides.");
		Key<Categorie> key = categorie.save();

		SectionUtil.createDefaultSections(key);
	}
}
