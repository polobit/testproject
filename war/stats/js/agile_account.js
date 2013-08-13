/**
 * agile_account.js deals with function to set id, namespace
 * 
 * @module stats
 */

function agile_setAccount(id, namespace)
{
	// Sets the contact account with passed id and namespace
	console.log("Setting account " + id + " with namespace " + namespace);
	agile_id.set(id, namespace);
}
