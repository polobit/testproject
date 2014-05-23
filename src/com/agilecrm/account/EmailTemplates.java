package com.agilecrm.account;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>EmailTemplates</code> is the base class for Email Templates. User can
 * create custom email templates with Subject and Body. Email Templates are
 * useful while sending an email to the Contact. User can just include required
 * template before sending email. EmailTemplates gives reusability feature for
 * sending email to different contacts.
 * <p>
 * EmailTemplates are saved in datastore with unique id, Subject and Body.
 * </p>
 * 
 */
@XmlRootElement
@Cached
public class EmailTemplates
{
    /**
     * EmailTemplate Id.
     */
    @Id
    public Long id;

    /**
     * Email Subject.
     */
    @NotSaved(IfDefault.class)
    public String subject = null;

    /**
     * Email Body.
     */
    @NotSaved(IfDefault.class)
    public String text = null;

    /**
     * EmailTemplates Dao.
     */
    public static ObjectifyGenericDao<EmailTemplates> dao = new ObjectifyGenericDao<EmailTemplates>(
	    EmailTemplates.class);

    /**
     * Default EmailTemplates.
     */
    EmailTemplates()
    {

    }

    /**
     * Constructs a new {@link EmailTemplates}.
     * 
     * @param subject
     *            - Email Subject.
     * @param text
     *            - Email Text Body.
     */
    public EmailTemplates(String subject, String text)
    {
	this.subject = subject;
	this.text = text;
    }

    /**
     * Saves EmailTemplates.
     */
    public void save()
    {
	dao.put(this);
    }

    /**
     * Deletes EmailTemplates.
     */
    public void delete()
    {
	dao.delete(this);
    }
}
