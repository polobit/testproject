package com.agilecrm.bulkaction.deferred;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.session.UserInfo;
import com.agilecrm.user.DomainUser;
import com.agilecrm.workflows.util.WorkflowSubscribeUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.googlecode.objectify.Key;

public class CampaignSubscriberDeferredTask implements DeferredTask
{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Key<DomainUser> key;
	private Long campaignId;
	private String namespace;
	private Set<Key<Contact>> contactKeySet;
	private UserInfo info;

	CampaignSubscriberDeferredTask()
	{

	}

	public CampaignSubscriberDeferredTask(Long domainUserId, Long campaignId, String namespace,
			Set<Key<Contact>> contactKeySet, UserInfo info)
	{
		this.key = new Key<DomainUser>(DomainUser.class, domainUserId);
		this.campaignId = campaignId;
		this.namespace = namespace;
		this.contactKeySet = contactKeySet;
		this.info = info;
	}

	public void run()
	{
		// TODO Auto-generated method stub
		if (!isValidTask())
			return;

		String oldNamespace = NamespaceManager.get();

		try
		{
			NamespaceManager.set(namespace);
			subscribeToCampaign();
		}
		catch (Exception e)
		{
			System.out.println("Error in subscribing campaign " + contactKeySet);
			e.printStackTrace();
		}
		finally
		{
			NamespaceManager.set(oldNamespace);
		}

	}

	public boolean isValidTask()
	{
		if (StringUtils.isEmpty(namespace))
			return false;
		if (campaignId == null)
			return false;
		if (key == null)
			return false;

		return true;

	}

	private void subscribeToCampaign()
	{
		WorkflowSubscribeUtil.subscribeDeferred(fetchContacts(), campaignId);
	}

	private List<Contact> fetchContacts()
	{
		List<Contact> contacts = null;

		try
		{
			contacts = Contact.dao.fetchAllByKeys(new ArrayList<Key<Contact>>(contactKeySet));
		}
		catch (Exception e)
		{
			e.printStackTrace();
			contacts = new ArrayList<Contact>();
			for (Key<Contact> contactKey : contactKeySet)
			{
				try
				{
					contacts.add(Contact.dao.get(contactKey));
				}
				catch (Exception e1)
				{
					e.printStackTrace();
				}
			}
		}

		return contacts;

	}
}
