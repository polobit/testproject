package com.agilecrm.user.deferred;

import com.agilecrm.session.SessionManager;
import com.agilecrm.session.UserInfo;
import com.agilecrm.util.Defaults;
import com.google.appengine.api.NamespaceManager;

public class RegisterTask extends AgileDeferredTask {
	String domainname;
	UserInfo userInfo;

	public RegisterTask(String domainname, UserInfo userInfo) {
		this.domainname = domainname;
		this.userInfo = userInfo;
	}

	@Override
	public void run() {
		try {
			System.out.println("RegisterTask = " + domainname);

			// Set Namespace
			NamespaceManager.set(domainname);

			// Set user info
			SessionManager.set(userInfo);
			
			new Defaults();

		} catch (Exception e) {
			handleException(e);
		}
	}
}
