package com.agilecrm.core.api.widgets;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/api/widgets/knowlarity")
public class KnowlarityAPI {

	@Path("get/{widget-id}/{keyID}")
	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String getBainTreeDetails(@PathParam("widget-id") Long widgetId,
			@PathParam("keyID") String keyID) {
		return null;
	}

}
