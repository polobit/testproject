/**
 * Function to check if visitor is known
 * 
 * @param email
 * @returns {Boolean}
 */
function agile_isKnown(email)
{
	if (!email)
		return false;
	agile_getContact(email, { success : function(data)
	{
		return true;
	}, error : function(data)
	{
		return false;
	} });
}
