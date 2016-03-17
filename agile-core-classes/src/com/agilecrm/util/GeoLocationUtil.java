package com.agilecrm.util;

import javax.servlet.http.HttpServletRequest;

import org.json.simple.JSONObject;

public class GeoLocationUtil
{

    public static JSONObject getLocation(HttpServletRequest request)
    {
	JSONObject locationJSON = new JSONObject();

	try
	{
	    // Add Google headers
	    String country = request.getHeader("X-AppEngine-Country");
	    String state = request.getHeader("X-AppEngine-Region");
	    String city = request.getHeader("X-AppEngine-City");
	    country = country == null ? "" : country;
	    state = state == null ? "" : state;
	    city = city == null ? "" : city;

	    String ip = request.getRemoteAddr();

	    System.out.println("Countrryyyy" + country + " Stateeeeee" + state + "Cityyy" + city);

	    locationJSON.put("city", city);
	    locationJSON.put("state", state);
	    locationJSON.put("country", country);

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	return locationJSON;
    }

}