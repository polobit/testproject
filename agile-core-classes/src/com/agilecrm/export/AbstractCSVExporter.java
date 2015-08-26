package com.agilecrm.export;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.agilecrm.CSVWriterAgile;
import com.agilecrm.contact.export.util.ContactExportCSVUtil;
import com.agilecrm.db.GoogleSQL;
import com.agilecrm.export.util.DealExportCSVUtil;
import com.agilecrm.file.readers.ByteBufferBackedInputStream;
import com.agilecrm.file.readers.IFileInputStream;
import com.agilecrm.util.email.SendMail;
import com.google.appengine.api.NamespaceManager;

/**
 * Base level Abstract class for all exports (deals, contacts)
 * 
 * @author yaswanth
 *
 */
public abstract class AbstractCSVExporter<T> implements Exporter<T>
{

    protected CSVWriterAgile csvWriter;
    private boolean isHeaderAdded;
    private String[] headers;
    private Map<String, Integer> indexMap = null;
    private EXPORT_TYPE export_type;
    private File file;

    protected abstract String[] convertEntityToCSVRow(T entity, Map<String, Integer> indexMap, int headerLength);

    public AbstractCSVExporter(EXPORT_TYPE export_type)
    {
	this.export_type = export_type;

	// csvWriter = new CSVWriterAgile(getOutputFile());

	try
	{

	    csvWriter = new CSVWriterAgile(NamespaceManager.get() + "_" + export_type + "_" + GoogleSQL.getFutureDate()
		    + ".csv");
	}
	catch (IOException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	}
    }

    /**
     * Constructor which can take a writer object and build CSV writer wrapper
     * around it. It can be use full when stream is from url connection or any
     * other external destination
     * 
     * @param clazz
     * @param writer
     * @throws IOException
     */
    public AbstractCSVExporter(EXPORT_TYPE export_type, File file) throws IOException
    {
	this.export_type = export_type;
	csvWriter = new CSVWriterAgile(file);
    }

    private File getOutputFile()
    {
	if (file != null)
	    return file;

	return file = new File("test");
    }

    /**
     * Flush should be called to ensure all writers are closed and all entities
     * are added into CSV
     */
    public final void finalize()
    {
	csvWriter.flush();
    }

    public final void writeEntitesToCSV(List<T> entities)
    {

	if (entities.size() == 0)
	{
	    return;
	}

	if (!isHeaderAdded)
	{
	    csvWriter.writeNext(getHeaders());
	    isHeaderAdded = true;
	}

	for (T entity : entities)
	{

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

    private String[] getHeaders()
    {
	if (headers != null)
	    return headers;

	if (export_type == EXPORT_TYPE.COMPANY)
	{
	    return headers = ContactExportCSVUtil.getCSVHeadersForCompany();
	}

	else if (export_type == EXPORT_TYPE.CONTACT)
	{
	    return headers = ContactExportCSVUtil.getCSVHeadersForContact();
	}

	else if (export_type == EXPORT_TYPE.DEAL)
	    return headers = DealExportCSVUtil.getCSVHeadersForDeal();

	return headers = new String[] { "" };
    }

    /**
     * This method can be overridden if any custom data needs to be passed to
     * email template
     * 
     * @return
     */
    protected Object[] getCustomObjects()
    {
	return null;
    }

    private String getDownloadURL()
    {
	return csvWriter.getPath();
    }

    public final void sendEmail(String email)
    {

	HashMap<String, String> map = new HashMap<String, String>();
	// -1 to exclude heading from count
	map.put("count", String.valueOf(csvWriter.getNumberOfRows() - 1));
	map.put("download_url", csvWriter.getPath());
	map.put("contact_type", export_type.label);

	SendMail.sendMail(email, export_type.templateSubject, export_type.templaceTemplate, map,
		SendMail.AGILE_FROM_EMAIL, SendMail.AGILE_FROM_NAME);
    }

    public static void main(String[] args)
    {
	ExportBuilder.buildContactExporter();
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
