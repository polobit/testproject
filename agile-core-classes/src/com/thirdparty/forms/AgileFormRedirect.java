package com.thirdparty.forms;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.Map.Entry;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

@SuppressWarnings("serial")
public class AgileFormRedirect extends HttpServlet
{
    public void service(HttpServletRequest req, HttpServletResponse res) throws IOException
    {
	StringBuilder sb = new StringBuilder();
	Set<?> formSet = req.getParameterMap().entrySet();
	Iterator<?> i = formSet.iterator();
	while (i.hasNext())
	{
	    Map.Entry<String, String[]> e = (Entry<String, String[]>) i.next();
	    if (sb.length() > 0)
		sb.append('&');
	    String[] temp = e.getValue();
	    for (String s : temp)
		sb.append(URLEncoder.encode(e.getKey(), "UTF-8")).append('=').append(URLEncoder.encode(s, "UTF-8"));
	}
	String urlParameters = sb.toString();
	URL url = new URL(req.getAttribute("url").toString() + "&" + urlParameters);

	res.sendRedirect(url.toString());
	if (StringUtils.equalsIgnoreCase("POST", req.getMethod()))
	{
	    HttpURLConnection con = (HttpURLConnection) url.openConnection();
	    con.setRequestMethod("POST");

	    con.setDoOutput(true);
	    DataOutputStream wr = new DataOutputStream(con.getOutputStream());
	    wr.writeBytes(urlParameters);
	    wr.flush();
	    wr.close();

	    BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream(), StandardCharsets.UTF_8));
	    String inputLine;
	    StringBuffer response = new StringBuffer();
	    ServletOutputStream sout = res.getOutputStream();
	    while ((inputLine = in.readLine()) != null)
	    {
		response.append(inputLine);
		sout.write(inputLine.getBytes());
	    }
	    in.close();
	    sout.flush();
	}
    }
}