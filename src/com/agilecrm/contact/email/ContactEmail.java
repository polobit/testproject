package com.agilecrm.contact.email;

import java.util.Calendar;

import javax.persistence.Id;
import javax.persistence.PostLoad;
import javax.persistence.PrePersist;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.annotation.NotSaved;
import com.googlecode.objectify.condition.IfDefault;

/**
 * <code>ContactEmail</code> is the base class to store simple emails sent to a
 * contact. Some of the variables should be similar with their names to the
 * fields of imap, inorder to merge both before showing to user.
 * 
 * @author Naresh
 * 
 */
@XmlRootElement
public class ContactEmail
{
    @Id
    public Long id;

    /**
     * Contact Id of the contact retrieved from 'To' email-ids
     */
    @NotSaved(IfDefault.class)
    public Long contact_id = 0L;

    /**
     * From email address
     */
    @NotSaved(IfDefault.class)
    public String from = null;

    /**
     * From name
     **/
    @NotSaved(IfDefault.class)
    public String from_name = null;

    /**
     * To email address
     */
    @NotSaved(IfDefault.class)
    public String to = null;

    /**
     * Cc email address
     */
    @NotSaved(IfDefault.class)
    public String cc = null;

    /**
     * Bcc email address
     */
    @NotSaved(IfDefault.class)
    public String bcc = null;

    /**
     * Subject of an email
     */
    @NotSaved(IfDefault.class)
    public String subject = null;

    /**
     * Body of an email.
     */
    @NotSaved(IfDefault.class)
    public String message = null;

    /**
     * Epoch time
     */
    @NotSaved(IfDefault.class)
    public Long date_secs = 0L;

    /**
     * date - It is used in timeline. Not saved as it need only to show in
     * timeline
     */
    @NotSaved
    public String date = null;

    /**
     * To show the reply icon under mails tab. Not saved as it need only to show
     * in mail tab
     */
    @NotSaved
    public String owner_email = null;

    /**
     * Tracker id to track email opens.
     */
    @NotSaved(IfDefault.class)
    public Long trackerId = null;

    /**
     * To track contact personal emails open
     */
    @NotSaved(IfDefault.class)
    public Boolean is_email_opened = false;

    private static ObjectifyGenericDao<ContactEmail> dao = new ObjectifyGenericDao<ContactEmail>(ContactEmail.class);

    /**
     * Constructs default {@link ContactEmail}
     */
    ContactEmail()
    {
    }

    /**
     * Constructs {@link ContactEmail}
     * 
     * @param contact_id
     *            - Contact Id.
     * @param from
     *            - From email address
     * @param to
     *            - To email address
     * @param subject
     *            - Email subject
     * @param message
     *            - Email body
     */
    public ContactEmail(Long contact_id, String from, String to, String subject, String message)
    {
	this.contact_id = contact_id;
	this.from = from;
	this.to = to;
	this.subject = subject;
	this.message = message;
    }

    /**
     * Saves the entity
     */
    public void save()
    {
	dao.put(this);
    }

    /**
     * Modifies date_secs and from email-address before saving to datastore
     */
    @PrePersist
    private void prePersist()
    {
	// set date_secs and from for only new one
	if (id == null)
	{
	    if (date_secs == 0L)
		date_secs = (System.currentTimeMillis() / 1000) * 1000;

	    // From address should be same as imap format.
	    from = from_name + " " + "<" + from + ">";
	}
    }

    /**
     * Sets owner_email and date after getting from datastore
     */
    @PostLoad
    private void PostLoad()
    {
	// Mostly from address would be current agile user and filled in the
	// front-end.
	owner_email = from;

	// As imap email consists of date field
	date = Calendar.getInstance().getTime().toString();
    }
}
