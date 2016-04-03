package com.agilecrm.ticket.servlets;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.Part;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimePart;
import javax.mail.internet.MimeUtility;
import javax.mail.util.ByteArrayDataSource;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.apache.commons.lang.text.StrBuilder;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import com.agilecrm.export.gcs.GCSServiceAgile;
import com.agilecrm.ticket.entitys.TicketDocuments;
import com.google.agile.repackaged.appengine.tools.cloudstorage.GcsFileOptions;
import com.google.agile.repackaged.appengine.tools.cloudstorage.GcsOutputChannel;
import com.google.api.client.util.Base64;
import com.google.appengine.api.NamespaceManager;

/**
 * Parses a MimeMessage and stores the individual parts such a plain text, HTML
 * text and attachments.
 * 
 * @since 1.3
 * @version $Id: MimeMessageParser.java 1420381 2012-12-11 20:18:05Z
 */
public class MimeMessageParser
{
	/** The MimeMessage to convert */
	private final MimeMessage mimeMessage;

	/** Plain mail content from MimeMessage */
	private String plainContent;

	/** Html mail content from MimeMessage */
	private String htmlContent;

	/** List of attachments of MimeMessage */
	private final List<DataSource> attachmentList;

	/** Is this a Multipart email */
	private boolean isMultiPart;

	/** List of attachment names and blob keys **/
	private List<TicketDocuments> documentsList = null;

	/**
	 * Constructs an instance with the MimeMessage to be extracted.
	 * 
	 * @param message
	 *            the message to parse
	 */
	public MimeMessageParser(final MimeMessage message)
	{
		attachmentList = new ArrayList<DataSource>();
		this.mimeMessage = message;
		this.isMultiPart = false;
		documentsList = new ArrayList<TicketDocuments>();
	}

	/**
	 * Does the actual extraction.
	 * 
	 * @return this instance
	 * @throws Exception
	 *             parsing the mime message failed
	 */
	public MimeMessageParser parse() throws Exception
	{
		this.parse(null, mimeMessage);
		this.saveAttachments();
		return this;
	}

	/**
	 * @return the 'to' recipients of the message
	 * @throws Exception
	 *             determining the recipients failed
	 */
	public List<javax.mail.Address> getTo() throws Exception
	{
		javax.mail.Address[] recipients = this.mimeMessage.getRecipients(Message.RecipientType.TO);
		return recipients != null ? Arrays.asList(recipients) : new ArrayList<javax.mail.Address>();
	}

	/**
	 * @return the 'cc' recipients of the message
	 * @throws Exception
	 *             determining the recipients failed
	 */
	public List<javax.mail.Address> getCc() throws Exception
	{
		javax.mail.Address[] recipients = this.mimeMessage.getRecipients(Message.RecipientType.CC);
		return recipients != null ? Arrays.asList(recipients) : new ArrayList<javax.mail.Address>();
	}

	/**
	 * @return the 'bcc' recipients of the message
	 * @throws Exception
	 *             determining the recipients failed
	 */
	public List<javax.mail.Address> getBcc() throws Exception
	{
		javax.mail.Address[] recipients = this.mimeMessage.getRecipients(Message.RecipientType.BCC);
		return recipients != null ? Arrays.asList(recipients) : new ArrayList<javax.mail.Address>();
	}

	/**
	 * @return the 'from' field of the message
	 * @throws Exception
	 *             parsing the mime message failed
	 */
	public String getFrom() throws Exception
	{
		javax.mail.Address[] addresses = this.mimeMessage.getFrom();
		if ((addresses == null) || (addresses.length == 0))
		{
			return null;
		}
		else
		{
			return ((InternetAddress) addresses[0]).getAddress();
		}
	}

	/**
	 * @return the 'replyTo' address of the email
	 * @throws Exception
	 *             parsing the mime message failed
	 */
	public String getReplyTo() throws Exception
	{
		javax.mail.Address[] addresses = this.mimeMessage.getReplyTo();
		if ((addresses == null) || (addresses.length == 0))
		{
			return null;
		}
		else
		{
			return ((InternetAddress) addresses[0]).getAddress();
		}
	}

	/**
	 * @return the mail subject
	 * @throws Exception
	 *             parsing the mime message failed
	 */
	public String getSubject() throws Exception
	{
		return this.mimeMessage.getSubject();
	}

