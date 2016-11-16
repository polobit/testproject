package com.agilecrm.social;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.util.Date;

import org.apache.commons.lang.StringUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.HttpClientBuilder;
import org.jboss.resteasy.spi.UnhandledException;

import com.agilecrm.user.util.DomainUserUtil;

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
	public String connectToNumber(String user_phone,String url)throws UnhandledException{
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
	        ozonetelGetRequest(uri.toString());
	        /*HttpClient client = HttpClientBuilder.create().build();
	        URI uri = uribuilder.build();
	        HttpGet request = new HttpGet(uri);
	        try {
	        	System.out.println("Final out bound URL"+uri);
	            HttpResponse response = client.execute(request);
	            String responseString = new BasicResponseHandler().handleResponse(response);
		        System.out.println(responseString);
		        status="success";
	        } catch (Exception e) {
	            e.printStackTrace();

	        }*/
	        status="success";
		}catch(Exception e){
			System.out.println("Exception form OzonetelUtil connectToNumber method");
			e.printStackTrace();
			status="failed";
		}
		return status;
		
	}
	
	private String ozonetelGetRequest(String url) throws Exception {
		  String result = null;
		  System.out.println("Final OutBound URL"+url);
		  URL obj = new URL(url);
		  HttpURLConnection con = (HttpURLConnection) obj.openConnection();
		  con.setRequestMethod("GET");
		  int responseCode = con.getResponseCode();
		  System.out.println("ozonetel repsonse code : " + responseCode);

		  BufferedReader in = new BufferedReader(new InputStreamReader(
		    con.getInputStream()));
		  String inputLine;
		  StringBuffer response = new StringBuffer();

		  while ((inputLine = in.readLine()) != null) {
		   response.append(inputLine);
		  }
		  in.close();
		  System.out.println(response.toString());
		  return result;
	}

}
