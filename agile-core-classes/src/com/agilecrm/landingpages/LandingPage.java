package com.agilecrm.landingpages;

import javax.persistence.Id;
import javax.persistence.PrePersist;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

public class LandingPage
{

    @Id
    public Long id;

    @NotSaved(IfDefault.class)
    public String name = null;
    
    @NotSaved(IfDefault.class)
    public String dummy_name = null;

    @NotSaved(IfDefault.class)
    public String html = null;
    
//    For site builder (v2.x) page_css data will be stored here
    @NotSaved(IfDefault.class)
    public String css = null;
    
    @NotSaved(IfDefault.class)
    public String elements_css = null;
    
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

    @NotSaved(IfDefault.class)
    public float version = 0f;
    
//    For site builder (v2.x)
    @NotSaved(IfDefault.class)
    public String header_includes = null;

//    For site builder (v2.x) blocks data will be stored here
    @NotSaved(IfDefault.class)
    public String blocks = null;

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
		dao.put(this);
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
		
		// Trim name and make dummy one to sore
		if(StringUtils.isNotBlank(name)){
			dummy_name = name.toLowerCase().trim();
	    }
		
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
