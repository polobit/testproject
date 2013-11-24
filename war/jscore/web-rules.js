function chainWebRules(el)
{
	$("#campaign-actions", el).chained($("#action", el));
	$("#action-details", el).chained($("#action", el));
	$("#WEB_RULE_RHS", el).chained($("#action", el));
	$("#campaign", el).chained($("#action", el));
	$("#noty-type", el).chained($("#action", el));
	$("#noty-title", el).chained($("#noty-type", el));
	$("#noty-message", el).chained($("#noty-type", el));
}