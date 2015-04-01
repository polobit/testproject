
/**
 * @author jitendra
 * @since 2014
 */
package com.thirdparty.freshbooks;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import oauth.signpost.OAuthConsumer;
import oauth.signpost.basic.DefaultOAuthConsumer;
import oauth.signpost.commonshttp.CommonsHttpOAuthConsumer;
import oauth.signpost.exception.OAuthExpectationFailedException;
import oauth.signpost.exception.OAuthMessageSignerException;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;

import com.agilecrm.util.Base64Encoder;

public class FreshbooksConnectionUtil
{
    
    /**
	 * This method makes a connection to the server
	 * 
	 * @param postURL
	 *            URL to connect with the server
	 * @param data
	 *            Data to be posted through the request
	 * 
	 * @return response returned from the server
	 * @throws Exception
	 *             If the server returns an exception
	 */
	public static String accessURLUsingPost(String postURL, String data, String contentType) throws Exception
	{
		// Send data
		URL url = new URL(postURL);
		URLConnection conn = url.openConnection();
		conn.setDoOutput(true);
		conn.setConnectTimeout(60000);
		conn.setReadTimeout(60000);
		if (contentType != null)
			conn.setRequestProperty("Content-Type", contentType);

		OutputStreamWriter wr = new OutputStreamWriter(conn.getOutputStream());
		wr.write(data);
		wr.flush();

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

	/**
	 * This method makes a HTTP connection to the server
	 * 
	 * @param getUrl
	 *            URL to connect with the server
	 * @param data
	 *            Data to be posted through the request
	 * @param methodType
	 *            HTTP request method type
	 * @return response returned from the server
	 * @throws Exception
	 *             If the server returns an exception
	 */
	public static String sendHTTP(String getUrl, String data, String methodType) throws Exception
	{
		URL url = new URL(getUrl);
		HttpURLConnection connection = (HttpURLConnection) url.openConnection();

		connection.setDoOutput(true);
		connection.setConnectTimeout(60000);
		connection.setReadTimeout(60000);
		connection.setRequestMethod(methodType.toUpperCase());

		if (data != null)
		{
			OutputStreamWriter wr = new OutputStreamWriter(connection.getOutputStream());
			wr.write(data);
			wr.flush();
			wr.close();
		}

		if (methodType.equalsIgnoreCase("GET"))
		{
			BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));

			String output = "";
			String inputLine;
			while ((inputLine = reader.readLine()) != null)
			{
				output += inputLine;
			}
			reader.close();
			return output;
		}

