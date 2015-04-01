package com.agilecrm.contact;

import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.json.JSONException;
import org.json.JSONObject;

import ezvcard.Ezvcard;
import ezvcard.VCardVersion;
import ezvcard.parameters.AddressTypeParameter;
import ezvcard.parameters.EmailTypeParameter;
import ezvcard.parameters.TelephoneTypeParameter;
import ezvcard.types.AddressType;

/**
 * <code>VCard</code> is a class which provides VCard format string.
 * <p>
 * This class always uses its parameterized constructor to generate VCard string
 * for each contact based on properties(name, email, title, company, phone,
 * address, website).
 * </p>
 * 
 * @author mantra
 * 
 */
public class VCard
{
    static String VCARD_STRING = "";

    /**
     * Constructor when invoked produces VCard string
     * 
     * @param properties
     */
    public VCard(List<ContactField> properties)
    {
	ezvcard.VCard vcard = new ezvcard.VCard();
	String name = "";
	for (ContactField element : properties)
	{
	    if (element.name.equals("address"))
	    {
		try
		{
		    vcard.addAddress(getAddressType(element));
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
		    vcard.addTelephoneNumber(element.value, new TelephoneTypeParameter(element.subtype));
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
		    vcard.addEmail(element.value, new EmailTypeParameter(element.subtype));
		else
		    vcard.addEmail(element.value);
	    }

	}
	vcard.setFormattedName(name);
	VCARD_STRING = Ezvcard.write(vcard).version(VCardVersion.V2_1).go();
    }

    /**
     * It generates the VCard string.
     * 
     * @return generated VCard String
     */
    public String getVCardString()
    {
	return VCARD_STRING;
    }

    /**
     * Adds address element to VCard String
     * 
     * @param element
     * @return AddressType address
     * @throws JSONException
     */
    private AddressType getAddressType(ContactField element) throws JSONException
    {
	JSONObject addressJSON = new JSONObject(element.value);
	AddressType address = new AddressType();
	if (!StringUtils.isEmpty(addressJSON.getString("address")))
	    address.setStreetAddress(addressJSON.getString("address"));
	if (!StringUtils.isEmpty(addressJSON.getString("city")))
	    address.setLocality(addressJSON.getString("city"));
	if (!StringUtils.isEmpty(addressJSON.getString("state")))
	    address.setRegion(addressJSON.getString("state"));
	if (!StringUtils.isEmpty(addressJSON.getString("zip")))
	    address.setPostalCode(addressJSON.getString("zip"));
	if (!StringUtils.isEmpty(addressJSON.getString("country")))
	    address.setCountry(addressJSON.getString("country"));
	if (!StringUtils.isEmpty(element.subtype))
	    address.addType(new AddressTypeParameter(element.subtype));
	return address;
    }
}