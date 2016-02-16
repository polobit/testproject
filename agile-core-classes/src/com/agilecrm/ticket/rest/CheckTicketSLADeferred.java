package com.agilecrm.ticket.rest;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;

import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;

/**
 * 
 * @author Sasi
 * 
 */
public class CheckTicketSLADeferred implements DeferredTask
{
	private String namespace = "";

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public CheckTicketSLADeferred(String namespace)
	{
		super();
		this.namespace = namespace;
	}

	@Override
	public void run()
	{
		String oldNamespace = NamespaceManager.get();

		try
		{
			if (StringUtils.isEmpty(namespace))
				return;

			NamespaceManager.set(namespace);
		}
		catch (Exception e)
		{
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
		finally
		{
			NamespaceManager.set(oldNamespace);
		}
	}
}
