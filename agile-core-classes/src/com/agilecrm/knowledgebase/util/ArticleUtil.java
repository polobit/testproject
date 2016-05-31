package com.agilecrm.knowledgebase.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.knowledgebase.entity.Article;
import com.agilecrm.knowledgebase.entity.Categorie;
import com.agilecrm.knowledgebase.entity.Section;
import com.agilecrm.ticket.entitys.Tickets;
import com.googlecode.objectify.Key;

/**
 * 
 * @author Sasi
 * 
 */
public class ArticleUtil
{
	/**
	 * 
	 * @param categorieID
	 * @param sectionID
	 * @return
	 */
	public static List<Article> getArticles(Long categorieID, Long sectionID)
	{
		Map<String, Object> map = new HashMap<String, Object>();

		if (categorieID != null)
			map.put("categorie_key", new Key<>(Categorie.class, categorieID));

		if (sectionID != null)
			map.put("section_key", new Key<>(Section.class, sectionID));

		return Article.dao.listByProperty(map);
	}
	
	/**
	 * Returns list of tickets to given list of ids
	 * 
	 * @param idsArray
	 * @return
	 * @throws Exception
	 */
	public static List<Article> getArticlesByIDsList(List<Long> idsArray) throws Exception
	{
		if (idsArray == null || idsArray.size() == 0)
			throw new Exception("Required parameters missing");

		List<Key<Article>> articleKeys = new ArrayList<Key<Article>>();

		for (Long id : idsArray)
			articleKeys.add(new Key<Article>(Article.class, id));

		List<Article> list = Article.dao.fetchAllByKeys(articleKeys);

		System.out.println("articles " + list.size());

		return list;
	}

	public static void searchArticles(String searchTerm)
	{

	}

	/**
	 * 
	 * @param categorieID
	 * @param sectionID
	 * @return
	 */
	public static int getCount(final Long categorieID, final Long sectionID)
	{
		Map<String, Object> map = new HashMap<String, Object>()
		{
			private static final long serialVersionUID = 1L;

			{
				put("categorie_key", new Key<>(Categorie.class, categorieID));
				put("section_key", new Key<>(Section.class, sectionID));
			}
		};

		return Article.dao.getCountByProperty(map);
	}
	/**
	 * @param atricleID
	 * @return
	 */
	public static void delete(Long id) throws Exception
	{
		// Deleting section
		Article.dao.deleteKey(new Key<Article>(Article.class, id));
	}
}
