package com.agilecrm.core.api;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.account.RecaptchaGateway;
import com.agilecrm.account.util.RecaptchaGatewayUtil;

/**
 * <code>RecaptchaGatewayAPI</code> is the api class for Recaptcha Gateways. It handles
 * CRUD operations of RecaptchaGateway
 * 
 * @author Priyanka
 * 
 */
@Path("/api/recaptcha-gateway")
public class RecaptchaGatewayAPI
{

    /**
     * Saves Recaptcha gateway
     * 
     * @param RecaptchaGateway
     * @return
     */
    @PUT
    @POST
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public RecaptchaGateway saveRecaptchaGateway(RecaptchaGateway recaptchaGateway)
    {
	return RecaptchaGatewayUtil.saveRecaptchaGateway(recaptchaGateway);
    }

    /**
     * Returns Recaptcha gateway
     * 
     * @return RecaptchaGateway
     */
    @GET
    @Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    public RecaptchaGateway getRecaptchaGateway()
    {
	return RecaptchaGatewayUtil.getRecaptchaGateway();
    }

    /**
     * Deletes Recaptcha gateway object
     */
    @DELETE
    public void deleteRecaptchaGateway()
    {
	RecaptchaGatewayUtil.deleteRecaptchaGateway();
    }

}
