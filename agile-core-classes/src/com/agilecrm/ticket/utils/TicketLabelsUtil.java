package com.agilecrm.ticket.utils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.ticket.entitys.TicketLabels;
import com.google.appengine.api.datastore.EntityNotFoundException;

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

	public static TicketLabels createLabel(TicketLabels ticketLabel) throws Exception
	{
		TicketLabels existingLabel = TicketLabelsUtil.getLabelByName(ticketLabel.label);

		if (existingLabel != null)
			throw new Exception("Label already exists.");

		TicketLabels.dao.put(ticketLabel);

		return ticketLabel;
	}

	public static TicketLabels updateLabel(TicketLabels ticketLabel) throws Exception
	{
		TicketLabels oldTicketLabel = TicketLabelsUtil.getLabelByName(ticketLabel.label);

		if (!oldTicketLabel.id.equals(ticketLabel.id))
			throw new Exception("Label already exists.");

		oldTicketLabel.label = ticketLabel.label;
		oldTicketLabel.color_code = ticketLabel.color_code;
		TicketLabels.dao.put(oldTicketLabel);

		return oldTicketLabel;
	}
}
