package com.agilecrm.account;

import javax.persistence.Id;
import javax.persistence.PrePersist;
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
     * Email Name.
     */
    @NotSaved(IfDefault.class)
    public String name = null;

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
    public static ObjectifyGenericDao<EmailTemplates> dao = new ObjectifyGenericDao<EmailTemplates>(EmailTemplates.class);

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
    public EmailTemplates(String name, String subject, String text)
    {
	this.name = name;
	this.subject = subject;
	this.text = text;
    }

    /**
     * Saves EmailTemplates.
     */
    public void save()
    {
	System.out.println("email template : " + this);
	dao.put(this);
    }

    /**
     * Deletes EmailTemplates.
     */
    public void delete()
    {
	dao.delete(this);
    }

    /**
     * Sets name to subject if its null for old templates. PrePersist is called
     * each time before object gets saved.
     */
    @PrePersist
    private void PrePersist()
    {
	if (this.name == null)
	    this.name = this.subject;
    }

    /*
     * (non-Javadoc)
     * 
     * @see java.lang.Object#toString()
     */
    public String toString()
    {
	return "id: " + id + " name: " + this.name + " subject" + this.subject;
    }
}
