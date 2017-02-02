package com.thirdparty.sendgrid.subusers;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.entity.StringEntity;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.AgileQueues;
import com.agilecrm.Globals;
import com.agilecrm.account.EmailGateway;
import com.agilecrm.account.util.AccountPrefsUtil;
import com.agilecrm.sendgrid.util.SendGridUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.AgileGlobalPropertiesUtil;
import com.agilecrm.util.Base64Encoder;
import com.agilecrm.util.EncryptDecryptUtil;
import com.agilecrm.util.HTTPUtil;
import com.agilecrm.util.HttpClientUtil;
import com.campaignio.reports.DateUtil;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.thirdparty.sendgrid.SendGrid;
import com.thirdparty.sendgrid.deferred.SendGridSubAccountDeferred;
import com.thirdparty.sendgrid.lib.SendGridException;
import com.thirdparty.sendgrid.lib.SendGridLib;
import com.thirdparty.sendgrid.webhook.util.SendGridWebhookUtil;

public class SendGridSubUser extends SendGridLib
{
	//SubUser Attributes
	final String SUB_USER_NAME = "username";
	final String SUB_USER_EMAIL = "email";
	final String SUB_USER_PASSWORD = "password";
	final String SUB_USER_IPS = "ips";

	public final static String AGILE_SUB_USER_NAME_TOKEN = ".agilecrm";
	public final static String AGILE_SUB_USER_PWD_TOKEN = "@127";
	public final static String AGILE_SUB_USER_PWD_PREPEND = ".agile";
	
	//Stats Attributes
	
	final static String EMAIL_SENT = "requests";
	final static String HARD_BOUNCE = "bounces";
	final static String SOFT_BOUNCE = "deferred";
	final static String SPAM_REPORT = "spam_reports";
	final static String REJECTED = "invalid_emails";
	public final static String REPUTATION = "reputation";
	
	// 01-MARCH-2016
	final static long SEND_GRID_TIMESTAMP=1456805583000L;
	
	//26-JAN-2017
	public final static long DOMAIN_CREATED_TIME = 1485498264L;
	
	// Perday email sent limit if reputation is low
	public static final long PER_DAY_EMAIL_SENT_LIMIT = 1000L;
	
	public SendGridSubUser(String username, String password)
	{
		super(username, password);
		this.setEndpoint("/v3/subusers");
	}
	
	/**
	 * @param subUser
	 * @return
	 * @throws Exception 
	 */
	public String createSubUser(SubUser subUser) throws Exception
	{
    	HttpClientUtil.URLBuilder urlBuilder = new HttpClientUtil.URLBuilder(super.url + super.endpoint);
    	urlBuilder.setMethod("POST");
    	
    	Map<String, String> headers = new HashMap<String, String>();
        headers.put("Authorization", "Basic " + Base64Encoder.encode(super.username + ":" + super.password));
    	headers.put("Content-Type", "application/json");
    	urlBuilder.setHeaders(headers);
    	
    	String response = HttpClientUtil.accessURLUsingHttpClient(urlBuilder, this.buildBody(subUser));
    	
    	System.out.println("Response " + response);
    	
    	return response;
	}
	
	/**
	 * @param subUser
	 * @return
	 */
	public String addWebhookURL(SubUser subUser)
	{
		String webhookResponse = SendGridWebhookUtil.addWebhook(subUser.getName(), subUser.getPassword());
		
		System.out.println("SendGrid Webhook response after creating subUser is " + webhookResponse);
		
		return webhookResponse;
	}
	
	public String associateAgileWhiteLabel(SubUser subUser) throws Exception
	{
		//String DEFAULT_WHITELABEL_ID = "455116";//email.agilecrm.com
		String DEFAULT_WHITELABEL_ID = "933254";//mailagile-server.net
		String url = "https://api.sendgrid.com/v3/whitelabel/domains/"+DEFAULT_WHITELABEL_ID+"/subuser";
		
		
		HttpClientUtil.URLBuilder urlBuilder = new HttpClientUtil.URLBuilder(url);
    	urlBuilder.setMethod("POST");
    	
    	Map<String, String> headers = new HashMap<String, String>();
        headers.put("Authorization", "Basic " + Base64Encoder.encode(super.username + ":" + super.password));
    	headers.put("Content-Type", "application/json");
    	urlBuilder.setHeaders(headers);
    	
    	String response = null;
    	try
		{
    		JSONObject requestJSON = new JSONObject();
			requestJSON.put("username", subUser.getName());
    	
			response = HttpClientUtil.accessURLUsingHttpClient(urlBuilder, new StringEntity(requestJSON.toString()));
		}
		catch (JSONException e)
		{
			e.printStackTrace();
		}
		catch (UnsupportedEncodingException e)
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    	
    	return response;
		
	}
	
