package com.agilecrm.core.api;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONObject;

import com.agilecrm.account.util.SMSGatewayUtil;
import com.agilecrm.widgets.Widget;
import com.thirdparty.twilio.TwilioSMSUtil;

/**
 * <code>SMSGatewayAPI</code> is the API class for SMSGateways
 * 
 * @author Bhasuri
 */
@Path("/api/sms-gateway")
public class SMSGatewayAPI
{
	/**
	 * Returns current SMSGateway Widget
	 * 
	 * @return
	 */
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public Widget getSMSGateway()
	{
		return SMSGatewayUtil.getSMSGatewayWidget();
	}

	/**
	 * Updates SMS Gateway widget
	 * 
	 * @param smsGatewayWidget
	 * @return
	 */
	@PUT
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Widget updateSMSGatewayWidget(Widget smsGatewayWidget)
	{

		saveSMSGatewayWidget(smsGatewayWidget);
		return smsGatewayWidget;
	}

	/**
	 * Saves SMS Gateway widget
	 * 
	 * @param smsGatewayWidget
	 * @return
	 */
	@POST
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public Widget saveSMSGatewayWidget(Widget smsGatewayWidget)
	{
		try
		{

			if (!SMSGatewayUtil.checkCredentials(smsGatewayWidget))
				throw new Exception("Incorrect Authentication ID or Auth token");

			if (SMSGatewayUtil.incomingNumbers(smsGatewayWidget).isEmpty())
				throw new Exception(
						"You do not have a number purchased for this account. You can purchase one <a href='"
								+ SMSGatewayUtil.getLink(smsGatewayWidget) + "' target='_blank'>" + "here" + "</a>");

			smsGatewayWidget.save();
		}
		catch (Exception e)
		{
			throw new WebApplicationException(Response.status(javax.ws.rs.core.Response.Status.BAD_REQUEST)
					.entity(e.getMessage()).build());
		}

		return smsGatewayWidget;
	}

	/**
	 * Returns current SMSGateway numbers list
	 * 
	 * @return
	 */
	@Path("{widget_name}")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<String> getNumbers(@PathParam("widget_name") String name)
	{

		if (name.equals("twilio"))
			return TwilioSMSUtil.currentTwilioNumbers();
		return null;
	}

	@Path("{widget_name}/logs")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public JSONObject getLogs(@PathParam("widget_name") String name)
	{

		if (name.equals("twilio"))
			return TwilioSMSUtil.currentTwilioLogs();
		return null;
	}

	/**
	 * Returns current SMSGateway numbers list
	 * 
	 * @return
	 */
	@Path("/numbers")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public List<String> getGatewayNumbers()
	{

		return SMSGatewayUtil.currentGatewayNumbers();
	}

	@Path("/SMSlogs")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public JSONObject getSMSLogs()
	{

		return SMSGatewayUtil.getSMSLogs();
	}
}