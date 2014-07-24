package com.agilecrm.scribe.util;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import oauth.signpost.OAuthConsumer;
import oauth.signpost.basic.DefaultOAuthConsumer;
import oauth.signpost.commonshttp.CommonsHttpOAuthConsumer;
import oauth.signpost.exception.OAuthExpectationFailedException;
import oauth.signpost.exception.OAuthMessageSignerException;

import org.apache.commons.io.IOUtils;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;

public class SignpostUtil
{
	/**
	 * send request using oAuth
	 * 
	 * @param consumerKey
	 * @param consumerSecret
	 * @param accessToken
	 * @param tokenSecret
	 * @param endPointURL
	 * @param requestMethod
	 * @param postData
	 * @param pluginName
	 * @return
	 * @throws IOException
	 */
	public static String accessURLWithOauth(String consumerKey, String consumerSecret, String accessToken,
			String tokenSecret, String endPointURL, String requestMethod, String postData, String pluginName)
			throws IOException
	{
		System.out.print("conkey" + consumerKey + "consec" + consumerSecret + "access" + accessToken + "token"
				+ tokenSecret + "company" + endPointURL);
		HttpURLConnection request = null;
		BufferedReader rd = null;
		StringBuilder response = null;

		String errorMsg = "error: ";
		try
		{
			URL endpointUrl = new URL(endPointURL);
			request = (HttpURLConnection) endpointUrl.openConnection();

			requestMethod = (requestMethod.isEmpty()) ? "GET" : requestMethod;
			request.setRequestMethod(requestMethod);

			if (requestMethod.equalsIgnoreCase("GET") && pluginName.equalsIgnoreCase("xero"))
				request.setRequestProperty("Content-Type", "application/json");
			else
			{
				request.setDoInput(true);
				// changing from form encoding to application/json
				request.setRequestProperty("Content-Type", "application/json");
			}

			request.setRequestProperty("Content-Type", "application/json");
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

			if (!(postData == null || postData.isEmpty()))
			{
				OutputStreamWriter wr = new OutputStreamWriter(request.getOutputStream(),"UTF-8");
				wr.write(postData);
				wr.flush();
			}

			request.connect();
			System.out.println(request.getResponseCode());
			// removed some response code conditions for desk.com
			if (request.getResponseCode() == 400 || request.getResponseCode() == 401
					|| request.getResponseCode() == 500 || request.getResponseCode() == 404)
				rd = new BufferedReader(new InputStreamReader(request.getErrorStream(),"UTF-8"));
			else
				rd = new BufferedReader(new InputStreamReader(request.getInputStream(),"UTF-8"));

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
			List<NameValuePair> temp = new ArrayList<NameValuePair>();
			temp.add(new BasicNameValuePair("xml", postData));
			temp.add(new BasicNameValuePair("Content-Type", "application/x-www-form-urlencoded"));
			httpost.setEntity(new UrlEncodedFormEntity(temp));

			try
			{
				OAuthConsumer consumer = new CommonsHttpOAuthConsumer(consumerKey, consumerSecret);
				consumer.setTokenWithSecret(accessToken, tokenSecret);
				consumer.sign(httpost);
				System.out.println("consumer sign");
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
