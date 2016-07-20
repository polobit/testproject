package com.agilecrm.ssologin;

import java.text.ParseException;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.agilecrm.ssologin.SingleSignOn;
import com.agilecrm.ssologin.SingleSignOnUtil;
import com.agilecrm.subscription.Subscription;
import com.agilecrm.subscription.SubscriptionUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.webhooks.triggers.util.Webhook;
import com.agilecrm.webhooks.triggers.util.WebhookTriggerUtil;
import com.google.appengine.api.NamespaceManager;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.SignedJWT;

@Path("/api/sso/jwt")
public class SingleSignOnAPI {

    /**
     * Gets list of users of a domain
     * 
     * @return list of domain users
     */
    @GET
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public SingleSignOn iniatesharedKeyUsers() {
	SingleSignOn secretKey = SingleSignOnUtil.getSecreteKey();
	if (secretKey != null) {
	    System.out.println("seeeee == " + secretKey.toString());
	    return secretKey;
	}

	return SingleSignOnUtil.createSingleSignOnKey();

    }
    
    
    /**
     * Delete by current domain
     * 
     */
    @DELETE
    @Produces({ MediaType.APPLICATION_JSON })
    public void deleteSso()
    {
	SingleSignOn sso = SingleSignOnUtil.getSecreteKey();
	if (sso != null)
	    SingleSignOnUtil.deleteSecreteKey(sso.id);

	Response.ok();
    }

    /**
     * 
     * @param webhook
     * 
     * @return response ok
     */
    @PUT
    @Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
    @Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
    public void updateSso(SingleSignOn sso) {
	this.saveSSso(sso);

	Response.ok();
    }

    private void saveSSso(SingleSignOn sso) {
	try {
	    String domain = NamespaceManager.get();
	    	sso.domain = domain;

	    	sso.save();

		Response.ok();
	} catch (Exception e) {
	    e.printStackTrace();
	    throw new WebApplicationException(Response
		    .status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}

    }

    /**
     * 
     * @param id
     *            Testing purpose Webhook only return webhook
     */
    @Path("/jwt")
    @GET
    @Produces({ MediaType.APPLICATION_JSON })
    public String getWebhook(@QueryParam("jwt") String jwt) {

	// On the consumer side, parse the JWS and verify its HMAC
	SignedJWT signedJWT1 = null;
	try {
	    signedJWT1 = SignedJWT.parse(jwt);
	} catch (ParseException e) {
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	System.out.println("ggggggggggggggggggggggggggggg = "
		+ SingleSignOnUtil.getSecreteKey().secretKey.toString());
	JWSVerifier verifier = new MACVerifier(
		SingleSignOnUtil.getSecreteKey().secretKey.toString());
	try {
	    System.out.println(signedJWT1.verify(verifier));
	    System.out.println(signedJWT1.getJWTClaimsSet().getSubject());
	} catch (Exception e) {
	    // TODO: handle exception
	}

	return null;
    }
}