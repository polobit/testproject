package com.agilecrm.social;
import java.net.URI;
import java.util.Date;
import org.apache.commons.lang.StringUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.HttpClientBuilder;
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
	        try {
		        HttpClient client = HttpClientBuilder.create().build();
		        HttpResponse response = client.execute(request);
		        
		        String responseString = new BasicResponseHandler().handleResponse(response);
		        System.out.println(responseString);
		        status="success";
	        }catch(Exception e){
	        	e.printStackTrace();
	        }
		}catch(Exception e){
			System.out.println("Exception form OzonetelUtil connectToNumber method");
			e.printStackTrace();
			status="failed";
		}
		return status;
		
	}

}
