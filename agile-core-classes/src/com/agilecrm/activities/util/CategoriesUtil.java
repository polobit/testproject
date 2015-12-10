package com.agilecrm.activities.util;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.agilecrm.activities.Category;
import com.agilecrm.db.ObjectifyGenericDao;

/**
 * All the utility methods and the dao methods for saving, updating and
 * retrieving the categories.
 * 
 * @author saikiran.
 *
 */
public class CategoriesUtil
{

    /**
     * Regex for validating the category name.
     */
    private static final String CATEGORY_PATTERN = "^(?U)[\\p{Alpha}][\\p{Alpha}\\_\\- \\d]*";
    private Pattern pattern;
    private Matcher matcher;

    // Dao
    public ObjectifyGenericDao<Category> dao = null;

    /**
     * Default constructor.
     */
    public CategoriesUtil()
    {
	dao = new ObjectifyGenericDao<Category>(Category.class);
	pattern = Pattern.compile(CATEGORY_PATTERN);
    }

    /**
     * Save the category in data store. If category name is not valid, then
     * return null.
     * 
     * @param category
     *            category to be saved.
     * @return saved category.
     */
    public Category createCategory(Category category)
    {
	if (!validate(category.getLabel()))
	    return null;
	dao.put(category);
	return category;
    }

