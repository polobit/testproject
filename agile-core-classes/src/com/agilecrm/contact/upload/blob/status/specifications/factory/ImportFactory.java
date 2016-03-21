package com.agilecrm.contact.upload.blob.status.specifications.factory;

import com.agilecrm.contact.upload.blob.status.specifications.StatusProcessor;
import com.agilecrm.contact.upload.blob.status.specifications.StatusSender;
import com.agilecrm.user.DomainUser;

/**
 * Factory to return default status sender and status processors to send report
 * to users on import. This class allows to inject status sender application
 * when used in thrid party clients. Injecting implementations can be used when
 * import is run in GCe where we can have different conditions to send status
 * (current running tasks, tasks pending in queue, task pending in pull queue)
 * 
 * @author yaswanth
 *
 */
public class ImportFactory
{
    private static StatusSender statusSender = null;
    private static StatusProcessor<?> statusProcessor = null;
    private static Class<? extends StatusProcessor<?>> statusProcessorClass = null;

    /**
     * Returns instance of existing objecy and will not create new if instace is
     * already available
     * 
     * @return
     */
    public static StatusSender getImportStatusSender()
    {
	if (statusSender != null)
	    return statusSender;

	/**
	 * Returns dummy implentation
	 */
	return new StatusSender()
	{
	    @Override
	    public void sendEmail(DomainUser user, StatusProcessor<?> processor)
	    {
		// TODO Auto-generated method stub

	    }
	};
    }

    /**
     * Returns new instance every time as it has to store number of contacts in
     * import and user info
     * 
     * @return
     * @throws InstantiationException
     * @throws IllegalAccessException
     */
    public static StatusProcessor<?> getStatusProcessor()
    {
	if (statusProcessorClass == null)
	    return new MockStatusProcessor<String>();

	try
	{
	    return statusProcessorClass.newInstance();

	}
	catch (InstantiationException | IllegalAccessException e)
	{
	    // TODO Auto-generated catch block
	    e.printStackTrace();
	    return new MockStatusProcessor<String>();
	}

    }

    public static void injectStatusSender(StatusSender statusSender) throws NullPointerException
    {
	if (statusSender == null)
	    throw new NullPointerException("Sender cannot be null");

	ImportFactory.statusSender = statusSender;
    }

    public static void injectStatusProcessor(Class<? extends StatusProcessor<?>> statusProcessor)
    {
	ImportFactory.statusProcessorClass = statusProcessor;
    }

    public static void injectStatusProcessor(StatusProcessor<?> statusProcessor)
    {
	if (statusProcessor == null)
	    throw new NullPointerException("Sender cannot be null");

	ImportFactory.statusProcessor = statusProcessor;
    }
}

class MockStatusProcessor<T> implements StatusProcessor<T>
{

    @Override
    public T getStatus()
    {
	// TODO Auto-generated method stub
	return null;
    }

    @Override
    public boolean shouldSendDelayMessage()
    {
	// TODO Auto-generated method stub
	return false;
    }

    @Override
    public void setCount(int totalEntities)
    {
	// TODO Auto-generated method stub

    }

    @Override
    public void setTaskQueue(String taskName)
    {
	// TODO Auto-generated method stub

    }

    @Override
    public String getTaskQueueName()
    {
	// TODO Auto-generated method stub
	return null;
    }

}
