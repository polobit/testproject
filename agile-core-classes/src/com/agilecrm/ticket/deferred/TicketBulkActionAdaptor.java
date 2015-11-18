package com.agilecrm.ticket.deferred;

import com.agilecrm.contact.util.BulkActionUtil;
import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
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
			e.printStackTrace();
		}
		finally
		{
			NamespaceManager.set(oldNamespace);
		}
	}

	private void setSession()
	{
		if (info != null)
		{
			SessionManager.set(info);
		}

		if (key != null)
		{
			user = DomainUserUtil.getDomainUser(key.getId());

			if (user == null)
				return;

			BulkActionUtil.setSessionManager(user);
		}

	}

	protected abstract void performAction();
}