    /**
     * Retrieve the category using the id.
     * 
     * @param id
     *            id of the category.
     * @return category.
     */
    public Category getCategory(Long id)
    {
	try
	{
	    return dao.get(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return null;
    }

    /**
     * Update the category. If the category name is not valid or id is null then
     * return null.
     * 
     * @param category
     *            category to be updated.
     * @return updated category.
     */
    public Category updateCategory(Category category)
    {
	if (!validate(category.getLabel()) || category.getId() == null)
	    return null;
	Category oldCat = getCategory(category.getId());
	if (oldCat == null)
	    return null;
	category.setCreated_time(oldCat.getCreated_time());
	dao.put(category);
	return category;
    }

    /**
     * Return list of categories.
     * 
     * @return list of categories sort by the order.
     */
    public List<Category> getAllCategories()
    {
	List<Category> categories = dao.fetchAllByOrder("order");

	if (categories.size() == 0)
	{
	    categories = careateDefaultCategories();
	}
	return categories;
    }

    /**
     * Return list of categories.
     * 
     * @return list of categories sort by the order.
     */
    public List<Category> getAllCategoriesByType(String type)
    {
	List<Category> categories = dao.ofy().query(Category.class).filter("entity_type", type).order("order").list();

	if (categories.size() == 0)
	{
	    categories = careateDefaultCategories();
	}
	return categories;
    }

    /**
     * Delete the category.
     * 
     * @param id
     *            id of the category which has to be deleted.
     */
    public void deleteCategory(Long id)
    {
	Category cat = getCategory(id);
	dao.delete(cat);
    }

    /**
     * Create default categories. This is for the first time when the user is
     * loggin for the first time.
     * 
     * @return list of default categories.
     */
    public List<Category> careateDefaultCategories()
    {
	// TODO Auto-generated method stub
	List<Category> categories = new ArrayList<Category>();
	Category cat1 = new Category("Call", 0, Category.EntityType.TASK);
	categories.add(createCategory(cat1));
	Category cat2 = new Category("Email", 1, Category.EntityType.TASK);
	categories.add(createCategory(cat2));
	Category cat3 = new Category("Follow_up", 2, Category.EntityType.TASK);
	categories.add(createCategory(cat3));
	Category cat4 = new Category("Meeting", 3, Category.EntityType.TASK);
	categories.add(createCategory(cat4));
	Category cat5 = new Category("Milestone", 4, Category.EntityType.TASK);
	categories.add(createCategory(cat5));
	Category cat6 = new Category("Send", 5, Category.EntityType.TASK);
	categories.add(createCategory(cat6));
	Category cat7 = new Category("Tweet", 6, Category.EntityType.TASK);
	categories.add(createCategory(cat7));
	Category cat8 = new Category("Other", 7, Category.EntityType.TASK);
	categories.add(createCategory(cat8));
	return categories;
    }

    /**
     * Encode the label of the category to save as a value in the data store.
     * Like all CAPS and no spaces.
     * 
     * @param label
     *            label of the category.
     * @return encoded label.
     */
    public static String encodeCategory(String label)
    {
	String name = label.toUpperCase();
	name.replaceAll(" ", Category.SPACE);
	return name;
    }

    /**
     * Save the categories a precise order.
     * 
     * @param catIds
     *            List of id of the categories in a sequence which are to be
     *            save in the same order.
     */
    public void saveCategoryOrder(List<Long> catIds)
    {
	for (int i = 0; i < catIds.size(); i++)
	{
	    Category cat = getCategory(catIds.get(i));
	    cat.setOrder(i);
	    updateCategory(cat);
	}

    }

    /**
     * @param isUpdate
     * @return
     */
    public boolean isDuplicate(boolean isUpdate)
    {
	return true;
    }

    /**
     * Get the category by name.
     * 
     * @param name
     *            name of the category.
     * @return
     */
    public List<Category> getCategoryByName(String name)
    {
	name = CategoriesUtil.encodeCategory(name);

	return dao.ofy().query(Category.class).filter("name", name).list();
    }

    /**
     * Validate category label with regular expression
     * 
     * @param category
     *            label of the category for validation.
     * @return true valid name, false invalid name
     */
    public boolean validate(final String category)
    {
	matcher = pattern.matcher(category);
	return matcher.matches();
    }
    
    /**
     * Get the category by type.
     * 
     * @param type
     *            type of the category.
     * @return
     */
    public List<Category> getCategoriesByType(String type)
    {
    List<Category> categoriesList = null;
    try 
    {
    	categoriesList = dao.ofy().query(Category.class).filter("entity_type", type).order("order").list();
    	if (categoriesList != null && categoriesList.size() == 0)
    	{
    		categoriesList = createDefaultCategoriesByType(type);
    	}
    	if (type.equals(Category.EntityType.DEAL_LOST_REASON.toString()) || type.equals(Category.EntityType.DEAL_SOURCE.toString()))
    	{
    		categoriesList = dao.ofy().query(Category.class).filter("entity_type", type).filter("label !=", "Default_"+type.toLowerCase()+"_").list();
    	}
    	
	} 
    catch (Exception e) {
		e.printStackTrace();
	}
    return categoriesList;
    }
    
    /**
     * Get the category by name and type.
     * 
     * @param name
     *            name of the category.
     * @param type
     *            type of the category.
     * @return
     */
    public List<Category> getCategoryByNameAndType(String name, String type)
    {
	name = CategoriesUtil.encodeCategory(name);

	return dao.ofy().query(Category.class).filter("name", name).filter("entity_type", type).list();
    }
    
    /**
     * Create default categories for each type. This is for the first time when the user is
     * loggin for the first time.
     * 
     * @return list of default categories of differnt types.
     */
    public List<Category> createDefaultCategoriesByType(String type)
    {
    	List<Category> categories = new ArrayList<Category>();
    	if (type.equals(Category.EntityType.DEAL_LOST_REASON.toString()))
    	{
    		//It should not be deleted
    		Category cat1 = new Category("Default_"+type.toLowerCase()+"_", 0, Category.EntityType.DEAL_LOST_REASON);
    		createCategory(cat1);
    		Category cat2 = new Category("Unqualified", 1, Category.EntityType.DEAL_LOST_REASON);
    		categories.add(cat2);
    		Category cat3 = new Category("Lost to competitor", 2, Category.EntityType.DEAL_LOST_REASON);
    		categories.add(cat3);
    		Category cat4 = new Category("Expensive", 3, Category.EntityType.DEAL_LOST_REASON);
    		categories.add(cat4);
    	}
    	else if (type.equals(Category.EntityType.DEAL_SOURCE.toString()))
    	{
    		//It should not be deleted
    		Category cat1 = new Category("Default_"+type.toLowerCase()+"_", 0, Category.EntityType.DEAL_SOURCE);
    		createCategory(cat1);
    		Category cat2 = new Category("Website", 1, Category.EntityType.DEAL_SOURCE);
    		categories.add(cat2);
    		Category cat3 = new Category("Referral", 2, Category.EntityType.DEAL_SOURCE);
    		categories.add(cat3);
    		Category cat4 = new Category("Ads", 3, Category.EntityType.DEAL_SOURCE);
    		categories.add(cat4);
    	}
    	else if (type.equals(Category.EntityType.TASK.toString()))
    	{
    		categories = careateDefaultCategories();
    		return categories;
    	}
    	dao.putAll(categories);
    	return categories;
    }
}
