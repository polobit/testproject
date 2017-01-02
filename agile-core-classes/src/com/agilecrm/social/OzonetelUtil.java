package com.agilecrm.social;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.util.Date;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.apache.commons.lang.StringUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.HttpClientBuilder;
import org.jboss.resteasy.spi.UnhandledException;
import org.jdom.JDOMException;
import org.jdom.input.SAXBuilder;

import java.io.StringReader;    

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathFactory;    

import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

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
	public String connectToNumber(String user_phone,String url,String domain_user)throws UnhandledException{
		String status="";
		try{
			String  domainUrl = "";
			String domain = DomainUserUtil.getCurrentDomainUser().domain;
			if(domain != null && StringUtils.contains(domain,"agilecrm.com")){
				domainUrl = "http://"+domain;
			}else{
				if(domain == null){
					domainUrl = "https://ozonetelin.appspot.com";
				}else{
					//rajesh-dot-sandbox-dot-agilecrmbeta.appspot.com
					//domainUrl = "http://"+domain+".agilecrm.com";
					domainUrl = "https://"+domain+"-dot-sandbox-dot-agilecrmbeta.appspot.com";
				}
			}
			String agent_number = "";
			if(agent_no.startsWith("+91") || (agent_no.startsWith("91") && agent_no.length() >10)){
				agent_number = "0"+agent_no.substring(agent_no.length() - 10);
			}else{
				agent_number = agent_no;
			}
			Date d = new Date();
	        String trackId = "" + d.getTime();
	        URIBuilder uribuilder = new URIBuilder(url);
	        uribuilder.addParameter("api_key", api_key);
	        uribuilder.addParameter("phone_no", agent_number);
	        uribuilder.addParameter("caller_id", caller_id);
	        uribuilder.addParameter("url", domainUrl+"/outboundcall?contact_number=" + user_phone + "&trackId=" + trackId+"&domain_user="+domain_user);
	        uribuilder.addParameter("callback_url",domainUrl+"/outbound_callstatus?contact_number=" + user_phone + "&trackId=" + trackId+"&domain_user="+domain_user);
	        //uribuilder.addParameter("url", "http://ozonetelin.appspot.com/outboundcall?contact_number=" + user_phone + "&trackId=" + trackId);
	        //uribuilder.addParameter("callback_url","http://ozonetelin.appspot.com/outbound_callstatus?contact_number=" + user_phone + "&trackId=" + trackId);
	        URI uri = uribuilder.build();
	        String resstatus = ozonetelGetRequest(uri.toString());
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
	        if(StringUtils.equals(resstatus, "error")){
	        	status="failed";
	        }else{
	        	status="success";
	        }
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
		  
		  org.jdom.input.SAXBuilder saxBuilder = new SAXBuilder();
		  try {
		      org.jdom.Document doc = saxBuilder.build(new StringReader(response.toString()));
		      String message = doc.getRootElement().getChildText("status");
		      result = message;
		  } catch (JDOMException e) {
		  } catch (IOException e) {
		  }
		  System.out.println(response.toString());
		  return result;
	}

}
