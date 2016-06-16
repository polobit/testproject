package com.agilecrm.knowledgebase.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.knowledgebase.entity.Article;
import com.agilecrm.knowledgebase.entity.Categorie;
import com.agilecrm.knowledgebase.entity.Section;
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
	public static List<Article> getArticles( Long sectionID)
	{
		Map<String, Object> map = new HashMap<String, Object>();

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
	
	public static Article getArticle(Long id)
    {
	try
	{
	    return Article.dao.get(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return null;
    }
	
	/**
     * Save the categories a precise order.
     * 
     * @param catIds
     *            List of id of the categories in a sequence which are to be
     *            save in the same order.
     */
    public static void saveArticleOrder(List<Long> catIds)
    {
	for (int i = 0; i < catIds.size(); i++)
	{
		Article article = getArticle(catIds.get(i));
		article.order=i;
		updateArticle(article);
	}
	
    }

    /**
     * Update the category. If the category name is not valid or id is null then
     * return null.
     * 
     * @param category
     *            category to be updated.
     * @return updated category.
     */
    public static Article updateArticle(Article article)
    {
	
    	Article oldarticle = getArticle(article.id);
	if (oldarticle == null)
	    return null;
		
	Article.dao.put(article);
	
	return article;
    }    

}
