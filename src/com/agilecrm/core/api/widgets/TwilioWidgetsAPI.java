package com.agilecrm.core.api.widgets;

import java.io.IOException;
import java.net.SocketTimeoutException;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONArray;

import com.agilecrm.social.TwilioUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;

/**
 * <code>TwilioWidgetsAPI</code> class includes REST calls to interact with
 * {@link TwilioUtil} class
 * 
 * <p>
 * It is called from client side for retrieving call logs, retrieving numbers,
 * verifying numbers, create application SID and so on
 * </p>
 * 
 * @author Tejaswi
 * @since August 2013
 * 
 */
@Path("/api/widgets/twilio")
public class TwilioWidgetsAPI
{

	/**
	 * Retrieves registered phone numbers from agent's Twilio account
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @return {@link String} form of {@link JSONArray}
	 */
	@Path("numbers/{widget-id}")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String getOutgoingNumbersfromTwilio(@PathParam("widget-id") Long widgetId)
	{
		// Retrieve widget based on its id
		Widget widget = WidgetUtil.getWidget(widgetId);

		if (widget == null)
			return null;

		try
		{
			// Calls TwilioUtil method to retrieve numbers
			return TwilioUtil.getOutgoingNumber(widget).toString();
		}
		catch (SocketTimeoutException e)
		{
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
					.entity("Request timed out. Refresh and Please try again.").build());
		}
		catch (IOException e)
		{
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
					.entity("An error occurred. Refresh and Please try again.").build());
		}
		catch (Exception e)
		{
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * Verify phone number in agent's Twilio account
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @return {@link String} form of {@link JSONArray}
	 */
	@Path("verify/numbers/{widget-id}/{from}")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String verifyNumberInTwilio(@PathParam("widget-id") Long widgetId, @PathParam("from") String from)
	{
		// Retrieve widget based on its id
		Widget widget = WidgetUtil.getWidget(widgetId);

		if (widget == null)
			return null;

		try
		{
			/*
			 * Calls TwilioUtil method to verify a number in agile Twilio user
			 * account
			 */
			return TwilioUtil.verifyOutgoingNumbers(widget, from).toString();
		}
		catch (SocketTimeoutException e)
		{
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
					.entity("Request timed out. Refresh and Please try again.").build());
		}
		catch (IOException e)
		{
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
					.entity("An error occurred. Refresh and Please try again.").build());
		}
		catch (Exception e)
		{
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * Connects to Twilio and fetches applicaiton sid based on the accountSID
	 * 
	 * @param accountSid
	 *            {@link String} accountSid of agent Twilio account
	 * @return {@link String} token generated from Twilio
	 */
	@Path("appsid/{widget-id}")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String getTwilioAppSid(@PathParam("widget-id") Long widgetId)
	{
		// Retrieve widget based on its id
		Widget widget = WidgetUtil.getWidget(widgetId);

		if (widget == null)
			return null;

		try
		{
			/*
			 * Create a Twilio Application for Agile in Agile User Twilio
			 * account
			 */
			return TwilioUtil.getTwilioAppSID(widget);
		}
		catch (SocketTimeoutException e)
		{
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
					.entity("Request timed out. Refresh and Please try again.").build());
		}
		catch (IOException e)
		{
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
					.entity("An error occurred. Refresh and Please try again.").build());
		}
		catch (Exception e)
		{
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}

	/**
	 * Connects to Twilio and generates a token which is used for making calls
	 * based on the accountSID and appsid
	 * 
	 * @param accountSid
	 *            {@link String} accountSid of agent Twilio account
	 * @param appSID
	 *            {@link String} appSid of agent Twilio account
	 * @return {@link String} token generated from Twilio
	 */
	@Path("token/{widget-id}")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String getTwilioToken(@PathParam("widget-id") Long widgetId)
	{
		// Retrieve widget based on its id
		Widget widget = WidgetUtil.getWidget(widgetId);

		if (widget == null)
			return null;

		try
		{
			/*
			 * Calls TwilioUtil method to generate a token to make calls
			 */
			return TwilioUtil.generateTwilioToken(widget);
		}
		catch (SocketTimeoutException e)
		{
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
					.entity("Request timed out. Refresh and Please try again.").build());
		}
		catch (IOException e)
		{
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
					.entity("An error occurred. Refresh and Please try again.").build());
		}
		catch (Exception e)
		{
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}

	}

	/**
	 * Connects to Twilio and fetches call logs for a given number based on the
	 * accountSID
	 * 
	 * @param widgetId
	 *            {@link String} widget id to get {@link Widget} preferences
	 * @return {@link String} form of {@link JSONArray} of call logs
	 */
	@Path("call/logs/{widget-id}/{to}")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String getCallLogsOfTwilio(@PathParam("widget-id") Long widgetId, @PathParam("to") String to)
	{
		// Retrieve widget based on its id
		Widget widget = WidgetUtil.getWidget(widgetId);

		if (widget == null)
			return null;

		try
		{

			// Calls TwilioUtil method to retrieve call logs for the "to" number
			return TwilioUtil.getCallLogsWithRecordings(widget, to).toString();
		}
		catch (SocketTimeoutException e)
		{
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
					.entity("Request timed out. Refresh and Please try again.").build());
		}
		catch (IOException e)
		{
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
					.entity("An error occurred. Refresh and Please try again.").build());
		}
		catch (Exception e)
		{
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}

	}

	/**
	 * Retrieves registered incoming phone numbers from agent's Twilio account
	 * 
	 * @param widgetId
	 *            {@link Long} plugin-id/widget id, to get {@link Widget} object
	 * @return {@link String} form of {@link JSONArray}
	 */
	@Path("incoming/numbers/{widget-id}")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String getIncomingNumbersfromTwilio(@PathParam("widget-id") Long widgetId)
	{
		// Retrieve widget based on its id
		Widget widget = WidgetUtil.getWidget(widgetId);

		if (widget == null)
			return null;
		try
		{
			// Calls TwilioUtil method to retrive incoming numbers
			return TwilioUtil.getIncomingNumber(widget).toString();
		}
		catch (SocketTimeoutException e)
		{
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
					.entity("Request timed out. Refresh and Please try again.").build());
		}
		catch (IOException e)
		{
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
					.entity("An error occurred. Refresh and Please try again.").build());
		}
		catch (Exception e)
		{
			throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
					.build());
		}
	}
}