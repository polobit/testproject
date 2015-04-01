package com.agilecrm.gadget;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.user.notification.NotificationPrefs.Type;
import com.agilecrm.user.notification.util.NotificationPrefsUtil;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.util.WorkflowUtil;
import com.campaignio.logger.Log.LogType;
import com.campaignio.logger.util.LogUtil;
import com.google.appengine.api.NamespaceManager;

/**
 * GadgetServlet.java is servlet which generates response for gadget template
 * requests.
 * 
 * @module GadgetServlet
 * @submodule GadgetTemplate
 * @main GadgetServlet
 * 
 * @author Dheeraj
 * 
 */

/**
 * @class GadgetServlet
 * @extends HttpServlet
 * */
public class GadgetServlet extends HttpServlet {
	/**
	 * @method service
	 * @param {Object} req gives object of data come from borwser as request.
	 * @param {Object} res object of generated response.
	 * */
	public void service(HttpServletRequest req, HttpServletResponse res)
			throws IOException {

		res.setContentType("text/plain;charset=UTF-8");

		try {

			String templateName = req.getParameter("template");
			if (StringUtils.isBlank(templateName))
				throw new Exception("Invalid param for template");

			String callback = req.getParameter("callback");
			JSONObject reponseJSON = new JSONObject();
			// Creating response data
			reponseJSON.put("status", "success");
			reponseJSON.put("content",
					GadgetTemplate.getGadgetTemplate(templateName));

			// Returning data by calling callback function retrieved from
			// request.
			res.getWriter()
					.print(callback + "(" + reponseJSON.toString() + ")");

		} catch (Exception e) {
			e.printStackTrace();
			// TODO: handle exception
		}
	}

}
