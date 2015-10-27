package com.agilecrm.landingpages;

import javax.persistence.Id;
import javax.persistence.PrePersist;

import com.agilecrm.db.ObjectifyGenericDao;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

public class LandingPageCNames
{

	@Id
    public Long id;

    @NotSaved(IfDefault.class)
    public String domain = null;

    @NotSaved(IfDefault.class)
    public Long landing_page_id = null;
    
    // Unique id to identify the page
    public String cname;

    public static ObjectifyGenericDao<LandingPageCNames> dao = new ObjectifyGenericDao<LandingPageCNames>(LandingPageCNames.class);

    public LandingPageCNames()
    {
    }
    
	public LandingPageCNames(String domain, Long landing_page_id, String cname) {
		this.domain = domain;
		this.landing_page_id = landing_page_id;
		this.cname = cname;
	}

	public void save()
    {
		String oldNameSpace = NamespaceManager.get();
		NamespaceManager.set("");
		try
		{
		    dao.put(this);
		}
		finally
		{
		    NamespaceManager.set(oldNameSpace);
		}
    }
    
	/**
	 * PrePersist is called each time before object gets saved.
	 */
	@PrePersist
	private void PrePersist()
	{

	}
	

}
