/**
 * 
 */
package com.agilecrm.contact.sync;

import java.io.Serializable;

/**
 * <code>SyncFrequency</code> is used for scheduling sync Contact frequency.
 * 
 * @author jitendra
 */
public enum SyncFrequency implements Serializable
{

    /** daily. */
    DAILY,
    /** weekly. */
    WEEKLY,
    /** monthly. */
    MONTHLY,
    /** once. */
    ONCE
}
