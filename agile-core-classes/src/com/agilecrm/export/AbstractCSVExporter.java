package com.agilecrm.export;

import java.io.Writer;
import java.util.List;
import java.util.Map;

import com.agilecrm.CSVWriterAgile;
import com.agilecrm.contact.Contact;
import com.agilecrm.contact.export.util.ContactExportCSVUtil;
import com.agilecrm.deals.Opportunity;
import com.agilecrm.export.util.DealExportCSVUtil;

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

    protected abstract String[] convertEntityToCSVRow(T entity, Map<String, Integer> indexMap, int headerLength);

    protected AbstractCSVExporter(Class<T> clazz)
    {
	this.clazz = clazz;
	csvWriter = new CSVWriterAgile();
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
}
