package com.agilecrm.queues.cron;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.AgileQueues;
import com.agilecrm.queues.PullScheduler;
import com.agilecrm.queues.util.PullQueueUtil;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.QueueStatistics;
import com.google.appengine.api.taskqueue.TaskOptions;

/**
 * <code>CronPullServlet</code> is the cron servlet to lease and process
 * pull-queue tasks. If the pull-queue tasks in the queue are above fetch limit,
 * these tasks are processed in backend.
 * 
 * @author Naresh
 * 
 */
@SuppressWarnings("serial")
public class CronPullServlet extends HttpServlet
{

    /**
     * Tasks limit
     */
    public static final int FETCH_LIMIT = 50;

    public void doGet(HttpServletRequest req, HttpServletResponse res)
    {
	doPost(req, res);
    }

    public void doPost(HttpServletRequest req, HttpServletResponse res)
    {
    	// Get queue name
    	String queueName = req.getParameter("q");

    	if (StringUtils.isBlank(queueName))
    	    return;
    	
    	checkQueueTasks(queueName);
    }
    
    public void checkQueueTasks(String queueName)
	{
		   long startTime = System.currentTimeMillis();
		   long maxTime =  startTime + 8 * 60 * 1000; // 8 mins
		   long timeout_ms = 1000;
		   long currentTime = startTime;
		   
		   // Iterates upto maxTime
		//   while(currentTime <= maxTime){
   	 			try
   	 			{
   	 				runTasks(queueName);

   	 				// Resetting timeout
   	 				timeout_ms = 1000;
   	 			}
   	 			catch(TasksCountZeroException tcz)
   	 			{
   	 					try {
   	 					// exponential backoff
   	 					Thread.sleep(timeout_ms);
   	 					
   	 					if(timeout_ms >= 50000) // Apply exponential upto 50 secs
   	 						timeout_ms = 1000;
   	 					
   	 						timeout_ms *= 2;
   	 					
   	 					System.out.println("waiting for " + timeout_ms + " milliseconds");
						} catch (InterruptedException e) {
							e.printStackTrace();
						}
   	 			}
   	 			catch(Exception e)
   	 			{
   	 				System.err.println("Unknown exception occurred...");
   	 				e.printStackTrace();
   	 			}
   	 			finally
   	 			{
   	 				System.out.println("Time taken for this iteration is " + (System.currentTimeMillis() - currentTime));
   	 				currentTime = System.currentTimeMillis();
   	 			}
		//   }
		   
		   System.out.println("Loop checking tasks of " + queueName + " is completed and time taken is " + (System.currentTimeMillis() - startTime) + " millis");
	}
	
	/**
	 * 
	 */
	public void runTasks(String queueName) throws TasksCountZeroException{
		Queue queue = QueueFactory.getQueue(queueName);

    	System.out.println("campaign queue | Queue name :" + queueName);

    	long startTime = System.currentTimeMillis();
    	// Get statistics
    	QueueStatistics qs = queue.fetchStatistics();
    	int tasksCount = qs.getNumTasks();
    	System.out.println("Time taken to get queue statistics is " + (System.currentTimeMillis() - startTime));

    	System.out.println("Statistics in queue : " + queue.getQueueName() + ", task count : " + tasksCount
    		+ "Fetch limit : " + CronPullServlet.FETCH_LIMIT);

    	if (tasksCount == 0)
    	{
    	    System.out.println("Tasks count is zero...");
    	    throw new TasksCountZeroException();
    	}

    	if (queueName.equalsIgnoreCase("webhooks-register-add-queue"))
    	{
    	    // If from cron Process tasks in frontend
    	    PullScheduler pullScheduler = new PullScheduler(queueName, true);
    	    pullScheduler.run();
    	    return;
    	}

    	// Process tasks in backend
    	if (tasksCount > CronPullServlet.FETCH_LIMIT)
    	{
    	    	try
    	    	{
    	    		if(StringUtils.equals(AgileQueues.BULK_CAMPAIGN_PULL_QUEUE, queueName) 
    	    				|| StringUtils.equalsIgnoreCase(AgileQueues.BULK_CAMPAIGN_PULL_QUEUE_1, queueName))
    	    		{
    	    			    // If backend push queue already has more than 10K tasks then skipping further requests to Backend to reduce load
    	    				if(PullQueueUtil.getTasksCountofQueue(PullQueueUtil.getCampaignQueueName(queueName)) > 10000)
    	    					return;
    	    		}
    	    		
    	    		PullQueueUtil.processTasksInBackend("/backend-pull", queueName);
    	    	}
    	    	catch (Exception e)
    	    	{
    	    		System.out.println("exception raised while sending request to backend");
    	    		e.printStackTrace();
    	    	}
    	}
    	else
    	{
    	    // If from cron Process tasks in frontend. Max 5K tasks will be running frontend tasks
    		if(PullQueueUtil.getTasksCountofQueue(AgileQueues.CRON_PULL_TASK_QUEUE) < 5000)
    			addTaskToQueue(queueName);
    	}
	}
	
	 private void addTaskToQueue(String queueName)
    {
    	Queue queue = QueueFactory.getQueue(AgileQueues.CRON_PULL_TASK_QUEUE);
    	CronPullDeferredTask task = new CronPullDeferredTask(queueName);
    	queue.add(TaskOptions.Builder.withPayload(task));
    }	
}


class CronPullDeferredTask implements DeferredTask
{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 3130745982138904157L;
	private String queueName = null;
	
	public CronPullDeferredTask(String queueName)
	{
		this.queueName = queueName;
	}

	public void run()
	{
		 PullScheduler pullScheduler = new PullScheduler(queueName, true);
		 pullScheduler.run();
	}
}

class TasksCountZeroException extends Exception
{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1024188223470910677L;
	
}
