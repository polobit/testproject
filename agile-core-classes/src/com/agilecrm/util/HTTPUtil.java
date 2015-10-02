package com.agilecrm.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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

	    // Set Connection Timeout as Google AppEngine has 5 secs timeout
	    conn.setConnectTimeout(600000);
	    conn.setReadTimeout(600000);

	    BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));

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
     * Connects to the remote object based on the given url and reads the
     * response to return
     * 
     * @return response of remote object
     */
    public static String accessURLToReadScript(String url, String requestMethod, String data)
    {
	try
	{
	    URL yahoo = new URL(url);
	    HttpURLConnection conn = (HttpURLConnection) yahoo.openConnection();

	    // Set Connection Timeout as Google AppEngine has 5 secs timeout
	    conn.setConnectTimeout(600000);
	    conn.setReadTimeout(600000);
	    conn.setDoOutput(true);
	    conn.setRequestMethod(requestMethod);

	    if (!StringUtils.isBlank(data))
	    {
		OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream());
		wr.write(data);
		wr.flush();
	    }

	    BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));

	    String output = "";
	    String inputLine;

	    while ((inputLine = reader.readLine()) != null)
	    {
		/*
	         * new line is added at the end of each line since it not
	         * appending a new line for enter
	         */
		output += inputLine;
	    }

	    reader.close();
	    System.out.println("script");
	    System.out.println(output);

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
    public static String accessURLUsingPost(String postURL, String data) throws Exception
    {
	// Send data
	URL url = new URL(postURL);
	HttpURLConnection conn = (HttpURLConnection) url.openConnection();
	conn.setDoOutput(true);

	// Set Connection Timeout as Google AppEngine has 5 secs timeout
	conn.setConnectTimeout(600000);
	conn.setReadTimeout(600000);
	
	OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream(), "UTF-8");
	if (data != null)
	{
	    wr.write(data);
	    wr.flush();
	}

	InputStream is = null;
	
    try
    {
    	is = conn.getInputStream();
    }
    catch(IOException ie)
    {
    	System.err.println("IOException occured, getting error stream.");
    	is = conn.getErrorStream();
    }
	
	// Get the response
	BufferedReader reader = new BufferedReader(new InputStreamReader(is, "UTF-8"));
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

    /**
     * Opens a HTTP connection and process request based on given method type
     * 
     * @param requestURL
     *            base URL to which connection is opened
     * @param data
     *            data to be posted with URL
     * @param methodType
     *            request method(GET,PUT or POST)
     * @return {@link String} response from server
     * @throws Exception
     */
    public static String accessHTTPURL(String requestURL, String data, String methodType) throws Exception
    {
	URL url;
	HttpURLConnection conn = null;

	// Send data
	url = new URL(requestURL);
	conn = (HttpURLConnection) url.openConnection();
	conn.setDoOutput(true);

	// Set Connection Timeout as Google AppEngine has 5 secs timeout
	conn.setConnectTimeout(600000);
	conn.setReadTimeout(600000);

	conn.setRequestMethod(methodType.toUpperCase());
	OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream(), "UTF-8");
	wr.write(data);
	wr.flush();

	// Get the response
	BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
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

    /**
     * This method makes request to the URL by authenticating the user with the
     * given parameters
     * 
     * @param postURL
     *            URL to connect with the server
     * @param username
     *            {@link String} username
     * @param password
     *            {@link String} password
     * @param requestMethod
     *            {@link String} request method
     * @param data
     *            {@link String} data to be posted
     * @param setContentLength
     *            {@link Boolean} whether to set content length for request
     * @param contentType
     *            {@link String} type of content to be posted
     * @param acceptType
     *            {@link String} type of output data expected
     * @return {@link String} response from server
     * @throws Exception
     *             If server throws an exception
     */
    public static String accessURLUsingAuthentication(String url, String username, String password,
	    String requestMethod, String data, boolean setContentLength, String contentType, String acceptType)
	    throws Exception
    {
	HttpURLConnection connection = null;

	URL accessUrl = new URL(url);
	connection = (HttpURLConnection) accessUrl.openConnection();

	// Set Connection Timeout as Google AppEngine has 5 secs timeout
	connection.setConnectTimeout(600000);
	connection.setReadTimeout(600000);

	connection.setDoOutput(true);

	System.out.println(username);
	System.out.println(password);

	if (!StringUtils.isBlank(username) && !StringUtils.isBlank(password))
	{
	    String userPass = Base64Encoder.encode((username + ":" + password).getBytes()).replace("\n", "");

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
	    /*
	     * If setContentLength is true, set content length as length of data
	     * in request
	     */
	    if (setContentLength)
		connection.setRequestProperty("Content-length", String.valueOf(data.length()));
	    OutputStreamWriter wr = new OutputStreamWriter(connection.getOutputStream());

	    wr.write(data);
	    wr.flush();
	    wr.close();
	}

	System.out.println("responseCode = " + connection.getResponseMessage());

	BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream(),"UTF8"));

	String output = "";
	String inputLine;

	// Read output
	while ((inputLine = reader.readLine()) != null)
	{
	    output += inputLine;
	}
	reader.close();

	System.out.println("output" + output);
	return output;
    }

    /**
     * Prints the entire request headers, parameters and content
     * 
     * @param request
     * @throws IOException
     */
    public void printRequest(HttpServletRequest request) throws IOException
    {
	{
	    System.out.println("--------------Headers---------------");
	    Enumeration en = request.getHeaderNames();
	    while (en.hasMoreElements())
	    {
		String val = en.nextElement().toString();
		System.out.println(val + " :");
		Enumeration en1 = request.getHeaders(val);
		while (en1.hasMoreElements())
		{
		    System.out.println("\t" + en1.nextElement());
		}
	    }
	}

	{
	    System.out.println("------------Parameters--------------");
	    Enumeration en = request.getParameterNames();
	    while (en.hasMoreElements())
	    {
		String val = en.nextElement().toString();
		System.out.println(val + " :");
		String[] en1 = request.getParameterValues(val);
		for (String val1 : en1)
		{
		    System.out.println("\t" + val1);
		}
	    }
	}

	System.out.println("---------------BODY--------------");
	BufferedReader is = request.getReader();
	String line;
	while ((line = is.readLine()) != null)
	{
	    System.out.println(line);
	}
	System.out.println("---------------------------------");

	System.out.println("ContentType: " + request.getContentType());
	System.out.println("ContentLength: " + request.getContentLength());
	System.out.println("characterEncodings: " + request.getCharacterEncoding());
	System.out.println("AuthType: " + request.getAuthType());

	System.out.println("ContextPath: " + request.getContextPath());
	System.out.println("Method: " + request.getMethod());
    }

    public static void writeResonse(HttpServletResponse response, String responseString)
    {
	try
	{
	    response.getWriter().write(responseString);
	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }

    public static String accessURLUsingPostForWebCalendar(String postURL, String data) throws Exception
    {
	// Send data
	URL url = new URL(postURL);
	URLConnection conn = url.openConnection();
	conn.setDoOutput(true);

	conn.setRequestProperty("Content-Type", "application/json");
	conn.setRequestProperty("Accept", "application/json");

	OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream(), "UTF-8");
	if (data != null)
	{
	    wr.write(data);
	    wr.flush();
	}

	// Get the response
	BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
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
}