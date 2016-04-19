package com.agilecrm.knowledgebase.util;

import java.util.HashMap;
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
}
