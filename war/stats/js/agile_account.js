var agile_id = { set : function(id, namespace)
{
	this.id = id;
	this.namespace = namespace;
	console.log(id);
	console.log(namespace);
}, 
	get : function()
{
	console.log("get id" + this.id);
	return this.id;
}, 
	getURL : function()
{
	if (!this.namespace || this.namespace == "localhost")
		return "http://localhost:8888/core/js/api";
	else
		return "https://" + this.namespace + ".agilecrm.com/core/js/api";
}, 
getNamespace : function()
{
	return this.namespace;
} };

function agile_setAccount(id, namespace)
{
	console.log("Setting account " + id + " with namespace " + namespace);
	agile_id.set(id, namespace);
}