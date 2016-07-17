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
