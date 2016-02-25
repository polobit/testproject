package com.agilecrm;

import java.io.IOException;

public class ThreadPoolQueueStatsDaemon extends TaskQueueStatsDaemon
{
    public ThreadPoolQueueStatsDaemon(String queue)
    {
	super(queue);
	System.out.println("Initializing exteded daemon class");
    }

    @Override
    protected void setRemoteAPI() throws IOException
    {
	System.out.println("Dummy setup");
	// TODO Auto-generated method stub

    }

}
