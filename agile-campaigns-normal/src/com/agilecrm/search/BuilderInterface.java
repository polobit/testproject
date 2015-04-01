package com.agilecrm.search;

import java.util.List;

import com.google.appengine.api.search.Index;

/**
 * <code> BuilderInterface </code> is root interface to build search on
 * entities. It includes method declarations to add an entity to search, edit
 * and delete entities added to search (Appengine search)
 * 
 * @author Yaswanth
 * 
 * @since November 2012
 * 
 */
public interface BuilderInterface
{

    /**
     * Defines an entity in search, so search is enabled on entity
     * 
     * @param entity
     *            {@link Object}
     */
    public void add(Object entity);

    /**
     * Declares edit functionality on an entity in search
     * 
     * @param entity
     */
    public void edit(Object entity);

    /**
     * Declares delete of an entity from search, removes object form search.
     * Whenever an entity is deleted from database, this method is called to
     * remove object from search
     * 
     * @param id
     */
    public void delete(String id);

    /**
     * Returns index of the document of implemented class (contacts, deals,
     * tasks).
     * 
     * @return
     */
    public Index getIndex();

    public List getResults(List<Long> ids);
}
