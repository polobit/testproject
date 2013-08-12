/**
 * agile_account.js deals with functions to set, get agile_id getURL,
 * getNamespace and set agile_setAccount
 * 
 * @module stats
 */

var agile_id = {

// sets the agile_id, id = api key, namespace = account owner domain name
set : function(id, namespace)
{
	this.id = id;
	this.namespace = namespace;
	console.log(id);
	console.log(namespace);
},
get : function()
{ 
	// returns the id of the contact
	console.log("get id" + this.id);
	return this.id;
}, 
getURL : function()
{ 
	// returns the url corresponding to the namespace
	if (!this.namespace || this.namespace == "localhost")
		return "http://localhost:8888/core/js/api";
	else
		return "https://" + this.namespace + ".agilecrm.com/core/js/api";
}, 
getNamespace : function()
{
	return this.namespace; // returns the namespace by id
} };

function agile_setAccount(id, namespace)
{
	// sets the contact account with passed id and namespace
	console.log("Setting account " + id + " with namespace " + namespace);
	agile_id.set(id, namespace);
}
