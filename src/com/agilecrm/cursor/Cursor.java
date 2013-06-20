package com.agilecrm.cursor;

import com.agilecrm.db.ObjectifyGenericDao;
import com.googlecode.objectify.annotation.NotSaved;

/**
 * <code>Cursor</code> is used to fetch entities using
 * {@link com.google.appengine.api.datastore.Cursor}, which is set to cursor
 * variable after fetching first set of entities based on the count specified,
 * on fetch entities with cursor set in it, will fetch the result set based on
 * the query set while fetching the first time and fetches the results according
 * to cursor set
 * <p>
 * Used in {@link ObjectifyGenericDao} to set cursor while processing request
 * with count, Every class which uses infini scroll should extent this class
 * </p>
 */
public class Cursor
{
    /**
     * Represents {@link com.google.appengine.api.datastore.Cursor} string,
     */
    @NotSaved
    public String cursor = null;

    /**
     * Represents number of entities to be fetched per request
     */
    @NotSaved
    public Integer count = null;
}
