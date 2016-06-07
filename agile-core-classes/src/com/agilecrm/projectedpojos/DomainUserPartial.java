package com.agilecrm.projectedpojos;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.user.util.AliasDomainUtil;
import com.agilecrm.util.VersioningUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.Entity;
import com.googlecode.objectify.annotation.Cached;

@XmlRootElement
@Cached
public class DomainUserPartial extends ProjectionEntityParse{
	public Long id;
	public String domain;
	public String email;
	public String name;
	public String pic;
	public String schedule_id;
	
	public String calendar_url;
	
	public DomainUserPartial(){
		super();
		System.out.println("Default one");
	}
	
	public DomainUserPartial parseEntity(Entity entity)
	{
		id = entity.getKey().getId();
		domain = NamespaceManager.get();
		name = (String) getPropertyValue(entity, "name");
		email = (String) getPropertyValue(entity, "email");
		pic = (String) getPropertyValue(entity, "pic");
		schedule_id = (String) getPropertyValue(entity, "schedule_id");
		
		domain = (String) getPropertyValue(entity, "domain");
		
		// Gets alias name
		domain = AliasDomainUtil.getCachedAliasDomainName(domain);
		calendar_url = getCalendarURL();
		
		return this;

	}
	
	public List<DomainUserPartial> postProcess(List domainUsers){
		System.out.println("postProcess");
		
		// Now sort by name.
	    Collections.sort(domainUsers, new Comparator<DomainUserPartial>()
	    {
		public int compare(DomainUserPartial one, DomainUserPartial other)
		{
		    return one.name.toLowerCase().compareTo(other.name.toLowerCase());
		}
	    });
	    
	    return domainUsers;

	}
	
	/**
	 * 
	 * @param domain
	 *            Domain of the user
	 * @param schedule_id
	 *            Calendar schedule ID
	 * @return Calendar URL
	 */
	public String getCalendarURL()
	{

		String calendar_url = VersioningUtil.getHostURLByApp(domain);
		
		if (StringUtils.isBlank(schedule_id))
			schedule_id = name.replace(" ", "_");
		
		return calendar_url += "calendar/" + schedule_id;
	
	}

	
	
}
