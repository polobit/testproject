/**
 * Function to check if user is known
 * 
 * @param email
 * @param callback
 */
function agile_isKnown(email, success_callback, error_callback, a, b)
{
	_agile.get_contact(email, { success : function(data)
	{
		if (!data)
		{
			success_callback();
		}
		error_callback(a, b);
	}, error : function(data)
	{
		success_callback();
	} });
}

/**
 * Function to authenticate domain
 * 
 * @param callback
 * @param a
 * @param b
 */
function agile_isAuth(callback, a, b)
{
	agile_accessDomains({ success : function(data)
	{
		var i = data.length;
		while (i > 0)
		{
			if (data[--i].accessDomains == window.location.hostname)
			{
				callback(a, b);
				return;
			}
		}
		console.log("unauthenticated");
	}, error : function(data)
	{
		console.log("unauthenticated");
	} });
}
