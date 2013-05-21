package com.agilecrm.contact;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;

import ezvcard.Ezvcard;
import ezvcard.VCard;
import ezvcard.VCardVersion;
import ezvcard.parameters.AddressTypeParameter;
import ezvcard.parameters.EmailTypeParameter;
import ezvcard.parameters.TelephoneTypeParameter;
import ezvcard.types.AddressType;

/**
 * <code>VcardString</code> is a class which provides Vcard format string.
 * <p>
 * It is called from client side to generate QR Code using this string.
 * </p>
 * 
 * @author mantra
 * 
 */
public class VcardString
{
    static String VCARD_STRING = "";

    public VcardString(List<ContactField> properties)
    {
	VCard vcard = new VCard();
	String name = "";
	for (ContactField element : properties)
	{
	    if (element.name.equals("address"))
	    {
		try
		{
		    JSONObject address = new JSONObject(element.value);
		    AddressType adr = new AddressType();
		    if (!StringUtils.isEmpty(address.getString("address")))
			adr.setStreetAddress(address.getString("address"));
		    if (!StringUtils.isEmpty(address.getString("city")))
			adr.setLocality(address.getString("city"));
		    if (!StringUtils.isEmpty(address.getString("state")))
			adr.setRegion(address.getString("state"));
		    if (!StringUtils.isEmpty(address.getString("zip")))
			adr.setPostalCode(address.getString("zip"));
		    if (!StringUtils.isEmpty(address.getString("country")))
			adr.setCountry(address.getString("country"));
		    if (!StringUtils.isEmpty(element.subtype))
			adr.addType(new AddressTypeParameter(element.subtype));
		    vcard.addAddress(adr);
		}
		catch (JSONException e)
		{
		    e.printStackTrace();
		}

	    }
	    else if (element.name.equals("first_name"))
	    {
		name = element.value + " ";
	    }
	    else if (element.name.equals("last_name"))
	    {
		name += element.value;
	    }
	    else if (element.name.equals("title"))
	    {
		vcard.addTitle(element.value);
	    }
	    else if (element.name.equals("company"))
	    {
		vcard.setOrganization(element.value);
	    }
	    else if (element.name.equals("phone"))
	    {
		if (!StringUtils.isEmpty(element.subtype))
		    vcard.addTelephoneNumber(element.value,
			    new TelephoneTypeParameter(element.subtype));
		else
		    vcard.addTelephoneNumber(element.value);
	    }
	    else if (element.name.equals("website"))
	    {
		vcard.addUrl(element.value);
	    }
	    else if (element.name.equals("email"))
	    {
		if (!StringUtils.isEmpty(element.subtype))
		    vcard.addEmail(element.value, new EmailTypeParameter(
			    element.subtype));
		else
		    vcard.addEmail(element.value);
	    }

	}
	vcard.setFormattedName(name);
	VCARD_STRING = Ezvcard.write(vcard).version(VCardVersion.V2_1).go();

	/*
	 * File file = new File(name + ".vcf"); try {
	 * Ezvcard.write(vcard).go(file); } catch (IOException e) {
	 * e.printStackTrace(); }
	 */
    }

    /**
     * It generates the VCard string.
     * 
     * @return
     */
    public String getVcardString()
    {
	return VCARD_STRING;
    }
}