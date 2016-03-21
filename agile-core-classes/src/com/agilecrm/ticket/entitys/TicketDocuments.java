package com.agilecrm.ticket.entitys;

import java.util.Calendar;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang.exception.ExceptionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

@XmlRootElement
public class TicketDocuments
{
	/**
	 * Document Id.
	 */
	@Id
	public Long id;

	/**
	 * Name of a Document.
	 */
	public String name = null;

	/**
	 * Uploaded time of a Document.
	 */
	public Long uploaded_time = Calendar.getInstance().getTimeInMillis();

	/**
	 * Extension of a Document.
	 */
	public String extension = null;

	/**
	 * Size of Document in bytes. zero for old documents and GOOGLE docs.
	 */
	public Long size = 0L;

	/**
	 * URL of Document.
	 */
	public String url = null;

	/**
	 * Default Constructor.
	 */
	public TicketDocuments()
	{
	}

	public TicketDocuments(String name, String extension, Long size, String url)
	{
		super();
		this.name = name;
		this.extension = extension;
		this.size = size;
		this.url = url;
		this.uploaded_time = Calendar.getInstance().getTimeInMillis();
	}

	@Override
	public String toString()
	{
		try
		{
			ObjectMapper mapper = new ObjectMapper();
			return mapper.writeValueAsString(this);
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}

		return null;
	}
}