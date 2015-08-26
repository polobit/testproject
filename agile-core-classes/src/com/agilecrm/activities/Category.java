package com.agilecrm.activities;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.activities.util.CategoriesUtil;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * Categories of the entities like Task etc. It includes the order of the
 * categories in which they have to be displayed in the select box in front end.
 * 
 * @author saikiran.
 *
 */
@XmlRootElement
@Cached
public class Category
{

    /**
     * The display name of the category in the list.
     */
    @Id
    private Long id;

    /**
     * The value of the category.
     */
    @NotSaved(IfDefault.class)
    private String name = null;

    /**
     * The value of the category.
     */
    @NotSaved(IfDefault.class)
    private String label = null;

    /**
     * Type of the entity to which this category belongs.
     */
    @NotSaved(IfDefault.class)
    private EntityType entity_type = null;

    /**
     * Order of the category in the list.
     */
    private Integer order = 0;

    /**
     * Created time of category
     */
    private Long created_time = 0L;

    /**
     * Updated time of category
     */
    private Long updated_time = 0L;

    /**
     * Type of the entity to which this category belongs.
     * 
     */
    public static enum EntityType
    {
	CONTACT, DEAL, TASK, EVENT, CAMPAIGN, DOCUMENT, DEAL_LOST_REASON, DEAL_SOURCE
    }

    public static final String SPACE = "_SPACE_";

    public Category()
    {

    }

    public Category(String label, Integer order, EntityType entityType)
    {
	this.label = label;
	this.order = order;
	this.entity_type = entityType;
    }

    /**
     * @return the entity_type
     */
    public EntityType getEntity_type()
    {
	return entity_type;
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
     * @return the order
     */
    public Integer getOrder()
    {
	return order;
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
    public String getLabel()
    {
	return label;
    }

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
     * @param label
     *            the label to set
     */
    public void setLabel(String label)
    {
	this.label = label;
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
    public void setEntity_type(EntityType entity_type)
    {
	this.entity_type = entity_type;
    }

    /**
     * @param name
     *            the name to set
     */
    public void setName(String name)
    {
	this.name = name;
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
     * @param order
     *            the order to set
     */
    public void setOrder(Integer order)
    {
	this.order = order;
    }

    /**
     * Assigns created time for the new one, creates task related contact keys
     * list with their ids and owner key with current agile user id.
     */
    @PrePersist
    private void PrePersist()
    {
	this.name = CategoriesUtil.encodeCategory(label);
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
	builder.append("Category [name=").append(name).append(", value=").append(label).append(", entity_type=")
		.append(entity_type).append(", order=").append(order).append(", created_time=").append(created_time)
		.append(", updated_time=").append(updated_time).append("]");
	return builder.toString();
    }

}
