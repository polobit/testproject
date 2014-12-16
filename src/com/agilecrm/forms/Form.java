package com.agilecrm.forms;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
public class Form
{
    @Id
    public Long id;

    @NotSaved(IfDefault.class)
    public String formName = null;

    @NotSaved(IfDefault.class)
    public String formJson = null;

    public static ObjectifyGenericDao<Form> dao = new ObjectifyGenericDao<Form>(Form.class);

    public Form()
    {

    }

    public Form(String name, String json)
    {
	this.formName = name;
	this.formJson = json;
    }

    public void save()
    {
	dao.put(this);
    }
}
