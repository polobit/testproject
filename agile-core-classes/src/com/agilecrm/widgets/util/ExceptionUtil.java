package com.agilecrm.widgets.util;

import java.io.IOException;
import java.net.SocketTimeoutException;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import org.scribe.exceptions.OAuthException;

public class ExceptionUtil {
	public static WebApplicationException catchWebException(Exception exception) {
		// Check for the Socket Timeout Exception.
		if (exception instanceof SocketTimeoutException) {
			return new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST)
					.entity("Request timed out. Refresh and Please try again.")
					.build());
			// Check for the IO Exception.
		} else if (exception instanceof IOException) {
			return new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST)
					.entity("An error occurred. Refresh and Please try again.")
					.build());
			// Checks for the Runtime Exception.
		} else if (exception instanceof RuntimeException) {
			// InvalidApiKeyException is added to the message of runtime
			// exception by in helpScout-api.jar instead of raising it as a
			// exception.
			if (exception.getMessage().indexOf("InvalidApiKeyException") > 0) {
				return new WebApplicationException(Response
						.status(Response.Status.BAD_REQUEST)
						.entity("Invalid API Key.").build());
			}
			return new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST)
					.entity("Request timed out. Refresh and Please try again.")
					.build());
			// For all Exceptions which was not matched with above Exceptions.
		} else {
			return new WebApplicationException(Response
					.status(Response.Status.BAD_REQUEST)
					.entity(exception.getMessage()).build());
		}
	}

	public static void catchException(Exception exception) {
		if (exception instanceof OAuthException) {
			exception.printStackTrace();
		}else{
			
		}
	}
}
