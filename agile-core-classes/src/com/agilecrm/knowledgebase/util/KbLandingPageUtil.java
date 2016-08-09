package com.agilecrm.knowledgebase.util;

import com.agilecrm.knowledgebase.entity.LandingPageKnowledgebase;

public class KbLandingPageUtil
{
	public static LandingPageKnowledgebase get()
	{
		System.out.println(LandingPageKnowledgebase.dao.getByProperty(null)); 	
		return LandingPageKnowledgebase.dao.getByProperty(null);
	}

	public static boolean isValidPage(LandingPageKnowledgebase page)
	{
		if (page == null || page.kb_landing_page_id == null)
			return false;

		return true;
	}
}
