function get_blocked_ips()
{
	var blocked_ips_array = $("#blocked_ips_list").children();
	var blocked_ips = "";
	for ( var i = 0; i < blocked_ips_array.length; i++)
	{
		blocked_ips = blocked_ips ? blocked_ips + ", " + $(blocked_ips_array[i]).attr("data") : $(blocked_ips_array[i]).attr("data");
	}
	return blocked_ips;
}

function put_blocked_ips(blocked_ips)
{
	$.ajax({ url : "/core/api/api-key/blocked-ips?blocked_ips=" + encodeURIComponent(blocked_ips), method : "PUT",
		success : function(data)
		{
			$("#blocked_ips_list").empty();
			var ips_to_append = Handlebars.helpers.blocked_ips_list(data.blocked_ips);
			$("#blocked_ips_list").append(ips_to_append);
			$(".blocked-ip-delete").on('click', function(e) {
        e.preventDefault();
        $(this).closest("tr").remove();
        var blocked_ips = get_blocked_ips();
        put_blocked_ips(blocked_ips);
    });
			$("#update_blocked_ips").removeAttr("disabled");
			$("#new_blocked_ip").val("");
		} });
}

function is_duplicate_blocked_ip(new_blocked_ip, blocked_ips)
{
	blocked_ips = blocked_ips.split(",");
	for ( var i in blocked_ips)
	{
		blocked_ips[i] = blocked_ips[i].trim();
		if (blocked_ips[i] == new_blocked_ip)
			return true;
	}
	return false;
}

function is_valid_ip(blocked_ip)
{
	blocked_ip = blocked_ip.replace(/\*/g, "0");
	var ip_regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
	return ip_regex.test(blocked_ip);
}
