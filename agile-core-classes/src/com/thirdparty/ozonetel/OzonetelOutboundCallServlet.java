package com.thirdparty.ozonetel;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.URI;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.user.AgileUser;
import com.ozonetel.kookoo.Dial;
import com.ozonetel.kookoo.Response;
import com.thirdparty.PubNub;

//add and import kookoo response.jar or source code into your application

@SuppressWarnings("serial")
public class OzonetelOutboundCallServlet extends HttpServlet {

    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
    	
    	String phone_no = "";
        String contact_number ="";
        String status = ""; 
        String duration = ""; 
        String message = "";
        
    	String uri = request.getRequestURI();
        if (request.getQueryString() != null) {
            uri += "?" + request.getQueryString();
        }
        System.out.println("kookoo outbound request url  : " + uri);/*here I am just kookoo final xml prepared*/
        try (PrintWriter out = response.getWriter()) {
            Response r = new Response();
            String kookoo_event = request.getParameter("event");

            if ((null != kookoo_event) && kookoo_event.equalsIgnoreCase("newcall")) {
                r.addPlayText("please wait while we connecting to consern person");
                Dial dialnumber = new Dial();
                dialnumber.setNumber(request.getParameter("contact_number"));
                r.addDial(dialnumber);
                status = "oncall";
            } else if ((null != kookoo_event) && kookoo_event.equalsIgnoreCase("dial")) {
            	status = request.getParameter("status");
                if (status.equalsIgnoreCase("answered")) {
                    r.addHangup();
                } else {
                	
                }
            } else if((null != kookoo_event) && kookoo_event.equalsIgnoreCase("hangup")) {
            	status = request.getParameter("status");
            }else {
                r.addHangup();
            }
            System.out.println(r.getXML());
            out.println(r.getXML());
            
            status = request.getParameter("status");
            phone_no = request.getParameter("phone_no");
	        contact_number = request.getParameter("contact_number");
	        duration = request.getParameter("callduration");
	        message = request.getParameter("message");
	        String domain_user = request.getParameter("domain_user");
	        
            JSONObject pubnub_notification = new JSONObject();
	        pubnub_notification.put("direction", "Outgoing");
   	        pubnub_notification.put("type", "call");
   	        pubnub_notification.put("callType", "Ozonetel");
   	        pubnub_notification.put("state", status.toLowerCase());
   	        pubnub_notification.put("contact_number", contact_number);
   	        pubnub_notification.put("phone_no", phone_no);
   	        pubnub_notification.put("duration", duration);
   	        pubnub_notification.put("oz_message", message);
   	        pubnub_notification.put("message_from", "notcallback");
   	        
   	        PubNub.pubNubPush(domain_user+"_Channel", pubnub_notification);
        } catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

    }
}