	/**
	 * Extracts the content of a MimeMessage recursively.
	 * 
	 * @param parent
	 *            the parent multi-part
	 * @param part
	 *            the current MimePart
	 * @throws MessagingException
	 *             parsing the MimeMessage failed
	 * @throws IOException
	 *             parsing the MimeMessage failed
	 */
	protected void parse(Multipart parent, MimePart part) throws MessagingException, IOException
	{
		if (part.isMimeType("text/plain") && (plainContent == null))
		{
			plainContent = (String) part.getContent();
		}
		else
		{
			if (part.isMimeType("text/html") && (htmlContent == null))
			{
				htmlContent = (String) part.getContent();
			}
			else
			{
				if (part.isMimeType("multipart/*"))
				{
					this.isMultiPart = true;
					Multipart mp = (Multipart) part.getContent();
					int count = mp.getCount();

					for (int i = 0; i < count; i++)
						parse(mp, (MimeBodyPart) mp.getBodyPart(i));
				}
				else
				{
					this.attachmentList.add(createDataSource(parent, part));
				}
			}
		}
	}

	/**
	 * Parses the MimePart to create a DataSource.
	 * 
	 * @param parent
	 *            the parent multi-part
	 * @param part
	 *            the current part to be processed
	 * @return the DataSource
	 * @throws MessagingException
	 *             creating the DataSource failed
	 * @throws IOException
	 *             creating the DataSource failed
	 */
	protected DataSource createDataSource(Multipart parent, MimePart part) throws MessagingException, IOException
	{
		DataHandler dataHandler = part.getDataHandler();
		DataSource dataSource = dataHandler.getDataSource();
		String contentType = getBaseMimeType(dataSource.getContentType());
		byte[] content = this.getContent(dataSource.getInputStream());
		ByteArrayDataSource result = new ByteArrayDataSource(content, contentType);
		String dataSourceName = getDataSourceName(part, dataSource);

		result.setName(dataSourceName);
		return result;
	}

	/** @return Returns the mimeMessage. */
	public MimeMessage getMimeMessage()
	{
		System.out.println("getMimeMessage(): " + mimeMessage);
		return mimeMessage;
	}

	/** @return Returns the isMultiPart. */
	public boolean isMultipart()
	{
		return isMultiPart;
	}

	/** @return Returns the plainContent if any */
	public String getPlainContent()
	{
		System.out.println("MimeMessageParser getPlainContent(): " + plainContent);

		return this.plainContent;
	}

	/**
	 * @return Returns the attachmentList.
	 * @throws Exception
	 */
	// public List<DataSource> getAttachmentList() throws Exception
	// {
	// for (DataSource ds : attachmentList)
	// {
	// System.out.println("Attachment ContentType(): " + ds.getContentType());
	// System.out.println("Attachment GetName(): " + ds.getName());
	//
	// // saveFileToGC(IOUtils.toByteArray(ds.getInputStream()),
	// // ds.getName(), ds.getContentType());
	// }
	//
	// System.out.println("AttachmentNamesAndKeys: " + attachmentNamesAndKeys);
	// return attachmentList;
	// }

	/**
	 * @return Returns the attachment names and blob keys.
	 * @throws Exception
	 */
	public List<TicketDocuments> saveAttachments() throws Exception
	{
		String plainContent = (hasPlainContent()) ? this.plainContent : "";
		String htmlContent = (hasHtmlContent()) ? this.htmlContent : "";

		StrBuilder sb = new StrBuilder(htmlContent);
		sb.replaceAll("3D", "").replaceAll("\"\"", "");

		Document doc = Jsoup.parseBodyFragment(sb.toString(), "UTF-8");

		for (DataSource ds : attachmentList)
		{
			String fileName = ds.getName(), fileContentType = ds.getContentType(), fileContent = IOUtils.toString(ds
					.getInputStream());

			byte[] byteArray = IOUtils.toByteArray(fileContent);

			System.out.println("Attachment ContentType(): " + fileContentType);
			System.out.println("Attachment GetName(): " + fileName);

			// If content type is image then checking if it is inline image. If
			// yes then removing "[image: Inline image 1]" from plain text and
			// from html content
			if (fileContentType.contains("image") || fileContentType.contains("img"))
			{
				byteArray = Base64.decodeBase64(fileContent);

				Elements elements = doc.getElementsByAttributeValue("src", "cid:" + fileName);

				if (elements == null || elements.size() == 0)
					continue;

				Element element = elements.first();

				plainContent = plainContent.replace("[image: " + element.attr("alt") + "]", "");

				try
				{
					element.remove();
				}
				catch (Exception e)
				{
					System.out.println(ExceptionUtils.getFullStackTrace(e));
				}
			}

			saveFileToGCS(ds.getName(), ds.getContentType(), byteArray);
		}

		this.htmlContent = doc.body().html();
		this.plainContent = plainContent;

		return documentsList;
	}