	public HttpEntity buildBody(SubUser subUser) throws UnsupportedEncodingException
	{
		JSONObject json = new JSONObject();
		
		try{
		 
		 if(StringUtils.isNotBlank(subUser.getName()))
			json.put(SUB_USER_NAME, subUser.getName());
		 
		 if(StringUtils.isNotBlank(subUser.getEmail()))
			 json.put(SUB_USER_EMAIL, subUser.getEmail());

		 if(StringUtils.isNotBlank(subUser.getPassword()))
			 json.put(SUB_USER_PASSWORD, subUser.getPassword());
		 
		 if(StringUtils.isNotBlank(subUser.getIps().toString()))
			 json.put(SUB_USER_IPS, subUser.getIps());
		}catch(Exception e)
		{
			e.printStackTrace();
		}
		 
		 return new StringEntity(json.toString());
	}
	
	public static class SubUser
	{
		private String name;
		private String password;
		private String email;
		private List<String> ips;
		
		public SubUser()
		{
			this.ips = new ArrayList<String>();
			ips.add("167.89.30.173");
		}
		
		public String getName()
		{
			return name;
		}

		public void setName(String name)
		{
			this.name = name;
		}

		public String getPassword()
		{
			return password;
		}

		public void setPassword(String password)
		{
			this.password = password;
		}

		public String getEmail()
		{
			return email;
		}

		public void setEmail(String email)
		{
			this.email = email;
		}

		public List<String> getIps()
		{
			return ips;
		}

		public void setIps(List<String> ips)
		{
			this.ips = ips;
		}
		
		/* (non-Javadoc)
		 * @see java.lang.Object#toString()
		 */
		public String toString()
		{
			return "SubUser name is " +  name + " Password is " + password + " Email is " + email;
		}
		
	}
	
	public static String getAgileSubUserName(String domain) throws IllegalArgumentException
	{
		if(StringUtils.isNotBlank(domain))
			return domain + AGILE_SUB_USER_NAME_TOKEN;
		
		throw new IllegalArgumentException("Domain " + domain + " is not valid.");
	}
	
	/**
	 * SendGrid password should be 8 characters length. Related URL is 
	 * https://sendgrid.com/docs/Classroom/Basics/Security/password.html
	 * 
	 * @param domain
	 * @return
	 * @throws IllegalArgumentException
	 */
	public static String getAgileSubUserPwd(String domain) throws IllegalArgumentException
	{
		String pwd = null;
		
		if(StringUtils.isNotBlank(domain))
		{
			// Gets password from Datastore
			pwd = AgileGlobalPropertiesUtil.getGlobalSendGridSubUserPwd();

			if(StringUtils.isNotBlank(pwd))
				return EncryptDecryptUtil.encrypt(pwd + domain);
			
			if(domain.length() <= 3)
				return domain +  AGILE_SUB_USER_PWD_PREPEND + AGILE_SUB_USER_PWD_TOKEN;
			
			return domain + AGILE_SUB_USER_PWD_TOKEN;
		}
		
		
		throw new IllegalArgumentException("Domain " + domain + " is not valid.");
	}
	
	public static String getSubUserStatistics(String domain, EmailGateway gateway, SendGridStats statsData)
	{
		String response = null, queryString = "", url = "https://api.sendgrid.com/v3/stats";
		
		try
		{
			if (StringUtils.isBlank(domain))
				return null;
			
			String username = null, password = null;
			
			if (gateway != null)
			{
				username = gateway.api_user;
				password = gateway.api_key;
			}
			
			if(username == null || password == null)
			{
				username = Globals.SENDGRID_API_USER_NAME;
				password = Globals.SENDGRID_API_KEY;
				
				queryString = "subusers" + "=" + URLEncoder.encode(getAgileSubUserName(domain), "UTF-8")+ "&";
				url = "https://api.sendgrid.com/v3/subusers/stats";
			}
			
			long timestamp = System.currentTimeMillis();

			queryString += "start_date"
					+ "="
					+ URLEncoder.encode(DateUtil.getDateInGivenFormat(statsData.getStartTime(), "YYYY-MM-dd", null), "UTF-8")
					/*+ "&"
					+ "end_date"
					+ "="
					+ URLEncoder.encode(DateUtil.getDateInGivenFormat(timestamp, "YYYY-MM-dd", null)
							, "UTF-8")*/
					+"&"+ "aggregated_by" + "=" + URLEncoder.encode(statsData.getDuration(), "UTF-8");
			System.out.println("Send query : "+queryString);
			response = HTTPUtil.accessURLUsingAuthentication(url + "?" + queryString, username, password,
					"GET", null, false, "application/json", "application/json");
		}
			catch (Exception e)
			{
				e.printStackTrace();
				System.out.println("Exception occured...." + e.getMessage());
			}
		
		
		return response;
	}
	
