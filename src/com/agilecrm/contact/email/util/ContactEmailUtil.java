package com.agilecrm.contact.email.util;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.StringTokenizer;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.email.ContactEmail;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.db.ObjectifyGenericDao;

/**
 * <code>ConactEmailUtil</code> is the utility class for {@link ContactEmail}.
 * It retrieves the {@link ContactEmail} based on contactId.
 * 
 * @author mantra
 * 
 */
public class ContactEmailUtil
{
    private static ObjectifyGenericDao<ContactEmail> dao = new ObjectifyGenericDao<ContactEmail>(
	    ContactEmail.class);

    /**
     * Retrieves the ContactEmails based on contactId.
     * 
     * @param contactId
     *            - Contact Id.
     * @return List
     */
    public static List<ContactEmail> getContactEmails(Long contactId)
    {
	return dao.listByProperty("contact_id", contactId);
    }

    /**
     * Saves email in datastore. It iterates over the given to emails and gets
     * the contact-id if exists for that email.
     * 
     * @param from
     *            - from email
     * @param to
     *            - to email
     * @param subject
     *            - subject
     * @param body
     *            - body
     */
    public static void saveContactEmailBasedOnTo(String from, String to,
	    String subject, String body)
    {
	Set<String> toEmailSet = new HashSet<String>();
	StringTokenizer st = new StringTokenizer(to, ",");

	while (st.hasMoreTokens())
	{
	    toEmailSet.add(st.nextToken());
	}

	for (String toEmail : toEmailSet)
	{
	    if (StringUtils.isEmpty(toEmail))
		continue;

	    // Get contact based on email.
	    Contact contact = ContactUtil.searchContactByEmail(toEmail);

	    // Saves email with contact-id
	    if (contact != null)
	    {
		// Remove trailing commas for to emails
		ContactEmail contactEmail = new ContactEmail(contact.id, from,
			to.replaceAll(",$", ""), subject, body);
		contactEmail.save();
	    }

	}
    }
}
