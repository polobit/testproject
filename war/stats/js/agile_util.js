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
