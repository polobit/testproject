package com.agilecrm.ticket.entitys;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import javax.persistence.Embedded;
import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnore;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.ticket.utils.TicketFiltersUtil;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>TicketFilters</code> class is a entity class to save ticket filter
 * conditions.
 * 
 * <p>
 * {@link TicketFiltersUtil} is a utility class which provides CRUD operations
 * on TicketFilters.
 * </p>
 * 
 * 
 * @author Sasi on 15-Oct-2015
 * 
 */
@XmlRootElement
public class TicketFilters
{
	@Id
	public Long id;

	/**
	 * Stores ticket filter name
	 */
	@NotSaved(IfDefault.class)
	public String name = null;

	/**
	 * Stores ticket filter conditions
	 */
	@NotSaved(IfDefault.class)
	@Embedded
	public List<SearchRule> conditions = new ArrayList<SearchRule>();

	/**
	 * Stores current domain user key as owner.
	 */
	@JsonIgnore
	private Key<DomainUser> owner_key = null;

	/**
	 * Stores current domain user key as owner.
	 */
	@NotSaved
	public Long owner_id = null;
	
	public Long updated_time = 0l;

	@JsonIgnore
	public void setOwner_key(Key<DomainUser> owner_key)
	{
		this.owner_key = owner_key;
	}

	@javax.persistence.PrePersist
	private void prePersist()
	{
		this.updated_time = Calendar.getInstance().getTimeInMillis();
	}
	
	@javax.persistence.PostLoad
	private void postLoad()
	{
		if(owner_key != null)
		this.owner_id = owner_key.getId();
	}
	
	public static ObjectifyGenericDao<TicketFilters> dao = new ObjectifyGenericDao<TicketFilters>(TicketFilters.class);

	public TicketFilters()
	{

	}
}
