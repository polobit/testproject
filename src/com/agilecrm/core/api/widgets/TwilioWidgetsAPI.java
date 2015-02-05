package com.agilecrm.core.api.widgets;

import java.io.IOException;
import java.net.SocketTimeoutException;

import javax.ws.rs.Consumes;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.StringUtils;
import org.json.JSONArray;

import com.agilecrm.activities.Call;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.Note;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.social.TwilioUtil;
import com.agilecrm.user.AgileUser;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;
import com.agilecrm.workflows.triggers.util.CallTriggerUtil;
import com.thirdparty.twilio.sdk.TwilioRestClient;
import com.twilio.sdk.client.TwilioCapability;
import com.twilio.sdk.client.TwilioCapability.DomainException;

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
			return TwilioUtil.getCallLogsWithRecordingsFromTwilioIO(widget, to).toString();
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

	/**
	 * Create token for twilio io.
	 * 
	 * @return {@link String} Generated token
	 */
	@Path("getglobaltoken")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String getGlobalToken()
	{
		Widget twilioio = WidgetUtil.getWidget("TwilioIO");

		// Get current logged in agile user
		Long agileUserID = AgileUser.getCurrentAgileUser().id;

		// Find an application Sid from twilio.com/user/account/apps
		String applicationSid = twilioio.getProperty("twilio_app_sid");
		TwilioCapability capability = new TwilioCapability(twilioio.getProperty("twilio_acc_sid"),
				twilioio.getProperty("twilio_auth_token"));
		capability.allowClientOutgoing(applicationSid);
		// capability.allowClientIncoming("jenny");
		capability.allowClientIncoming("agileclient" + agileUserID);

		String token = null;

		try
		{
			token = capability.generateToken(86400); // 600sec 10min,86400sec
														// 24hr
			System.out.println("token:" + token);
		}
		catch (DomainException e)
		{
			e.printStackTrace();
		}
		return token;
	}

	/**
	 * Validate entered details of twilio account for twilio saga and return
	 * twilio number if valid.
	 * 
	 * @return {@link String} Generated token
	 * @throws Exception
	 */
	@Path("validateaccount/{acc-sid}/{auth-token}")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public boolean validateTwilioAccount(@PathParam("acc-sid") String accountSID,
			@PathParam("auth-token") String authToken)
	{
		System.out.println("In validateaccount" + accountSID + " " + authToken);
		/*
		 * TwilioRestClient client = new TwilioRestClient(accountSID, authToken,
		 * null); System.out.println(client.getAccountSid());
		 */
		try
		{
			/*
			 * // Calls TwilioUtil method to retrieve numbers return
			 * TwilioUtil.getOutgoingNumberTwilioIO(client).toString();
			 */
			return TwilioUtil.checkCredentials(accountSID, authToken);
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
	 * Validate entered details of twilio account for twilio io and return
	 * verified number if valid.
	 * 
	 * @return {@link String} Generated token
	 * @throws Exception
	 */
	@Path("getverifiednumbers/{acc-sid}/{auth-token}")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String getVerifiedNumbers(@PathParam("acc-sid") String accountSID, @PathParam("auth-token") String authToken)
	{
		System.out.println("In getverifiednumbers" + accountSID + " " + authToken);
		TwilioRestClient client = new TwilioRestClient(accountSID, authToken, null);
		System.out.println(client.getAccountSid());
		try
		{
			// Calls TwilioUtil method to retrieve numbers
			return TwilioUtil.getOutgoingNumberTwilioIO(client).toString();
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
	 * Validate entered details of twilio account for twilio io and return
	 * twilio number if valid.
	 * 
	 * @return {@link String} Generated token
	 * @throws Exception
	 */
	@Path("gettwilionumbers/{acc-sid}/{auth-token}")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String getTwilioNumbers(@PathParam("acc-sid") String accountSID, @PathParam("auth-token") String authToken)
	{
		System.out.println("In gettwilionumbers" + accountSID + " " + authToken);
		TwilioRestClient client = new TwilioRestClient(accountSID, authToken, null);
		System.out.println(client.getAccountSid());
		try
		{
			// Calls TwilioUtil method to retrieve numbers
			return TwilioUtil.getIncomingNumberTwilioIO(client).toString();
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

	@Path("createappsid/{acc-sid}/{auth-token}/{number-sid}/{record}/{twimlet-url}")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String createAppSid(@PathParam("acc-sid") String accountSID, @PathParam("auth-token") String authToken,
			@PathParam("number-sid") String numberSid, @PathParam("record") String record,
			@PathParam("twimlet-url") String twimletUrl)
	{
		System.out.println("In createAppSid" + accountSID + " " + authToken + " " + numberSid + " " + record);

		try
		{
			/*
			 * Create a Twilio Application for Agile in Agile User Twilio
			 * account
			 */
			return TwilioUtil.createAppSidTwilioIO(accountSID, authToken, numberSid, record, twimletUrl);
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
	 * 
	 * @author Purushotham
	 * @created 28-Nov-2014
	 * 
	 */
	@Path("getlastcall/{acc-sid}/{auth-token}/{call-sid}/{parent}")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String getTwilioLastCallLog(@PathParam("acc-sid") String accountSID,
			@PathParam("auth-token") String authToken, @PathParam("call-sid") String callSID,
			@PathParam("parent") String isParent)
	{

		try
		{
			if (isParent.equals("true"))
				return TwilioUtil.getLastCallLogStatus(accountSID, authToken, callSID).toString();
			else
				return TwilioUtil.getLastChildCallLogStatus(accountSID, authToken, callSID).toString();
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
	 * 
	 * @author Purushotham
	 * @created 28-Nov-2014
	 * 
	 */
	@Path("savecallactivity")
	@POST
	@Produces(MediaType.TEXT_PLAIN)
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public String saveCallActivity(@FormParam("direction") String direction,@FormParam("phone") String phone,@FormParam("status") String status,@FormParam("duration") String duration) {		
	    
	    	if (StringUtils.isBlank(phone))
		    return "";

		Contact contact = ContactUtil.searchContactByPhoneNumber(phone);

		if (direction.equalsIgnoreCase("outbound-dial"))
		{
		    ActivityUtil.createLogForCalls(Call.SERVICE_TWILIO, phone, Call.OUTBOUND, status, duration, contact);

		    // Trigger for outbound
		    CallTriggerUtil.executeTriggerForCall(contact, Call.SERVICE_TWILIO, Call.OUTBOUND, status, duration);
		}

		if (direction.equalsIgnoreCase("inbound"))
		{
		    ActivityUtil.createLogForCalls(Call.SERVICE_TWILIO, phone, Call.INBOUND, status, duration, contact);

		    // Trigger for inbound
		    CallTriggerUtil.executeTriggerForCall(contact,  Call.SERVICE_TWILIO, Call.INBOUND, status, duration);
		}
	
		return "";
	}

	/**
	 * 
	 * @author Purushotham
	 * @created 28-Nov-2014
	 * 
	 */
	@Path("autosavenote")
	@POST
	@Produces(MediaType.TEXT_PLAIN)
	@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
	public String autoSaveNote(@FormParam("subject") String subject, @FormParam("message") String message,
			@FormParam("contactid") String contactid)
	{
		Long contactId = Long.parseLong(contactid);
		Note note = new Note(subject, message);
		note.addRelatedContacts(contactId.toString());
		note.save();
		return "";
	}
	
	/**
	 * 
	 * @author Purushotham
	 * @created 10-Dec-2014
	 *
	 */
	
	@Path("setvoicemail/{acc-sid}/{auth-token}/{call-sid}/{file-selected}")
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public String setVoiceMailRedirect(@PathParam("acc-sid") String accountSID,
			@PathParam("auth-token") String authToken, @PathParam("call-sid") String callSID, @PathParam("file-selected") String fileSelected)
	{

		try
		{
			TwilioUtil.sendVoiceMailRedirect(accountSID, authToken, callSID, fileSelected);
			return "{}";//empty JSON Object
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
	@Path("call/nextlogs/{widget-id}/{to}/{page}/{pageToken}")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String getCallLogsByPage(@PathParam("widget-id") Long widgetId, @PathParam("to") String to,
			@PathParam("page") String page, @PathParam("pageToken") String pageToken)
	{
		// Retrieve widget based on its id
		Widget widget = WidgetUtil.getWidget(widgetId);

		if (widget == null)
			return null;

		try
		{

			// Calls TwilioUtil method to retrieve call logs for the "to" number
			return TwilioUtil.getCallLogsByPage(widget, to, page, pageToken).toString();
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