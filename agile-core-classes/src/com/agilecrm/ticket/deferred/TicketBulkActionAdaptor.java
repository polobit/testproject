package com.agilecrm.ticket.deferred;

import java.util.Set;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.agilecrm.contact.util.BulkActionUtil;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.googlecode.objectify.Key;

public abstract class TicketBulkActionAdaptor implements DeferredTask
{
	private static final long serialVersionUID = -7597339468507292123L;
	protected Key<DomainUser> key;

	protected String namespace;
	protected UserInfo info;
	private DomainUser user = null;

	public Set<Key<Tickets>> ticketsKeySet = null;

	public void run()
	{
		String oldNamespace = NamespaceManager.get();

		try
		{
			NamespaceManager.set(namespace);
			setSession();
			performAction();
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
		finally
		{
			NamespaceManager.set(oldNamespace);
		}
	}

	private void setSession()
	{
		System.out.println("Setting session................");
		
		System.out.println("Setting session info................" + info);
		
		if (info != null)
		{
			SessionManager.set(info);
		}
		
		System.out.println("Setting session key................" + key);
		
		if (key != null)
		{
			user = DomainUserUtil.getDomainUser(key.getId());
			
			System.out.println("Setting session user................" + user);
			
			if (user == null)
				return;

			BulkActionUtil.setSessionManager(user);
		}

	}

	protected abstract void performAction();

	public void setTicketKeys(Set<Key<Tickets>> ticketsKeySet)
	{
		this.ticketsKeySet = ticketsKeySet;
	}
}
