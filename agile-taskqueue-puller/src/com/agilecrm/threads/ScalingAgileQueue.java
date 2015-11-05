package com.agilecrm.threads;

import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;

/**
 * A scaling queue that works with a
 * {@link java.util.concurrent.ThreadPoolExecutor} in when offerring which takes
 * the active count and the max threads into account.
 *
 * @author kimchy
 */
public class ScalingAgileQueue<E> extends LinkedBlockingQueue<E>
{

    /**
     * 
     */
    private static final long serialVersionUID = 1L;

    private ThreadPoolExecutor executor = null;

    /**
     * Creates a <tt>TaskQueue</tt> with a capacity of {@link Integer#MAX_VALUE}
     * .
     */
    public ScalingAgileQueue()
    {
	super();
    }

    /**
     * Creates a <tt>TaskQueue</tt> with the given (fixed) capacity.
     *
     * @param capacity
     *            the capacity of this queue.
     */
    public ScalingAgileQueue(int capacity)
    {
	super(capacity);
    }

    public void setThreadPool(ThreadPoolExecutor executor)
    {
	this.executor = executor;
    }

    /**
     * Inserts the specified element at the tail of this queue if there is at
     * least one available thread to run the current task. If all pool threads
     * are actively busy, it rejects the offer.
     *
     * @param o
     *            the element to add.
     * @return <tt>true</tt> if it was possible to add the element to this
     *         queue, else <tt>false</tt>
     * @see ThreadPoolExecutor#execute(Runnable)
     */
    @Override
    public boolean offer(E o)
    {
	int poolSize = executor.getPoolSize();
	int maximumPoolSize = executor.getMaximumPoolSize();
	if (poolSize >= maximumPoolSize || poolSize > executor.getActiveCount())
	{
	    return super.offer(o);
	}
	else
	{
	    return false;
	}
    }
}
