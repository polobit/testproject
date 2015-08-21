package com.agilecrm;

import java.io.IOException;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.tools.remoteapi.RemoteApiInstaller;
import com.google.appengine.tools.remoteapi.RemoteApiOptions;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.cache.TriggerFutureHook;

public class Tester
{
    public static void main(String[] args)
    {
	RemoteApiOptions options = new RemoteApiOptions().server("agilecrmbeta.appspot.com", 443).credentials(
		"naresh@faxdesk.com", "clickdesk");

	// CachingRemoteApiInstaller installer = new
	// CachingRemoteApiInstaller();

	RemoteApiInstaller installer = new RemoteApiInstaller();

	try
	{
	    installer.install(options);
	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

	DomainUser user = DomainUserUtil.getDomainOwner("local");
	System.out.println(user);
	NamespaceManager.set("local");
	Contact contact = new Contact();
	contact.setContactOwner(new Key<DomainUser>(DomainUser.class, user.id));
	contact.addProperty(new ContactField(Contact.EMAIL, "remotapi12@agilecrm.com", null));
	contact.save();

	TriggerFutureHook.completeAllPendingFutures();
	installer.uninstall();
    }
}
