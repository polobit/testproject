package com.agilecrm;

import java.util.HashMap;
import java.util.Map;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.Indexed;

/**
 * </p> <code>OpportunitySchemaUpdateStats</code> Used for storing schema update
 * statistics of opportunity table. </p>
 * 
 * @author Subrahmanyam
 */
@XmlRootElement
@Cached
public class OpportunitySchemaUpdateStats 
{

	@Id
	public String domain;

	@Indexed
	public String status;

	public String cursor;

	public Integer count;

	public Integer total;
	
	public String failedIds;

	
	private static ObjectifyGenericDao<OpportunitySchemaUpdateStats> dao = new ObjectifyGenericDao<OpportunitySchemaUpdateStats>(
			OpportunitySchemaUpdateStats.class);

	/**
	 * Saves UserPrefs. Wraps DomainUser Name with UserPrefs name.
	 */
	public void save()
	{
		dao.put(this);
	}

	public static OpportunitySchemaUpdateStats get(String domain) throws EntityNotFoundException
	{
		Key<OpportunitySchemaUpdateStats> domainKey = new Key<OpportunitySchemaUpdateStats>(OpportunitySchemaUpdateStats.class,
				domain);
		return dao.get(domainKey);
	}
	
	public static OpportunitySchemaUpdateStats getByDomain(String domain)
	{
		Map<String, Object> criteria = new HashMap<>();
		criteria.put("domain", domain);
		
		return dao.getByProperty(criteria);
	}

	public OpportunitySchemaUpdateStats()
	{
		
	}

	public OpportunitySchemaUpdateStats(String domain, String status, String cursor, Integer count, Integer total)
	{
		this.domain = domain;
		this.status = status;
		this.cursor = cursor;
		this.count = count;
		this.total = total;
	}

	/**
	 * Deletes UserPrefs.
	 */
	public void delete()
	{
		dao.delete(this);
	}
}