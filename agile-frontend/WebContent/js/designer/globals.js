// Server Path
var Server = "/invox/core";
var Absolute_Server_Path = "http://localhost:8080/invox";

// YQL
var YQL_Filter = "http://localhost:8080";

// Translator
var Translator_Path_Global = "js/translator.js";

// Changed by yasin (8/12/2011)
// Default Nodes to be populated
var First_Nodes_Toolbar_Global = new Array("json/nodes/email/send_email.jsp",
		"json/nodes/common/wait.jsp", "json/nodes/email/clicked.js",
		"json/nodes/email/opened.js", "json/nodes/crm/tags.js",
		"json/nodes/common/score.js", "json/nodes/common/url.js",
		"json/nodes/social/tweet.js", "json/nodes/email/ab.js");

var Second_Nodes_Toolbar_Global = new Array("json/nodes/crm/addtask.jsp",
		"json/nodes/crm/adddeal.jsp", "json/nodes/crm/addnote.js",
		"json/nodes/common/check_tags.js", "json/nodes/crm/transfer.jsp",
		"json/nodes/developers/condition.js", "json/nodes/crm/set_owner.jsp",
		"json/nodes/developers/jsonio.js");

var Third_Nodes_Toolbar_Global = new Array("json/nodes/ticket/status.js",
		"json/nodes/ticket/priority.js", "json/nodes/ticket/type.js",
		"json/nodes/ticket/email_user.js", "json/nodes/ticket/email_group.js",
		"json/nodes/ticket/group.js", "json/nodes/ticket/assignee.js",
		"json/nodes/ticket/tags.js");

/*
 * var First_Nodes_Toolbar_Global = new Array("json/nodes/sms/sendmessage.js",
 * "json/nodes/sms/menusms.js", "json/nodes/common/wait.js",
 * "json/nodes/sms/getmessage.js", "json/nodes/sms/getnword.js",
 * "json/nodes/sms/condition.js", "json/nodes/common/jsonio.js",
 * "json/nodes/common/transfer.jsp"); var Second_Nodes_Toolbar_Global = new
 * Array("json/nodes/email/send_email.jsp", "json/nodes/common/wait.js",
 * "json/nodes/common/url.js",
 * "json/nodes/email/ab.js","json/nodes/email/bounced.js",
 * "json/nodes/email/clicked.js", "json/nodes/email/opened.js",
 * "json/nodes/email/score.js", "json/nodes/email/tags.js" );
 */

// Google Translator Path
var Google_Translator_Path = "http://jquery-translate.googlecode.com/files/jquery.translate-1.3.9.min.js";

// Table first column --- Changed for inline icon display (Yasin/3-09-10)
var Edit_Delete_Column = "<td><div class='ui-icon ui-icon-trash deletegridrow' style='float:right;'>delete</div><div class='ui-icon ui-icon-pencil editgridrow' style='float:left;'>edit</div></td>";

var Get_Node_Definations_Path = Server + "/catalog/getNodesCatalog.jsp";
// Default template jsp Ramesh 01/10/2010
var Default_PhoneSystem_Path = Server
		+ "/catalog/getTemplates.jsp?template=$template";
