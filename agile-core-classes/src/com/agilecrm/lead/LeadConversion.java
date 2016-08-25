package com.agilecrm.lead;

import javax.persistence.Id;
import javax.persistence.PostLoad;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.activities.Category;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;

/**
 * {link LeadConversion} is used save the lead conversion status.
 * 
 * @author Subrahmanyam.
 *
 */
@XmlRootElement
@Cached
public class LeadConversion {
	
	/**
     * Key
     */
    @Id
    private Long id;
    
    /**
     * Lead conversion status
     */
    @Indexed
	private Long conversion_status;
    
    /**
     * Created time of lead conversion status
     */
    private Long created_time = 0L;

    /**
     * Updated time of lead conversion status
     */
    private Long updated_time = 0L;
    
    /**
	 * @return the id
	 */
	public Long getId() 
	{
		return id;
	}

	/**
	 * @param id the id to set
	 */
	public void setId(Long id) 
	{
		this.id = id;
	}

	/**
	 * @return the conversion_status
	 */
	public Long getConversion_status() 
	{
		return conversion_status;
	}

	/**
	 * @param conversion_status the conversion_status to set
	 */
	public void setConversion_status(Long conversion_status) 
	{
		this.conversion_status = conversion_status;
	}

	/**
	 * @return the created_time
	 */
	public Long getCreated_time() 
	{
		return created_time;
	}

	/**
	 * @param created_time the created_time to set
	 */
	public void setCreated_time(Long created_time) 
	{
		this.created_time = created_time;
	}

	/**
	 * @return the updated_time
	 */
	public Long getUpdated_time() 
	{
		return updated_time;
	}

	/**
	 * @param updated_time the updated_time to set
	 */
	public void setUpdated_time(Long updated_time) 
	{
		this.updated_time = updated_time;
	}

	@PrePersist
    private void prePersist()
    {
	if (created_time == 0L)
	{
		created_time = System.currentTimeMillis() / 1000;
	}
	updated_time = System.currentTimeMillis() / 1000;
    }
}
