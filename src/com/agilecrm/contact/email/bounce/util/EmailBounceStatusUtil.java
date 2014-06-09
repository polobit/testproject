package com.agilecrm.contact.email.bounce.util;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.email.bounce.EmailBounceStatus;

public class EmailBounceStatusUtil
{

    /**
     * Updates email bounce status of contact
     * 
     * @param oldContact
     *            - Contact before written to db
     * @param newContact
     *            - Contact after written to db
     */
    public static void updateEmailBounceStatus(Contact oldContact, Contact newContact)
    {
	try
	{
	    // Update only for HardBounceContacts
	    if (newContact.emailBounceStatus.size() == 0)
		return;

	    List<String> oldEmails = getEmails(oldContact.getContactPropertiesList(Contact.EMAIL));
	    List<String> newEmails = getEmails(newContact.getContactPropertiesList(Contact.EMAIL));

	    // If oldEmails exists
	    if (newEmails.containsAll(oldEmails))
		return;

	    System.out.println("Bounced " + oldEmails.toString() + " emails are updated..." + newEmails.toString());

	    boolean isBounceEmailRemoved = false;

	    Iterator<EmailBounceStatus> emailBounceStatusIterator = newContact.emailBounceStatus.listIterator();

	    // Update EmailBounceStatus when HardBounceEmail is removed
	    while (emailBounceStatusIterator.hasNext())
	    {
		try
		{
		    // Compare old hardbounced emails
		    for (String email : oldEmails)
		    {
			// If any hardbounced email not removed
			if (newEmails.contains(email))
			    continue;

			// Remove email if equal
			if ((emailBounceStatusIterator.next().email.equals(email)))
			{
			    isBounceEmailRemoved = true;
			    emailBounceStatusIterator.remove();
			}

		    }
		}
		catch (Exception e)
		{

		    System.err.println("Exception occured in loop while updating email bounce status..."
			    + e.getMessage());
		    e.printStackTrace();
		    continue;
		}
	    }

	    // Save only if emailBounce updated
	    if (isBounceEmailRemoved)
		newContact.save();
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured while updating email bounce status..." + e.getMessage());
	    e.printStackTrace();
	}
    }

    /**
     * Returns list of string emails
     * 
     * @param contactFieldEmails
     *            - Emails ContactField Objects list
     * @return List
     */
    public static List<String> getEmails(List<ContactField> contactFieldEmails)
    {
	List<String> emails = new ArrayList<String>();

	for (ContactField field : contactFieldEmails)
	    emails.add(field.value);

	return emails;
    }

}
