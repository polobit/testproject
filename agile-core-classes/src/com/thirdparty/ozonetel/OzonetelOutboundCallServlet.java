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
            } else if ((null != kookoo_event) && kookoo_event.equalsIgnoreCase("dial")) {
                String status = request.getParameter("status");
                if (status.equalsIgnoreCase("answered")) {
                    r.addPlayText("thanks for calling");
                    r.addHangup();
                } else {
                    r.addPlayText("re trying again");
                    Dial dialnumber = new Dial();
                    dialnumber.setNumber(request.getParameter("contact_number"));
                    //dialnumber.setLimitTime(3600);
                    r.addDial(dialnumber);
                }
            } else if((null != kookoo_event) && kookoo_event.equalsIgnoreCase("hangup")) {
                
            	r.addHangup();
            } else {
                r.addHangup();
            }
            
            JSONObject pubnub_notification = new JSONObject();
		    pubnub_notification.put("title", "");
		    pubnub_notification.put("start", "");
		    pubnub_notification.put("end", "");
		    pubnub_notification.put("priority", "");
		    pubnub_notification.put("username", "");
		    pubnub_notification.put("useremail", "");
		    pubnub_notification.put("type", "EVENT_REMINDER");

		    PubNub.pubNubPush(AgileUser.getCurrentAgileUser().domain_user_id+"_Channel", pubnub_notification);
            
            System.out.println(r.getXML());/*here I am just printing kookoo final xml prepared*/
            out.println(r.getXML());
        } catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

    }
}
