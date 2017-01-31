package com.call.notification;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

import com.agilecrm.user.util.AliasDomainUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.gdata.util.common.base.StringUtil;
import com.thirdparty.PubNub;

public class AsteriskCallNotificatoin extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public void doGet(HttpServletRequest req, HttpServletResponse res)
			throws IOException, ServletException {
		service(req, res);
	}

	public void doPost(HttpServletRequest req, HttpServletResponse res)
			throws IOException, ServletException {
		service(req, res);
	}

	protected void service(HttpServletRequest req, HttpServletResponse res)
			throws IOException, ServletException {
		String event = req.getParameter("event");
		String extensionNumber = req.getParameter("extension");
		// String callType = req.getParameter("call_type");
		String fromNumber = req.getParameter("fromNumber");
		
		if (null == extensionNumber) {
			res.sendError(HttpServletResponse.SC_BAD_REQUEST,
					"Bad Request: Extension Number is missing");
			return;
		}

		if (null == fromNumber) {
			res.sendError(HttpServletResponse.SC_BAD_REQUEST,
					"Bad Request: From Number is missing");
			return;
		}

		String namespace = AliasDomainUtil
				.getCachedAliasDomainName(NamespaceManager.get());

		try {
			JSONObject obj = new JSONObject();
			if (StringUtil.equals("inbound", event)) {
				obj.put("check", true);
				obj.put("extension", extensionNumber);
				obj.put("number", fromNumber);
				obj.put("direction", "Inbound");
				obj.put("callType", "Asterisk");
				obj.put("state", "ringing");
				obj.put("type", "call");			
			} else {
				obj.put("check", true);
				obj.put("extension", extensionNumber);
				obj.put("number", fromNumber);
				obj.put("direction", "Inbound");
				obj.put("callType", "Asterisk");
				obj.put("state", "lastCallDetail");
				obj.put("type", "call");
				obj.put("duration", 230);
			}
			PubNub.pubNubPush(namespace, obj);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
