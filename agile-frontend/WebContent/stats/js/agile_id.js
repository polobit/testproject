/**
 * agile_id.js deals with object agile_id and its methods which are used to set,
 * get agile user id and namespace.
 */
var agile_id = {

		// Sets the agile_id, id = api key, namespace = account owner domain name
		set : function(id, namespace)
		{
			this.id = id;
			this.namespace = namespace;
		}, get : function()
		{
			// Returns the id of the contact
			return this.id;
		}, getURL : function()
		{
			// Returns the url corresponding to the namespace
			if (!this.namespace || this.namespace == "localhost")
				return "http://localhost:8888/core/js/api";
			else
				return "https://" + this.namespace + ".agilecrm.com/core/js/api";
		}, getNamespace : function()
		{
			// Returns the namespace by id
			return this.namespace; 
		}, setDomain : function(host)
		{
			this.domain = host;
		}, getDomain : function()
		{
			return this.domain;
		}};
