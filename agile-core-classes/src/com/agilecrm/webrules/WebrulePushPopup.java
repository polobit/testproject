package com.agilecrm.webrules;

import java.net.InetAddress;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;

import com.agilecrm.account.util.AccountPrefsUtil;
import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.search.ui.serialize.SearchRule.RuleCondition;
import com.agilecrm.search.ui.serialize.SearchRule.RuleType;
import com.agilecrm.user.AgileUser;
import com.agilecrm.user.util.DomainUserUtil;
import com.agilecrm.webrules.WebRuleAction.Action;
import com.agilecrm.webrules.util.WebRuleUtil;
import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.datastore.Text;

public class WebrulePushPopup {

	public static void CreateWebrule(String hostName) {

		String domain = NamespaceManager.get();
		List<WebRuleAction> actionsList = new ArrayList<WebRuleAction>();
		List<SearchRule> rulesList = new ArrayList<SearchRule>();
		List<WebRule> webRulesList = new ArrayList<WebRule>();
		hostName = AccountPrefsUtil.getAccountPrefs().company_name;

		String html = "<html lang=\"en\" data-modal-type=\"agile-modal-xs push-xs\" data-modal-version=\"2\" >\n<head>\n<meta http-equiv=\"content-type\" content=\"text/html;charset=utf-8\" />\n<title>Popup</title>\n<link\n  href=\"https://fonts.googleapis.com/css?family=Varela:400|Montserrat:700\"\n  rel=\"stylesheet\" type=\"text/css\">\n<style type=\"text/css\">\n\n\t@media (max-width:320px){\n\t.image-wrapper{\n\t    display: none;\n\t}\n\t.button {\n    \tfloat: left !important;\n\t}\n\t.notification-window {\n    \tpadding-bottom: 20px;\n\t}\n\t.agilecrm-branding {\n    \tfloat: right !important;\n\tmargin-top: 8px !important;\n\t}\t\n\n\t}\n\t\n\t.notification-window {\n\t    background-color: white;\n    \t}\n\t.inner-wrapper {\n    padding: 0 20px 10px 20px;\n\t}\n\t.image-wrapper {\n    float: left;\n    margin: 15px 15px 0px 0px !important;\n    padding: 0 !important;\n\t}\n\t.image-wrapper img {\n    height: 65px;\n    width: 65px;\n\t}\n\t.text {\n    padding: 15px 0 0 0 !important;\n\t}\n\t.title {\n    font-size: 14px;\n    line-height: 1.4em;\n    font-family: 'Open Sans', sans-serif;\n\t}\n\t.message {\n    font-size: 12px !important;\n    line-height: 1.4em !important;\n    margin: 10px 0 !important;\n    padding: 0 !important;\n    text-align: left !important;\n    font-family: 'Open Sans', sans-serif !important;\n    word-break: break-word;\n    color: #95a5a6;\n\t}\n\t.button {\n    float: right ;\n    margin: 0 !important;\n    padding: 0 !important;\n\t}\n\t.btn.btn-close {\n    background: #FFFFFF !important;\n    color: #000 !important;\n    border-color: #CCCCCC !important;\n    margin-right: 20px !important;\n    width: 100px !important;\n\t}\n\t.btn {\n    width: 90px !important;\n    height: 26px !important;\n    font-size: 14px !important;\n    line-height: 1.1em !important;\n    border-radius: 4px !important;\n    color: #fff !important;\n    background: linear-gradient(to bottom,#64b4f4,#0084f6) !important;\n    border: 1px solid #42a2f2 !important;\n    display: inline-block !important;\n    padding: 5px !important;\n    box-sizing: border-box !important;\n    font-family: Arial !important;\n    text-decoration: blink;\n    text-align: center;\n\t}\n\t.agilecrm-branding {\n    float: left;\n    font-size: 10px;\n    margin-top: 8px;\n    font-family: Arial !important;\n    line-height: 1.2em !important;\n\t}\n\t.agilecrm-branding img {\n    vertical-align: bottom;\n    width: 14px;\n    height: 14px;\n    padding-right: 2px;\n    }\n\n</style>\n</head>\n<body >\n<div id=\"popup\" style=\"margin: 0px auto;max-width: 468px;\">\n<div id=\"popup-body\">\n<div id=\"popup-content\">\n<div>\n<div id=\"floating-opt-in\" class=\"notification notification-window\">\n<div class=\"inner-wrapper\">\n<div class=\"image-wrapper\"><img class=\"notification-image logo-preview-notification\" src=\"https://agilecrm.s3.amazonaws.com/editor/notification/santhoshkumar/ttvpnf5y_png_1470311035869.png\" /></div>\n<div class=\"text\"><strong><span class=\"title\" id=\"customize_title_preview\">"
				+ hostName
				+ " would like to send you notifications.</span></strong>\n<p class=\"message\" id=\"customize_subtitle_preview\">Notifications can be turned off anytime from browser settings.</p>\n</div>\n<div style=\"clear: both;\">\n<div class=\"agilecrm-branding\"><span> <a href=\"https://www.agilecrm.com/\" target=\"_blank\" style=\"text-decoration: none; color: black;\"> Powered by Agile </a> </span></div>\n<div class=\"button\"><a class=\"btn btn-close\" href=\"#\" onclick=\"dontAllow();\">Don't Allow</a> <a class=\"btn\" href=\"#\" onclick=\"allow();\">Allow</a></div>\n<div style=\"clear: both;\"></div>\n</div>\n</div>\n</div>\n</div>\n</div>\n</div>\n</div>\n</body>\n<script>\n\tfunction allow(){\n      window.parent.agile_store_data(\"agile-push-notification\",true);\n var params = \"guid=\" + window.parent.agile_guid.get();\n\n      params = params + \"&email=\" + window.parent.agile_guid.get_email();\n\n      params = params + \"&apiKey=\" + window.parent.agile_id.id;\n\n      params = params + \"&host=\" + window.parent.location.host;\n\n\n\twindow.open( \"https://\"+window.parent.agile_id.getNamespace()+\".agilecrm.com/notification/notification.html?\"+params,\"name\",\"height=325,width=500\");\n window.parent._agile_close_modal();\nreturn false;\n}\n\n\tfunction dontAllow(){\n\twindow.parent._agile_webrule_cookie('request-push-popup', 'agile-pushpopup-webrule', 5);\n        window.parent._agile_close_modal();\nreturn false;\n}\n</script>\n</html>";

		Text text = new Text(html);

		WebRule webrule = new WebRule();
		webrule.name = "Request Push Notification";
		webrule.disabled = false;

		WebRuleAction actions = new WebRuleAction();
		actions.RHS = null;
		actions.action = Action.REQUEST_PUSH_POPUP;
		actions.delay = "AFTER_SECS";
		actions.popup_pattern = null;
		actions.popup_text = text;
		actions.position = "CENTER";
		actions.timer = (long) 5;
		actions.title = null;

		actionsList.add(actions);

		SearchRule rules = new SearchRule();
		rules.CONDITION = RuleCondition.MATCHES;
		rules.LHS = "page";
		rules.RHS = "http";
		rules.RHS_NEW = null;
		rules.nested_condition = null;
		rules.nested_lhs = null;
		rules.nested_rhs = null;
		rules.ruleType = RuleType.Contact;

		rulesList.add(rules);

		webrule.actions = actionsList;
		webrule.rules = rulesList;

		webRulesList.addAll(WebRuleUtil.getAllWebRules());

		int count = 0;
		if (!webRulesList.isEmpty()) {
			for (WebRule webRule2 : webRulesList) {
				if (webRule2.actions.get(0).action.equals(webrule.actions.get(0).action)) {
					count++;
					break;
				}
			}
			if (count == 0)
				webrule.save();
		} else {
			webrule.save();
		}

	}

	public static String getDomainName(String url) throws URISyntaxException {

		URI uri = new URI(url);
		String domain = uri.getHost();
		url = domain.startsWith("www.") ? domain.substring(4) : domain;

		return url;
	}

}
