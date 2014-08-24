package com.agilecrm;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import javax.mail.Address;
import javax.mail.MessagingException;
import javax.mail.Session;
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
    public void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException
    {
	Properties properties = new Properties();
	Session session = Session.getDefaultInstance(properties, null);
	try
	{
	    MimeMessage email = new MimeMessage(session, req.getInputStream());

	    Address[] senderAddress = email.getFrom();
	    String senderUserName = getSenderUserName(senderAddress);

	    Address[] recepientAddresses = email.getAllRecipients();
	    String agileRecepientUserName = getAgileRecepientUserName(recepientAddresses);

	    String[] agileAccountDetails = agileRecepientUserName.split("-");
	    String apiKey = agileAccountDetails[1];

	    Key<DomainUser> owner = APIKey.getDomainUserKeyRelatedToAPIKey(apiKey);
	    if (owner == null)
	    {
		res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "API Key Invalid");
		return;
	    }

	    Contact contact = ContactUtil.searchContactByEmail(senderAddress[0].toString());
	    if (contact == null)
		contact = new Contact();
	    else
	    {
		res.sendError(HttpServletResponse.SC_BAD_REQUEST, "Contact with email already exists");
		return;
	    }

	    List<ContactField> contactProperties = new ArrayList<ContactField>();
	    contactProperties.add(new ContactField(Contact.FIRST_NAME, senderUserName, null));
	    contactProperties.add(new ContactField(Contact.EMAIL, senderAddress[0].toString(), null));

	    contact.setContactOwner(owner);
	    contact.properties = contactProperties;
	    contact.save();
	}
	catch (MessagingException e)
	{
	    System.out.println(e.getMessage());
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }

    public static String getAgileRecepientUserName(Address[] addresses)
    {
	String[] agileRecepient = null;
	for (Address recepient : addresses)
	{
	    if (recepient.toString().contains("@agile-crm-cloud.appspotmail.com"))
	    {
		agileRecepient = recepient.toString().split("@");
	    }
	}
	return agileRecepient[0];
    }

    public static String getSenderUserName(Address[] address)
    {
	String[] senderUserName = address[0].toString().split("@");
	return senderUserName[0];
    }
}