package com.agilecrm.facebookpage;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.forms.Form;
import com.agilecrm.forms.util.FormUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.utils.SystemProperty;

/**
 * 
 */
public class FacebookFormLoadServlet extends HttpServlet
{
    private static final long serialVersionUID = 1L;


    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
	doPost(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
    	
    	Long formId = Long.parseLong(request.getParameter("formId"));
    	
    	if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Production)
    	{
        	String domain = request.getParameter("domain");
        	NamespaceManager.set(domain);
    	}
    	
    	Form form = FormUtil.getFormById(formId);
    	JSONObject jobj = new JSONObject();
    	
    	try {
			jobj.put("id", form.id);
		  	jobj.put("updated_time", form.updated_time);
	    	jobj.put("formName", form.formName);
	    	jobj.put("formJson", form.formJson);
	    	
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    	
    	response.setContentType("application/json");
    	PrintWriter out = response.getWriter();    	
    	out.print(jobj.toString());
    	
    }

}