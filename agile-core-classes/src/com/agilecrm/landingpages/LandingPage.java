package com.agilecrm.landingpages;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.Transient;

import com.agilecrm.db.ObjectifyGenericDao;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

public class LandingPage
{

    @Id
    public Long id;

    @NotSaved(IfDefault.class)
    public String name = null;

    @NotSaved(IfDefault.class)
    public String html = null;
    
    @NotSaved(IfDefault.class)
    public String css = null;
    
    @NotSaved(IfDefault.class)
    public String js = null;

    @NotSaved(IfDefault.class)
    public String title = null;
    
    @NotSaved(IfDefault.class)
    public String tags = null;
    
    @NotSaved(IfDefault.class)
    public String description = null;
    
    public Long created_time = 0L;
    
    public Long updated_time = 0L;
    
    public String cname = "";
    
    public Long cname_id = 0L;
    
    @Transient
    public boolean isDuplicateCName = false;
    
    @Transient
    public boolean requestViaCnameSetup = false;

    public static ObjectifyGenericDao<LandingPage> dao = new ObjectifyGenericDao<LandingPage>(LandingPage.class);

    public LandingPage()
    {
    }

    public LandingPage(String name, String html, String css, String js, String title, String tags, String description )
    {
    	this.name = name;
    	this.html = html;
    	this.css = css;
    	this.js = js;
    	this.title = title;
    	this.tags = tags;
    	this.description = description;
    }

	public void save()
    {
		LandingPageUtil lputil = new LandingPageUtil();
		if(this.id == null){
		    //when creating
			if(!cname.isEmpty() && lputil.isCNameExists(cname)) {
				isDuplicateCName = true;
				return;
			} else {
				dao.put(this);
				
				//store
				if(!cname.isEmpty()) {
					LandingPageCNames lpCNames = new LandingPageCNames(NamespaceManager.get(),id,cname);
					lpCNames.save();
					if(lpCNames.id != null) {
						cname_id = lpCNames.id;
						dao.put(this);
					}
				}
				
			}
		} else {
		    //when updating
			if(!requestViaCnameSetup)
				dao.put(this);
			
			//update
			if(!cname.isEmpty()) {
				if(cname_id != 0L) {
					isDuplicateCName = lputil.isCNameExists(cname,cname_id);
				} else {
					isDuplicateCName = lputil.isCNameExists(cname);
				}
				if(isDuplicateCName) {
					return;
				}
				
				if(cname_id != 0L) {
					LandingPageCNames lpCNames = LandingPageUtil.getLandingPageCNames(cname_id);
					lpCNames.cname = cname;
					lpCNames.save();
					if(lpCNames.id != null) {
						cname_id = lpCNames.id;
					}
				} else {
					LandingPageCNames lpCNames = new LandingPageCNames(NamespaceManager.get(),id,cname);
					lpCNames.save();
					if(lpCNames.id != null) {
						cname_id = lpCNames.id;
					}
				}
				dao.put(this);
			}
			
		}
		
    }

    public void delete()
    {
    	dao.delete(this);
    }
    
	/**
	 * PrePersist is called each time before object gets saved.
	 */
	@PrePersist
	private void PrePersist()
	{
		// Initializes created Time
		if (created_time == 0L)
			created_time = System.currentTimeMillis() / 1000;

	}

	@Override
	public String toString() {
		return "LandingPage [id=" + id + ", name=" + name + ", html=" + html
				+ ", css=" + css + ", js=" + js + ", title=" + title
				+ ", tags=" + tags + ", description=" + description
				+ ", created_time=" + created_time + ", updated_time="
				+ updated_time + "]";
	}
	
	

}
