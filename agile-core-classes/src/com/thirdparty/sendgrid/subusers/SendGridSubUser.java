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

import com.agilecrm.Globals;
import com.agilecrm.account.EmailGateway;
import com.agilecrm.account.util.AccountPrefsUtil;
import com.agilecrm.contact.email.EmailSender;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.Base64Encoder;
import com.agilecrm.util.HTTPUtil;
import com.agilecrm.util.HttpClientUtil;
import com.campaignio.reports.DateUtil;
import com.google.gson.JsonObject;
import com.thirdparty.sendgrid.lib.SendGridLib;

public class SendGridSubUser extends SendGridLib
{
	//SubUser Attributes
	final String SUB_USER_NAME = "username";
	final String SUB_USER_EMAIL = "email";
	final String SUB_USER_PASSWORD = "password";
	final String SUB_USER_IPS = "ips";

	public final static String AGILE_SUB_USER_NAME_TOKEN = ".agilecrm";
	public static String AGILE_SUB_USER_PWD_TOKEN = "@127";
	
	//Stats Attributes
	
	final static String EMAIL_SENT = "requests";
	final static String HARD_BOUNCE = "bounces";
	final static String SOFT_BOUNCE = "deferred";
	final static String SPAM_REPORT = "spam_reports";
	final static String REJECTED = "invalid_emails";
	final static String REPUTATION = "reputation";
	
	// 01-MARCH-2016
	final static long SEND_GRID_TIMESTAMP=1456805583000L;
	
	public SendGridSubUser(String username, String password)
	{
		super(username, password);
		this.setEndpoint("/v3/subusers");
	}
	
	public String createSubUser(SubUser subUser) throws UnsupportedEncodingException
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
			ips.add("167.89.89.43");
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
	
	public static String getAgileSubUserPwd(String domain) throws IllegalArgumentException
	{
		if(StringUtils.isNotBlank(domain))
			return domain + AGILE_SUB_USER_PWD_TOKEN;
		
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
			JSONArray reputation=new JSONArray(getSendGridUserReputation(domain, gateway));
			
			JSONObject data=getSendgridStatsCount(statsJSON);
					   data.put("id",domain);
					   data.put(REPUTATION, reputation.getJSONObject(0).getInt(REPUTATION));
		
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
			}
		return response;
	}
	
	public static void main(String asd[]) throws JSONException{
		JSONArray reputation=new JSONArray(getSendGridUserReputation("free", null));
		System.out.println("Response "+reputation.getJSONObject(0).getString("reputation"));
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
		String duration="daily";
		
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

}
	

