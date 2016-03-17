package com.agilecrm.landingpages;

import java.net.MalformedURLException;
import java.net.URL;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.Transient;

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
    
    public String cname_host;
    
    @Transient
    public boolean isDuplicateCName = false;

    public static ObjectifyGenericDao<LandingPageCNames> dao = new ObjectifyGenericDao<LandingPageCNames>(LandingPageCNames.class);

    public LandingPageCNames()
    {
    }
    
	public LandingPageCNames(String domain, Long landing_page_id, String cname) {
		this.domain = domain;
		this.landing_page_id = landing_page_id;
		this.cname = cname.toLowerCase();
	}

	public void save()
    {
		String oldNameSpace = NamespaceManager.get();
		NamespaceManager.set("");
		try
		{
			LandingPageUtil lputil = new LandingPageUtil();
			if(this.id == null){
			    //when creating
				if(!cname.isEmpty() && lputil.isCNameExists(cname)) {
					isDuplicateCName = true;
					return;
				} else {
					dao.put(this);					
				}
			} else {				
				//update
				if(!cname.isEmpty()) {
					if(id != 0L) {
						isDuplicateCName = lputil.isCNameExists(cname,id);
					} else {
						isDuplicateCName = lputil.isCNameExists(cname);
					}
					if(isDuplicateCName) {
						return;
					}					
					dao.put(this);
				}				
			}    
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
		cname = cname.toLowerCase();
		
		System.out.println("in prepresist of lpcnames");
		URL landingPageURL;
		try {
			landingPageURL = new URL(cname);
			String cnameWithSubDomain = landingPageURL.getHost();
			int indexOfDot = cnameWithSubDomain.indexOf('.');
			if(-1 != indexOfDot) {
				cname_host = cnameWithSubDomain.substring(indexOfDot+1);
			} else {
				cname_host = cnameWithSubDomain;
			}
			
		} catch (MalformedURLException e) {
			e.printStackTrace();
			cname_host = "";
		}
	}
	

}
