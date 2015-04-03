package com.socialsuite.util;

import java.util.List;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.socialsuite.Stream;

/**
 * <code>StreamUtil</code> is the utility class for {@link Stream}. It fetches
 * Stream with respect to id and also all Streams related to current domain user
 * at a time.
 * 
 * @author Farah
 */
public class StreamUtil
{
    /** object of objectify for dB operations on Stream. */
    private static ObjectifyGenericDao<Stream> dao = new ObjectifyGenericDao<Stream>(Stream.class);

    /**
     * Gets value of a Stream objects, related with the current domainUser.
     * 
     * @return list of value of the matched entity.
     */
    public static List<Stream> getStreams()
    {
	DomainUser domainUser = DomainUserUtil.getCurrentDomainUser();

	try
	{
	    return dao.listByProperty("domain_user_id", domainUser.id);
	}
	catch (Exception e)
	{
	    // streams not found
	    e.printStackTrace();
	    return null;
	}
    }// GetStreams end

    /**
     * Gets value of a Stream object, matched with the given stream Id.
     * 
     * @param id
     *            stream id of the object to get its value.
     * @return value of the matched entity.
     */
    public static Stream getStream(Long id)
    {
	try
	{
	    // search stream and return
	    return dao.get(id);
	}
	catch (EntityNotFoundException e)
	{
	    // stream not found
	    // e.printStackTrace();
	    return null;
	}
    }// getStream end
}