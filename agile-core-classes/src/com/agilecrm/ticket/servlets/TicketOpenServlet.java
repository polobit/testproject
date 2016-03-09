package com.agilecrm.ticket.servlets;

import java.io.IOException;
import java.net.URL;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.ticket.utils.TicketNotesUtil;
import com.agilecrm.util.NamespaceUtil;
import com.google.appengine.api.NamespaceManager;

/**
 * 
 * @author Mantra
 * 
 */
public class TicketOpenServlet extends HttpServlet
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public void service(HttpServletRequest request, HttpServletResponse res) throws IOException
	{
		// Redirect to image.
		res.sendRedirect("/img/1X1.png");

		String ticketID = request.getParameter("t");
		String notesID = request.getParameter("n");

		String oldNamespace = NamespaceManager.get();
		
		try
		{
			// Fetches domain name from url. E.g. From admin.agilecrm.com,
			// returns
			// admin
			URL url = new URL(request.getRequestURL().toString());
			String namespace = NamespaceUtil.getNamespaceFromURL(url);

			if (StringUtils.isEmpty(namespace))
				return;

			NamespaceManager.set(namespace);

			TicketNotesUtil.ticketNoteViewedTime(ticketID, notesID);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		finally
		{
		    NamespaceManager.set(oldNamespace);
		}
	}
}
