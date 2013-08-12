/**
 * agile_score.js deals with functions to add or substract score
 * from the contact fetched based on email 
 * @param score
 * 				score to be added or subtracted from contact
 * @param callback
 * 				callback function for addSore or subtractScore
 * @param email
 * 				email of the contact
 */
function agile_addScore(score, callback, email)
{
	//if score is not passed return
	if (!score)
		return;
	//check if email is passed else get it from cookie
	if (!email)
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else
			email = agile_guid.get_email();
	}

	// Post
	var agile_url = agile_id.getURL() + "/contacts/add-score?callback=?&id=" + agile_id.get() + "&score=" + score + "&email=" + encodeURIComponent(email);
	//callback
	agile_json(agile_url, callback);
}

function agile_subtractScore(score, callback, email)
{
	//if score is not passed return
	if (!score)
		return;
	//check if email is passed else get it from cookie
	if (!email)
	{
		if (!agile_guid.get_email())
		{
			return;
		}
		else
			email = agile_guid.get_email();
	}
	// Post
	var agile_url = agile_id.getURL() + "/contacts/subtract-score?callback=?&id=" + agile_id.get() + "&score=" + score + "&email=" + encodeURIComponent(email);
	//callback
	agile_json(agile_url, callback);
}