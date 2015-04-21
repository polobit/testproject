package com.thirdparty.ecommerce;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONException;
import org.json.JSONObject;

import com.thirdparty.ecommerce.EcommerceUtil.HOOK;

/**
 * 
 */
public class EcommerceWebhook extends HttpServlet
{
    private static final long serialVersionUID = 1L;

    public String action = null;

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
	System.out.println("In doGet of EcommerceWebhook");
	doPost(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
	System.out.println("In doPost of EcommerceWebhook");
	String responseText = "{\"error\" : \"No action executed.\"}";
	action = request.getParameter("hook");

	if (action != null && action.trim() != "")
	{
	    action = action.trim();
	    HOOK hook = HOOK.valueOf(action);

	    EcommerceUtil ecommUtil = new EcommerceUtil();
	    ecommUtil.hook = hook;
	    ecommUtil.apiKey = request.getParameter("api-key");
	    ecommUtil.email = request.getParameter("email").toLowerCase();
	    ecommUtil.pluginType = request.getParameter("pluginType");
	    if(request.getParameter("syncAsTags") != null)
	    	ecommUtil.syncAsTags = request.getParameter("syncAsTags");

	    String json = request.getParameter("payLoad");

	    JSONObject jsonObj = null;
	    try
	    {
		jsonObj = new JSONObject(json);
		if (jsonObj.has("order"))
		{
		    System.out.println("in jsonObj.has(\"order\")");
		    ObjectMapper mapper = new ObjectMapper();
		    ecommUtil.order = mapper.readValue(jsonObj.getString("order"), Order.class);
		}
		switch (hook)
		{
		case CUSTOMER_CREATED:
		case CUSTOMER_UPDATED:
		    responseText = ecommUtil.createContact(jsonObj.toString());
		    break;
		case ORDER_CREATED:
		case ORDER_UPDATED:
		    responseText = ecommUtil.addOrderNote(json);
		    ecommUtil.updateContactTags();
		    break;
		case NOTE_CREATED:
		    responseText = ecommUtil.addNoteToContact(jsonObj.getString("note"));
		    break;
		default:
		    break;
		}
	    }
	    catch (JSONException e)
	    {
		e.printStackTrace();
		responseText = "{\"error\" : \"" + e.getMessage() + "\"}";
	    }
	}

	response.setContentType("application/json");
	PrintWriter out = response.getWriter();
	out.println(responseText);

    }

}