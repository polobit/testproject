package com.agilecrm.util;

import java.io.BufferedReader;
import java.io.InputStreamReader;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.conn.ClientConnectionManager;
import org.apache.http.conn.scheme.PlainSocketFactory;
import org.apache.http.conn.scheme.Scheme;
import org.apache.http.conn.scheme.SchemeRegistry;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.conn.tsccm.ThreadSafeClientConnManager;
import org.apache.http.params.BasicHttpParams;
import org.apache.http.params.HttpParams;

/**
 * <code>HttpClientUtil</code> is the utility class that handles URL requests
 * through HttpClient.
 * 
 * @author Naresh
 * 
 */
public class HttpClientUtil
{
    public static HttpClient httpClient;

    static
    {
	HttpParams httpParams = new BasicHttpParams();

	SchemeRegistry schemeRegistry = new SchemeRegistry();
	schemeRegistry.register(new Scheme("http", PlainSocketFactory.getSocketFactory(), 80));

	ClientConnectionManager connManager = new ThreadSafeClientConnManager(httpParams, schemeRegistry);

	httpClient = new DefaultHttpClient(connManager, httpParams);
    }

    /**
     * Connects with remote server with given url and post data using HttpClient
     * 
     * @param url
     *            - HTTP Post Url
     * @param postData
     *            - post data
     */
    public static void accessPostURLUsingHttpClient(String url, String postData)
    {
	try
	{
	    HttpPost postRequest = new HttpPost(url);

	    StringEntity input = new StringEntity(postData, "UTF-8");
	    input.setContentType("application/json");
	    postRequest.setEntity(input);

	    HttpResponse response = httpClient.execute(postRequest);

	    BufferedReader br = new BufferedReader(new InputStreamReader((response.getEntity().getContent())));

	    StringBuffer sb = new StringBuffer();
	    String output;

	    while ((output = br.readLine()) != null)
	    {
		sb.append(output);
	    }

	    br.close();

	    System.out.println("Size of postData is..." + postData.length());

	    System.out.println("Response:  " + sb.toString());
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured in HttpClientUtil..." + e.getMessage());

	    e.printStackTrace();

	    System.err.println("Sending again normally...");

	    System.out.println("Size of postData in exception is..." + postData.length());

	    try
	    {
		String response = HTTPUtil.accessURLUsingPost(url, postData);

		System.out.println("Mandrill response in HttpClientUtil..." + response);
	    }
	    catch (Exception e1)
	    {
		e1.printStackTrace();
		System.err.println("Exception occured in HttpClientUtil while sending again..." + e1.getMessage());
	    }
	}
    }
}
