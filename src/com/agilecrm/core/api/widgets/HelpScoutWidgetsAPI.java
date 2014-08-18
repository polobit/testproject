package com.agilecrm.core.api.widgets;

import java.io.IOException;
import java.net.SocketTimeoutException;

import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.contact.Contact;
import com.agilecrm.social.HelpScoutUtil;
import com.agilecrm.widgets.Widget;
import com.agilecrm.widgets.util.WidgetUtil;

/**
 * <code>HelpScoutWidgetsAPI</code> class includes REST calls to interact with
 * {@link HelpScout} class
 * 
 * <p>
 * It is called from client side for adding, retrieving and updating tickets in
 * HelpScout
 * </p>
 * 
 * @author Saikiran
 * @since April 2014
 * 
 */
@Path("/api/widgets/helpscout")
public class HelpScoutWidgetsAPI
{

    /**
     * Retrieves Customer Information from HelpScout based on the email and
     * {@link Widget} Id provided
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param email
     *            {@link String} email of the {@link Contact}
     * @return {@link String} form of Tickets {@link JSONArray}
     */
    @Path("get/{widget-id}/{email}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getCustomerByEmail(@PathParam("widget-id") Long widgetId, @PathParam("email") String email)
    {
	try
	{
	    // Retrieves widget based on its id
	    Widget widget = WidgetUtil.getWidget(widgetId);

	    if (widget == null)
		return null;

	    // Calls Help Scout to retrieve tickets/Mails for contacts email
	    return HelpScoutUtil.getCustomerByEmail(widget, email);
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
	catch (RuntimeException e)
	{
	    // InvalidApiKeyException is added to the message of runtime
	    // exception by in helpScout-api.jar instead of raising it as a
	    // exception.
	    if (e.getMessage().indexOf("InvalidApiKeyException") > 0)
		throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
			.entity("Invalid API Key.").build());
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and Please try again.").build());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }

    /**
     * Retrieves the list of values to fill the create Conversation form based
     * on the API_Key in the {@link Widget}
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @return the JSON String containing the value required to fill the create
     *         Conversation form.
     */
    @Path("get/createform/{widget-id}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public static String getCreateFormData(@PathParam("widget-id") Long widgetId)
    {
	try
	{
	    // Retrieves widget based on its id
	    Widget widget = WidgetUtil.getWidget(widgetId);

	    if (widget == null)
		return null;

	    // Calls Help Scout to retrieve tickets/Mails for contacts email
	    return HelpScoutUtil.getCreateFormData(widget);
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
	catch (RuntimeException e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and Please try again.").build());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }

    /**
     * Retrieves Conversations from HelpScout based on the Customer Id and
     * {@link Widget} Id provided
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param customerId
     *            {@link Long} HelpScout customer Id of the {@link Contact}
     * @return {@link String} form of Tickets {@link JSONArray}
     */
    @Path("get/{widget-id}/customer/{customer-id}")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public JSONObject getConversationsFromHelpScout(@PathParam("widget-id") Long widgetId,
	    @PathParam("customer-id") int customerId)
    {
	try
	{
	    // Retrieves widget based on its id
	    Widget widget = WidgetUtil.getWidget(widgetId);

	    if (widget == null)
		return null;

	    // Calls Help Scout to retrieve tickets/Mails for contacts email
	    return HelpScoutUtil.getCustomerConversations(widget, customerId);
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
	catch (RuntimeException e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST)
		    .entity("Request timed out. Refresh and Please try again.").build());
	}
	catch (Exception e)
	{
	    throw new WebApplicationException(Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage())
		    .build());
	}
    }

    /**
     * Adds a Conversation to HelpScout based on the given parameters and
     * {@link Widget} id
     * 
     * @param widgetId
     *            {@link Long} plugin-id/widget id, to get {@link Widget} object
     * @param customerId
     *            {@link String} Id of the {@link Contact} to be added to
     *            Conversation
     * @param subject
     *            {@link String} subject of the Conversation to be added
     * @param email
     *            {@link String} email of the {@link Contact} to be added to
     *            Conversation
     * @param description
     *            {@link String} description of the Conversation to be added
     * @param type
     *            {@link String} type of the conversation.
     * @param assignTo
     *            {@link Long} the user id of the assignee.
     * @param tags
     *            {@link String} tags to be added to conversation.
     * @return {@link String} form of Conversation added
     */
    @Path("add/{widget-id}")
    @POST
    @Produces(MediaType.TEXT_PLAIN)
    public String addConversationInHelpScout(@PathParam("widget-id") Long widgetId,
	    @FormParam("customerId") Long customerId, @FormParam("subject") String subject,
	    @FormParam("email") String email, @FormParam("mailbox") Long mailbox,
	    @FormParam("message") String description, @FormParam("type") String type,
	    @FormParam("assignTo") Long assignTo, @FormParam("tags") String tags)
    {
	try
	{
	    // Retrieves widget based on its id
	    Widget widget = WidgetUtil.getWidget(widgetId);

	    if (widget == null)
		return null;
	    System.out.println(customerId + " " + subject + " " + email + " " + mailbox + " " + description);
	    // Calls HelpScoutUtil method to create a conversation in HelpScout.
	    return HelpScoutUtil.addConversation(widget, customerId, email, mailbox, subject, description, type,
		    assignTo, tags);
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
