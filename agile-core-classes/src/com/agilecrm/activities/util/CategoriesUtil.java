package com.agilecrm.activities.util;

import java.util.ArrayList;
import java.util.List;

import com.agilecrm.activities.Category;
import com.agilecrm.db.ObjectifyGenericDao;

public class CategoriesUtil
{

    // Dao
    public ObjectifyGenericDao<Category> dao = null;

    public CategoriesUtil()
    {
	dao = new ObjectifyGenericDao<Category>(Category.class);
    }

    public Category createCategory(Category category)
    {
	dao.put(category);
	return category;
    }

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

    public Category updateCategory(Category category)
    {
	if (category.getId() == null)
	    return null;
	Category oldCat = getCategory(category.getId());
	if (oldCat == null)
	    return null;
	category.setCreated_time(oldCat.getCreated_time());
	dao.put(category);
	return category;
    }

    public List<Category> getAllCategories()
    {
	List<Category> categories = dao.fetchAllByOrder("order");

	if (categories.size() == 0)
	{
	    categories = careateDefaultCategories();
	}
	return categories;
    }

    public void deleteCategory(Long id)
    {
	Category cat = getCategory(id);
	dao.delete(cat);
    }

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

    public static String encodeCategory(String label)
    {
	String name = label.toUpperCase();
	name.replaceAll(" ", Category.SPACE);
	return name;
    }

    public void saveCategoryOrder(List<Long> catIds)
    {
	for (int i = 0; i < catIds.size(); i++)
	{
	    Category cat = getCategory(catIds.get(i));
	    cat.setOrder(i);
	    updateCategory(cat);
	}

    }

    public boolean isDuplicate(boolean isUpdate)
    {
	return true;
    }

    public List<Category> getCategoryByName(String name)
    {
	name = CategoriesUtil.encodeCategory(name);

	return dao.ofy().query(Category.class).filter("name", name).list();
    }
}