		return connection.getResponseCode() + "";
	}

	/**
	 * This method makes a URL connection to the server
	 * 
	 * @param url
	 *            URL to connect with the server
	 * @return {@link String} response returned from the server
	 * @throws Exception
	 *             If the server returns an exception
	 */
	public static String accessURL(String url) throws Exception
	{
		URL yahoo = new URL(url);
		URLConnection conn = yahoo.openConnection();
		conn.setConnectTimeout(600000);
		conn.setReadTimeout(600000);

		BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));

		String output = "";
		String inputLine;
		while ((inputLine = reader.readLine()) != null)
		{
			output += inputLine;
		}
		reader.close();
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
	public static String accessUrlusingAuthentication(String postURL, String username, String password, String data,
			String contentType, String requestMethod) throws Exception
	{
		HttpURLConnection connection = null;

		URL url = new URL(postURL);
		connection = (HttpURLConnection) url.openConnection();

		if (!StringUtils.isEmpty(username) && !StringUtils.isEmpty(password))
		{
			String userPass = Base64Encoder.encode((username + ":" + password).getBytes()).replace("\n", "");
			System.out.println(userPass);
			// Authorization with CRM API
			connection.setRequestProperty("Authorization", "Basic " + userPass);
		}

		connection.setDoOutput(true);
		connection.setConnectTimeout(60000);
		connection.setReadTimeout(60000);

		requestMethod = (requestMethod == null) ? "GET" : requestMethod;
		connection.setRequestMethod(requestMethod);

		contentType = (contentType == null) ? "text/plain" : contentType;
		connection.setRequestProperty("Content-type", contentType);

		if (data != null)
		{
			OutputStreamWriter wr = new OutputStreamWriter(connection.getOutputStream());

			wr.write(data);
			wr.flush();
			wr.close();
		}

		System.out.println("responseCode = " + connection.getResponseMessage() + connection.getResponseCode());

		BufferedReader reader;

		int responseCode = connection.getResponseCode();

		if (responseCode == 200 || responseCode == 201 || responseCode == 204)
		{
			System.out.println("Location: " + connection.getHeaderField("Location"));
			reader = new BufferedReader(new InputStreamReader(connection.getInputStream(),"utf-8"));
		}
		else
			reader = new BufferedReader(new InputStreamReader(connection.getErrorStream(),"utf-8"));

		String output = "";
		String inputLine;
		while ((inputLine = reader.readLine()) != null)
		{
			output += inputLine;
		}
		reader.close();

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
	public static String accessUrlusingAccessToken(String postURL, String accessToken, String data, String contentType,
			String requestMethod, Map<String, String> headers) throws Exception
	{
		HttpURLConnection connection = null;

		URL url = new URL(postURL);
		connection = (HttpURLConnection) url.openConnection();

		for (Map.Entry<String, String> header : headers.entrySet())
		{
			connection.setRequestProperty(header.getKey(), header.getValue());
		}

		if (!StringUtils.isEmpty(accessToken ))
			connection.setRequestProperty("Authorization", "Bearer " + accessToken);

		connection.setDoOutput(true);
		connection.setConnectTimeout(60000);
		connection.setReadTimeout(60000);

		requestMethod = (requestMethod == null) ? "GET" : requestMethod;
		connection.setRequestMethod(requestMethod);

		contentType = (contentType == null) ? "text/plain" : contentType;
		connection.setRequestProperty("Content-type", contentType);

		if (data != null)
		{
			OutputStreamWriter wr = new OutputStreamWriter(connection.getOutputStream());

			wr.write(data);
			wr.flush();
			wr.close();
		}

		System.out.println("responseCode = " + connection.getResponseMessage() + connection.getResponseCode());

		BufferedReader reader;

		int responseCode = connection.getResponseCode();

		if (responseCode == 200 || responseCode == 201 || responseCode == 204)
		{
			System.out.println("Location: " + connection.getHeaderField("Location"));
			reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
		}
		else
			reader = new BufferedReader(new InputStreamReader(connection.getErrorStream()));

		String output = "";
		String inputLine;
		while ((inputLine = reader.readLine()) != null)
		{
			output += inputLine;
		}
		reader.close();

		return output;
	}

	public static String accessURLWithOauth(String consumerKey, String consumerSecret, String accessToken,
			String tokenSecret, String endPointURL, String requestMethod, String postData, String pluginName)
			throws IOException
	{
		HttpURLConnection request = null;
		BufferedReader rd = null;
		StringBuilder response = null;

		String errorMsg = "error: ";
		try
		{
			URL endpointUrl = new URL(endPointURL);
			request = (HttpURLConnection) endpointUrl.openConnection();

			requestMethod = (StringUtils.isEmpty(requestMethod)) ? "GET" : requestMethod;
			request.setRequestMethod(requestMethod);

			if (requestMethod.equalsIgnoreCase("GET") && pluginName.equalsIgnoreCase("xero"))
				request.setRequestProperty("Content-Type", "application/json");
			else
			{
				request.setDoInput(true);
				// changing from form encoding to application/json
				request.setRequestProperty("Content-Type", "application/json");
			}

			request.setRequestProperty("Accept", "application/json");
			request.setDoOutput(true);

			try
			{
				OAuthConsumer consumer = new DefaultOAuthConsumer(consumerKey, consumerSecret);
				consumer.setTokenWithSecret(accessToken, tokenSecret);
				consumer.sign(request);
			}
			catch (OAuthMessageSignerException ex)
			{
				System.out.println("OAuth Signing failed - " + ex.getMessage());
				errorMsg += "OAuthMessageSignerException " + ex.getMessage();
			}
			catch (OAuthExpectationFailedException ex)
			{
				System.out.println("OAuth failed - " + ex.getMessage());
				errorMsg += "OAuthMessageSignerException " + ex.getMessage();
			}

			if (!StringUtils.isEmpty( postData))
			{
				// write data
				DataOutputStream wr = new DataOutputStream(request.getOutputStream());
				wr.writeBytes(postData);
				wr.flush();
				wr.close();
			}

			request.connect();
			System.out.println(request.getResponseCode());
			// removed some response code conditions for desk.com
			if (request.getResponseCode() == 400 || request.getResponseCode() == 401
					|| request.getResponseCode() == 500 || request.getResponseCode() == 404)
				rd = new BufferedReader(new InputStreamReader(request.getErrorStream()));
			else
				rd = new BufferedReader(new InputStreamReader(request.getInputStream()));

			response = new StringBuilder();
			String line = null;
			while ((line = rd.readLine()) != null)
			{
				response.append(line + '\n');
			}
		}
		catch (Exception e)
		{
			System.out.println("Exception: " + e.getMessage());
			e.printStackTrace();
			errorMsg += "Exception " + e.getMessage();
		}
		finally
		{
			try
			{
				request.disconnect();
			}
			catch (Exception e)
			{
			}

			if (rd != null)
			{
				try
				{
					rd.close();
				}
				catch (IOException ex)
				{
				}
				rd = null;
			}
		}

		if (response != null)
			return response.toString();

		return errorMsg;
	}

	public static String postDataWithOauth(String consumerKey, String consumerSecret, String accessToken,
			String tokenSecret, String endPointURL, String requestMethod, String postData) throws IOException
	{
		String errorMsg = "error: ";
		String response = "";
		try
		{
			// Creating an instance of HttpPost.
			HttpPost httpost = new HttpPost(endPointURL);
			List<NameValuePair> nvps = new ArrayList<NameValuePair>();
			nvps.add(new BasicNameValuePair("xml", postData));

			httpost.setEntity(new UrlEncodedFormEntity(nvps));

			try
			{
				OAuthConsumer consumer = new CommonsHttpOAuthConsumer(consumerKey, consumerSecret);
				consumer.setTokenWithSecret(accessToken, tokenSecret);
				consumer.sign(httpost);
			}
			catch (OAuthMessageSignerException ex)
			{
				System.out.println("OAuth Signing failed - " + ex.getMessage());
				errorMsg += "OAuthMessageSignerException " + ex.getMessage();
			}
			catch (OAuthExpectationFailedException ex)
			{
				System.out.println("OAuth failed - " + ex.getMessage());
				errorMsg += "OAuthMessageSignerException " + ex.getMessage();
			}

			// send the request
			HttpClient httpClient = new DefaultHttpClient();
			HttpResponse httpResponse = httpClient.execute(httpost);
			System.out.println(httpResponse.getStatusLine().getStatusCode());

			response = IOUtils.toString(httpResponse.getEntity().getContent());
		}
		catch (Exception e)
		{
			System.out.println("Exception: " + e.getMessage());
			e.printStackTrace();
			errorMsg += "Exception " + e.getMessage();
		}

		return response;
	}


}
