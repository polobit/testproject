package com.agilecrm.util;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;

import org.apache.commons.lang.StringUtils;

/**
 * <code>HTTPUtil</code> is a utility class used to access data from remote
 * objects by connecting to those based on url
 * <p>
 * This utility class includes methods need to get data from, and post data to,
 * remote objects
 * </p>
 * 
 * @author
 * 
 */
public class HTTPUtil
{
    /**
     * Connects to the remote object based on the given url and reads the
     * response to return
     * 
     * @param url
     * @return response of remote object
     */
    public static String accessURL(String url)
    {
	try
	{
	    URL yahoo = new URL(url);
	    URLConnection conn = yahoo.openConnection();
	    conn.setConnectTimeout(60000);
	    conn.setReadTimeout(60000);

	    BufferedReader reader = new BufferedReader(new InputStreamReader(
		    conn.getInputStream()));

	    String output = "";
	    String inputLine;
	    while ((inputLine = reader.readLine()) != null)
	    {
		output += inputLine;
	    }
	    reader.close();
	    return output;
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println(e.getMessage());
	}
	return null;
    }

    /**
     * Connects to the remote object to write (post) the given data and reads
     * the response of it to return
     * 
     * @param postURL
     * @param data
     * @return response of the remote object
     * @throws Exception
     */
    public static String accessURLUsingPost(String postURL, String data)
	    throws Exception
    {
	// Send data
	URL url = new URL(postURL);
	URLConnection conn = url.openConnection();
	conn.setDoOutput(true);
	OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream());
	if (data != null)
	{
	    wr.write(data);
	    wr.flush();
	}

	// Get the response
	BufferedReader reader = new BufferedReader(new InputStreamReader(
		conn.getInputStream()));
	String output = "";
	String inputLine;
	while ((inputLine = reader.readLine()) != null)
	{
	    output += inputLine;
	}

	wr.close();
	reader.close();

	return output;
    }

    public static String accessHTTPURL(String postURL, String data,
	    String methodType) throws Exception
    {
	URL url;
	HttpURLConnection conn = null;

	// try
	// {
	// Send data
	url = new URL(postURL);
	conn = (HttpURLConnection) url.openConnection();
	conn.setDoOutput(true);
	// conn.setRequestProperty("Content-Type", "application/json");
	conn.setRequestMethod(methodType.toUpperCase());
	OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream());
	wr.write(data);
	wr.flush();

	// Get the response
	BufferedReader reader = new BufferedReader(new InputStreamReader(
		conn.getInputStream()));
	String output = "";
	String inputLine;
	while ((inputLine = reader.readLine()) != null)
	{
	    output += inputLine;
	}

	wr.close();
	reader.close();

	return output;
	// }
	// catch (Exception e)
	// {
	// System.out.println(e.getMessage());
	// System.out.println(conn.getResponseCode());
	// throw new Exception(conn.getResponseMessage());
	// }
    }

    /**
     * This method makes POST request to the URL by authenticating the user with
     * the given parameters
     * 
     * @param postURL
     *            URL to connect with the server
     * @param username
     *            {@link String} username
     * @param password
     *            {@link String} password
     * @param data
     *            {@link String} data to be posted
     * @return {@link String} response from server
     * @throws Exception
     *             If server throws an exception
     */
    public static String accessURLUsingAuthentication(String postURL,
	    String username, String password, String data, String contentType,
	    String requestMethod, String acceptType) throws Exception
    {
	HttpURLConnection connection = null;

	URL yahoo = new URL(postURL);
	connection = (HttpURLConnection) yahoo.openConnection();

	System.out.println(username);
	System.out.println(password);

	if (!StringUtils.isBlank(username) && !StringUtils.isBlank(password))
	{
	    String userPass = Base64Encoder.encode(
		    (username + ":" + password).getBytes()).replace("\n", "");

	    // Authorization with CRM API
	    connection.setRequestProperty("Authorization", "Basic " + userPass);
	}

	connection.setDoOutput(true);

	requestMethod = (requestMethod == null) ? "GET" : requestMethod;
	connection.setRequestMethod(requestMethod);

	contentType = (contentType == null) ? "text/plain" : contentType;
	connection.setRequestProperty("Content-type", contentType);

	if (acceptType != null)
	    connection.setRequestProperty("accept", acceptType);

	if (data != null)
	{
	    OutputStreamWriter wr = new OutputStreamWriter(
		    connection.getOutputStream());

	    wr.write(data);
	    wr.flush();
	    wr.close();
	}

	System.out.println("responseCode = " + connection.getResponseMessage());

	BufferedReader reader = new BufferedReader(new InputStreamReader(
		connection.getInputStream()));

	String output = "";
	String inputLine;
	while ((inputLine = reader.readLine()) != null)
	{
	    output += inputLine;
	}
	reader.close();

	System.out.println("outpiut" + output);
	return output;
    }

    /**
     * This method makes POST request to the URL by authenticating the user with
     * the given parameters
     * 
     * @param postURL
     *            URL to connect with the server
     * @param username
     *            {@link String} username
     * @param password
     *            {@link String} password
     * @param data
     *            {@link String} data to be posted
     * @return {@link String} response from server
     * @throws Exception
     *             If server throws an exception
     */
    public static String accessURL(String postURL, String username,
	    String password, String requestMethod, String data,
	    String contentLength, String contentType, String acceptType)
	    throws Exception
    {
	HttpURLConnection connection = null;

	URL url = new URL(postURL);
	connection = (HttpURLConnection) url.openConnection();
	connection.setConnectTimeout(60000);
	connection.setReadTimeout(60000);
	connection.setDoOutput(true);

	System.out.println(username);
	System.out.println(password);

	if (!StringUtils.isBlank(username) && !StringUtils.isBlank(password))
	{
	    String userPass = Base64Encoder.encode(
		    (username + ":" + password).getBytes()).replace("\n", "");

	    // Authorization with CRM API
	    connection.setRequestProperty("Authorization", "Basic " + userPass);
	}

	requestMethod = (requestMethod == null) ? "GET" : requestMethod;
	connection.setRequestMethod(requestMethod);

	if (!StringUtils.isBlank(contentType))
	    connection.setRequestProperty("Content-type", contentType);

	if (!StringUtils.isBlank(acceptType))
	    connection.setRequestProperty("accept", acceptType);

	if (!StringUtils.isBlank(data))
	{
	    if (contentLength != null)
		connection.setRequestProperty("Content-length",
			String.valueOf(data.length()));
	    OutputStreamWriter wr = new OutputStreamWriter(
		    connection.getOutputStream());

	    wr.write(data);
	    wr.flush();
	    wr.close();
	}

	System.out.println("responseCode = " + connection.getResponseMessage());

	BufferedReader reader = new BufferedReader(new InputStreamReader(
		connection.getInputStream()));

	String output = "";
	String inputLine;
	while ((inputLine = reader.readLine()) != null)
	{
	    output += inputLine;
	}
	reader.close();

	System.out.println("outpiut" + output);
	return output;
    }

}
