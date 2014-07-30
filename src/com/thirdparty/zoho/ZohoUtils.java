package com.thirdparty.zoho;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import com.thirdparty.google.ContactPrefs;

public class ZohoUtils
{

    /**
     * <code>getConnection</code> method take string param as url and open
     * connection
     * 
     * @param url
     * @return URLConnection object
     */

    public static URLConnection getConnection(String url)
    {
	URLConnection con = null;
	try
	{
	    URL uri = new URL(url);
	    con = uri.openConnection();
	    con.connect();

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return con;
    }

    public static JSONArray getData(String url)
    {
	JSONArray data = new JSONArray();
	try
	{
	    URLConnection con = getConnection(url);
	    BufferedReader result = new BufferedReader(new InputStreamReader(con.getInputStream()));
	    String line;
	    while ((line = result.readLine()) != null)
	    {
		data.put(new JSONParser().parse(line));
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return data;
    }

    /**
     * This method fetch all leads from zoho CRM
     * 
     * @param ctx
     *            is user contactPrefs
     * @param i
     *            is Starting index from which is start fetching records
     * @param time
     *            is string format of time use for fetch records after a
     *            particular time interval default value is null.
     * @return
     */
    public static String getZohoLeads(ContactPrefs ctx, int i, String time)
    {

	JSONArray data = new JSONArray();
	try
	{
	    String url = buildUrl("Leads", ctx, i, i + 200, time);
	    System.out.println(url);
	    URLConnection con = getConnection(url);
	    BufferedReader result = new BufferedReader(new InputStreamReader(con.getInputStream()));
	    String line;
	    while ((line = result.readLine()) != null)
	    {
		data.put(new JSONParser().parse(line));
	    }

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return data.toString();
    }

    /**
     * This method fetch all Accounts from zoho CRM
     * 
     * @param ctx
     *            is user contactPrefs
     * @param i
     *            is Starting index from which is start fetching records
     * @param time
     *            is string format of time use for fetch records after a
     *            particular time interval default value is null.
     * @return
     */
    public static String getAccounts(ContactPrefs ctx, int index, String time)
    {
	JSONArray data = new JSONArray();

	String url = buildUrl("Accounts", ctx, index, index + 200, time);
	System.out.println(url);
	try
	{
	    URLConnection con = getConnection(url);
	    BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream()));
	    String line;
	    while ((line = br.readLine()) != null)
	    {
		data.put(new JSONParser().parse(line));
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return data.toString();
    }

    /**
     * fetching all cases from zoho crm
     * 
     * @param ctx
     * @return
     */
    public static String getCases(ContactPrefs ctx)
    {
	// TODO: jitendra implement later
	return null;
    }

    public static String getEvents(ContactPrefs ctx, String time)
    {
	// TODO: jitendra implement later

	return null;
    }

    public static String getTask(ContactPrefs ctx)
    {
	// TODO: jitendra implement later

	return null;
    }

    /**
     * fetching contacts from zoho crm
     * 
     * @param ctx
     * @param index
     * @param time
     * @return
     */
    public static String getContacts(ContactPrefs ctx, int index, String time)
    {

	JSONArray data = new JSONArray();

	String url = buildUrl("Contacts", ctx, index, index + 200, time);
	try
	{
	    URLConnection con = getConnection(url);
	    BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream()));
	    String line;
	    while ((line = br.readLine()) != null)
	    {
		data.put(new JSONParser().parse(line));
	    }
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}
	return data.toString();
    }

    /**
     * This is static method used for materialize url with different parameter
     * it will accept zoho module name ,fromIndex,toIndex and last modified time
     * 
     * @param module
     *            this value depends on zoho crm it can be
     *            (Accounts,Leads,Contacts... etc)
     * @param ctx
     * @param fromIndex
     * @param toIndex
     * @param time
     * @return string form of url
     */
    public static String buildUrl(String module, ContactPrefs ctx, int fromIndex, int toIndex, String time)
    {
	/*StringBuilder url = new StringBuilder(SERVER_URL).append(module + "/getRecords?")
		.append("authtoken=" + ctx.token).append("&fromIndex=" + fromIndex + "&toIndex=" + toIndex)
		.append("&scope=crmapi").append("&lastModifiedTime=" + time);*/

	return "";//url.toString();
    }

    /**
     * This method will test if zoho crm has more records
     * 
     * @param url
     * @return it will return true if more records are there and false it not
     * @throws JSONException
     */

    public static boolean hasMore(String url) throws JSONException
    {

	String record;
	JSONArray response = new JSONArray();
	try
	{
	    URLConnection con = getConnection(url);
	    BufferedReader reader = new BufferedReader(new InputStreamReader(con.getInputStream()));
	    while ((record = reader.readLine()) != null)
	    {
		try
		{
		    response.put(new JSONParser().parse(record));
		    String res = response.get(0).toString();
		    JSONObject result = new JSONObject(new JSONObject(res).get("response").toString());
		    if (result.has("result"))
			return true;
		    if (result.has("error") || result.has("nodata"))
			return false;

		}
		catch (ParseException e)
		{
		    e.printStackTrace();
		}

	    }
	}
	catch (IOException e)
	{
	    e.printStackTrace();
	}
	return false;

    }

}
