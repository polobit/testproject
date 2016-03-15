package com.agilecrm.ticket.servlets;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.List;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import com.agilecrm.account.util.AccountPrefsUtil;
import com.agilecrm.ticket.entitys.TicketGroups;
import com.agilecrm.ticket.entitys.TicketNotes;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.entitys.TicketNotes.NOTE_TYPE;
import com.agilecrm.ticket.utils.TicketGroupUtil;
import com.agilecrm.ticket.utils.TicketNotesUtil;
import com.agilecrm.ticket.utils.TicketsUtil;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.DateUtil;
import com.agilecrm.util.email.MustacheUtil;
import com.itextpdf.text.Document;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.tool.xml.XMLWorkerHelper;
import com.itextpdf.text.PageSize;
/**
 * Servlet implementation class InvoicePdfServlet
 */
public class TicketsPdfServlet extends HttpServlet
{
	public static final String DEST = "/home/agile20/Desktop/my.pdf";
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public TicketsPdfServlet()
	{
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		// TODO Auto-generated method stub
		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException,
			IOException
	{
		
		// TODO Auto-generated method stub
		try
		{			
			JSONArray notesArray = new JSONArray();
			
			String ticket_id = request.getParameter("ticket_id");
			
			long ticketId = Long.parseLong(ticket_id);
			
			Tickets ticket = TicketsUtil.getTicketByID(ticketId);
			System.out.println(ticket);
			
			JSONObject json = new JSONObject();
			
			TicketGroups group = TicketGroupUtil.getTicketGroupById(ticket.groupID);
			
			List<TicketNotes> notesList = TicketNotesUtil.getTicketNotes(ticketId, "-created_time");
			
			String groupName = group.group_name;
			
			String agentName = DomainUserUtil.getDomainUser(ticket.assigneeID).name;

			if (StringUtils.isBlank(agentName))
				agentName = "";
			
			json.put("subject", ticket.subject);
			json.put("status", ticket.status.toString().toLowerCase());
			json.put("type", ticket.type.toString().toLowerCase());
			json.put("priority", ticket.priority.toString().toLowerCase());
			json.put("ticket_id", ticket.id);
			json.put("requester_email", ticket.requester_email);
			json.put("group_name", groupName);
			json.put("agent_name", agentName);
			json.put("ticket_created_time", DateUtil.getCalendarString(ticket.created_time, "MMM d, h:mm a (z)", ""));
			json.put("requester_name", ticket.requester_name);
			json.put("tracking_img", TicketNotesUtil.appendTrackingImage(ticket.id, notesList.get(0).id));

			String companyName = AccountPrefsUtil.getAccountPrefs().company_name;

			if (companyName != null)
				json.put("company_name", companyName);
			
			for (TicketNotes notes : notesList)
				
			{
				if (notes.note_type == NOTE_TYPE.PRIVATE)
					continue;

				JSONObject eachNoteJSON = TicketNotesUtil.getFormattedEmailNoteJSON(notes, ticket.getContact());

				if (eachNoteJSON != null)
					notesArray.put(eachNoteJSON);
			}
			json.put("note_json_array", notesArray);
			
			
			String htmlText = "";
             // Add all notes
		   
//		    for (TicketNotes notes : notesList)
//			{  
//			htmlText = htmlText.concat(notes.html_text);
//			}
//			System.out.println("htmlText "+htmlText);
//			
			
			String ticketTemplate = MustacheUtil.templatize("ticket_pdf_download_html.html",json);
			System.out.println("json "+json);			
			response.setContentType("application/pdf");
			response.setHeader("Content-Disposition","attachment; filename=TicketDetails.pdf");
			
			Document document = new Document();
			PdfWriter writer = PdfWriter.getInstance(document, response.getOutputStream());
			
			document.open();
			document.setPageSize(PageSize.A4);
			
			InputStream is = new ByteArrayInputStream(ticketTemplate.getBytes());
			XMLWorkerHelper.getInstance().parseXHtml(writer, document, is);

			document.close();
		}
		
		catch (Exception e)
		{
			// TODO Auto-generated catch block
			System.out.println(ExceptionUtils.getMessage(e));
			e.printStackTrace();
		}
	
	}
	
}
