package com.agilecrm.ticket.entitys;

import java.util.ArrayList;
import java.util.List;

public class HelpdeskSettings
{
	public enum TicketViewType
	{
		MULTILINE, SINGLELINE
	}

	public TicketViewType ticket_view_type = null;

	public List<String> choosed_columns = null;

	public HelpdeskSettings()
	{
	}

	public HelpdeskSettings defaultSettings()
	{
		this.ticket_view_type = TicketViewType.MULTILINE;
		this.choosed_columns = new ArrayList<String>()
		{
			private static final long serialVersionUID = 1L;

			{
				add("id");
				add("subject");
				add("requester_name");
				add("created_time");
				add("priority");
				add("group");
			}
		};

		return this;
	}
}
