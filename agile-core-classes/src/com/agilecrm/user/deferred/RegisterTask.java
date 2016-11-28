package com.agilecrm.user.deferred;

import com.google.appengine.api.NamespaceManager;

public class RegisterTask extends AgileDeferredTask {
	String domainname;

	public RegisterTask(String domainname) {
		this.domainname = domainname;
	}

	@Override
	public void run() {
		try {
			NamespaceManager.set(domainname);
			
			
		} catch (Exception e) {
			handleException(e);
		}

	}
}