	/**
	 * This method is used for fetching sendgrid daily, weekly, monthly and overall stats count
	 * 
	 * @param timestamp
	 * @return string
	 * 
	 */
	public static String getSendgridStats(String domain, EmailGateway gateway)
	{
		long  domainCreatedTimestamps=DomainUserUtil.getCurrentDomainUser().getCreatedTime()*1000l;
						
		JSONArray  statsJSON=new JSONArray();
			
		SendGridStats stats=new SendGridStats();
		stats.setDuration("day");
		
		if(domainCreatedTimestamps < SEND_GRID_TIMESTAMP)
				stats.setStartTime(SEND_GRID_TIMESTAMP);
		else
			stats.setStartTime(domainCreatedTimestamps);
				
		//Fetching all sttats count of sendgrid to the domain
		try
		  {
			statsJSON=new JSONArray(getSubUserStatistics(domain, gateway,stats ));
			//getting reputation			
			JSONObject data=getSendgridStatsCount(statsJSON);
					   data.put("id",domain);
					   
					   if(gateway==null)
					   {
					    JSONArray reputation=new JSONArray(getSendGridUserReputation(domain, gateway));	
					    data.put(REPUTATION, reputation.getJSONObject(0).getInt(REPUTATION));
					   }
					   else
					   {
						   JSONObject reputation=new JSONObject(getSendGridUserReputation(domain, gateway));	
						   data.put(REPUTATION, reputation.getInt(REPUTATION));
					   }
		
			return data.toString();
		  }
		catch (Exception e)
		{
				e.printStackTrace();
				System.out.println("Exception occured while getting all stats of Sendgrid...." + e.getMessage());
		}
		return null;
	}
	
	/**
	 * This method will fetch count of email sent from JSONArray
	 * 
	 * @param JSONArry
	 * 				- allstats
	 * @return jsonObject
	 * 					-count of all stats
	 */
	private static JSONObject getSendgridStatsCount(JSONArray allStats)
	{
		int statsCount=allStats.length();
		int dailyEmailSent=0;
		int weeklyEmailSent=0;
		int monthlyEmailSent=0;
		int allEmailSent=0;
		int hardBounce=0;
		int softBounce=0;
		int spamReported=0;
		int rejected=0;
		
		Calendar cal = Calendar.getInstance();
		
		String today=DateUtil.getDateInGivenFormat(System.currentTimeMillis(), "YYYY-MM-dd",AccountPrefsUtil.getTimeZone());
		
		JSONObject allStatsJSON=new JSONObject();	
		
		try
		{
			for(int index=statsCount-1; index>=0; index--)
			   {
				  JSONObject tempJSON=allStats.getJSONObject(index);      
				  
				  if(tempJSON.has("stats"))
				  {
				    	   allEmailSent += tempJSON.getJSONArray("stats").getJSONObject(0).getJSONObject("metrics").getInt(EMAIL_SENT); 
				    	   
				    	   if(index == statsCount-1 && today.equals(tempJSON.getString("date")))
				    		   dailyEmailSent += tempJSON.getJSONArray("stats").getJSONObject(0).getJSONObject("metrics").getInt(EMAIL_SENT);
				    		  
				    	   if(index >= statsCount- cal.get(Calendar.DAY_OF_WEEK))
				    		   weeklyEmailSent += tempJSON.getJSONArray("stats").getJSONObject(0).getJSONObject("metrics").getInt(EMAIL_SENT); 
				    	   
				    	   if(index >= statsCount- cal.get(Calendar.DAY_OF_MONTH))
				    		   monthlyEmailSent += tempJSON.getJSONArray("stats").getJSONObject(0).getJSONObject("metrics").getInt(EMAIL_SENT);
				    	   
				    	   if(index >= statsCount - 30)
				    	   {
				    		   hardBounce += tempJSON.getJSONArray("stats").getJSONObject(0).getJSONObject("metrics").getInt(HARD_BOUNCE);
				    		   softBounce += tempJSON.getJSONArray("stats").getJSONObject(0).getJSONObject("metrics").getInt(SOFT_BOUNCE);
				    		   spamReported += tempJSON.getJSONArray("stats").getJSONObject(0).getJSONObject("metrics").getInt(SPAM_REPORT);
				    		   rejected += tempJSON.getJSONArray("stats").getJSONObject(0).getJSONObject("metrics").getInt(REJECTED);
				    	   }
				  }
			   }
			
			allStatsJSON.put("hardBounce", hardBounce);
			allStatsJSON.put("softBounce", softBounce);
			allStatsJSON.put("rejected", rejected);
			allStatsJSON.put("spamReported", spamReported);
			allStatsJSON.put("dailyEmailSent", dailyEmailSent);
			allStatsJSON.put("weeklyEmailSent", weeklyEmailSent);
			allStatsJSON.put("monthlyEmailSent", monthlyEmailSent);
			allStatsJSON.put("allEmailSent", allEmailSent);
			allStatsJSON.put("_agile_email_gateway", "SEND_GRID");	
			
		}
		catch (Exception e)
		{
				e.printStackTrace();
				System.out.println("Exception occured while getting all stats of Sendgrid...." + e.getMessage());
				return null;
		}
		return allStatsJSON;
	}
	
