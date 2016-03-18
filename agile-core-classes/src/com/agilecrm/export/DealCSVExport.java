package com.agilecrm.export;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.activities.Category;
import com.agilecrm.activities.util.CategoriesUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.ContactField;
import com.agilecrm.deals.CustomFieldData;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.user.util.UserPrefsUtil;

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
    public static final String PIPELINE = "Track";
    public static final String MILESTONE = "Milestone";
    public static final String PROBABILITY = "Probability";
    public static final String EXPECTED_VALUE = "Value";
    public static final String CLOSE_DATE = "Close Date";
    public static final String OWNER = "Owner";
    public static final String RELATED_TO = "Related Contacts";
    public static final String SOURCE = "Deal Source";
    public static final String LOSSREASON = "Loss Reason";
    public static final String CREATED_DATE = "Created Date";

    private static final DateFormat date = new SimpleDateFormat("MM/dd/yyyy");

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

	try
	{
	    str[indexMap.get(NAME)] = deal.name;
	    str[indexMap.get(DESCRIPTION)] = deal.description;
	    try
	    {
		if (deal.getPipeline_id() != 0)
		    str[indexMap.get(PIPELINE)] = deal.getPipeline().name;
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	    str[indexMap.get(MILESTONE)] = deal.milestone;
	    str[indexMap.get(PROBABILITY)] = deal.probability + "%";
	    String currency = UserPrefsUtil.getCurrentUserPrefs().currency;
	    if (StringUtils.isNotBlank(currency))
		currency = currency.split("-")[1];
	    else
		currency = "$";
	    str[indexMap.get(EXPECTED_VALUE)] = currency + " "
		    + (deal.expected_value != null ? deal.expected_value : 0);

	    str[indexMap.get(OWNER)] = deal.getOwner().email;
	    if (deal.close_date != null)
	    {
		Date d = new Date();
		d.setTime(deal.close_date * 1000);
		str[indexMap.get(CLOSE_DATE)] = date.format(d);
	    }

	    String relatedTo = "";
	    List<Contact> relatedContacts = deal.relatedContacts();
	    for (Contact contact : relatedContacts)
	    {
		relatedTo += getContactFieldValue("email", contact) + ",";

	    }

	    str[indexMap.get(RELATED_TO)] = relatedTo.length() > 0 ? relatedTo.substring(0, relatedTo.length() - 1)
		    : "";

	    for (CustomFieldData field : deal.custom_data)
	    {
		str[indexMap.get(field.name)] = field.value;
	    }
	    if(deal.getDeal_source_id()!=null && deal.getDeal_source_id()!=0)
	    	{
	    	CategoriesUtil cu=new CategoriesUtil();
	    	Category source = cu.getCategory(deal.getDeal_source_id());
	    	if(source!=null)
	    	str[indexMap.get(SOURCE)] = source.getLabel();
	    	}
	    if(deal.getLost_reason_id()!=null && deal.getLost_reason_id()!=0)
    	{
    	CategoriesUtil cu=new CategoriesUtil();
    	Category reason = cu.getCategory(deal.getLost_reason_id());
    	if(reason!=null)
    	str[indexMap.get(LOSSREASON)] = reason.getLabel();
    	}
	    if (deal.created_time != null)
	    {
		Date d = new Date();
		d.setTime(deal.created_time * 1000);
		str[indexMap.get(CREATED_DATE)] = date.format(d);
	    }

	}
	catch (ParseException e)
	{
	    e.printStackTrace();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
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
