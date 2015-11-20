package com.agilecrm.ticket.utils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.ticket.entitys.TicketGroups;
import com.agilecrm.ticket.entitys.TicketLabels;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.googlecode.objectify.Key;

/**
 * 
 * @author Sasi on 20-Nov-2015
 * 
 */
public class TicketLabelsUtil
{
	public static List<TicketLabels> fetchAll()
	{
		return TicketLabels.dao.fetchAll();
	}

	public static TicketLabels getLabelById(Long id)
	{
		try
		{
			return TicketLabels.dao.get(id);
		}
		catch (EntityNotFoundException e)
		{
			e.printStackTrace();
		}

		return null;
	}

	public static TicketLabels getLabelByName(String labelName)
	{
		Map<String, Object> searchMap = new HashMap<String, Object>();
		searchMap.put("label", labelName);

		return TicketLabels.dao.getByProperty(searchMap);
	}

	public static TicketLabels createLabel(String labelName) throws Exception
	{
		TicketLabels existingLabel = TicketLabelsUtil.getLabelByName(labelName);

		if (existingLabel != null)
			throw new Exception("Label already exists.");

		TicketLabels ticketLabel = new TicketLabels();
		ticketLabel.label = labelName;

		TicketLabels.dao.put(ticketLabel);

		return ticketLabel;
	}

	public static TicketLabels updateLabel(TicketLabels ticketLabel) throws Exception
	{
		TicketLabels oldTicketLabel = TicketLabelsUtil.getLabelByName(ticketLabel.label);

		if (oldTicketLabel.id != ticketLabel.id)
			throw new Exception("Label already exists.");

		oldTicketLabel.label = ticketLabel.label;
		TicketLabels.dao.put(oldTicketLabel);

		return oldTicketLabel;
	}
}
