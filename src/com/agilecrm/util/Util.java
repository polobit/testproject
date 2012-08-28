package com.agilecrm.util;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.StringReader;
import java.net.URL;
import java.net.URLConnection;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Hashtable;
import java.util.Set;
import java.util.TimeZone;
import java.util.Vector;

import org.json.JSONArray;
import org.json.JSONObject;

import au.com.bytecode.opencsv.CSVReader;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Query;

public class Util {

	public static Set<String> getSearchTokens(Set<String> strings) {
		StringBuilder sb = new StringBuilder();
		for (String s : strings)
			sb.append(s + " ");

		String input = sb.toString();

		// Set<String> tokens = tokenize(input);
		return StringUtils2.breakdownFragments(input);
	}

	// URL
	public static String accessURL(String url) {
		try {
			URL yahoo = new URL(url);
			URLConnection conn = yahoo.openConnection();
			conn.setConnectTimeout(60000);
			conn.setReadTimeout(60000);

			BufferedReader reader = new BufferedReader(new InputStreamReader(
					conn.getInputStream()));

			String output = "";
			String inputLine;
			while ((inputLine = reader.readLine()) != null) {
				output += inputLine;
			}
			reader.close();
			return output;
		} catch (Exception e) {
			e.printStackTrace();
			System.err.println(e.getMessage());
		}
		return null;
	}

	// URL
	public static String accessURLUsingPost(String postURL, String data)
			throws Exception {
		// Send data
		URL url = new URL(postURL);
		URLConnection conn = url.openConnection();
		conn.setDoOutput(true);
		OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream());
		wr.write(data);
		wr.flush();

		// Get the response
		BufferedReader reader = new BufferedReader(new InputStreamReader(
				conn.getInputStream()));
		String output = "";
		String inputLine;
		while ((inputLine = reader.readLine()) != null) {
			output += inputLine;
		}

		wr.close();
		reader.close();

		return output;

	}

	// HashMap() of Error and Array
	public static Hashtable convertCSVToJSONArray2(String csv,
			String duplicateFieldName) throws Exception {

		CSVReader reader = new CSVReader(new StringReader(csv.trim()));

		// Get Header Liner
		String[] headers = reader.readNext();
		if (headers == null) {
			System.out.println("Empty List");
			new Exception("Empty List");
		}

		// CSV Json Array
		JSONArray csvJSONArray = new JSONArray();

		// HashTable of keys to check duplicates - we will store all keys into
		// this hashtable and if there are any - we will exclude them
		Vector<String> keys = new Vector();
		Vector<String> duplicates = new Vector();

		String[] csvValues;
		while ((csvValues = reader.readNext()) != null) {
			JSONObject csvJSONObject = new JSONObject();

			boolean isDuplicate = false;
			for (int j = 0; j < csvValues.length; j++) {
				// Check if the header is same as duplicate name
				if (duplicateFieldName != null
						&& headers[j].equalsIgnoreCase(duplicateFieldName)) {
					System.out.println("If already present " + headers[j] + " "
							+ csvValues[j]);

					// Check if is already present in already imported items
					if (keys.contains(csvValues[j])) {
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

		// Put warning
		if (duplicateFieldName != null && duplicates.size() > 0) {
			resultHashtable.put("warning",
					"Duplicate Values (" + duplicates.size()
							+ ") were not imported " + duplicates);
		}

		System.out.println("Converted csv " + csv + " to " + resultHashtable);
		return resultHashtable;

	}

	// Get Calendar in Pacific
	public static String getCalendarString(long timeout) {
		// define output format and print
		SimpleDateFormat sdf = new SimpleDateFormat("d MMM yyyy hh:mm aaa");
		TimeZone pst = TimeZone.getTimeZone("PST");

		sdf.setTimeZone(pst);
		Calendar calendar = Calendar.getInstance();
		calendar.setTimeInMillis(timeout);

		String date = sdf.format(calendar.getTime());
		return date;
	}

	// Change Number
	public static String changeNumber(String number) {
		
		// Add if it does not start with 1 or +
		if (number.startsWith("+"))
			return number;

		if (number.startsWith("1"))
			return "+" + number;

		return "+1" + number;
	}

	// Get Name space count
	public static JSONObject getNamespaceCount() {

		
		
		
		DatastoreService datastore = DatastoreServiceFactory
				.getDatastoreService();
		
		Entity globalStat = datastore.prepare(new Query("__Stat_Total__")).asSingleEntity();
		Long totalBytes = (Long) globalStat.getProperty("bytes");
		Long totalEntities = (Long) globalStat.getProperty("count");		

		JSONObject statsJSON = new JSONObject();

		try {
			statsJSON.put("bytes", totalBytes);
			statsJSON.put("entities", totalEntities);
		} catch (Exception e) {

		}

		System.out.println("Total Bytes: " + totalBytes);
		System.out.println("Total Entities: " + totalEntities);

		return statsJSON;
	}

}
