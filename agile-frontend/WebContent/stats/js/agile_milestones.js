/**
 * agile_milestones.js deals with functions to get milestones
 * 
 * @module stats
 */

/**
* Get pipelines of domain
*
* @return callback
* 					callback function for getPipelines
*/
function agile_getPipelines(callback)
{
	// Get
	var agile_url = agile_id.getURL() + "/milestone/get-pipelines?callback=?&id=" + agile_id.get();
	
	// Callback
	agile_json(agile_url, callback);
}

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

/**
* Get milestones of domain
*
* @return callback
* 					callback function for getMilestones
*/
function agile_getMilestones_by_pipeline(pipeline_id,callback)
{
	// Get
	var agile_url = agile_id.getURL() + "/milestone/get-milestones?callback=?&id=" + agile_id.get()+"&pipeline_id="+pipeline_id;
	
	// Callback
	agile_json(agile_url, callback);
}