package com.agilecrm.social;
import java.net.URI;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.apache.http.NameValuePair;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.HttpClientBuilder;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.session.SessionManager;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.widgets.Widget;
import com.campaignio.tasklets.sms.SendMessage;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.utils.SystemProperty;
import com.google.gson.JsonObject;
import com.ozonetel.kookoo.*;
import com.twilio.sdk.resource.instance.sip.Domain;

public class OzonetelUtil {
	
	private String api_key;
	private String agent_no;
	private String caller_id;
	
	/**
	 * Constructor
	 * 
	 */
	public OzonetelUtil(String api_key, String agent_no, String caller_id){
		this.api_key = api_key;
		this.agent_no = agent_no;
		this.caller_id = caller_id;
	}
	/**
	 * Dialing number
	 * @param user_phone //number from contacts
	 * @return
	 */
	public String connectToNumber(String user_phone,String url){
		String status="";
		try{
			String  domainUrl = "";
			String domain = DomainUserUtil.getCurrentDomainUser().domain;
			if(domain != null && StringUtils.contains(domain,"agilecrm.com")){
				domainUrl = "http://"+domain;
			}else{
				if(domain == null){
					domainUrl = "http://ozonetelin.appspot.com";
				}else{
					domainUrl = "http://"+domain+".agilecrm.com";
				}
			}
			Date d = new Date();
	        String trackId = "" + d.getTime();
	        URIBuilder uribuilder = new URIBuilder(url);
	        uribuilder.addParameter("api_key", api_key);
	        uribuilder.addParameter("phone_no", agent_no);
	        uribuilder.addParameter("caller_id", caller_id);
	        uribuilder.addParameter("url", domainUrl+"/outboundcall?contact_number=" + user_phone + "&trackId=" + trackId);
	        uribuilder.addParameter("callback_url",domainUrl+"/outbound_callstatus?contact_number=" + user_phone + "&trackId=" + trackId);
	        //uribuilder.addParameter("url", "http://ozonetelin.appspot.com/outboundcall?contact_number=" + user_phone + "&trackId=" + trackId);
	        //uribuilder.addParameter("callback_url","http://ozonetelin.appspot.com/outbound_callstatus?contact_number=" + user_phone + "&trackId=" + trackId);
	
	        URI uri = uribuilder.build();
	        System.out.println("Final Outboud API url " + uri);
	        HttpGet request = new HttpGet(uri);
	        HttpClient client = HttpClientBuilder.create().build();
	        HttpResponse response = client.execute(request);
	
	        String responseString = new BasicResponseHandler().handleResponse(response);
	        System.out.println(responseString);
	        status="success";
		}catch(Exception e){
			System.out.println("Exception form OzonetelUtil connectToNumber method");
			e.printStackTrace();
			status="failed";
		}
		return status;
		
	}

}
