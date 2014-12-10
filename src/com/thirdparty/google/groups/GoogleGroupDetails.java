package com.thirdparty.google.groups;

import java.io.Serializable;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

import javax.xml.bind.annotation.XmlRootElement;

import com.google.gdata.data.contacts.ContactGroupEntry;
import com.google.gdata.data.contacts.SystemGroup;

@SuppressWarnings("serial")
@XmlRootElement
public class GoogleGroupDetails implements Serializable
{
    public String atomId = null;
    public String atomIdDecoded = null;
    public String editLisk = null;
    public String groupId = null;
    public String groupName = null;
    public String groupTitle = null;
    public String selfLink = null;
    public boolean isSystemGroup ;

    public GoogleGroupDetails()
    {

    }

    public GoogleGroupDetails(ContactGroupEntry groupEntry)
    {
	atomId = groupEntry.getId();
	try
	{
	    atomIdDecoded = URLDecoder.decode(atomId, "utf-8");
	}
	catch (UnsupportedEncodingException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	selfLink = groupEntry.getSelfLink().getHref();

	groupName = groupEntry.getTitle().getPlainText();

	if (groupEntry.hasSystemGroup())
	{
	    groupName = groupEntry.getSystemGroup().getId();
	    groupId = groupName;
	}
	SystemGroup sysGourp = groupEntry.getSystemGroup();
	
	isSystemGroup = sysGourp != null;
    }
}
