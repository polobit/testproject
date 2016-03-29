package com.agilecrm.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.conn.ClientConnectionManager;
import org.apache.http.conn.scheme.PlainSocketFactory;
import org.apache.http.conn.scheme.Scheme;
import org.apache.http.conn.scheme.SchemeRegistry;
import org.apache.http.conn.ssl.SSLSocketFactory;
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
	schemeRegistry.register(new Scheme("https",SSLSocketFactory.getSocketFactory(),443));
	
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
    public static void accessPostURLUsingHttpClient(String url, String contentType, String postData)
    {
	try
	{
	    HttpPost postRequest = new HttpPost(url);

	    StringEntity input = new StringEntity(postData, "UTF-8");
	    
	    
	    if(StringUtils.isNotBlank(contentType))
	    	input.setContentType(contentType);
	    
	    postRequest.setEntity(input);
	    
	    long startTime = System.currentTimeMillis();
	    HttpResponse response = httpClient.execute(postRequest);
	    System.out.println("Request time taken..." + (System.currentTimeMillis() - startTime));

	    BufferedReader br = new BufferedReader(new InputStreamReader((response.getEntity().getContent())));

	    StringBuffer sb = new StringBuffer();
	    String output;

	    while ((output = br.readLine()) != null)
	    {
		sb.append(output);
	    }

	    br.close();

	    System.out.println("Response:  " + sb.toString());
	}
	catch (Exception e)
	{
	    System.err.println("Exception occured in HttpClientUtil..." + e.getMessage());

	    e.printStackTrace();

	    System.err.println("Sending again normally...");

	    try
	    {
		String response = HTTPUtil.accessURLUsingPost(url, postData);

		System.out.println("Response in HttpClientUtil..." + response);
	    }
	    catch (Exception e1)
	    {
		e1.printStackTrace();
		System.err.println("Exception occured in HttpClientUtil while sending again..." + e1.getMessage());
	    }
	}
    }
    
    public static String accessURLUsingHttpClient(URLBuilder urlBuilder, HttpEntity httpEntity)
    {
    	HttpUriRequest request = null;
    	BufferedReader br = null;
    	
    	try
    	{
    		if(urlBuilder.getMethod().equalsIgnoreCase("GET"))
    			request = new HttpGet(urlBuilder.getURL());
    		
    		if(urlBuilder.getMethod().equalsIgnoreCase("POST"))
    		{
    			request = new HttpPost(urlBuilder.getURL());
    			((HttpPost)request).setEntity(httpEntity);
    		}
    		
    		// Iterates each header and add to request
    		if(!urlBuilder.getHeaders().isEmpty())
    		{
    			for(Map.Entry<String, String> entry: urlBuilder.getHeaders().entrySet())
    			{
    				request.setHeader(entry.getKey(), entry.getValue());
    			}
    		}
    		
    		HttpResponse response = httpClient.execute(request);

    		System.out.println(response.getStatusLine().getStatusCode());
    		System.out.println(response.getStatusLine().getReasonPhrase());
		    br = new BufferedReader(new InputStreamReader((response.getEntity().getContent())));

		    StringBuffer sb = new StringBuffer();
		    String output;

		    while ((output = br.readLine()) != null)
		    {
		    	sb.append(output);
		    }

		    return sb.toString();
    		
    	}
    	catch(Exception e)
    	{
    		e.printStackTrace();
    		System.err.println("Exception occured while sending request..." + e.getMessage());
    		return null;
    	}
    	
    	finally
    	{
    		 try
			{
				br.close();
			}
			catch (IOException e)
			{
				e.printStackTrace();
			}
    	}
    }
    
  public static class URLBuilder
    {
    	private String url;
    	private String contentType;
    	private String method = "GET";
    	
    	private Map<String, String> headers = new LinkedHashMap<String, String>();
    	
    	public final String USER_AGENT = "User-Agent";
    	public final String AUTHORIZATION = "Authorization";
    	
    	public URLBuilder(String url)
    	{
    		this.url = url;
    	}
    	
    	public String getContentType()
		{
			return contentType;
		}

		public void setContentType(String contentType)
		{
			this.contentType = contentType;
		}

		public String getMethod()
		{
			return method;
		}

		public void setMethod(String method)
		{
			this.method = method;
		}

    	public void setURL(String url)
    	{
    		this.url = url;
    	}
    	
    	public String getURL()
    	{
    		return url;
    	}
    	
    	public void setHeaders(Map<String, String> headers)
    	{
    		this.headers = headers;
    	}
    	
    	public Map<String, String> getHeaders()
    	{
    		return headers;
    	}
    	
    	
    }
}
