package com.agilecrm.contact.upload.blob.status;

import java.io.Serializable;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.Unindexed;

/**
 * This class is to track import status in a domain. Each domain will have only
 * one entity of this class at a time. It is a serializable object, so that it
 * can passed around in deferred tasks
 * 
 * @author yaswanth
 *
 */
@Entity
@XmlRootElement
@Unindexed
public class ImportStatus implements Serializable
{
    private static final long serialVersionUID = -3624335411586917936L;

    @Id
    private Long id;

    @JsonIgnore
    private Key<DomainUser> owner;

    private Long start_time;

    private Long last_updated_time;

    private int total_count;

    private int saved_entities;

    private String file_name;

    @Indexed
    private ImportType type = ImportType.CONTACTS;

    public static enum ImportType implements Serializable
    {
	CONTACTS, COMPANIES, DEALS;
    };

    public Long getId()
    {
	return id;
    }

    public void setId(Long id)
    {
	this.id = id;
    }

    @JsonIgnore
    public Key<DomainUser> getOwner()
    {
	return owner;
    }

    @JsonIgnore
    public void setOwner(Key<DomainUser> owner)
    {
	this.owner = owner;
    }

    public Long getStart_time()
    {
	return start_time;
    }

    public void setStart_time(Long start_time)
    {
	this.start_time = start_time;
    }

    public Long getLast_updated_time()
    {
	return last_updated_time;
    }

    public void setLast_updated_time(Long last_updated_time)
    {
	this.last_updated_time = last_updated_time;
    }

    public int getTotal_count()
    {
	return total_count;
    }

    public void setTotal_count(int total_count)
    {
	this.total_count = total_count;
    }

    public int getSaved_contacts()
    {
	return saved_entities;
    }

    public void setSaved_entities(int saved_entities)
    {
	this.saved_entities = saved_entities;
    }

    public String getFile_name()
    {
	return file_name;
    }

    public void setFile_name(String file_name)
    {
	this.file_name = file_name;
    }

    public ImportType getType()
    {
	return type;
    }

    public void setType(ImportType type)
    {
	this.type = type;
    }

}
