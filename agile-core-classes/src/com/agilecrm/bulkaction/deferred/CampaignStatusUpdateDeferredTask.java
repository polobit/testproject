package com.agilecrm.bulkaction.deferred;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.workflows.status.util.CampaignStatusUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.googlecode.objectify.Key;

public class CampaignStatusUpdateDeferredTask implements DeferredTask
{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Long campaignId;
	private String campaignName;
	private String namespace;
	private Set<Key<Contact>> contactKeySet;

	CampaignStatusUpdateDeferredTask()
	{

	}

	public CampaignStatusUpdateDeferredTask(Long campaignId, String campaignName, String namespace,
			Set<Key<Contact>> contactKeySet)
	{
		this.campaignId = campaignId;
		this.campaignName = campaignName;
		this.namespace = namespace;
		this.contactKeySet = contactKeySet;
	}

	public void run()
	{
		if (!isValidTask())
			return;

		String oldNamespace = NamespaceManager.get();

		try
		{
			NamespaceManager.set(namespace);
			updateCampaignStatus();
		}
		catch (Exception e)
		{
			System.out.println("Error in updating campaign status " + e.getMessage());
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

		return true;

	}

	private void updateCampaignStatus()
	{
		String id = campaignId.toString();
		
		CampaignStatusUtil.setRemoveStatus(fetchContacts(),id, campaignName);
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
