package com.thirdparty.google;

import javax.xml.bind.annotation.XmlRootElement;

import com.google.gdata.data.contacts.ContactGroupEntry;

@XmlRootElement
public class GoogleGroupDetails
{
	public String atomId = null;
	public String editLisk = null;
	public String groupId = null;
	public String groupName = null;
	public String selfLink = null;

	public GoogleGroupDetails()
	{

	}

	public GoogleGroupDetails(ContactGroupEntry groupEntry)
	{
		atomId = groupEntry.getId();
		selfLink = groupEntry.getSelfLink().getHref();
		if (groupEntry.hasSystemGroup())
		{
			groupName = groupEntry.getSystemGroup().getValue();
			groupId = groupEntry.getSystemGroup().getId();
		}
		groupName = groupEntry.getTitle().getPlainText();
	}
}
