package com.agilecrm.deals;

import java.io.Serializable;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.deals.util.GoalsUtil;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * 
 * @author Nidhi
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
    public Double amount = 0.0;
    
    @NotSaved(IfDefault.class)
    public Long count = 0L;

    //@NotSaved
    public Long domain_user_id;

    public static ObjectifyGenericDao<Goals> dao = new ObjectifyGenericDao<Goals>(
    		Goals.class);

    public Long start_time = 0L;
   //public Long end_time = 0L;
    
    /**
     * Key object of DomainUser.
     */
    @NotSaved(IfDefault.class)
    private Key<DomainUser> ownerKey = null;



    public Goals()
    {

    }

    public Goals(Long domain_user_id,Long start_time,Double amount,Long count)
    {
	//this.domain_user_id = domain_user_id;
	this.start_time = start_time;
	//this.end_time=end_time;
	this.amount=amount;
	this.count=count;
    }


    



    /**
     * Saves the goal
     */
    public void save()
    {
    	Long id=this.id;
    	if(id!=null)
		{
			Goals new_goal=getGoal(id);
			new_goal.amount=this.amount;
			new_goal.count=this.count;
			
		}
    	if (domain_user_id != null)
    	    ownerKey = new Key<DomainUser>(DomainUser.class, domain_user_id);
        
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
	builder.append("Goals [Id=").append(id).append(", amount=").append(amount).append(", count=").append(count).append(", startTime=")
	        .append(start_time).append(", domain_user_id=").
	        append(domain_user_id).append("]");
	return builder.toString();
    }
    
    public static Goals getGoal(Long id)
    {
	try
	{
	    return dao.get(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

}
