package com.agilecrm.visitor.segmentation;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URLDecoder;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;

import com.agilecrm.web.stats.StatsSQLUtil;
import com.agilecrm.web.stats.StatsUtil;

/**
 * <code>SegmentationServlet</code> segments contacts based on contact filters
 * issued by customers. In page views table email address represents the contact
 * in app engine datastore.It sends the obtained email addresses from the google
 * cloud sql.
 * 
 * @author Ramesh
 * 
 */

@SuppressWarnings("serial")
public class SegmentationServlet extends HttpServlet
{
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException
    {
	doPost(request, response);
    }
    
    /**
     * It receives segmentation of contacts request from the client.This request
     * contains post data. This data includes all parameters which are mandatory
     * for running segmentation query.
     * 
     */
    public void doPost(HttpServletRequest req, HttpServletResponse res) throws IOException
    {
	StringBuilder stringBuilder = new StringBuilder();
	BufferedReader bufferedReader = req.getReader();
	if (bufferedReader != null)
	{
	    char[] charBuffer = new char[128];
	    int bytesRead = -1;
	    while ((bytesRead = bufferedReader.read(charBuffer)) > 0)
	    {
		stringBuilder.append(charBuffer, 0, bytesRead);
	    }
	}
	else
	    stringBuilder.append("");
	String[] paramsArray = stringBuilder.toString().split("&");
	Map<String, String> params = new LinkedHashMap<String, String>();
	for (int i = 0; i < paramsArray.length; i++)
	{
	    String param = URLDecoder.decode(paramsArray[i], "UTF-8");
	    String[] paramSplit = param.split("=");
	    params.put(paramSplit[0], paramSplit[1]);
	}
	if (StatsUtil.isValidRequest(params.get("psd")))
	{
	    
	    JSONArray emails = StatsSQLUtil.getContactEmails(params.get("domain"), params.get("filter_json"),
		    params.get("start_time"), params.get("end_time"), params.get("cursor"), params.get("page_size"));
	    StatsUtil.sendResponse(req, res, emails.toString());
	}
    }
}
