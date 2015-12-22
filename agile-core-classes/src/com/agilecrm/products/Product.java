package com.agilecrm.products;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.activities.util.CategoriesUtil;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.portlets.Portlet;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * 
 * Products master information.
 * 
 * @author sri.
 *
 */
@XmlRootElement
@Cached
public class Product
{

	public static ObjectifyGenericDao<Product> dao = new ObjectifyGenericDao<Product>(Product.class);
    /**
     * The display name of the product in the list.
     */
    @Id
    private Long id;

    /**
     * The value of the product.
     */
    @NotSaved(IfDefault.class)
    private String name = null;

    @NotSaved(IfDefault.class)
    private String description = null;

    /**
     * Created time of product
     */
    private Long created_time = 0L;

    /**
     * Updated time of product
     */
    private Long updated_time = 0L;

    /**
     * price of this product.
     * 
     */
    private float price = 0;

    /**
     * Type of the entity to which this product belongs.
     * 
     */
    

    public static final String SPACE = "_SPACE_";

    public Product()
    {

    }

    public Product(String name, String description, float price)
    {
	this.name = name;
	this.price = price;
	this.description=description;
    }

    /**
     * @return the price
     */
    public float getPrice()
    {
	return price;
    }

    /**
     * @return the name
     */
    public String getDescription()
    {
	return this.description;
    }
    
    /**
     * @return the name
     */
    public String getName()
    {
	return name;
    }

    /**
     * @return the created_time
     */
    public Long getCreated_time()
    {
	return created_time;
    }

    /**
     * @return the updated_time
     */
    public Long getUpdated_time()
    {
	return updated_time;
    }

    /**
     * @return the label
     */

    /**
     * @return the id
     */
    public Long getId()
    {
	return id;
    }

    /**
     * @param id
     *            the id to set
     */
    public void setId(Long id)
    {
	this.id = id;
    }


    /**
     * @param updated_time
     *            the updated_time to set
     */
    public void setUpdated_time(Long updated_time)
    {
	this.updated_time = updated_time;
    }

    /**
     * @param entity_type
     *            the entity_type to set
     */
    public void setPrice(float price)
    {
	this.price = price;
    }

    /**
     * @param name
     *            the name to set
     */
    public void setName(String name)
    {
	this.name = name;
    }

    public void setDescription(String description)
    {
	this.description = description;
    }
    /**
     * @param created_time
     *            the created_time to set
     */
    public void setCreated_time(Long created_time)
    {
	this.created_time = created_time;
    }


    /**
     * Assigns created time for the new one, creates task related contact keys
     * list with their ids and owner key with current agile user id.
     */
    @PrePersist
    private void PrePersist()
    {
	// Store Created Time
	if (created_time == 0L)
	    created_time = System.currentTimeMillis() / 1000;
	updated_time = System.currentTimeMillis() / 1000;
    }

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString()
    {
	StringBuilder builder = new StringBuilder();
	builder.append("Product [name=").append(name).append(", description=").append(description).append(", price=")
		.append(price).append(", created_time=").append(created_time)
		.append(", updated_time=").append(updated_time).append("]");
	return builder.toString();
    }

}
