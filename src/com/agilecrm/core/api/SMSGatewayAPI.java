package com.agilecrm.core.api;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.agilecrm.account.util.SMSGatewayUtil;
import com.agilecrm.widgets.Widget;

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
    	
    		if(!SMSGatewayUtil.checkCredentials(smsGatewayWidget)){
    			throw new Exception("Error saving SMS Widget. Please check the credentials" );
    		}
			
		}catch (Exception e)
		{
			 throw new WebApplicationException(Response.status(javax.ws.rs.core.Response.Status.BAD_REQUEST)
					    .entity(e.getMessage()).build());
		}
    	
	smsGatewayWidget.save();

	return smsGatewayWidget;
    }
	
}