	/**
	 * Reputation of domain users on the basis of hardbounce, spam and block
	 * 
	 * @param domain
	 * @param gateway
	 * @return Double
	 */
	public static String getSendGridUserReputation(String domain, EmailGateway gateway)
	{
			String response = null, queryString = "", url = "https://api.sendgrid.com/v3/user/account";
		try
		{
			if (StringUtils.isBlank(domain))
				return null;
			
			String username = null, password = null;
			
			if (gateway != null)
			{
				username = gateway.api_user;
				password = gateway.api_key;
			}
			
			if(username == null || password == null)
			{
				username = Globals.SENDGRID_API_USER_NAME;
				password = Globals.SENDGRID_API_KEY;
				
				queryString = "usernames" + "=" + URLEncoder.encode(getAgileSubUserName(domain), "UTF-8");
				url = "https://api.sendgrid.com/v3/subusers/reputations";
			}
			response = HTTPUtil.accessURLUsingAuthentication(url + "?" + queryString, username, password,
					"GET", null, false, "application/json", "application/json");
		}
			catch (Exception e)
			{
				e.printStackTrace();
				System.out.println("Exception occured while getting sendgrid reputation...." + e.getMessage());
				return null;
			}
		return response;
	}
	
	/**
	 * This clas is used for getting stats report of Sendgrid domain users
	 * 
	 * @author Prashannjeet
	 *
	 */
	public static class SendGridStats
	{
		long startTime=0;
		String duration="day";
		
	    public void setStartTime(long startTime)
	    {
	    	this.startTime=startTime;
	    }
	    
	    public long getStartTime()
	    {
	    	return startTime;
	    }
	    public void setDuration(String duration)
	    {
	    	this.duration=duration;
	    }
	    
	    public String getDuration()
	    {
	    	return duration;
	    }
	}
	
	/**
	 * It will delete subuser from Sendgrid account
	 * @param subUser
	 * @param domain
	 * @return
	 */
	
	public static String deleteSubAccountFromSendGrid(String domain)
	{
		String response = null, queryString = SendGridSubUser.getAgileSubUserName(domain), url = "https://api.sendgrid.com/v3/subusers/";
		try
		{
			if (StringUtils.isBlank(domain))
				return null;
			
			String username = Globals.SENDGRID_API_USER_NAME, password = Globals.SENDGRID_API_KEY;
			
			response = HTTPUtil.accessURLUsingAuthentication(url + queryString, username, password,
					"DELETE", null, false, "application/json", "application/json");
			System.out.println("Subuser account deleted successfully from SendGrid :"+domain);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			System.out.println("Exception occured while deleting sendgrid subuser...." + e.getMessage());
			return null;
		}
		return response;
	}
	
