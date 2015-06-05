package com.agilecrm.facebookpage;

import javax.persistence.Id;

import com.agilecrm.db.ObjectifyGenericDao;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

public class FacebookPage
{

    @Id
    public Long id;

    @NotSaved(IfDefault.class)
    public String domain = null;

    @NotSaved(IfDefault.class)
    public String page_id = null;

    @NotSaved(IfDefault.class)
    public String page_name = null;

    @NotSaved(IfDefault.class)
    public String form_id = null;

    @NotSaved(IfDefault.class)
    public String form_name = null;

    private static ObjectifyGenericDao<FacebookPage> dao = new ObjectifyGenericDao<FacebookPage>(FacebookPage.class);

    public FacebookPage()
    {
    }

    public FacebookPage(String domain, String page_id, String page_name, String form_id, String form_name)
    {
	this.domain = domain;
	this.page_id = page_id;
	this.page_name = page_name;
	this.form_id = form_id;
	this.form_name = form_name;
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

    public void delete()
    {
    String oldNameSpace = NamespaceManager.get();
    NamespaceManager.set("");
    try
    {
    	dao.delete(this);
    }
    finally
    {
        NamespaceManager.set(oldNameSpace);
    }
    }
}
