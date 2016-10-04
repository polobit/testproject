package com.agilecrm.account.util;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import org.codehaus.jackson.map.ObjectMapper;

import com.agilecrm.account.RecaptchaGateway;
import com.agilecrm.util.CacheUtil;
import com.agilecrm.util.HTTPUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.Widget.IntegrationType;
import com.agilecrm.widgets.Widget.WidgetType;
import com.agilecrm.widgets.util.WidgetUtil;
import com.google.appengine.api.NamespaceManager;
/**
 * 
 * @author Priyanka
 *
 */

public class RecaptchaGatewayUtil {
	
	/**
	 * This site key is used for permanent link
	 */
	public final static String GOOGLE_RECAPTCHA_DATA_SITE_KEY = "6Ldk9AcUAAAAAGFWY_ZB_y36DrE_8ee5wa08-jdG";
	
	private final static String GOOGLE_RECAPTCHA_URL = "https://www.google.com/recaptcha/api/siteverify";
	
	/**
	 * 
	 * @param recaptchaGateway
	 * @return recaptcahgateway 
	 */
	 public static RecaptchaGateway saveRecaptchaGateway(RecaptchaGateway recaptchaGateway)
	    {
		 try
			{
			 System.out.println("Validating Google Recaptcha api key.");
			    // Check given api keys.and data site is valid or not
				checkRecaptchaSettings(recaptchaGateway);
					
			}
			catch (Exception e)
			{
			    throw new WebApplicationException(Response.status(javax.ws.rs.core.Response.Status.BAD_REQUEST)
				    .entity(e.getMessage()).build());
			}

		try
		{
		    Widget widget = WidgetUtil.getWidgetByNameAndType("RecaptchaGateway", IntegrationType.RECAPTCHA);

		    if (widget == null)
		    {
			widget = new Widget("RecaptchaGateway",
				"Recaptcha Gateway supports google recaptcha verfication for Forms", "", "", "", "",
				WidgetType.INTEGRATIONS, IntegrationType.RECAPTCHA);
		    }

		    ObjectMapper map = new ObjectMapper();
		    widget.prefs = map.writeValueAsString(recaptchaGateway);
		    widget.save();

		    if (recaptchaGateway != null)
			CacheUtil.setCache(NamespaceManager.get() + "_recaptcha_gateway", recaptchaGateway);

		    return recaptchaGateway;
		}
		catch (Exception e)
		{
		    e.printStackTrace();
		    return null;
		}
	  }
	 
	 /**
	  * 
	  * @return
	  * 			RecaptchaGateway
	  */
	 
	 public static RecaptchaGateway getRecaptchaGateway()
	    {

		// Get from Cache
		RecaptchaGateway gateway = (RecaptchaGateway) CacheUtil.getCache(NamespaceManager.get() + "_recaptcha_gateway");

		if (gateway != null)
		{
		    System.out.println("Returning gateway from Cache...");
		    return gateway;
		}

		Widget widget = WidgetUtil.getWidgetByNameAndType("RecaptchaGateway", IntegrationType.RECAPTCHA);

		// If no widget return null
		if (widget == null)
		    return null;

		RecaptchaGateway recaptchaGateway = null;

		try
		{
		    // Fetch from widget prefs and wrap to RecaptchaGateway
		    ObjectMapper mapper = new ObjectMapper();
		    recaptchaGateway = mapper.readValue(widget.prefs, RecaptchaGateway.class);
		}
		catch (Exception e)
		{
		    System.out.println("Exception occured while getting google recaptcha gateway from object mapper..." + e.getMessage());
		    e.printStackTrace();
		    return null;
		}

		return recaptchaGateway;
	    }
	 
	    /**
	     * Deletes Recaptcha Gateway widget from datastore and memcache
	     */
	    public static void deleteRecaptchaGateway()
	    {
		try
		{
		    // Delete from cache
		    CacheUtil.deleteCache(NamespaceManager.get() + "_recaptcha_gateway");
		}
		catch (Exception e)
		{
		    System.err.println("Exception occured while deleting Recaptcha gateway from cache..." + e.getMessage());
		}

		Widget widget = WidgetUtil.getWidgetByNameAndType("RecaptchaGateway", IntegrationType.RECAPTCHA);
		widget.delete();
	    }

	  private static String checkRecaptchaSettings(RecaptchaGateway recaptchaGateway)throws Exception
	  {
		  String url = GOOGLE_RECAPTCHA_URL + "?secret=" + recaptchaGateway.api_key;
		  String response = "";
		  try
		    {
				  response = HTTPUtil.accessURLUsingPost(url, null);
		    }
		   catch (Exception e)
			{
			   throw new Exception("Error occured while saving Recaptcha Gateway.");
			}
		  
		  if(response.contains("invalid-input-secret"))
		    throw new Exception("Error Saving:Site key and Secrete key is invalid.");
		  
		  return "";
			  
		 }
}
