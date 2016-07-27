package com.agilecrm.knowledgebase.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.knowledgebase.entity.Article;
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
	public static List<Section> getSectionByCategorie(Long categorieID, boolean admin )
	{
		if(admin)
			return Section.dao.listByProperty("categorie_key", new Key<>(Categorie.class, categorieID));
		
		Map<String, Object> map = new HashMap<String, Object>();

		if (categorieID != null){
			
			map.put("categorie_key", new Key<>(Categorie.class, categorieID));
			map.put("visible_to",Visible_To.CUSTOMER);
		}		
		return Section.dao.listByProperty(map);

		
	}

	public static void createDefaultSections(Key<Categorie> key)
	{
	
		Section faqSection = new Section("FAQ's", "This section contains frequently asked questions by customers.", key,
				Visible_To.CUSTOMER);

		Key<Section> faqkey = faqSection.save();
		
		String content = "<p><ol><li> Create a landing page</li><li> Add knowledge base elements in your landing page</li><li> Go to Knowledge base panel and choose your required landing page in settings</li><li> Then access your knowledge base by clicking on Access link.</li></ol></p>";
		
		new Article("How to add a landing page to your Knowledge Base?",content, "Create a landing page, add knowledge base elements, choose your landing page here, then access your knowledge base.",
				key,faqkey,false,"How%20to%20add%20a%20landing%20page%20to%20your%20Knowledge%20Base%3F");

		
	
		Section anouncements = new Section("Announcements", "This section contains announcements.",
				key, Visible_To.CUSTOMER);
	
		Key<Section> anouncementkey= anouncements.save();
	

		content = "<p>We created this category and a few common sections to help you get started with your Knowledge Base. Also we are providing two default templates Basic and Default. You can add your own content and modify or completely delete our content.";
		new Article("Welcome",content, "We created this category and a few common sections to help you get started with your Knowledge Base. You can add your own content and modify or completely delete our content.",
				key,anouncementkey,false,"Welcome");
	
		Section gettingStarted = new Section("Getting Started", "This section is getting started guide for knowledge base.",
				key, Visible_To.CUSTOMER);
	
		Key<Section> gettingStartedkey= gettingStarted.save();
	
		
		content = "<p>Configure your knowledge base by adding categories, sections and articles, select a landing page in knowledge base settings and access your knowledge base.</p><ul><li>Click on category to see how many sections you have.</li><li>Click on section to see how many articles you have.</li></ul>";
		 new Article("How to configure Knowledge Base?",content,"Configure your knowledge base by adding categories, sections and articles, select a landing page in knowledge base settings and access your knowledge base.Click on category to see how many sections you have.Click on section to see how many articles you have.",
				 key,gettingStartedkey,false,"How%20to%20configure%20Knowledge%20Base%3F");
		
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
	
	public static Section getSection(Long id)
    {
	try
	{
	    return Section.dao.get(id);
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
    public static void saveSectionOrder(List<Long> catIds)
    {
	for (int i = 0; i < catIds.size(); i++)
	{
		Section section = getSection(catIds.get(i));
		section.order=i;
		updateSection(section);
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
    public static Section updateSection(Section section)
    {
	
    	Section oldsection = getSection(section.id);
	if (oldsection == null)
	    return null;
		
	Section.dao.put(section);
	
	return section;
    }    


}
