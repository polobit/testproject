package com.agilecrm.ticket.servlets;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.user.util.DomainUserUtil;

/**
 * Servlet implementation class TicketWebhook
 */
public class TicketWebhook extends HttpServlet
{
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		PrintWriter pw = response.getWriter();
		pw.write("Get");
		System.out.println("Get method called..");
		//doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException,
			IOException
	{
		try
		{
			String mandrillResponse = request.getParameter("mandrill_events");

			System.out.println("MandrillResponse: " + mandrillResponse);

			if (StringUtils.isBlank(mandrillResponse))
				return;

			// Mandrill Inbound event format -
			// https://mandrill.zendesk.com/hc/en-us/articles/205583197-Inbound-Email-Processing-Overview#inbound-events-format
			JSONObject mandrillInboundJSON = new JSONArray(mandrillResponse).getJSONObject(0);

			if (!mandrillInboundJSON.has("msg"))
				return;

			JSONObject msgJSON = mandrillInboundJSON.getJSONObject("msg");

			if (!msgJSON.has("headers"))
				return;

			JSONArray recipientsArray = msgJSON.getJSONArray("to");

			if (recipientsArray == null || recipientsArray.length() == 0)
				return;

			String toAddress = "";
			for (int i = 0; i < recipientsArray.length(); i++)
			{
				JSONArray recipientJSON = recipientsArray.getJSONArray(i);

				toAddress = recipientJSON.getString(0);

				if (toAddress.endsWith("helptor"))
					break;
			}

			String[] toAddressArray = toAddress.split("+");

			if (toAddressArray.length != 2)
				return;

			String domainName = toAddressArray[0], groupID = toAddressArray[1];

			System.out.println("DomainName: " + domainName);
			System.out.println("GroupID: " + groupID);
			
			if (DomainUserUtil.count(domainName) <= 0)
			{
				System.out.println("Invalid domain: " + domainName);
				return;
			}

			JSONObject mimeHeaders = msgJSON.getJSONObject("headers");
		}
		catch (Exception e)
		{
			System.out.println("ExceptionUtils.getFullStackTrace(e): " + ExceptionUtils.getFullStackTrace(e));
			e.printStackTrace();
		}
	}
}
