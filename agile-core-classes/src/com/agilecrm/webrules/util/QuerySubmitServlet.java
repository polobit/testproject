package com.agilecrm.webrules.util;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.contact.Contact;
import com.agilecrm.contact.util.ContactUtil;
import com.agilecrm.ticket.entitys.TicketGroups;
import com.agilecrm.ticket.entitys.TicketLabels;
import com.agilecrm.ticket.entitys.TicketNotes;
import com.agilecrm.ticket.entitys.TicketStats;
import com.agilecrm.ticket.entitys.Tickets;
import com.agilecrm.ticket.entitys.TicketNotes.CREATED_BY;
import com.agilecrm.ticket.entitys.TicketNotes.NOTE_TYPE;
import com.agilecrm.ticket.utils.TicketStatsUtil;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.util.JSAPIUtil;
import com.agilecrm.workflows.Workflow;
import com.agilecrm.workflows.status.CampaignStatus.Status;
import com.agilecrm.workflows.status.util.CampaignStatusUtil;
import com.campaignio.cron.util.CronUtil;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Key;

@SuppressWarnings("serial")
public class QuerySubmitServlet extends HttpServlet
{
    public void service(HttpServletRequest request, HttpServletResponse response) throws IOException
    {
	try
	{
	    
	    // checking for empty email and query
	    String email = request.getParameter("email");
	    String query = request.getParameter("querytext");
	    if (email.isEmpty())
		throw new Exception("Please provide email address.");
	    if (query.isEmpty())
		throw new Exception("Please provide Query.");
	    
	    Tickets ticket = new Tickets();
	    ticket.requester_email = email;
	    ticket.requester_name = request.getParameter("name");
	    ticket.html_text = query;
	    ticket.subject = query;
	    ticket.assigned_to_group = true;
	    boolean attachmentExists = false;
	    List<String> cc_emails = new ArrayList<String>();
	    Key<DomainUser> ownerKey = new Key<DomainUser>(DomainUser.class,
		    DomainUserUtil.getDomainOwner(NamespaceManager.get()).id);
	    TicketGroups ticketGroups = TicketGroups.ticketGroupsDao.ofy().query(TicketGroups.class)
		    .filter("group_name", "Support").filter("owner_key", ownerKey).get();
	    ticket.groupID = ticketGroups.id;
	    
	    String fromName = ticket.requester_email.substring(0, ticket.requester_email.lastIndexOf("@"));
	    
	    if (StringUtils.isBlank(ticket.requester_name))
		ticket.requester_name = fromName;
	    String html_text = ticket.html_text;
	    html_text = html_text.replaceAll("(\r\n|\n\r|\r|\n)", "<br/>");
	    String plain_text = html_text;
	    ticket.created_time = new Date().getTime();
	    ticket.last_updated_time = new Date().getTime();
	    List<Key<TicketLabels>> labels_keys_list = new ArrayList<Key<TicketLabels>>();
	    // Creating new Ticket in Ticket table
	    ticket = new Tickets(ticket.groupID, null, ticket.requester_name, ticket.requester_email, ticket.subject,
		    cc_emails, plain_text, ticket.status, ticket.type, ticket.priority, ticket.source,
		    ticket.created_by, attachmentExists, "", labels_keys_list);
	    
	    // Creating new Notes in TicketNotes table
	    TicketNotes notes = new TicketNotes(ticket.id, ticket.groupID, null, CREATED_BY.REQUESTER,
		    ticket.requester_name, ticket.requester_email, plain_text, html_text, NOTE_TYPE.PUBLIC,
		    ticket.attachments_list, "", true);
	    notes.save();
	    
	    // Updating ticket count DB
	    TicketStatsUtil.updateEntity(TicketStats.TICKETS_COUNT);
	    
	    Contact contact = ContactUtil.searchContactByEmail(email);
	    // for add-campaign
	    String addCampaign_id = request.getParameter("add-campaign");
	    if (StringUtils.isNotBlank(addCampaign_id))
	    {
		JSAPIUtil.subscribeCampaigns(addCampaign_id, contact);
	    }
	    
	    // for add tag
	    String addTag = request.getParameter("add-tag");
	    if (StringUtils.isNotBlank(addTag))
	    {
		String tags = addTag.trim().replaceAll(" +", " ");
		tags = tags.replaceAll(", ", ",");
		String[] tagsArray = tags.split(",");
		contact.addTags(tagsArray);
	    }
	    
	    // for add score
	    String addScore = request.getParameter("add-score");
	    if (StringUtils.isNotBlank(addScore))
	    {
		contact.addScore(Integer.parseInt(addScore));
	    }
	    
	    contact.save();
	    System.out.println("successfully save");
	}
	catch (Exception e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	
    }
    
}
