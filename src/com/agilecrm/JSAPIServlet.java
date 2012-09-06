package com.agilecrm;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;

@SuppressWarnings("serial")
public class JSAPIServlet extends HttpServlet
{
    public void doGet(HttpServletRequest req, HttpServletResponse resp)
	    throws IOException
    {

	try
	{
	    // Get Data
	    String jsonDataString = req.getParameter("data");
	    if (jsonDataString == null)
		throw new Exception("Bad request");

	    // Get JSON
	    JSONObject jsonData = new JSONObject(jsonDataString);

	    // Get API Key
	    String apiKey = jsonData.getString("api_key");

	    // Get Operations

	}
	catch (Exception e)
	{
	    System.err.println(e.getMessage());
	    return;
	}

    }

    public void doPost(HttpServletRequest req, HttpServletResponse resp)
	    throws IOException
    {
	doGet(req, resp);

    }

}
