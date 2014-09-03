package com.agilecrm;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import javax.mail.Address;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.account.APIKey;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.DomainUser;
import com.googlecode.objectify.Key;

@SuppressWarnings("serial")
public class MailHandlerServlet extends HttpServlet
{
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException
    {
	System.out.println("/_ah/mail");

	Properties properties = new Properties();
	Session session = Session.getDefaultInstance(properties, null);
	try
	{
	    MimeMessage email = new MimeMessage(session, request.getInputStream());
	    System.out.println("email " + email);
	    Address[] recepientAddresses = email.getAllRecipients();

	    System.out.println("recepients " + recepientAddresses);

	    String apiKey = getAgileAPIKey(recepientAddresses);

	    System.out.println(apiKey);

	    Key<DomainUser> owner = APIKey.getDomainUserKeyRelatedToAPIKey(apiKey);

	    System.out.println("owner is " + owner);

	    for (Address recepientAddress : recepientAddresses)
	    {
		System.out.println("received recepients");
		System.out.println("address " + recepientAddress.toString());

		if (isAgileRecepient(recepientAddress))
		    continue;

		InternetAddress recepient = new InternetAddress(recepientAddress.toString());

		Contact contact = ContactUtil.searchContactByEmail(recepient.getAddress().toString());
		if (contact == null)
		    contact = new Contact();
		else
		    continue;

		List<ContactField> contactProperties = new ArrayList<ContactField>();
		contactProperties.add(new ContactField(Contact.EMAIL, recepient.getAddress().toString(), null));

		if (recepient.getPersonal() != null)
		{
		    if (recepient.getPersonal().contains(" "))
		    {
			contactProperties.add(new ContactField(Contact.FIRST_NAME,
				recepient.getPersonal().split(" ")[0], null));
			contactProperties.add(new ContactField(Contact.LAST_NAME,
				recepient.getPersonal().split(" ")[1], null));
		    }
		    else
			contactProperties.add(new ContactField(Contact.FIRST_NAME, recepient.getPersonal(), null));
		}
		else
		    contactProperties.add(new ContactField(Contact.FIRST_NAME, recepient.getAddress().split("@")[0],
			    null));

		System.out.println("contact properties ");
		System.out.println(contactProperties);

		contact.properties = contactProperties;
		contact.setContactOwner(owner);
		contact.save();
	    }
	}
	catch (MessagingException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }

    public boolean isAgileRecepient(Address address)
    {
	if (address.toString().contains("@agile-crm-cloud.appspotmail.com")
		|| address.toString().contains("@agilecrmbeta.appspotmail.com"))
	    return true;
	else
	    return false;
    }

    public String getAgileAPIKey(Address[] addresses)
    {
	String agileRecepientUserName[] = null;

	for (Address address : addresses)
	    if (isAgileRecepient(address))
		agileRecepientUserName = address.toString().split("@");

	String agileDetails[] = agileRecepientUserName[0].split("-");
	return agileDetails[1].toString();
    }
}