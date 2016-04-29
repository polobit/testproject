package com.agilecrm.knowledgebase.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.knowledgebase.entity.Article;
import com.agilecrm.knowledgebase.entity.Comment;
import com.googlecode.objectify.Key;

/**
 * 
 * @author Sasi
 * 
 */
public class CommentUtil
{
	/**
	 * 
	 * @param article_id
	 * @return
	 */
	public static List<Comment> getCommentsByArticleID(Long article_id)
	{
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("article_key", new Key<Article>(Article.class, article_id));

		return Comment.dao.listByProperty(map);
	}
}
