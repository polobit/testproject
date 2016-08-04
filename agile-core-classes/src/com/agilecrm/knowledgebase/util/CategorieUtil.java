package com.agilecrm.knowledgebase.util;

import java.util.List;

import com.agilecrm.activities.Category;
import com.agilecrm.activities.Activity.ActivityType;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.knowledgebase.entity.Categorie;
import com.agilecrm.search.document.TicketsDocument;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.utils.TicketNotesUtil;
import com.google.appengine.api.datastore.EntityNotFoundException;
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
				CategorieUtil.createDefaultCategorie();
		
		categories = Categorie.dao.fetchAll();
		
		return categories;
	}

	public static void createDefaultCategorie()
	{
		Categorie categorie = new Categorie("General", "General category contains Announcements, FAQ's and Getting Started guides.");
		Key<Categorie> key = categorie.save();

		SectionUtil.createDefaultSections(key);
	}

	public static Categorie getCategorie(Long id)
    {
	try
	{
	    return Categorie.dao.get(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return null;
    }
	

	/**
	 * Deletes categorie from DB, text search and its related notes. 
	 * @param id
	 * @throws Exception
	 */
	public static void delete(Long id) throws Exception
	{
		// Deleting categorie
		Categorie.dao.deleteKey(new Key<Categorie>(Categorie.class, id));
	}
	
	/**
     * Save the categories a precise order.
     * 
     * @param catIds
     *            List of id of the categories in a sequence which are to be
     *            save in the same order.
     */
    public static void saveCategorieOrder(List<Long> catIds)
    {
	for (int i = 0; i < catIds.size(); i++)
	{
	    Categorie cat = getCategorie(catIds.get(i));
	    cat.order=i;
	    updateCategorie(cat);
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
    public static Categorie updateCategorie(Categorie categorie)
    {
	
	Categorie oldCat = getCategorie(categorie.id);
	if (oldCat == null)
	    return null;
		
	Categorie.dao.put(categorie);
	
	return categorie;
    }    
    
}
