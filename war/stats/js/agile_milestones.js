/**
 * agile_milestones.js deals with functions to get milestones
 * 
 * @module stats
 */

/**
* Get milestones of domain
*
* @return callback
* 					callback function for getMilestones
*/
function agile_getMilestones(callback)
{
	// Get
	var agile_url = agile_id.getURL() + "/contact/get-milestones?callback=?&id=" + agile_id.get();
	
	// Callback
	agile_json(agile_url, callback);
}