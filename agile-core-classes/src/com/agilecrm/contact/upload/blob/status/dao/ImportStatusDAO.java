package com.agilecrm.contact.upload.blob.status.dao;

import java.io.Serializable;

import com.agilecrm.contact.upload.blob.status.ImportStatus;
import com.agilecrm.contact.upload.blob.status.ImportStatus.ImportType;
import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.DomainUser;
import com.google.appengine.api.NamespaceManager;
import com.googlecode.objectify.Key;

public class ImportStatusDAO implements Serializable
{

    /**
     * Random serial id
     */
    private static final long serialVersionUID = 3730843843628194364L;

    private static final Long MAX_VALIDITY_TIME = (60 * 60 * 1000l) / 2;

    private String namespace;
    private ImportStatus currentStatus;
    private ImportType type;

    public ImportStatusDAO(String namespace, ImportType type)
    {
	this.namespace = namespace;
	String oldNamespace = NamespaceManager.get();
	this.type = type;
	try
	{
	    NamespaceManager.set(namespace);
	    currentStatus = ImportStatusDAOWrapper.getImportStatusDAO().getByProperty("type", type);
	}
	finally
	{
	    NamespaceManager.set(oldNamespace);
	}

    }

    public ImportStatus getImportStatus(String namespace)
    {
	return currentStatus;
    }

    /**
     * Creates new status and updates it with total number of Entities in import
     * and assigner, file name and other details. If there is an existing import
     * status, it just deletes all Entities
     * 
     * @param assigner
     * @param totalEntities
     * @param file_name
     */
    public void createNewImportStatus(Key<DomainUser> assigner, int totalEntities, String file_name)
    {
	ImportStatus oldStatus = getImportStatus(NamespaceManager.get());

	ImportStatus status = new ImportStatus();
	status.setType(type);
	status.setFile_name(file_name);
	status.setOwner(assigner);
	status.setTotal_count(totalEntities);
	status.setStart_time(System.currentTimeMillis());
	status.setLast_updated_time(status.getStart_time());

	if (oldStatus != null)
	{
	    ImportStatusDAOWrapper.getImportStatusDAO().delete(oldStatus);
	}

	ImportStatusDAOWrapper.getImportStatusDAO().put(status);
	currentStatus = status;
    }

    /**
     * Updates statusImportStatusDAOWrapper.getImportStatusDAO().h number of
     * processed entities
     * 
     * @param processedEntities
     */
    public void updateStatus(int processedEntities)
    {
	currentStatus.setSaved_entities(processedEntities);
	currentStatus.setLast_updated_time(System.currentTimeMillis());
	ImportStatusDAOWrapper.getImportStatusDAO().put(currentStatus);
    }

    public void updateTotalEntites(int entitiesCount)
    {
	if (currentStatus == null)
	    return;

	currentStatus.setTotal_count(entitiesCount);
	ImportStatusDAOWrapper.getImportStatusDAO().put(currentStatus);
    }

    public void updateTotalEntitiesCount(int totalCount) throws Exception
    {
	if (currentStatus == null)
	{
	    new Exception("There is no existing status to update count");
	}

	currentStatus.setTotal_count(totalCount);
	updateEntity();
    }

    private void updateEntity()
    {
	ImportStatusDAOWrapper.getImportStatusDAO().put(currentStatus);
    }

    /**
     * Deletes existing status
     */
    public void deleteStatus()
    {
	if (currentStatus != null && currentStatus.getId() != null)
	    ImportStatusDAOWrapper.getImportStatusDAO().delete(currentStatus);
    }

    public boolean checkRunningStatus()
    {
	boolean status = false;
	if (currentStatus != null)
	{
	    Long updatedTime = currentStatus.getLast_updated_time();

	    if (updatedTime == 0)
	    {
		if ((System.currentTimeMillis() - currentStatus.getStart_time()) > MAX_VALIDITY_TIME)
		    status = false;
		else
		    status = true;
	    }
	    else if ((System.currentTimeMillis() - updatedTime) > MAX_VALIDITY_TIME)
	    {
		status = false;
	    }
	    else
	    {
		status = true;
	    }

	    if (!status)
	    {
		deleteStatus();
	    }
	}

	return status;
    }
}

class ImportStatusDAOWrapper
{
    private static final ObjectifyGenericDao<ImportStatus> dao = new ObjectifyGenericDao<ImportStatus>(
	    ImportStatus.class);

    static ObjectifyGenericDao<ImportStatus> getImportStatusDAO()
    {
	return dao;
    }
}