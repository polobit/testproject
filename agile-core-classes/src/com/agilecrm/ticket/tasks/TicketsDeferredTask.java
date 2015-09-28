package com.agilecrm.ticket.tasks;

import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.agilecrm.ticket.entitys.TicketGroups;
import com.agilecrm.ticket.entitys.TicketNotes.CREATED_BY;
import com.agilecrm.ticket.entitys.TicketNotes.NOTE_TYPE;
import com.agilecrm.ticket.entitys.Tickets.Source;
import com.agilecrm.ticket.utils.TicketGroupUtil;
import com.agilecrm.ticket.utils.TicketUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.campaignio.urlshortener.util.Base62;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * 
 * @author Sasi on 28-Sep-2015
 * 
 */
public class TicketsDeferredTask implements DeferredTask
{
	String mandrillResponse = "";

	public TicketsDeferredTask(String mandrillResponse)
	{
		this.mandrillResponse = mandrillResponse;
	}

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Override
	public void run()
	{
		try
		{
			JSONObject mandrillInboundJSON = new JSONArray(mandrillResponse).getJSONObject(0);
			
			if (mandrillInboundJSON == null || !mandrillInboundJSON.has("msg"))
				return;

			JSONObject msgJSON = mandrillInboundJSON.getJSONObject("msg");

			if (!msgJSON.has("headers"))
				return;

			JSONArray recipientsArray = msgJSON.getJSONArray("to");

			if (recipientsArray == null || recipientsArray.length() == 0)
				return;

			String toAddress = "";
			for (int i = 0; i < recipientsArray.length(); i++)
			{
				toAddress = recipientsArray.getJSONArray(i).getString(0);

				if (toAddress.endsWith("helptor"))
					break;
			}

			System.out.println("toAddress: " + toAddress);

			String[] toAddressArray = toAddress.replace("@helptor.com", "").split("\\+");

			if (toAddressArray.length != 2)
				return;

			String namespace = toAddressArray[0];
			Long groupID = Base62.fromOtherBaseToDecimal(62, toAddressArray[1]);

			System.out.println("DomainName: " + namespace);
			System.out.println("GroupID: " + groupID);

			TicketGroups ticketGroup = TicketGroupUtil.getTicketGroupById(namespace, groupID);

			if (DomainUserUtil.count(namespace) <= 0)
			{
				System.out.println("Invalid domain: " + namespace);
				return;
			}
			if (ticketGroup == null)
			{
				System.out.println("Invalid groupID: " + groupID);
				return;
			}

			JSONObject mimeHeaders = msgJSON.getJSONObject("headers");

			boolean isNewTicket = true;

			if (mimeHeaders.has("In-Reply-To"))
				isNewTicket = false;

			if (isNewTicket)
			{
				TicketUtil.createTicket(groupID, true, msgJSON.getString("from_name"), msgJSON.getString("from_email"),
						msgJSON.getString("subject"), "", msgJSON.getString("text"), msgJSON.getString("html"), Source.EMAIL, false,
						mimeHeaders.getString("X-Originating-Ip"), CREATED_BY.REQUESTER, NOTE_TYPE.PUBLIC);
			}
			else
			{

			}
		}
		catch (Exception e)
		{
			System.out.println("ExceptionUtils.getFullStackTrace(e): " + ExceptionUtils.getFullStackTrace(e));
			e.printStackTrace();
		}
	}
}
