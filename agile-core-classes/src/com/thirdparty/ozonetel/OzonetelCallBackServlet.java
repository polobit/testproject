package com.thirdparty.ozonetel;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.agilecrm.user.AgileUser;
import com.thirdparty.PubNub;
import org.json.*;

@SuppressWarnings("serial")
public class OzonetelCallBackServlet extends HttpServlet {
	/**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	try{
	        String phone_no = request.getParameter("phone_no");
	        String contact_number = request.getParameter("contact_number");
	        String status = request.getParameter("status");
	        String duration = request.getParameter("duration");
	        String domain_user = request.getParameter("domain_user");
	        		
	        JSONObject pubnub_notification = new JSONObject();
	        pubnub_notification.put("direction", "Outgoing");
	        pubnub_notification.put("type", "call");
	        pubnub_notification.put("callType", "Ozonetel");
	        pubnub_notification.put("state", status.toLowerCase());
	        pubnub_notification.put("contact_number", contact_number);
	        pubnub_notification.put("phone_no", phone_no);
	        pubnub_notification.put("duration", duration);
	        pubnub_notification.put("message_from", "callback");
	        
	        PubNub.pubNubPush(domain_user+"_Channel", pubnub_notification);
	    }catch(Exception e){
	    	e.printStackTrace();
	    }
    }
}
