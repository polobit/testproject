package com.agilecrm.export;

import java.io.IOException;
import java.io.InputStream;
import java.io.Writer;
import java.util.List;
import java.util.Map;

import org.json.JSONException;
import org.json.JSONObject;

import com.agilecrm.CSVWriterAgile;
import com.agilecrm.Globals;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.export.util.ContactExportCSVUtil;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.export.impl.ContactExporter;
import com.agilecrm.export.util.DealExportCSVUtil;
import com.agilecrm.file.readers.ByteBufferBackedInputStream;
import com.agilecrm.file.readers.IFileInputStream;
import com.agilecrm.util.email.SendMail;
import com.thirdparty.mandrill.Mandrill;
import com.thirdparty.mandrill.MandrillSendDeferredTask;

/**
 * Base level Abstract class for all exports (deals, contacts)
 * 
 * @author yaswanth
 *
 */
public abstract class AbstractCSVExporter<T>
{
    private Class<T> clazz;

    protected CSVWriterAgile csvWriter;
    private boolean isHeaderAdded;
    private static String[] headers;
    private static Map<String, Integer> indexMap = null;

    static enum EXPORT_TYPE
    {
	DEAL(SendMail.EXPORT_DEALS_CSV_SUBJECT, ""), CONTACT("Agile CRM Contacts CSV", SendMail.EXPORT_CONTACTS_CSV);

	String templateSubject;
	String templaceTemplate;

	private EXPORT_TYPE(String subject, String template)
	{
	    this.templaceTemplate = template;
	    this.templateSubject = subject;
	}

    }

    protected abstract String[] convertEntityToCSVRow(T entity, Map<String, Integer> indexMap, int headerLength);

    protected AbstractCSVExporter(Class<T> clazz)
    {
	this.clazz = clazz;
	csvWriter = new CSVWriterAgile(getWriter(), clazz.getSimpleName());
    }

    /**
     * Constructor which can take a writer object and build CSV writer wrapper
     * around it. It can be use full when stream is from url connection or any
     * other external destination
     * 
     * @param clazz
     * @param writer
     */
    protected AbstractCSVExporter(Class<T> clazz, Writer writer)
    {
	this.clazz = clazz;
	csvWriter = new CSVWriterAgile();
    }

    /**
     * Flush should be called to ensure all writers are closed and all entities
     * are added into CSV
     */
    public final void flush()
    {
	csvWriter.flush();
    }

    protected abstract Writer getWriter();

    protected abstract InputStream getInputStream();

    public final void writeEntitesToCSV(List<T> entities)
    {

	if (entities.size() == 0)
	{
	    return;
	}

	for (T entity : entities)
	{

	    if (!isHeaderAdded)
	    {
		csvWriter.writeNext(getHeaders(entity));
		isHeaderAdded = true;
	    }

	    csvWriter.writeNext(convertEntityToCSVRow(entity, getIndexMap(), getIndexMap().size()));
	}
    }

    private Map<String, Integer> getIndexMap()
    {
	if (headers == null)
	    return null;

	if (indexMap != null)
	    return indexMap;

	return indexMap = ContactExportCSVUtil.getIndexMapOfCSVHeaders(headers);
    }

    private String[] getHeaders(T entity)
    {
	if (headers != null)
	    return headers;

	if (clazz.equals(Contact.class))
	{
	    Contact contact = (Contact) entity;
	    if (contact.type == Contact.Type.COMPANY)
		return headers = ContactExportCSVUtil.getCSVHeadersForCompany();

	    return headers = ContactExportCSVUtil.getCSVHeadersForContact();
	}

	if (clazz.equals(Opportunity.class))
	    return headers = DealExportCSVUtil.getCSVHeadersForDeal();

	return headers = new String[] { "" };
    }

    protected void sendEmail() throws JSONException
    {
	// Complete mail json to be sent
	JSONObject mailJSON = Mandrill.setMandrillAPIKey(Globals.MANDRIL_API_KEY_VALUE, "devikatest");

	// Set mandrill async

	// By Default Main pool
	mailJSON.put(Mandrill.MANDRILL_IP_POOL, Mandrill.MANDRILL_MAIN_POOL);

	// All email params are inserted into Message json
	JSONObject messageJSON = Mandrill.getMessageJSON("devikatest", SendMail.AGILE_FROM_EMAIL,
		SendMail.AGILE_FROM_NAME, "yaswanth@agilecrm.com", null, null, "yaswanth@agilecrm.com",
		EXPORT_TYPE.CONTACT.templateSubject, EXPORT_TYPE.CONTACT.templaceTemplate, "test", null);

	// Task for sending emails with attachments
	String mailJSONString = mailJSON.toString().replaceAll("}", ",");
	String messageJSONString = messageJSON.toString();
	String response = null;

	MandrillSendDeferredTask task = new MandrillSendDeferredTask(mailJSONString, messageJSONString,
		new CSVInputFileStreamWrapper(getInputStream(), "test"));
	task.run();
    }

    public static void main(String[] args)
    {
	ContactExporter exporter = new ContactExporter(Contact.class);
	for (int i = 0; i < 800000; i++)
	{
	    String[] s = { "a", "b", "c", "d", "e", "f", "g" };
	    exporter.csvWriter.writeNext(s);
	}

	exporter.flush();

	try
	{
	    exporter.sendEmail();
	}
	catch (JSONException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}

    }
}

class CSVInputFileStreamWrapper extends IFileInputStream
{

    /**
     * 
     */
    private static final long serialVersionUID = 782464497884901056L;

    InputStream stream;
    String fileName;
    ByteBufferBackedInputStream buffer;

    CSVInputFileStreamWrapper(InputStream stream, String fileName)
    {
	this.stream = stream;
	this.fileName = fileName;

    }

    @Override
    public InputStream getInputStream()
    {
	// TODO Auto-generated method stub
	return stream;
    }

    @Override
    public void closeResources()
    {
	if (buffer == null)
	    return;

	try
	{
	    stream.close();
	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
	// TODO Auto-generated method stub

    }

    @Override
    public String getFileName()
    {
	// TODO Auto-generated method stub
	return fileName;
    }

}
