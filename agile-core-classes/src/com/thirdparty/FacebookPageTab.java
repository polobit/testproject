package com.thirdparty;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.binary.Base64;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.facebookpage.FacebookPage;
import com.agilecrm.facebookpage.FacebookPageUtil;

/**
 * 
 */
public class FacebookPageTab extends HttpServlet
{
    private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
	System.out.println("In doGet of FacebookPageTab");
	doPost(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
	System.out.println("In doPost of FacebookPageTab");
	response.setContentType("text/html");
	PrintWriter out = response.getWriter();

	String signedRequest = request.getParameter("signed_request");
	if (signedRequest != null)
	{
	    try
	    {
		String json = parse_signed_request(signedRequest);
		System.out.println(json);

		if (!isJSONValid(json))
		{
		    if (json != null)
		    {
			json = json.trim();
			if (json.startsWith("{"))
			{
			    json = json.substring(1, json.length());
			    json = "{" + json + "}";
			}
			else
			{
			    return;
			}
		    }
		    else
		    {
			return;
		    }
		}

		JSONObject payLoadJSON = new JSONObject(json);
		JSONObject pageJSON = payLoadJSON.getJSONObject("page");
		String facebookRequestedPageID = pageJSON.getString("id");
		FacebookPage fbpage = FacebookPageUtil.getFacebookPageDetails(facebookRequestedPageID);
		if (fbpage != null && fbpage.form_id != "")
		{
		    response.sendRedirect("https://"+fbpage.domain+".agilecrm.com/form.jsp?id=" + fbpage.form_id);
		    return;
		}
		else
		{
		    out.print("No agile form exists for this page.");
		}
	    }
	    catch (Exception e)
	    {
		e.printStackTrace();
	    }
	}
	else
	{
	    out.print("No agile form exists for this page.");
	}
    }

    public boolean isJSONValid(String test)
    {
	try
	{
	    new JSONObject(test);
	}
	catch (JSONException ex)
	{
	    try
	    {
		new JSONArray(test);
	    }
	    catch (JSONException ex1)
	    {
		return false;
	    }
	}
	return true;
    }

    public static byte[] base64_url_decode(String input) throws IOException
    {
	return Base64.decodeBase64(input.getBytes("UTF-8"));
    }

    public static String parse_signed_request(String input) throws Exception
    {
	String[] split = input.split("[.]", 2);
	// String encoded_sig = split[0];
	String encoded_envelope = split[1];
	String json = new String(base64_url_decode(encoded_envelope));
	return json;
    }
}