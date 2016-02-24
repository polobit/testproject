package com.agilecrm.export.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.contact.CustomFieldDef;
import com.agilecrm.contact.CustomFieldDef.SCOPE;
import com.agilecrm.contact.util.CustomFieldDefUtil;
import com.agilecrm.export.DealCSVExport;

public class DealExportCSVUtil
{

    /* *//**
     * Builds deals csv and write to blob file.
     * 
     * @param writeChannel
     * @param dealList
     *            List of the deals.
     * @param isFirstTime
     *            to state whether this is the new or appending to the old one.
     */
    /*
     * public static void writeDealCSV(FileWriteChannel writeChannel,
     * List<Opportunity> dealList, Boolean isFirstTime) { try {
     * 
     * CSVWriter writer = new CSVWriter(Channels.newWriter(writeChannel,
     * "UTF8"));
     * 
     * String[] headers = DealExportCSVUtil.getCSVHeadersForDeal();
     * 
     * if (isFirstTime) writer.writeNext(headers);
     * 
     * Map<String, Integer> indexMap =
     * DealExportCSVUtil.getIndexMapOfCSVHeaders(headers);
     * 
     * System.out.println("Writing deals to CSV file."); for (Opportunity deal :
     * dealList) { try { if (deal == null) continue;
     * 
     * String str[] = DealCSVExport.insertDealFields(deal, indexMap,
     * headers.length); if (str.length > 0) writer.writeNext(str); } catch
     * (Exception e) { System.out.println("Exception in deal - " + deal.name); }
     * }
     * 
     * ActivityUtil.createLogForImport(ActivityType.DEAL_EXPORT,
     * EntityType.DEAL, dealList.size(), 0);
     * 
     * System.out.println("Completed writing deals to CSV file."); // Close
     * without finalizing writer.close(); } catch (Exception e) {
     * e.printStackTrace();
     * System.err.println("Exception occured in writeDealCSV " +
     * e.getMessage()); } }
     */

    /**
     * Returns array of CSV Headers. Appends custom fields labels as CSV Headers
     * to array.
     * 
     * @return String[]
     */
    public static String[] getCSVHeadersForDeal()
    {
	// CSV Header will get initialized in the same order
	String[] headers = { DealCSVExport.NAME, DealCSVExport.DESCRIPTION, DealCSVExport.PIPELINE,
		DealCSVExport.MILESTONE, DealCSVExport.PROBABILITY, DealCSVExport.EXPECTED_VALUE,
		DealCSVExport.CLOSE_DATE, DealCSVExport.OWNER, DealCSVExport.RELATED_TO,DealCSVExport.DEAL_SOURCE };

	return DealExportCSVUtil.appendCustomFieldsToHeaders(headers);
    }

    /**
     * Appends Custom fields to CSV Headers string array. If Exception occurs it
     * simply returns headers without appending custom fields.
     * 
     * @param headers
     *            - string array of headers.
     * @return String[]
     */
    public static String[] appendCustomFieldsToHeaders(String[] headers)
    {
	// Can't append elements directly in java, so convert to ArrayList
	List<String> headersList = new ArrayList<String>(Arrays.asList(headers));

	try
	{
	    // List of custom fields for Deals.
	    List<CustomFieldDef> customFields = CustomFieldDefUtil.getAllCustomFields(SCOPE.DEAL);

	    // Appends custom field labels to list
	    for (CustomFieldDef customField : customFields)
	    {
	    	if (!customField.field_type.equals(CustomFieldDef.Type.FORMULA))
	    	{
	    		headersList.add(customField.field_label);
	    	}
	    }

	    // Converts ArrayList to String array before return
	    return headersList.toArray(new String[headersList.size()]);
	}
	catch (Exception e)
	{
	    System.err.println("Exception occurend in appendCustomFieldsToHeaders " + e.getMessage());
	    return headers;
	}

    }

    /**
     * Returns map with header names as keys and their array indexes as values.
     * It helps to add elements to array on the same index of header name
     * without worrying about their index in an array.
     * 
     * @param headers
     * @return
     */
    public static Map<String, Integer> getIndexMapOfCSVHeaders(String[] headers)
    {
	Map<String, Integer> indexMap = new HashMap<String, Integer>();

	// Map with header name as key and their index as value
	for (int i = 0; i < headers.length; i++)
	    indexMap.put(headers[i], i);

	return indexMap;
    }
}
