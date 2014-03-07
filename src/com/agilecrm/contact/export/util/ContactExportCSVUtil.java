package com.agilecrm.contact.export.util;

import java.nio.channels.Channels;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import au.com.bytecode.opencsv.CSVWriter;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.CustomFieldDef;
import com.agilecrm.contact.export.ContactCSVExport;
import com.agilecrm.contact.util.CustomFieldDefUtil;
import com.google.appengine.api.files.FileWriteChannel;

public class ContactExportCSVUtil
{

    /**
     * Builds contacts csv and write to blob file.
     * 
     * @param writeChannel
     * @param contactList
     * @param isFirstTime
     */
    public static void writeContactCSV(FileWriteChannel writeChannel, List<Contact> contactList, Boolean isFirstTime)
    {
        try
        {
            CSVWriter writer = new CSVWriter(Channels.newWriter(writeChannel, "UTF8"));
    
            String[] headers = ContactExportCSVUtil.getCSVHeadersForContact();
    
            if (isFirstTime)
        	writer.writeNext(headers);
    
            Map<String, Integer> indexMap = ContactExportCSVUtil.getIndexMapOfCSVHeaders(headers);
    
            for (Contact contact : contactList)
            {
        	if (contact == null)
        	    continue;
    
        	String str[] = ContactCSVExport.insertContactProperties(contact, indexMap, headers.length);
        	writer.writeNext(str);
            }
    
            // Close without finalizing
            writer.close();
        }
        catch (Exception e)
        {
            e.printStackTrace();
            System.err.println("Exception occured in writeContactCSV " + e.getMessage());
        }
    }

    /**
     * Returns array of CSV Headers. Appends custom fields labels as CSV Headers
     * to array.
     * 
     * @return String[]
     */
    public static String[] getCSVHeadersForContact()
    {
        // CSV Header will get initialized in the same order
        String[] headers = { ContactCSVExport.FIRST_NAME, ContactCSVExport.LAST_NAME, ContactCSVExport.TITLE, ContactCSVExport.COMPANY, ContactCSVExport.EMAIL_DEFAULT, ContactCSVExport.EMAIL_HOME, ContactCSVExport.EMAIL_WORK, ContactCSVExport.PHONE_DEFAULT, ContactCSVExport.PHONE_WORK, ContactCSVExport.PHONE_HOME, ContactCSVExport.PHONE_MOBILE,
        	ContactCSVExport.PHONE_MAIN, ContactCSVExport.PHONE_HOME_FAX, ContactCSVExport.PHONE_WORK_FAX, ContactCSVExport.PHONE_OTHER, ContactCSVExport.ADDRESS, ContactCSVExport.CITY, ContactCSVExport.STATE, ContactCSVExport.COUNTRY, ContactCSVExport.ZIP, ContactCSVExport.WEBSITE_DEFAULT, ContactCSVExport.WEBSITE, ContactCSVExport.SKYPE, ContactCSVExport.TWITTER,
        	ContactCSVExport.LINKEDIN, ContactCSVExport.FACEBOOK, ContactCSVExport.XING, ContactCSVExport.BLOG, ContactCSVExport.GOOGLE_PLUS, ContactCSVExport.FLICKR, ContactCSVExport.GITHUB, ContactCSVExport.YOUTUBE, ContactCSVExport.TAGS, ContactCSVExport.TAGS_TIME };
    
        return ContactExportCSVUtil.appendCustomFieldsToHeaders(headers);
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
            // List of custom fields
            List<CustomFieldDef> customFields = CustomFieldDefUtil.getAllCustomFields();
    
            // Appends custom field labels to list
            for (CustomFieldDef customField : customFields)
        	headersList.add(customField.field_label);
    
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
