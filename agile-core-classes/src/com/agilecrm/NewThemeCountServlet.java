package com.agilecrm;

import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.user.util.UserPrefsUtil;
import com.agilecrm.util.NamespaceUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.api.taskqueue.TransientFailureException;
import com.thirdparty.sendgrid.SendGrid;

public class NewThemeCountServlet extends HttpServlet{
	 public void doPost(HttpServletRequest req, HttpServletResponse res)
	 {
		doGet(req, res);
	 }
	 public void doGet(HttpServletRequest req, HttpServletResponse res)
	 {
		 CheckNewThemeCount deferredTask = new CheckNewThemeCount();
		 Queue queue = QueueFactory.getDefaultQueue();
		 System.out.println("creating queue");
		 addTaskToQueue(queue,deferredTask);
	 }
	 public static void addTaskToQueue(Queue queue,DeferredTask dt)
	 {
     	try{
     	      queue.add(TaskOptions.Builder.withPayload(dt));
     	}
     	catch (TransientFailureException tfe)
     	{
     		System.out.println("In Transient failure exception");
     		addTaskToQueue(queue,dt);
     	}
     }

}
class CheckNewThemeCount implements DeferredTask{
	@Override
	public void run() {
		System.out.println("In run method");
		Set<String> namespaces = NamespaceUtil.getAllNamespaces();
		System.out.println("In namespace");
		int count = 0;
		String info="";
		for(String namespace : namespaces){
			String oldNamespace = NamespaceManager.get();
			NamespaceManager.set(namespace);
			try{
				List<DomainUser> users = DomainUserUtil.getUsers();
				System.out.println("All users = "+users);
				for(DomainUser user : users){
					UserPrefs prefs = UserPrefsUtil.getUserPrefs(AgileUser.getCurrentAgileUserFromDomainUser(user.id));
					System.out.println("prefs = "+prefs);
					if(prefs.theme.equals("15")){
							count++;
							System.out.println("count = "+count);
							info += user.email+"("+user.domain+")"+System.lineSeparator();							
					}
					else
						return;
				}
			
			}
			finally{
				NamespaceManager.set(oldNamespace);
			}
		}
		String msg = "New theme users = "+count+System.lineSeparator()+"Users information = "+info;
		System.out.println("sending mail");
		System.out.println("info = "+info);
		SendGrid.sendMail("noreply@agilecrm.com", "agilecrm", "srija@agilecrm.com", null, null, "Number of users", null, null, msg);
		System.out.println("after email send");
	}
}