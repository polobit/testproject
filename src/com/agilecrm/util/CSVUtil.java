package com.agilecrm.util;

import java.io.StringReader;
import java.util.Hashtable;
import java.util.Vector;

import org.json.JSONArray;
import org.json.JSONObject;

import au.com.bytecode.opencsv.CSVReader;

/**
 * <code>CSVUtil</code> is a utility class, which converts the given data of a
 * csv file into an array of json objects (each row of the file as a json
 * object).
 * <p>
 * Corresponding headers are taken as keys for the values. Also validates the
 * duplicates in the given data.
 * </p>
 * 
 * @author
 * 
 */
public class CSVUtil
{
    /**
     * Converts csv file data into json objects and returns HashMap() of Array
     * (result) and Error (duplicates). Validates the duplicates based on given
     * "duplicateFieldName".
     * 
     * @param csv
     * @param duplicateFieldName
     * @return hashtable of json objects
     * @throws Exception
     */
    public static Hashtable convertCSVToJSONArray2(String csv,
	    String duplicateFieldName) throws Exception
    {

	CSVReader reader = new CSVReader(new StringReader(csv.trim()));

	// Get Header Liner
	String[] headers = reader.readNext();
	if (headers == null)
	{
	    System.out.println("Empty List");
	    new Exception("Empty List");
	}

	// CSV Json Array
	JSONArray csvJSONArray = new JSONArray();

	/*
	 * HashTable of keys to check duplicates - we will store all keys into
	 * this hashtable and if there are any duplicates we will exclude them
	 */
	Vector<String> keys = new Vector();
	Vector<String> duplicates = new Vector();

	String[] csvValues;
	while ((csvValues = reader.readNext()) != null)
	{
	    JSONObject csvJSONObject = new JSONObject();

	    boolean isDuplicate = false;
	    for (int j = 0; j < csvValues.length; j++)
	    {
		// Check if the header is same as duplicate name
		if (duplicateFieldName != null
			&& headers[j].equalsIgnoreCase(duplicateFieldName))
		{
		    System.out.println("If already present " + headers[j] + " "
			    + csvValues[j]);

		    // Check if is already present in already imported items
		    if (keys.contains(csvValues[j]))
		    {
			duplicates.add(csvValues[j]);
			isDuplicate = true;
			break;
		    }

		    keys.add(csvValues[j]);
		}

		csvJSONObject.put(headers[j], csvValues[j]);
	    }

	    if (!isDuplicate)
		csvJSONArray.put(csvJSONObject);
	}

	Hashtable resultHashtable = new Hashtable();
	resultHashtable.put("result", csvJSONArray);

	// Put warning with the duplicate objects
	if (duplicateFieldName != null && duplicates.size() > 0)
	{
	    resultHashtable.put("warning",
		    "Duplicate Values (" + duplicates.size()
			    + ") were not imported " + duplicates);
	}

	System.out.println("Converted csv " + csv + " to " + resultHashtable);
	return resultHashtable;

    }

}
