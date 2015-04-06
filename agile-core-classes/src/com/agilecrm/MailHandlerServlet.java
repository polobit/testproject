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
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Key;

@SuppressWarnings("serial")
public class MailHandlerServlet extends HttpServlet
{
    public enum AgileDetail
    {
	API_KEY, SUB_DOMAIN;
    }

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException
    {
	Properties properties = new Properties();
	Session session = Session.getDefaultInstance(properties, null);
	try
	{
	    MimeMessage email = new MimeMessage(session, request.getInputStream());
	    Address[] recepientAddresses = email.getAllRecipients();

	    String subDomain = getAgileDetails(recepientAddresses, AgileDetail.SUB_DOMAIN);
	    NamespaceManager.set(subDomain);
	    System.out.println("Setting namespace " + subDomain);

	    String apiKey = getAgileDetails(recepientAddresses, AgileDetail.API_KEY);
	    Key<DomainUser> owner = APIKey.getDomainUserKeyRelatedToAPIKey(apiKey);
	    System.out.println("API Key is " + apiKey);

	    if (owner == null)
		return;

	    for (Address recepientAddress : recepientAddresses)
	    {
		if (isAgileRecepient(recepientAddress))
		    continue;

		System.out.println("Recepient is " + recepientAddress.toString());
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

		System.out.println("Contact properties " + contactProperties);
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

    public String getAgileDetails(Address[] addresses, AgileDetail agileDetail)
    {
	String agileRecepientUserName[] = null;

	for (Address address : addresses)
	    if (isAgileRecepient(address))
		agileRecepientUserName = address.toString().split("@");

	String agileDetails[] = agileRecepientUserName[0].split("-");

	if (agileDetail == AgileDetail.SUB_DOMAIN)
	    return agileDetails[0];
	else if (agileDetail == AgileDetail.API_KEY)
	    return agileDetails[1];

	return null;
    }
}