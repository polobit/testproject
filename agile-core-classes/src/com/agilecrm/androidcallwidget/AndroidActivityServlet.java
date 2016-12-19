package com.agilecrm.androidcallwidget;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

import com.thirdparty.PubNub;

public class AndroidActivityServlet extends HttpServlet {

    /**
	 * 
	 */
    private static final long serialVersionUID = 1L;

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response)
	    throws IOException, ServletException {

	// Get server type
	String toNo = request.getParameter("called-number");
	String fromNo = request.getParameter("caller-number");
	String domain = request.getParameter("domain");
	String userID = request.getParameter("user-id");
	String st_time = request.getParameter("start_time");
	String ed_time = request.getParameter("end_time");
	String cl_duration = request.getParameter("call_duration");
	String type_of_call = request.getParameter("type_of_call");
	long start_time = 0;
 	long end_time = 0;
 	long call_duration = 0;	    
	if (toNo == null || toNo.equalsIgnoreCase("null")) {
 	    toNo = "";
 	}
 	if (fromNo == null || fromNo.equalsIgnoreCase("null")) {
 	    fromNo = "";
 	}

 	if (domain == null || domain.equalsIgnoreCase("null")) {
 	    domain = "";
 	}

 	if (userID == null || userID.equalsIgnoreCase("null")) {
 	    userID = "";
 	}

 	if (ed_time == null || ed_time.equalsIgnoreCase("null") || ed_time.isEmpty()) {
 	    end_time = 0;
 	}else{
 	    end_time = Long.parseLong(ed_time);
 	}

 	if (type_of_call == null || type_of_call.equalsIgnoreCase("null")) {
 	    type_of_call = "";
 	}
 		    
 	if (cl_duration == null || cl_duration.equalsIgnoreCase("null") || cl_duration.isEmpty()) {
 	    call_duration = -1;
 	}else{
 	    call_duration = Long.parseLong(cl_duration);
 	}
	System.out.println("toNo = " + toNo);
	System.out.println("fromNo = " + fromNo);
	System.out.println("domain = " + domain);
	System.out.println("userID = " + userID);
	System.out.println("start_time = " + start_time);
	System.out.println("end_time = " + end_time);
	System.out.println("call_duration = " + call_duration);
	System.out.println("call_type = " + type_of_call);	    
        try {
	    JSONObject messageJson = new JSONObject();
	    JSONObject metaJson = new JSONObject();
	    metaJson.put("type", "calling");
	    metaJson.put("widget_name", "android_app_calling");
	    metaJson.put("widget_type", "widget_type");
	    metaJson.put("version", "v1");

	    messageJson.put("contact_number", toNo);
	    messageJson.put("phone_no", "");
	    if (call_duration == -1
		    && type_of_call.equalsIgnoreCase("CONNECTED")) {
		messageJson.put("state", "INITIATED");
		messageJson.put("event_type", "CALL");
		messageJson.put("duration", "0");
	    } else if (call_duration == -1
		    && !type_of_call.equalsIgnoreCase("CONNECTED")) {
		messageJson.put("state", "FAILED");
		messageJson.put("event_type", "CDR");
		messageJson.put("duration", "0");
		messageJson.put("start_time", start_time);
		messageJson.put("end_time", end_time);
	    } else if (call_duration != -1  && call_duration <= 1) {
		messageJson.put("state", "AGENT_MISSED");
		messageJson.put("event_type", "CDR");
		messageJson.put("duration", "0");
		messageJson.put("start_time", start_time);
		messageJson.put("end_time", end_time);
	    } else if (call_duration != -1 && call_duration > 1) {
		messageJson.put("state", "ANSWERED");
		messageJson.put("event_type", "CDR");
		messageJson.put("duration", call_duration);
		long t =call_duration*10000;
		start_time = end_time - t;
		messageJson.put("start_time", start_time);
		messageJson.put("end_time", end_time);
	    }
	    messageJson.put("caller_id", fromNo);
	    messageJson.put("type", "call");
	    messageJson.put("callType", "Android");
	    messageJson.put("direction", "Outgoing");
	    messageJson.put("meta", metaJson);

	    System.out.println(" Data going to pub nub = " + messageJson);
	    PubNub.pubNubPush(userID + "_Channel", messageJson);

	} catch (Exception e) {
	    // TODO: handle exception
	    System.out.println("Some exception" + e);
	}

    }

}