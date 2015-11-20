package com.agilecrm.ticket.entitys;

import java.io.Serializable;
import java.util.Calendar;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import com.agilecrm.cursor.Cursor;
import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.annotation.NotSaved;

@XmlRootElement
public class TicketLabels extends Cursor implements Serializable
{
	private static final long serialVersionUID = 1L;

	@Id
	public Long id;

	public String label;

	public Long created_time = 0L;
	public Long updated_time = 0L;

	// Dao
	public static ObjectifyGenericDao<TicketLabels> dao = new ObjectifyGenericDao<TicketLabels>(TicketLabels.class);

	@NotSaved
	public Integer availableCount = 0;

	@NotSaved
	public String entity_type = "ticket_labels";

	public TicketLabels()
	{

	}

	@javax.persistence.PrePersist
	private void prePersist()
	{
		if (this.id != null)
			this.updated_time = Calendar.getInstance().getTimeInMillis();
		else
			this.created_time = Calendar.getInstance().getTimeInMillis();
	}
}