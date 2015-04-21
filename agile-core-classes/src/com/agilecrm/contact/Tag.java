package com.agilecrm.contact;

import java.io.Serializable;

import javax.persistence.Id;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.cursor.Cursor;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.validator.TagValidator;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;

/**
 * <code>Tag</code> class stores tags (of a contact in particular). The id of
 * the created entity is not generated by appengine, the tag name itself is
 * taken as its id, to prevent existence of duplicate tag names.
 * <p>
 * This class always uses its parameterized constructor to create an entity
 * </p>
 * 
 * @author
 * 
 */
@XmlRootElement
@Cached
public class Tag extends Cursor implements Serializable
{

    /**
     * Tag name is taken as id
     */
    @Id
    public String tag;

    public Long createdTime = 0L;

    // Dao
    private static ObjectifyGenericDao<Tag> dao = new ObjectifyGenericDao<Tag>(Tag.class);

    @NotSaved
    public Integer availableCount = 0;

    @NotSaved
    public String entity_type = "tag";

    /**
     * Default constructor
     */
    public Tag()
    {

    }

    /**
     * Creates a tag with its name assigning to id
     * 
     * @param tag
     */
    public Tag(String tag)
    {
	this.tag = tag;
    }

    public Tag(String tag, Long createdTime)
    {
	this.tag = tag;
	this.createdTime = createdTime;
    }

    /**
     * Adds a tag entity to database, by creating it with its constructor
     * 
     * @param tagName
     * @return
     */
    public static Tag addTag(String tagName) throws WebApplicationException
    {
	if (!TagValidator.getInstance().validate(tagName))
	{
	    throw new WebApplicationException(
		    Response.status(Response.Status.BAD_REQUEST)
			    .entity("Sorry, Tag name should start with an alphabet and can not contain special characters other than underscore and space - "
				    + tagName).build());
	}
	Tag tag = new Tag(tagName);
	dao.put(tag);
	return tag;
    }

    /**
     * Equals method to compare to tags. It compares based on the 'tag' String
     * field
     */
    @Override
    public boolean equals(Object o)
    {
	Tag tag = (Tag) o;

	if (this.tag == null || tag.tag == null)
	    return false;

	String tagTrimmed = this.tag.trim();

	return tagTrimmed.equals(tag.tag.trim());
    }

    @Override
    public String toString()
    {
	return "Tag [tag=" + tag + ", createdTime=" + createdTime + "]";
    }

}