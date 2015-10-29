package com.agilecrm.ticket.entitys;

import java.util.Calendar;

import javax.persistence.Id;
import javax.xml.bind.annotation.XmlRootElement;


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
	public Long uploaded_time = 0L;

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
	public String bucketName = null;

	/**
	 * Default Constructor.
	 */
	public TicketDocuments()
	{
	}

	public TicketDocuments(String name, String extension, Long size, String bucketName)
	{
		super();
		this.name = name;
		this.extension = extension;
		this.size = size;
		this.bucketName = bucketName;
		this.uploaded_time = Calendar.getInstance().getTimeInMillis();
	}
}
