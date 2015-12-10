package com.agilecrm.subscription.limits.cron.deferred;

import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.util.NamespaceUtil;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;

public class TestTask implements DeferredTask
{

    public String domain = null;

    @Override
    public void run()
    {
	// TODO Auto-generated method stub
	// Fetches all namespaces
	Set<String> namespaces = NamespaceUtil.getAllNamespaces();

	if (!StringUtils.isEmpty(domain))
	{
	    AccountLimitsRemainderDeferredTask task = new AccountLimitsRemainderDeferredTask(domain);

	    // Add to queue
	    Queue queue = QueueFactory.getDefaultQueue();
	    queue.add(TaskOptions.Builder.withPayload(task));

	    return;
	}
	// Iterates through each Namespace and initiates task for each namespace
	// to update usage info
	for (String namespace : namespaces)
	{
	    AccountLimitsRemainderDeferredTask task = new AccountLimitsRemainderDeferredTask(namespace);

	    // Add to queue
	    Queue queue = QueueFactory.getDefaultQueue();
	    queue.add(TaskOptions.Builder.withPayload(task));
	}
    }
    
    public static void main(String[] args) {
    	
    	System.out.println(parse("$11111.0sadfsad0"));
	}

    private static String parse(String hex)
    {
        Pattern pattern = Pattern.compile("(\\d+\\.\\d+)|(\\d+)");
        Matcher matcher = pattern.matcher(hex);
        matcher.find();
        return matcher.group();
        }
}
