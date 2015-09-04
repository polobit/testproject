$(function()
{
	$("#update_allowed_domains").die().live("click", function(e)
	{
		e.preventDefault();
		var allowed_domains = get_allowed_domains();
		var new_allowed_domain = $("#new_allowed_domain").val();
		if (is_duplicate_allowed_domain(new_allowed_domain, allowed_domains))
			return;
		allowed_domains = allowed_domains ? allowed_domains + ", " + new_allowed_domain : new_allowed_domain;
		put_allowed_domains(allowed_domains);
	});

	$(".allowed-domain-delete").die().live("click", function(e)
	{
		e.preventDefault();
		$(this).closest("tr").remove();
		var allowed_domains = get_allowed_domains();
		put_allowed_domains(allowed_domains);
	});
});

function get_allowed_domains()
{
	var allowed_domains_array = $("#allowed_domains_list").children();
	var allowed_domains = "";
	for ( var i = 0; i < allowed_domains_array.length; i++)
	{
		allowed_domains = allowed_domains ? allowed_domains + ", " + $(allowed_domains_array[i]).attr("data") : $(allowed_domains_array[i]).attr("data");
	}
	return allowed_domains;
}

function put_allowed_domains(allowed_domains)
{
	$.ajax({ url : "/core/api/api-key/allowed-domains?allowed_domains=" + encodeURIComponent(allowed_domains), method : "PUT", async : true,
		success : function(data)
		{
			$("#allowed_domains_list").empty();
			var domains_to_append = Handlebars.helpers.allowed_domain_list(data.allowed_domains);
			$("#allowed_domains_list").append(domains_to_append);
		} });
}

function is_duplicate_allowed_domain(new_allowed_domain, allowed_domains)
{
	allowed_domains = allowed_domains.split(",");
	for ( var i in allowed_domains)
	{
		allowed_domains[i] = allowed_domains[i].trim();
		if (allowed_domains[i] == new_allowed_domain)
			return true;
	}
	return false;
}
