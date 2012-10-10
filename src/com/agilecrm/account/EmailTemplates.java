package com.agilecrm.account;

import java.util.List;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

@XmlRootElement
public class EmailTemplates
{

    // Key
    @Id
    public Long id;

    @NotSaved(IfDefault.class)
    public String subject = null;

    @NotSaved(IfDefault.class)
    public String text = null;

    // Dao
    public static ObjectifyGenericDao<EmailTemplates> dao = new ObjectifyGenericDao<EmailTemplates>(
	    EmailTemplates.class);

    EmailTemplates()
    {

    }

    public EmailTemplates(String subject, String text)
    {
	this.subject = subject;
	this.text = text;
    }

    public static List<EmailTemplates> getAllEmailTemplates()
    {
	return dao.fetchAll();
    }

    // Delete Contact
    public void delete()
    {
	dao.delete(this);

    }

    public void save()
    {
	dao.put(this);
    }

    public static EmailTemplates getEmailTemplate(Long id)
    {
	try
	{
	    return dao.get(id);
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }
}
