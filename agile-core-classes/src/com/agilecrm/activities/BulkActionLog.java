package com.agilecrm.activities;

import javax.persistence.Id;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.annotation.Cached;
import com.googlecode.objectify.annotation.Unindexed;

@Unindexed
@Cached
public class BulkActionLog
{
    @Id
    public String unique_key = null;

    private static ObjectifyGenericDao<BulkActionLog> dao = new ObjectifyGenericDao<BulkActionLog>(BulkActionLog.class);

    public static BulkActionLog getBulkAction(String id)
    {
	if (StringUtils.isEmpty(id))
	    return null;

	return dao.getByProperty("unique_key", id);
    }

    public static boolean checkAndSaveNewEntity(String id)
    {
	BulkActionLog log = getBulkAction(id);

	if (log != null)
	{
	    log.delete();
	    return true;
	}

	log = new BulkActionLog();
	log.unique_key = id;
	log.save();

	return false;
    }

    public static void delete(String id)
    {
	if (StringUtils.isEmpty(id))
	    return;

	BulkActionLog log = getBulkAction(id);

	if (log == null)
	    return;

	dao.deleteAsync(log);
    }

    public void save()
    {
	dao.put(this);
    }

    public void delete()
    {
	dao.delete(this);
    }
}
