/**
 * agile_refernce_domain.js is used to read the reference domain from query
 * string when user visited from referral link
 */



function getParameterByName(name)
{
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex.exec(location.search);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function agile_create_reference_domain_cookie()
{
	if (getParameterByName('utm_source') == "affiliates")
	{
		var reference_domain = getParameterByName("utm_campaign");
		if (reference_domain)
		{

			agile_createCookieInAllAgileSubdomains("Agile_Reference_Domain", reference_domain, 90);
			console.log("cookie created " + reference_domain);
		}
		else
		{
			reference_domain = "";
		}
	}
}




