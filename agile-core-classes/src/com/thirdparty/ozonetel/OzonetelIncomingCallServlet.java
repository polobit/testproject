/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.thirdparty.ozonetel;

import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.service.AgileUserService;
import com.agilecrm.user.service.impl.AgileUserServiceImpl;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;
import com.ozonetel.kookoo.CollectDtmf;
import com.ozonetel.kookoo.Dial;
import com.ozonetel.kookoo.Response;
import com.thirdparty.PubNub;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author Rajesh
 */
public class OzonetelIncomingCallServlet extends HttpServlet {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
	private String agent_no ;
	private String callstatus;
	private String callduration;
	private String contact_number;
	
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String uri = request.getRequestURI();
        if (request.getQueryString() != null) {
            uri += "?" + request.getQueryString();
        }
        System.out.println("kookoo request url : " + uri);/*here I am just kookoo final xml prepared*/
        
        String email = request.getParameter("email");
        
        DomainUser user = DomainUserUtil.getDomainUserFromEmail(email);
        AgileUser aguser = AgileUser.getCurrentAgileUserFromDomainUser(user.id);
        System.out.println(user.id);
        System.out.println(aguser.id);
        Widget widget = WidgetUtil.getWidget("Ozonetel", aguser.id); //WidgetUtil.getWidget("Ozonetel");
        agent_no = widget.getProperty("agent_no");
        
        String agent_number = "";
		if(agent_no.startsWith("+91") || (agent_no.startsWith("91") && agent_no.length() >10)){
			agent_number = "0"+agent_no.substring(agent_no.length() - 10);
		}else{
			agent_number = agent_no;
		}
		
        try (PrintWriter out = response.getWriter()) {
        	
            Response r = new Response();
            String kookoo_event = request.getParameter("event");
            if ((null != kookoo_event)&& kookoo_event.equalsIgnoreCase("newcall")) {
            	
                Dial dialnumber = new Dial(); //kookoo dial tag class
                dialnumber.setNumber(agent_number);
                r.addDial(dialnumber);
                
                contact_number = request.getParameter("cid");
                JSONObject pubnub_notification = new JSONObject();
            	pubnub_notification.put("direction", "Incoming");
     	        pubnub_notification.put("type", "call");
     	        pubnub_notification.put("callType", "Ozonetel");
     	        pubnub_notification.put("state", "ringing");
     	        pubnub_notification.put("number", contact_number);
     	        pubnub_notification.put("callId", agent_no);
     	        pubnub_notification.put("message_from", "notcallback");
     	       
     	        PubNub.pubNubPush(user.id+"_Channel", pubnub_notification);
     		    
            }else if ((null != kookoo_event) && kookoo_event.equalsIgnoreCase("dial")) {
                String status = request.getParameter("status");
                callstatus = status;
                callduration = request.getParameter("callduration");
                
                r.addHangup();
            } else if ((null != kookoo_event) && (kookoo_event.equalsIgnoreCase("hangup") || kookoo_event.equalsIgnoreCase("disconnect"))) {
            	if(request.getParameter("status") != null){
            		callstatus = request.getParameter("status");
            	}
            	if(request.getParameter("callduration") != null){
            		callduration = request.getParameter("callduration");
            	}
    	        JSONObject pubnub_notification = new JSONObject();
    	        pubnub_notification.put("direction", "Incoming");
    	        pubnub_notification.put("type", "call");
    	        pubnub_notification.put("callType", "Ozonetel");
    	        pubnub_notification.put("state", callstatus.toLowerCase());
    	        pubnub_notification.put("number", contact_number);
    	        pubnub_notification.put("callId", agent_no);
    	        pubnub_notification.put("duration", callduration);
    	        pubnub_notification.put("message_from", "notcallback");
    	        
    	        PubNub.pubNubPush(user.id+"_Channel", pubnub_notification);
            } else {
                r.addHangup();
            }
		    
            System.out.println(r.getXML());
            out.println(r.getXML());

        } catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }
}
