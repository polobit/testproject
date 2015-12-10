/**
 * agile_score.js deals with functions to add, get, subtract score from the
 * contact fetched based on email
 */

/**
 * Add score to contact based on email
 * @param score
 *            score to be added or subtracted from contact
 * @param callback
 *            callback function for addSore or subtractScore
 * @param email
 *            email of the contact
 */
function agile_addScore(score, callback, email)
{
	// If score is not passed return
	if (!score)
		return;

	// Check if email is passed else get it from cookie
	if (!email)
	{
		if (!agile_guid.get_email())
		{
			agile_cookieScore("add", score);
			return;
		}
		else
			email = agile_guid.get_email();
	}

	// Post
	var agile_url = agile_id.getURL() + "/contacts/add-score?callback=?&id=" + agile_id.get() + "&score=" + score + "&email=" + encodeURIComponent(email);

	// Callback
	agile_json(agile_url, callback);
}

function agile_subtractScore(score, callback, email)
{
	// If score is not passed return
	if (!score)
		return;

	// Check if email is passed else get it from cookie
	if (!email)
	{
		if (!agile_guid.get_email())
		{
			agile_cookieScore("delete", score);
			return;
		}
		else
			email = agile_guid.get_email();
	}
	// Post
	var agile_url = agile_id.getURL() + "/contacts/subtract-score?callback=?&id=" + agile_id.get() + "&score=" + score + "&email=" + encodeURIComponent(email);

	// Callback
	agile_json(agile_url, callback);
}

/**
 * Get score based on contact email
 * @param callback
 * 				callback function for agile_getScore
 * @param email
 * 				email of the contact
 */
function agile_getScore(callback, email)
{
	if(!email)
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else
			email = agile_guid.get_email();
	}
	var agile_url = agile_id.getURL() + "/contacts/get-score?callback=?&id=" + agile_id.get() + "&" + "email={0}".format(encodeURIComponent(email));
	
	// Callback
	agile_json(agile_url, callback);
}