package com.agilecrm.core.api.widgets;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.NexmoSMS;
import com.agilecrm.activities.util.ActivityUtil;
import com.agilecrm.activities.util.CategoriesUtil;
import com.agilecrm.social.NexmoUtil;
import com.agilecrm.social.TwilioUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.ExceptionUtil;
import com.agilecrm.widgets.util.WidgetUtil;

/**
 * <code>TwilioWidgetsAPI</code> class includes REST calls to interact with
 * {@link TwilioUtil} class
 * 
 * <p>
 * It is called from client side for retrieving SMS logs, retrieving numbers,
 * verifying numbers, create application SID and so on
 * </p>
 * 
 * @author Priyanka
 * @since January 2017
 * 
 */
@Path("/api/widgets/nexmo")
public class NexmoWidgetAPI {

	private CategoriesUtil categoriesUtil = null;

	/**
	 * Default constructor.
	 */

	public NexmoWidgetAPI() {
		categoriesUtil = new CategoriesUtil();
	}

	/**
	 * Validate entered details of twilio account for twilio saga and return
	 * Nexmo number if valid.
	 * 
	 * @return {@link String} Generated token
	 * @throws Exception
	 */
	@Path("/validateaccount")
	@GET
	@Produces({ MediaType.APPLICATION_JSON})
	public boolean validateNexmoAccount(@QueryParam("apikey") String apikey,
			@QueryParam("secretkey") String secretkey) {
		System.out.println("In validateaccount" + apikey + " " + secretkey);
		try {
			return NexmoUtil.checkNexmoAuthentication(apikey, secretkey);
			//return NexmoSMS.checkNexmoAuthentication(apikey, secretkey);
		} catch (Exception e) {
			throw ExceptionUtil.catchWebException(e);
		}
	}

	/***
	 * <p>
	 * Method for sending the nexmo sms through nexmo
	 * </p>
	 * 
	 * @param to
	 * @param message
	 * @param contactId
	 * @throws JSONException
	 */
	@Path("/send-nexmo-sms")
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public void sendSMS(@QueryParam("to") String to,
			@QueryParam("message") String message,
			@QueryParam("contactId") String contactId) throws JSONException {
			System.out.println("message" + message);

			NexmoUtil.sendNexmoSMS(to, message, contactId);
			
	}

	/****
	 * <p>
	 * Method to verify the nexmo numbers which is in user account
	 * </p>
	 * 
	 * @param apikey
	 * @param secretkey
	 * @return
	 */

	@Path("getnexmonumbers/{apikey}/{secretkey}")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String getNexmoNumber(@PathParam("apikey") String apikey,
			@PathParam("secretkey") String secretkey) {
		System.out.println("In get nexmo number" + apikey + " " + secretkey);
		try {
			// Calls NexmoUtil method to retrieve numbers return
			// return NexmoUtil.getNexmoFromNumbers(apikey, secretkey);

			return "[\"+919908164425\",\"+918121528351\",\"+919989875839\"]";
		} catch (Exception e) {
			throw ExceptionUtil.catchWebException(e);
		}

	}
}
