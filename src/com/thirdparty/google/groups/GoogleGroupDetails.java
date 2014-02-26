package com.thirdparty.google.groups;

import javax.xml.bind.annotation.XmlRootElement;

import com.google.gdata.data.contacts.ContactGroupEntry;

@XmlRootElement
public class GoogleGroupDetails
{
	public String atomId = null;
	public String editLisk = null;
	public String groupId = null;
	public String groupName = null;
	public String groupTitle = null;
	public String selfLink = null;

	public GoogleGroupDetails()
	{

	}

	public GoogleGroupDetails(ContactGroupEntry groupEntry)
	{
		atomId = groupEntry.getId();
		selfLink = groupEntry.getSelfLink().getHref();

		groupName = groupEntry.getTitle().getPlainText();

		if (groupEntry.hasSystemGroup())
		{
			groupName = groupEntry.getSystemGroup().getId();
			groupId = groupName;
		}

	}
}
