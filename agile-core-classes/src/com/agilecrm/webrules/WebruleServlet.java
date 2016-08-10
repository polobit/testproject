package com.agilecrm.webrules;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.search.ui.serialize.SearchRule.RuleCondition;
import com.agilecrm.search.ui.serialize.SearchRule.RuleType;
import com.agilecrm.webrules.WebRuleAction;
import com.agilecrm.webrules.WebRuleAction.Action;
import com.agilecrm.webrules.util.WebRuleUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.*;

@SuppressWarnings("serial")
public class WebruleServlet extends HttpServlet {

	public void service(HttpServletRequest req, HttpServletResponse resp) throws IOException {

		doGet(req, resp);

	}

	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {

		System.out.println(" host url is " + req.getRequestURL().toString());

		String url = req.getRequestURL().toString();
		String domainName;

		try {

			domainName = WebrulePushPopup.getDomainName(url);
			System.out.println("host name is " + domainName);

		} catch (URISyntaxException e) {

			domainName = "AGILE CRM";
			e.printStackTrace();
		}

		WebrulePushPopup.CreateWebrule(domainName);

	}

}
