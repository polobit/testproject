package com.agilecrm.webrules;

import java.net.InetAddress;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;

import com.agilecrm.search.ui.serialize.SearchRule;
import com.agilecrm.search.ui.serialize.SearchRule.RuleCondition;
import com.agilecrm.search.ui.serialize.SearchRule.RuleType;
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
		hostName = hostName.toUpperCase();

		/*
		 * String html =
		 * "<html lang=\"en\" data-modal-type=\"agile-modal-xs push-xs\" data-modal-version=\"2\">\n<head>\n<meta http-equiv=\"content-type\" content=\"text/html;charset=utf-8\" />\n<title>Popup</title>\n<link\n  href=\"https://fonts.googleapis.com/css?family=Varela:400|Montserrat:700\"\n  rel=\"stylesheet\" type=\"text/css\">\n<style type=\"text/css\">\n body {\n        \n         }\n\t.notification-window {\n\t    width: 100%;\n\t    background-color: white;\n    }\n\t.inner-wrapper {\n    padding: 0 20px 10px 20px;\n\t}\n\t.image-wrapper {\n    float: left;\n    margin: 15px 15px 0px 0px !important;\n    padding: 0 !important;\n\t}\n\t.image-wrapper img {\n    height: 65px;\n    width: 65px;\n\t}\n\t.text {\n    padding: 10px 0 0 0 !important;\n\t}\n\t.title {\n    font-size: 14px;\n    font-weight: 700;\n    line-height: 4.4em;\n    font-family: 'Open Sans', sans-serif;\n\t}\n\t.message {\n    font-size: 12px !important;\n    line-height: 1.4em !important;\n    margin: 10px 0 !important;\n    padding: 0 !important;\n    text-align: left !important;\n    font-family: 'Open Sans', sans-serif !important;\n    word-break: break-word;\n\t}\n\t.button {\n    float: right !important;\n    margin: 0 !important;\n    padding: 0 !important;\n\t}\n\t.btn.btn-close {\n    background: #FFFFFF !important;\n    color: #000 !important;\n    border-color: #CCCCCC !important;\n    margin-right: 20px !important;\n    width: 100px !important;\n\t}\n\t.btn {\n    width: 90px !important;\n    height: 26px !important;\n    font-size: 14px !important;\n    line-height: 1.1em !important;\n    border-radius: 4px !important;\n    color: #fff !important;\n    background: linear-gradient(to bottom,#64b4f4,#0084f6) !important;\n    border: 1px solid #42a2f2 !important;\n    display: inline-block !important;\n    padding: 5px !important;\n    box-sizing: border-box !important;\n    font-family: Arial !important;\n    text-decoration: blink;\n    text-align: center;\n\t}\n\t.agilecrm-branding {\n    float: left;\n    font-size: 10px;\n    margin-top: 8px;\n    font-family: Arial !important;\n    line-height: 1.2em !important;\n\t}\n\t.agilecrm-branding img {\n    vertical-align: bottom;\n    width: 14px;\n    height: 14px;\n    padding-right: 2px;\n    }\n\n</style>\n<script>\n\tfunction allow(){\n      window.parent.agile_store_data(\"agile-push-notification\",true);\n var params = \"guid=\" + window.parent.agile_guid.get();\n\n      params = params + \"&email=\" + window.parent.agile_guid.get_email();\n\n      params = params + \"&apiKey=\" + window.parent.agile_id.id;\n\n\n\twindow.open( \"https://\"+window.parent.agile_id.getNamespace()+\"-dot-sandbox-dot-agilecrmbeta.appspo.com/notification/notification.html?\"+params,\"name\",\"height=300,width=500\");\n window.parent._agile_close_modal();\n}\n\n\tfunction dontAllow(){\n\twindow.parent.agile_store_data(\"agile-push-notification\",true);\n}\n</script>\n</head>\n<body>\n<div id=\"popup\">\n<div id=\"popup-body\">\n<div id=\"popup-content\">\n<div>\n\t\t<div id=\"floating-opt-in\" class=\"notification notification-window\">\n\t\t\t<div class=\"inner-wrapper\">\n\t\t\t\t<div class=\"image-wrapper\">\n\t\t\t\t\t<img class=\"notification-image logo-preview-notification\"\n\t\t\t\t\t\tsrc=\"https://agilecrm.s3.amazonaws.com/editor/notification/santhoshkumar/ttvpnf5y_png_1470311035869.png\">\n\t\t\t\t</div>\n\t\t\t\t<div class=\"text\">\n\t\t\t\t\t<span class=\"title\"\n\t\t\t\t\t\tid=\"customize_title_preview\">"
		 * + hostName +
		 * " would like to send you notifications.</span>\n\t\t\t\t<!--\t<p class=\"message\"\n\t\t\t\t\t\tid=\"customize_subtitle_preview\">Notifications can be turned off anytime from browser settings.</p>-->\n\t\t\t\t</div>\n\t\t\t\t<div style=\"clear: both;\">\n\t\t\t\t\t<div class=\"agilecrm-branding\">\n\t\t\t\t\t\t<a href=\"https://agilecrm.com\"target=\"_blank\" style=\"text-decoration: none;\"> \n\t\t\t\t\t\t<img src=\"https://agilecrm.s3.amazonaws.com/editor/notification/santhoshkumar/ttvpnf5y_png_1470311035869.png\"></a> \n\t\t\t\t\t\t<span> \n\t\t\t\t\t\t<a href=\"https://agilecrm.com/\" target=\"_blank\" style=\"text-decoration: none; color: black;\"> Powered by Agile </a>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"button\">\n\t\t\t\t\t<a class=\"btn\" id="
		 * + domain +
		 * " href=\"javascript:allow();\">Allow</a>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div style=\"clear: both\"></div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n</div>\n</div>\n</div>\n</body>\n</html>"
		 * ;
		 */
		String html = "<html lang=\"en\" data-modal-type=\"agile-modal-xs push-xs\" data-modal-version=\"2\">\n<head>\n<meta http-equiv=\"content-type\" content=\"text/html;charset=utf-8\" />\n<title>Popup</title>\n<link\n  href=\"https://fonts.googleapis.com/css?family=Varela:400|Montserrat:700\"\n  rel=\"stylesheet\" type=\"text/css\">\n<style type=\"text/css\">\n body {\n        \n         }\n\t.notification-window {\n\t    width: 100%;\n\t    background-color: white;\n    }\n\t.inner-wrapper {\n    padding: 0 20px 10px 20px;\n\t}\n\t.image-wrapper {\n    float: left;\n    margin: 15px 15px 0px 0px !important;\n    padding: 0 !important;\n\t}\n\t.image-wrapper img {\n    height: 65px;\n    width: 65px;\n\t}\n\t.text {\n    text-align: center;\n    padding: 15px 0 0 0 !important;\n\t}\n\t.title {\n    font-size: 14px;\n    font-weight: 700;\n    line-height: 2.4em;\n    font-family: 'Open Sans', sans-serif;\n\t}\n\t.message {\n    font-size: 12px !important;\n    line-height: 1.4em !important;\n    margin: 10px 0 !important;\n    padding: 0 !important;\n    text-align: left !important;\n    font-family: 'Open Sans', sans-serif !important;\n    word-break: break-word;\n\t}\n\t.button {\n    float: right !important;\n    margin: 0 !important;\n    padding: 0 !important;\n\t}\n\t.btn.btn-close {\n    background: #FFFFFF !important;\n    color: #000 !important;\n    border-color: #CCCCCC !important;\n    margin-right: 20px !important;\n    width: 100px !important;\n\t}\n\t.btn {\n    width: 90px !important;\n    height: 26px !important;\n    font-size: 14px !important;\n    line-height: 1.1em !important;\n    border-radius: 4px !important;\n    color: #fff !important;\n    background: linear-gradient(to bottom,#64b4f4,#0084f6) !important;\n    border: 1px solid #42a2f2 !important;\n    display: inline-block !important;\n    padding: 5px !important;\n    box-sizing: border-box !important;\n    font-family: Arial !important;\n    text-decoration: blink;\n    text-align: center;\n\t}\n\t.agilecrm-branding {\n    float: left;\n    font-size: 10px;\n    margin-top: 8px;\n    font-family: Arial !important;\n    line-height: 1.2em !important;\n\t}\n\t.agilecrm-branding img {\n    vertical-align: bottom;\n    width: 14px;\n    height: 14px;\n    padding-right: 2px;\n    }\n\n</style>\n<script>\n\tfunction allow(){\n      window.parent.agile_store_data(\"agile-push-notification\",true);\n var params = \"guid=\" + window.parent.agile_guid.get();\n\n      params = params + \"&email=\" + window.parent.agile_guid.get_email();\n\n      params = params + \"&apiKey=\" + window.parent.agile_id.id;\n\n\n\twindow.open( \"https://\"+window.parent.agile_id.getNamespace()+\"-dot-sandbox-dot-agilecrmbeta.appspo.com/notification/notification.html?\"+params,\"name\",\"height=300,width=500\");\n window.parent._agile_close_modal();\n}\n\n\tfunction dontAllow(){\n\twindow.parent.agile_store_data(\"agile-push-notification\",true);\n}\n</script>\n</head>\n<body>\n<div id=\"popup\">\n<div id=\"popup-body\">\n<div id=\"popup-content\">\n<div>\n\t\t<div id=\"floating-opt-in\" class=\"notification notification-window\">\n\t\t\t<div class=\"inner-wrapper\">\n\t\t\t\t<div class=\"image-wrapper\">\n\t\t\t\t\t<img class=\"notification-image logo-preview-notification\"\n\t\t\t\t\t\tsrc=\"https://agilecrm.s3.amazonaws.com/editor/notification/santhoshkumar/ttvpnf5y_png_1470311035869.png\">\n\t\t\t\t</div>\n\t\t\t\t<div class=\"text\">\n\t\t\t\t\t<span class=\"title\"\n\t\t\t\t\t\tid=\"customize_title_preview\">"
				+ hostName
				+ " would like to send you notifications.</span>\n\t\t\t\t<!--\t<p class=\"message\"\n\t\t\t\t\t\tid=\"customize_subtitle_preview\">Notifications can be turned off anytime from browser settings.</p>-->\n\t\t\t\t</div>\n\t\t\t\t<div style=\"clear: both;\">\n\t\t\t\t\t<div class=\"agilecrm-branding\">\n\t\t\t\t\t\t<a href=\"https://agilecrm.com\"target=\"_blank\" style=\"text-decoration: none;\"> \n\t\t\t\t\t\t<img src=\"https://agilecrm.s3.amazonaws.com/editor/notification/santhoshkumar/ttvpnf5y_png_1470311035869.png\"></a> \n\t\t\t\t\t\t<span> \n\t\t\t\t\t\t<a href=\"https://agilecrm.com/\" target=\"_blank\" style=\"text-decoration: none; color: black;\"> Powered by Agile </a>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"button\">\n\t\t\t\t\t<a class=\"btn\" id="
				+ domain
				+ " href=\"javascript:allow();\">Allow</a>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div style=\"clear: both\"></div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n</div>\n</div>\n</div>\n</body>\n</html>";

		Text text = new Text(html);

		WebRule webrule = new WebRule();
		webrule.name = "Push Notification";
		webrule.disabled = false;

		WebRuleAction actions = new WebRuleAction();
		actions.RHS = null;
		actions.action = Action.PUSH_POPUP;
		actions.delay = "IMMEDIATE";
		actions.popup_pattern = null;
		actions.popup_text = text;
		actions.position = "CENTER";
		actions.timer = (long) 0;
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
				if (webRule2.name.equals(webrule.name)) {
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
