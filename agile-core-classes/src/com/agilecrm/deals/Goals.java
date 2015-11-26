package com.agilecrm.deals;

import java.io.Serializable;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * 
 * @author nidhi
 * 
 */
@SuppressWarnings("serial")
@XmlRootElement
@Cached
public class Goals implements Serializable
{
    // Key
    @Id
    public Long id;


    @NotSaved(IfDefault.class)
    public Long value = 0L;
    
    @NotSaved(IfDefault.class)
    public Long count = 0L;

    //@NotSaved
    public Long domain_user_id;

    public static ObjectifyGenericDao<Goals> dao = new ObjectifyGenericDao<Goals>(
    		Goals.class);

    public Long start_time = 0L;
    public Long end_time = 0L;


    public Goals()
    {

    }

    public Goals(Long domain_user_id,Long start_time,Long end_time,Long value,Long count)
    {
	this.domain_user_id = domain_user_id;
	this.start_time = start_time;
	this.end_time=end_time;
	this.value=value;
	this.count=count;
    }

    



    /**
     * Saves the goal
     */
    public void save()
    {
	dao.put(this);
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
	builder.append("Id").append(id).append(", value=").append(value).append(", count=").append(count).append(", startTime=")
	        .append(start_time).append(", endTime=").append(end_time).append(", domain_user_id=").
	        append(domain_user_id).append("]");
	return builder.toString();
    }

}
