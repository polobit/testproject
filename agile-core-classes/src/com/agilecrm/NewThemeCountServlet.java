package com.agilecrm;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.db.ObjectifyGenericDao;
import com.agilecrm.ipaccess.IpAccess;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.DomainUser;
import com.agilecrm.user.UserPrefs;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.user.util.UserPrefsUtil;
import com.agilecrm.util.NamespaceUtil;
import com.amazonaws.util.StringUtils;
import com.google.api.client.util.Key;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.Queue;
import com.google.appengine.api.taskqueue.QueueFactory;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.api.taskqueue.TransientFailureException;
import com.thirdparty.sendgrid.SendGrid;

public class NewThemeCountServlet extends HttpServlet {
	public void doPost(HttpServletRequest req, HttpServletResponse res) {
		doGet(req, res);
	}

	public void doGet(HttpServletRequest req, HttpServletResponse res) {
		CheckNewThemeCount deferredTask = new CheckNewThemeCount();
		Queue queue = QueueFactory.getQueue("owner-change-queue");
		System.out.println("ownerchangequeue");
		addTaskToQueue(queue, deferredTask);
	}

	public static void addTaskToQueue(Queue queue, DeferredTask dt) {
		try {
			queue.add(TaskOptions.Builder.withPayload(dt));
		} catch (TransientFailureException tfe) {
			System.out.println("In Transient failure exception");
			addTaskToQueue(queue, dt);
		}
	}

}

class CheckNewThemeCount implements DeferredTask {
	Set<String> usersList = new HashSet<String>();

	@Override
	public void run() {
		System.out.println("In run method");
		StringBuffer sb = new StringBuffer();
		int count = 0;
		Set<String> namespaces = NamespaceUtil.getAllNamespaces();
		System.out.println("countthemequeue");
		for (String namespace : namespaces) {
			NamespaceManager.set(namespace);

			ObjectifyGenericDao<UserPrefs> dao = new ObjectifyGenericDao<UserPrefs>(UserPrefs.class);
			int count1 = dao.getCountByProperty("theme", "15");
			System.out.println("count1 :" + count1 + " Namespace :" + namespace);
			if (count1 == 0)
				continue;

			System.out.println("when count is not zero");
			// DomainUsers
			List<com.googlecode.objectify.Key<DomainUser>> domainUserIds = new ArrayList<>();

			List<AgileUser> agileUsers = AgileUser.getUsers();

			System.out.println("AgileUsers :" + agileUsers);
			List<DomainUser> users = new ArrayList<DomainUser>();
			for (AgileUser agileUser : agileUsers) {
				UserPrefs userPrefs = UserPrefsUtil.getUserPrefs(agileUser);
				System.out.println("userPrefs = " + userPrefs);
				if (userPrefs == null || userPrefs.theme == null || !userPrefs.theme.equals("15"))
					continue;
				try {
					users.add(DomainUserUtil.getDomainUser(agileUser.domain_user_id));
					System.out.println("users = " + users);
					// domainUserIds.add(new
					// com.googlecode.objectify.Key(DomainUser.class,
					// agileUser.domain_user_id));
					NamespaceManager.set("");
					System.out.println("domainuserids" + domainUserIds);
				} catch (Exception e) {
					// TODO: handle exception
				} finally {
					System.out.println("setting namespace");
					NamespaceManager.set(namespace);
				}

			}

			// List<DomainUser> users =
			// DomainUserUtil.getDomainUsersFromKeys(domainUserIds);
			System.out.println("domainUsers = " + users + " User size = " + users.size());
			for (DomainUser domainUser : users) {
				sb.append(domainUser.email + "\t" + namespace + "\n");
			}
			count += users.size();
			sb.append("\n");
		}
		System.out.println(sb);
		System.out.println("sending mail");
		String subject = "New theme users : " + count;
		SendGrid.sendMail("noreply@agilecrm.com", "agilecrm", "venkat@agilecrm.com", null, null, subject, null, null,
				sb.toString());
	}

}