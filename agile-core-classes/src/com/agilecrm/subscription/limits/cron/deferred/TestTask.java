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
    	String email = "haaris.note3@gmail.com";
    	String[] emails = email.split(",");
    	for (int i = 0; i < emails.length; i++) {
    		System.out.println(isValidEmail(emails[i]));
		}
    	
	}

    private static boolean isValidEmail(final String hex)
    {
	String EMAIL_PATTERN = "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@"
		+ "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
	Pattern pattern = Pattern.compile(EMAIL_PATTERN);
	Matcher matcher = pattern.matcher(hex);
	return matcher.matches();

    }
}
