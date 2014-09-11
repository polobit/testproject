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
	var _utm_source=getParameterByName('utm_source');
	var _utm_medium=getParameterByName('utm_medium');
	var _utm_campaign=getParameterByName('utm_campaign');
	
	agile_createCookieInAllAgileSubdomains("_agile_utm_source", _utm_source, 90);
	agile_createCookieInAllAgileSubdomains("_agile_utm_medium", _utm_medium, 90);
	agile_createCookieInAllAgileSubdomains("_agile_utm_campaign", _utm_campaign, 90);
	
	if (_utm_source == "affiliates")
	{
		var reference_domain = _utm_campaign;
		if (reference_domain)
		{

			agile_createCookieInAllAgileSubdomains("agile_reference_domain", reference_domain, 90);
			console.log("cookie created " + reference_domain);
		}
		else
		{
			reference_domain = "";
		}
	}
}




