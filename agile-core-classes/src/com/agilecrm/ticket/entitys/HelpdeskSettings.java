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

	public enum TableColumns
	{
		ID, SUBJECT, REQUSTER_NAME, REQUESTER_EMAIL, CREATED_DATE, DUE_DATE, ASSIGNED_DATE, LAST_UPDATED_DATE, CLOSED_DATE, ASSIGNEE, GROUP, LAST_UPDATED_BY, ORGANIZATION, CONTACT_DETAILS, PRIORITY, TYPE, STATUS
	}

	public List<TableColumns> selected_columns = null;

	public HelpdeskSettings()
	{
	}

	public HelpdeskSettings defaultSettings()
	{
		this.ticket_view_type = TicketViewType.MULTILINE;
		this.selected_columns = new ArrayList<TableColumns>()
		{
			private static final long serialVersionUID = 1L;

			{
				add(TableColumns.ID);
				add(TableColumns.SUBJECT);
				add(TableColumns.REQUSTER_NAME);
				add(TableColumns.DUE_DATE);
				add(TableColumns.PRIORITY);
				add(TableColumns.STATUS);
				add(TableColumns.ASSIGNEE);
				add(TableColumns.GROUP);
			}
		};
		
		return this;
	}

	@Override
	public String toString()
	{
		return "HelpdeskSettings [ticket_view_type=" + ticket_view_type + ", selected_columns=" + selected_columns
				+ "]";
	}
}