	/** @return Returns the htmlContent if any */
	public String getHtmlContent()
	{
		System.out.println("getHtmlContent(): " + htmlContent);
		return htmlContent;
	}

	/** @return Returns the attchments if any */
	public List<TicketDocuments> getAttachmentsList()
	{
		return documentsList;
	}

	/** @return true if a plain content is available */
	public boolean hasPlainContent()
	{
		return this.plainContent != null;
	}

	/** @return true if HTML content is available */
	public boolean hasHtmlContent()
	{
		return this.htmlContent != null;
	}

	/** @return true if attachments are available */
	public boolean hasAttachments()
	{
		return this.attachmentList.size() > 0;
	}

	// /**
	// * Find an attachment using its name.
	// *
	// * @param name
	// * the name of the attachment
	// * @return the corresponding datasource or null if nothing was found
	// * @throws Exception
	// */
	// public DataSource findAttachmentByName(String name) throws Exception
	// {
	// DataSource dataSource;
	//
	// for (int i = 0; i < getAttachmentList().size(); i++)
	// {
	// dataSource = getAttachmentList().get(i);
	// if (name.equalsIgnoreCase(dataSource.getName()))
	// {
	// return dataSource;
	// }
	// }
	//
	// return null;
	// }

	/**
	 * Determines the name of the data source if it is not already set.
	 * 
	 * @param part
	 *            the mail part
	 * @param dataSource
	 *            the data source
	 * @return the name of the data source or {@code null} if no name can be
	 *         determined
	 * @throws MessagingException
	 *             accessing the part failed
	 * @throws UnsupportedEncodingException
	 *             decoding the text failed
	 */
	protected String getDataSourceName(Part part, DataSource dataSource) throws MessagingException,
			UnsupportedEncodingException
	{
		String result = dataSource.getName();

		if (result == null || result.length() == 0)
		{
			result = part.getFileName();
		}

		if (result != null && result.length() > 0)
		{
			result = MimeUtility.decodeText(result);
		}
		else
		{
			result = null;
		}

		return result;
	}

	/**
	 * Read the content of the input stream.
	 * 
	 * @param is
	 *            the input stream to process
	 * @return the content of the input stream
	 * @throws IOException
	 *             reading the input stream failed
	 */
	private byte[] getContent(InputStream is) throws IOException
	{
		int ch;
		byte[] result;

		ByteArrayOutputStream os = new ByteArrayOutputStream();
		BufferedInputStream isReader = new BufferedInputStream(is);
		BufferedOutputStream osWriter = new BufferedOutputStream(os);

		while ((ch = isReader.read()) != -1)
		{
			osWriter.write(ch);
		}

		osWriter.flush();
		result = os.toByteArray();
		osWriter.close();

		return result;
	}

	/**
	 * Parses the mimeType.
	 * 
	 * @param fullMimeType
	 *            the mime type from the mail api
	 * @return the real mime type
	 */
	private String getBaseMimeType(String fullMimeType)
	{
		int pos = fullMimeType.indexOf(';');
		if (pos >= 0)
		{
			return fullMimeType.substring(0, pos);
		}
		else
		{
			return fullMimeType;
		}
	}

	/**
	 * Writes file content to GCS and returns service object to get file path.
	 * 
	 * @param fileName
	 * @param fileType
	 * @param fileContentType
	 * @param currentTime
	 * @return
	 * @throws IOException
	 */
	public GCSServiceAgile saveFileToGCS(String fileName, String fileType, byte[] fileContent) throws IOException
	{
		if (fileType.contains("application/rar"))
			fileType = "application/x-rar-compressed, application/octet-stream";
		else if (fileType.contains("application/zip"))
			fileType = "application/zip, application/octet-stream";

		GcsFileOptions options = new GcsFileOptions.Builder().mimeType(fileType).contentEncoding("UTF-8")
				.acl("public-read").addUserMetadata("domain", NamespaceManager.get()).build();

		GCSServiceAgile service = new GCSServiceAgile((Calendar.getInstance().getTimeInMillis()) + fileName,
				"ticket-attachments", options);

		GcsOutputChannel writer = service.getOutputchannel();

		writer.write(ByteBuffer.wrap(fileContent));
		writer.close();

		documentsList.add(new TicketDocuments(fileName, fileType, (long) fileContent.length, service
				.getFilePathToDownload()));

		return service;
	}
}