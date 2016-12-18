package com.agilecrm.imap;

import com.sun.mail.imap.IMAPStore;

/**
 * <code>IMAPStoreWrapper</code> is the wrapper class for IMAPStore to maintain
 * store connection objects in cache map.
 * 
 * @author naresh
 * 
 */
public class IMAPStoreWrapper
{
    private long lastUsedTime;
    private IMAPStore store;

    public long getLastUsedTime()
    {
	return lastUsedTime;
    }

    public void setLastUsedTime(long lastUsedTime)
    {
	this.lastUsedTime = lastUsedTime;
    }

    public IMAPStore getStore()
    {
	return store;
    }

    public void setStore(IMAPStore store)
    {
	this.store = store;
    }

}
