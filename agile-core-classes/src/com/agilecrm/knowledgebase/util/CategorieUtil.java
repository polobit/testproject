package com.agilecrm.knowledgebase.util;

import java.util.List;

import com.agilecrm.knowledgebase.entity.Categorie;

/**
 * 
 * @author Mantra
 * 
 */
public class CategorieUtil
{
	public static List<Categorie> getCategories()
	{
		return Categorie.dao.fetchAll();
	}
}
