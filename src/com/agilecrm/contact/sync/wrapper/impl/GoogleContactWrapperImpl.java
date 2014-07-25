package com.agilecrm.contact.sync.wrapper.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.sync.wrapper.ContactWrapper;
import com.google.appengine.labs.repackaged.org.json.JSONException;
import com.google.appengine.labs.repackaged.org.json.JSONObject;
import com.google.gdata.data.contacts.ContactEntry;
import com.google.gdata.data.extensions.Email;
import com.google.gdata.data.extensions.Im;
import com.google.gdata.data.extensions.Name;
import com.google.gdata.data.extensions.PhoneNumber;
import com.google.gdata.data.extensions.StructuredPostalAddress;
import com.thirdparty.google.contacts.ContactSyncUtil;

// TODO: Auto-generated Javadoc
/**
 * The Class GoogleContactWrapperImpl.
 */
public class GoogleContactWrapperImpl extends ContactWrapper
{
    // Gdata specific contact object.
    /** The entry. */
    ContactEntry entry;

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#wrapContact()
     */
    @Override
    public void wrapContact()
    {
	if (!(object instanceof ContactEntry))
	    return;
	entry = (ContactEntry) object;
	return;
    }

    /**
     * Gets the subtype from google contacts rel.
     * 
     * @param rel
     *            the rel
     * @return the subtype from google contacts rel
     */
    private String getSubtypeFromGoogleContactsRel(String rel)
    {
	if (StringUtils.isEmpty(rel))
	    return "work";

	String type = rel.split("#")[1];

	if (StringUtils.isEmpty(type))
	    return "work";

	if (type.equalsIgnoreCase("work"))
	    return "work";

	if (type.equalsIgnoreCase("home"))
	    return "home";

	if (type.equalsIgnoreCase("mobile"))
	    return type;

	if (type.equalsIgnoreCase("main"))
	    return type;

	if (type.equalsIgnoreCase("work_fax"))
	    return "work fax";

	if (type.equalsIgnoreCase("home_fax"))
	    return "home fax";

	return "work";

    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.ContactWrapper#getMoreCustomInfo()
     */
    @Override
    public List<ContactField> getMoreCustomInfo()
    {
	List<ContactField> fields = new ArrayList<ContactField>();
	if (entry.hasImAddresses())
	    for (Im im : entry.getImAddresses())
	    {
		if (im.hasAddress())
		{
		    String subType = "";
		    if (im.hasProtocol() && im.getProtocol() != null)
		    {
			if (im.getProtocol().indexOf("#") >= 0
				&& im.getProtocol().substring(im.getProtocol().indexOf("#") + 1)
					.equalsIgnoreCase("SKYPE"))
			    subType = "SKYPE";
			if (im.getProtocol().indexOf("#") >= 0
				&& im.getProtocol().substring(im.getProtocol().indexOf("#") + 1)
					.equalsIgnoreCase("GOOGLE_TALK"))
			    subType = "GOOGLE-PLUS";
		    }

		    if (!StringUtils.isBlank(subType))
			fields.add(new ContactField("website", im.getAddress(), subType));
		    else
			fields.add(new ContactField("website", im.getAddress(), null));

		}

	    }

	// If image link there there then it is synced to agile
	// if (entry.getContactPhotoLink() != null)
	// fields.add(new ContactField(Contact.IMAGE,
	// entry.getContactPhotoLink().getHref(), null));

	return fields;

    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getEmail()
     */
    @Override
    public ContactField getEmail()
    {
	for (Email email : entry.getEmailAddresses())
	    if (email.getAddress() != null)
	    {
		String subType = ContactSyncUtil.getSubtypeFromGoogleContactsRel(email.getRel());
		ContactField field = new ContactField(Contact.EMAIL, email.getAddress(), subType);
		contact.properties.add(field);
	    }
	return null;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getPhoneNumber()
     */
    @Override
    public ContactField getPhoneNumber()
    {
	ContactField field = null;
	if (entry.hasPhoneNumbers())
	    for (PhoneNumber phone : entry.getPhoneNumbers())
	    {
		if (phone.getPhoneNumber() != null)
		{
		    String subType = ContactSyncUtil.getSubtypeFromGoogleContactsRel(phone.getRel());
		    field = new ContactField("phone", phone.getPhoneNumber(), subType);
		}
	    }
	return field;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getOrganization()
     */
    @Override
    public ContactField getOrganization()
    {
	ContactField field = null;
	if (entry.hasOrganizations())
	{
	    if (entry.getOrganizations().get(0).hasOrgName() && entry.getOrganizations().get(0).getOrgName().hasValue())
		field = new ContactField(Contact.COMPANY, entry.getOrganizations().get(0).getOrgName().getValue(), null);
	}
	return field;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getDescription()
     */
    @Override
    public String getDescription()
    {
	// TODO Auto-generated method stub
	return null;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getTags()
     */
    @Override
    public List<String> getTags()
    {
	// TODO Auto-generated method stub
	return null;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getAddress()
     */
    @Override
    public ContactField getAddress()
    {
	ContactField field = null;
	if (entry.hasStructuredPostalAddresses())
	    for (StructuredPostalAddress address : entry.getStructuredPostalAddresses())
	    {

		JSONObject json = new JSONObject();
		String addr = "";
		if (address.hasStreet())
		    addr = addr + address.getStreet().getValue();
		if (address.hasSubregion())
		    addr = addr + ", " + address.getSubregion().getValue();
		if (address.hasRegion())
		    addr = addr + ", " + address.getRegion().getValue();

		try
		{
		    if (!StringUtils.isBlank(addr))
			json.put("address", addr);

		    if (address.hasCity() && address.getCity().hasValue())
			json.put("city", address.getCity().getValue());

		    if (address.hasCountry() && address.getCountry().hasValue())
			json.put("country", address.getCountry().getValue());

		    if (address.hasPostcode() && address.getPostcode().hasValue())
			json.put("zip", address.getPostcode().getValue());
		}
		catch (JSONException e)
		{
		    continue;
		}

		field = new ContactField("address", json.toString(), null);

	    }
	return field;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getNotes()
     */
    @Override
    public List<Note> getNotes()
    {
	// TODO Auto-generated method stub
	return null;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getFirstName()
     */
    @Override
    public ContactField getFirstName()
    {
	ContactField field = null;
	if (entry.hasName())
	{
	    Name name = entry.getName();

	    if (name.hasGivenName() && name.hasFamilyName())
	    {
		if (name.hasGivenName())
		    field = new ContactField(Contact.FIRST_NAME, name.getGivenName().getValue(), null);
	    }
	    else if (name.hasFullName())
		field = new ContactField(Contact.FIRST_NAME, name.getFullName().getValue(), null);

	}
	return field;
    }

    /*
     * (non-Javadoc)
     * 
     * @see com.agilecrm.contact.sync.wrapper.WrapperService#getLastName()
     */
    @Override
    public ContactField getLastName()
    {
	ContactField field = null;
	if (entry.hasName())
	{
	    Name name = entry.getName();

	    if (name.hasGivenName() && name.hasFamilyName())
	    {
		if (name.hasFamilyName())
		    field = new ContactField(Contact.LAST_NAME, name.getFamilyName().getValue(), null);
	    }
	}
	return field;
    }

}
