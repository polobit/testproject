JSONSerializer = function () {}; /* @private */
JSONSerializer.prototype.type = "JSONSerializer";
/*
 * Return the draw2d document as JSON
 * @param {Document} document The Draw2D document
 */
JSONSerializer.prototype.toJSON = function (document) {

	// Stores the nodes of the entire workflow 
	var json = {};
	json.nodes = [];

	// Get the workflow figures which may consist of Nodes, ImageFigure etc. 
	var figures = document.getFigures();

	// Iterate each node
	for (var figureIndex = 0; figureIndex < figures.size; figureIndex++) {

		// Get the figure object
		var figure = figures.get(figureIndex);
		// Check if figure object is a node or not. If not, continue to next iteration
		if (!(figure instanceof Node)) {
			continue;
		}

		var eachNodeJson = {};
		/*
		 * Get the node defintion, id, x, y, display name, json form values of the each node.
		 * Here jsonencode is used to encode the double quotes           
		 */
		eachNodeJson.NodeDefinition = figure.getProperty("NodeDefinition");
		eachNodeJson.id = figure.getId();
		eachNodeJson.xPosition = figure.getX();
		eachNodeJson.yPosition = figure.getY();
		eachNodeJson.displayname = figure.displayName;
		eachNodeJson.JsonValues = figure.getProperty("JSON");
		eachNodeJson.States = [];
		// Get the ports list of node
		var ports = figure.getPorts();
		// Iterate the ports list and add the required properties to json.	
		for (var portIndex = 0; portIndex < ports.getSize(); portIndex++) {
			/*
			 * Check if the port name is Source or not. If it is Source we will not iterate because we 
			 * will iterate only output ports.
			 */
			if (ports.get(portIndex).getName() != "Source") {

				// Stores the connection of particular port as json
				var jsonConnection = {};
				// Get the particular port from the list of ports using index
				var port = ports.get(portIndex);
				// Get the name of the port
				var portName = port.getName();
				// Perform trim operation on portName
				portName = trimAll(portName);
				// Get the connections list of port
				var connections = port.getConnections();
				// Check if number of connections is greater than zero or not. 		
				if (connections.size > 0) {
					// Get the connection object
					var connection = connections.get(0);
					// Get the target node id ie., next node id
					var targetNodeId = connection.getTarget().getParent().getId();
					// Store port name and target node id as key, value pairs in json object
					jsonConnection[portName] = targetNodeId;
					
				} 
				else {                       
						  // Perform trim operation on portName
						  portName = trimAll(portName);
						  // Store port name and target node id as key, value pairs in json object.
    						jsonConnection[portName] = "hangup";				  

				}

      				// Store json object for each connection into states array. 
					eachNodeJson.States.push(clone(jsonConnection));
			}


		}
		// Store json object for each node into nodes array.
		json.nodes.push(clone(eachNodeJson));
	}
	return (json);
};


// This function performs trim operation
function trimAll(sString) {
    if(sString!=undefined){
		while (sString.substring(0, 1) == ' ') {
			sString = sString.substring(1, sString.length);
		}
		while (sString.substring(sString.length - 1, sString.length) == ' ') {
			sString = sString.substring(0, sString.length - 1);
		}
	}
	return sString;
}