package com.agilecrm.forms;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.annotation.Indexed;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
public class Form
{
    @Id
    public Long id;

    @Indexed
    @NotSaved(IfDefault.class)
    public Long updated_time = System.currentTimeMillis() / 1000;

    @NotSaved(IfDefault.class)
    public String formName = null;

    @NotSaved(IfDefault.class)
    public String formJson = null;
    
    public boolean emailNotification=false;

    @NotSaved(IfDefault.class)
    public String formHtml= null;

    public static ObjectifyGenericDao<Form> dao = new ObjectifyGenericDao<Form>(Form.class);

    public Form()
    {

    }

    public Form(String name, String json)
    {
	this.formName = name;
	this.formJson = json;
    }

    public Form(String name, String json, String html)
    {
    this.formName = name;
    this.formJson = json;
    this.formHtml = html;
    }
    
    public Form(String name, String json, String html, boolean emailnotification)
    {
    this.formName = name;
    this.formJson = json;
    this.formHtml = html;
    this.emailNotification=emailnotification;
    }

    public void save()
    {
	this.updated_time = System.currentTimeMillis() / 1000;
	dao.put(this);
    }
    
}
