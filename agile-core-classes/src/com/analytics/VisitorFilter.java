/*<code>SegmentFilters</code> 
class is a entity class to save segments filter conditions.

  {@link TicketFiltersUtil} is a utility class which provides CRUD operations
  on TicketFilters.
  @author Sonali
 */
package com.analytics;

import javax.persistence.Id;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

public class VisitorFilter
{
    
    @Id
    public Long	   id;
    /**
     * Stores segment filter name
     */
    public String name	 = null;
    
    /**
     * Stores segments filter conditions
     */
    @NotSaved(IfDefault.class)
    /*
     * @Embedded public List<SearchRule> segmentConditions = null;
     */
    public String segmentConditions = null;
    private Key<DomainUser> owner_key	 = null;
    
    public void setOwner_key(Key<DomainUser> owner_key)
    {
	this.owner_key = owner_key;
    }
    
    public static ObjectifyGenericDao<VisitorFilter> dao = new ObjectifyGenericDao<VisitorFilter>(VisitorFilter.class);
    
    public static VisitorFilter getSegmentFilter(Long id)
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
