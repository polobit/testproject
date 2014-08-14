package com.agilecrm.export;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.deals.CustomFieldData;
import com.agilecrm.deals.Opportunity;

/**
 * <code>DealCSVExport</code> handles building CSV file for obtained Deals.
 * Constructs CSV file using opencsv CSVWriter and save it Google app engine
 * BlobStore. Sends CSV file as an attachment to current domain user email.
 * 
 * @author Saikiran
 * 
 */
public class DealCSVExport
{

    public static final String NAME = "Name";
    public static final String DESCRIPTION = "Description";
    public static final String MILESTONE = "Milestone";
    public static final String EXPECTED_VALUE = "Value";
    public static final String CLOSE_DATE = "Close Date";
    public static final String OWNER = "Owner";
    public static final String RELATED_TO = "Related Conatacts";

    private static final DateFormat date = new SimpleDateFormat("EEE, MMM d yyyy");

    /**
     * Inserts contact properties into CSV w.r.t header name.
     * 
     * @param deals
     *            - List of deals.
     * @param indexMap
     *            - indexMap to insert property under respected header name.
     * @param headers
     *            - CSV headers to build array with headers array length.
     * @return String[]
     */
    public static String[] insertDealFields(Opportunity deal, Map<String, Integer> indexMap, int headersLength)
    {
	// Initialize new array to insert as new row.
	String str[] = new String[headersLength];

	str[indexMap.get(NAME)] = deal.name;
	str[indexMap.get(DESCRIPTION)] = deal.description;
	str[indexMap.get(MILESTONE)] = deal.milestone;
	str[indexMap.get(EXPECTED_VALUE)] = String.valueOf(deal.expected_value);
	try
	{
	    str[indexMap.get(OWNER)] = deal.getOwner().email;
	    Date d = new Date();
	    d.setTime(deal.close_date * 1000);
	    str[indexMap.get(CLOSE_DATE)] = date.format(d);
	}
	catch (ParseException e)
	{
	    e.printStackTrace();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	String relatedTo = "";
	List<Contact> relatedContacts = deal.getContacts();
	for (Contact contact : relatedContacts)
	{
	    relatedTo += getContactFieldValue("email", contact) + ",";

	}

	str[indexMap.get(RELATED_TO)] = relatedTo.length() > 0 ? relatedTo.substring(0, relatedTo.length() - 1) : "";

	for (CustomFieldData field : deal.custom_data)
	{
	    str[indexMap.get(field.name)] = field.value;
	}

	return str;
    }

    /**
     * Iterate through the properties of the contact and returns the value of
     * the field requested.
     * 
     * @param fieldName
     *            the name of the field requested.
     * @param contact
     *            Contact object.
     * @return value of the field.
     */
    public static String getContactFieldValue(String fieldName, Contact contact)
    {
	List<ContactField> properties = contact.properties;
	for (ContactField field : properties)
	{
	    if (field.name.equals(fieldName))
		return field.value;
	}

	return "";
    }
}
