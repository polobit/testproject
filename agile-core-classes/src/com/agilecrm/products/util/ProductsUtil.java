package com.agilecrm.products.util;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.agilecrm.products.Product;
import com.agilecrm.db.ObjectifyGenericDao;

/**
 * All the utility methods and the dao methods for saving, updating and
 * retrieving the products.
 * 
 * @author sri.
 *
 */
public class ProductsUtil
{

    
    
    // Dao
    public final static ObjectifyGenericDao<Product> dao = new ObjectifyGenericDao<Product>(Product.class);

    /**
     * Default constructor.
     */
    /*public ProductsUtil()
    {
	dao = new ObjectifyGenericDao<Product>(Product.class);
	
    }*/

    /**
     * Save the product in data store. If product name is not valid, then
     * return null.
     * 
     * @param product
     *            product to be saved.
     * @return saved product.
     */
    public Product createProduct(Product product)
    {
	
	dao.put(product);
	return product;
    }

    /**
     * Retrieve the product using the id.
     * 
     * @param id
     *            id of the product.
     * @return product.
     */
    public Product getProduct(Long id)
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
     * Update the product. If the product name is not valid or id is null then
     * return null.
     * 
     * @param product
     *            product to be updated.
     * @return updated product.
     */
    public Product updateProduct(Product product)
    {
	if ( product.getId() == null)
	    return null;
	Product oldProd = getProduct(product.getId());
	if (oldProd == null)
	    return null;
	product.setCreated_time(oldProd.getCreated_time());
	dao.put(product);
	return product;
    }

    /**
     * Return list of products.
     * 
     * @return list of products sort by the order.
     */
    public List<Product> getAllProducts()
    {
	List<Product> products = dao.fetchAll();


	return products;
    }

    /**
     * Return list of products.
     * 
     * @return list of products sort by the order.
     */
    public List<Product> getAllProductsByPrice(float price)
    {
	List<Product> products = dao.ofy().query(Product.class).filter("price", price).list();

	return products;
    }

    /**
     * Delete the product.
     * 
     * @param id
     *            id of the product which has to be deleted.
     */
    public void deleteProduct(Long id)
    {
	Product prod = getProduct(id);
	dao.delete(prod);
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
     * Get the products by name.
     * 
     * @param name
     *            name of the product.
     * @return
     */
    public List<Product> getProductByName(String name)
    {
    	return dao.ofy().query(Product.class).filter("name", name).list();
    }

    public List<Product> getProductByDescription(String description)
    {
    	return dao.ofy().query(Product.class).filter("description", description).list();
    }
    /**
     * Validate product label with regular expression
     * 
     * @param product
     *            label of the product for validation.
     * @return true valid name, false invalid name
     */
    public boolean validate(final String product)
    {
    	return true;
    }
    
    /**
     * Get the product by price.
     * 
     * @param price
     *            price of the product.
     * @return
     */
    public List<Product> getProductsByPrice(float price)
    {
    List<Product> productsList = null;
    try 
    {
    	productsList = dao.ofy().query(Product.class).filter("price", price).list();
    	
    	
	} 
    catch (Exception e) {
		e.printStackTrace();
	}
    return productsList;
    }
    
    /**
     * Get the products by name and Price.
     * 
     * @param name
     *            name of the product.
     * @param type
     *            price of the product.
     * @return
     */
    public List<Product> getProductByNameAndPrice(String name, float price)
    {
	

	return dao.ofy().query(Product.class).filter("name", name).filter("price", price).list();
    }
    
   
}
