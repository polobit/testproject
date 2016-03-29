package com.thirdparty.sendgrid.subusers;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.entity.StringEntity;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.json.JSONObject;

import com.agilecrm.util.Base64Encoder;
import com.agilecrm.util.HttpClientUtil;
import com.thirdparty.sendgrid.lib.SendGridLib;

public class SendGridSubUser extends SendGridLib
{
	//SubUser Attributes
	final String SUB_USER_NAME = "username";
	final String SUB_USER_EMAIL = "email";
	final String SUB_USER_PASSWORD = "password";
	final String SUB_USER_IPS = "ips";

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
			 json.put(SUB_USER_IPS, subUser.getIps().toString());
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
	}
	
}