	public static void main(String adf[]){
		try
		{
			System.out.println(SendGridUtil.getSubUserEmailLimit("prashannjeet"));
		}
		catch (Exception e)
		{
			System.out.println("Exception occured in main...."  + e.getMessage());
			e.printStackTrace();
		}
	}
	/**
	 * Add SendGrid sub account creation task in Deferred queue
	 * @param domainUser
	 */
	public static void createSubAccountInSendGrid(String domain)
	{
		if(domain==null)
			return;
		System.out.println("Sendgrid Subaccount creation task added in a queue");
		Queue queue = QueueFactory.getQueue(AgileQueues.ACCOUNT_STATS_UPDATE_QUEUE);
		
		SendGridSubAccountDeferred task = new SendGridSubAccountDeferred(domain);
		queue.add(TaskOptions.Builder.withPayload(task));
		
	}
	
	public static void updateSendGridSubUserPassword(String domain) throws SendGridException, Exception
	{
		if(StringUtils.isBlank(domain))
			return;
		
		String response = null, user = SendGridSubUser.getAgileSubUserName(domain), url = "https://api.sendgrid.com/apiv2/customer.password.json";
		
			String username = Globals.SENDGRID_API_USER_NAME, password = Globals.SENDGRID_API_KEY;
			
			String newPassword = getAgileSubUserPwd(domain);
			
			String queryString = null;
			
			try
			{
				queryString = SendGrid.SENDGRID_API_PARAM_API_USER + "=" + URLEncoder.encode(username, "UTF-8") + "&"  
									+ SendGrid.SENDGRID_API_PARAM_API_KEY + "=" + URLEncoder.encode(password, "UTF-8") + "&"
									+ "user" + "=" + URLEncoder.encode(user, "UTF-8") + "&"
									+ "password" + "=" + URLEncoder.encode(newPassword, "UTF-8") + "&"
									+ "confirm_password" + "=" + URLEncoder.encode(newPassword, "UTF-8");
			}
			catch (UnsupportedEncodingException e)
			{
				e.printStackTrace();
			}
			
			response = HTTPUtil.accessURLUsingPost(url, queryString);
			
			System.out.println("Response after updating password " + response);
			
			if(response.contains("User does not exist") && response.contains("400"))
				throw new SendGridException(new Exception("User does not exist"));
			
			System.out.println("After throwing exception");
	}
	
	/**
	 * This method will return per day email sent count from SendGrid
	 * 
	 * @param domain
	 * @return long
	 */
	public static int getPerDayEmailSent(String domain)
	{
	  int emailSent = 0;
	  try
		{
		  SendGridStats stats=new SendGridStats();
		  stats.setDuration("day");
		  stats.setStartTime(System.currentTimeMillis());
		  
		  JSONArray responseJSON = new JSONArray(getSubUserStatistics(domain, null, stats));
		  emailSent = responseJSON.getJSONObject(0).getJSONArray("stats").getJSONObject(0).getJSONObject("metrics").getInt(EMAIL_SENT);
		  
		  System.out.println("Per Email sent Count for domain : " + domain + emailSent);
		}
		catch (Exception e)
		{
			System.out.println("Exception occured while fetching per day email count"  + e.getMessage());
			e.printStackTrace();
			return emailSent;
		}
	  return emailSent;
	}
	
	/**
	 * This method will fetch sendgrid email sent count 
	 * 
	 * @param domain
	 * @param startTime
	 * 				- millisecond
	 * @return
	 *   int
	 */
	public static int getSendgridEmailSent(String domain, long startTime){
		 int emailSent = 0;
		  try
			{
			  SendGridStats stats=new SendGridStats();
			  stats.setDuration("month");
			  
			  stats.setStartTime(startTime);
			  
			  JSONArray responseJSON = new JSONArray(getSubUserStatistics(domain, null, stats));
			  
			  for(int index =0; index < responseJSON.length(); index ++)
			      emailSent += responseJSON.getJSONObject(index).getJSONArray("stats").getJSONObject(0).getJSONObject("metrics").getInt(EMAIL_SENT);
			  
			  System.out.println("Last three month Email sent Count for domain : " + + emailSent);
			}
			catch (Exception e)
			{
				System.out.println("Exception occured while fetching total email count"  + e.getMessage());
				e.printStackTrace();
				return emailSent;
			}
		  return emailSent;
	}
}
	

