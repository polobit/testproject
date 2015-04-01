JSONDeserializer = function () {}; /* @private */
JSONDeserializer.prototype.type = "JSONDeserializer";
/*
 * Initialize construction of the draw2d document from JSON
 * @param {Document} document The Draw2D document
 * @param {JSONObject} Required JSON Object to construct the draw2d document
 */
JSONDeserializer.prototype.fromJSON = function ( /*:Document*/ workflow, /*:JSONObject*/ jsonObject) {
	this.jsonObject = jsonObject;
	
	console.log(jsonObject.nodes);
	//Creates the workflow
	this.createStates(workflow, jsonObject.nodes);
}

/*
 * Construct the nodes and connection from JSON
 * @param {Document} document The Draw2D document
 * @param {nodes} Nodes List
 */
JSONDeserializer.prototype.createStates = function ( /*:Document*/ workflow, /*:Node*/ nodes) {
	// Iterate the list of node json obejcts present in JSON
	
	console.log("deserializer js nodes length "+nodes.length);
	for (var nodeIndex = 0; nodeIndex < nodes.length; nodeIndex++) {
		// Get the json object for each node and stores it into nodeItem 
		var nodeItem = nodes[nodeIndex];
		// Get the node backend name from the particular node definition
		var nodeDefintion = nodeItem.NodeDefinition;
		// Get the node name from node definition
		var name = nodeDefintion.name;
		// Check if node name is Start or not
		if (name == "Start") {
			// Get the start node object from workflow
			var startNodeInDeserialization = workflow.getFigure("PBXNODE1");
			// Check if start node is present in workflow or not
			if (startNodeInDeserialization != null) {
				// Set the position of start node
				startNodeInDeserialization.setPosition(parseFloat(nodeItem.xPosition), parseFloat(nodeItem.yPosition));
				// Set the JsonValues property of start node
				startNodeInDeserialization.setProperty("JSON", nodeItem.JsonValues);
				startNodeInDeserialization = null;
			}
			
			// Continue to the next iteration
			continue;
		}
		// The node backend name is not start
		else {
			 /*  
			  * For each node, we need to call initNode() to construct the node.
			  * If the node is last node then we need to establish the connection between nodes. 
			  * To do this we need to call createConnections() in the callback function
			  * of last node. For this purpose, we need to send extra flag variable which decides
			  * whether the the createConnections() should be invoked or not.
			  */
			var flag = false;
			if (nodeIndex == nodes.length - 1) 
				flag = true;
			console.log("Creating connections started " + flag);
			
			this.initDraw2DNode(nodeItem,flag)				

		}
	}
}

// This function is used to create the connections between the nodes
JSONDeserializer.prototype.createConnections = function () {
	// Get the node json array
	var nodes = this.jsonObject.nodes;
	
	//alert("createConnections "+nodes.length);
	//alert("createConnections "+nodes);
	
	// Iterate the list of node json obejcts present in JSON
	for (var nodeIndex = 0; nodeIndex < nodes.length; nodeIndex++) {
		// Get the json object for each node and stores it into nodeItem 
		var nodeItem = nodes[nodeIndex];
		// Get the states of all connections
		var states = nodeItem.States;
		
		// Get the node id from json
		var nodeId = nodeItem.id;
		
		// Get the node object
		var nodeObject = workflow.getFigure(nodeId);
		console.log(nodeId);
		// Check if node object is null or not
		if (nodeObject == null) 
			return;
		var nodeName = nodeObject.name;
		console.log(nodeName);
		//alert(nodeName);
		var portIndex = 1;
		if( nodeName.toLowerCase() == "start" ) {
                portIndex = 0; 				              
		}
		
		// Check if states object is undefined or null
		if(states == undefined || states == null)
			return;
		
		console.log("states.length " + states.length);
		//alert("createConnections "+states.length);
		// states is an object but length is undefined. So it may have chance of json object 
		if(states.length == undefined) {
			this.sendConnectionDetails(states, nodeObject, portIndex);
		}


		// Iterate the list of state json obejcts present in JSON
		for (var stateIndex = 0; stateIndex < states.length; stateIndex++, portIndex++) {
			// Get the json object for each state and stores it into stateItem 
			var stateItem = states[stateIndex];
			console.log("createConnections inside for "+stateItem+" nodeObject"+nodeObject+" portIndex"+portIndex);
			this.sendConnectionDetails(stateItem, nodeObject, portIndex);
		}
	}
}



// This function is used to create the connections between the nodes
JSONDeserializer.prototype.createTemplateConnections = function (jsonObject) {
	// Get the node json array
	var nodes = jsonObject.nodes;
	
	//alert("createConnections "+nodes.length);
	//alert("createConnections "+nodes);
	
	// Iterate the list of node json obejcts present in JSON
	for (var nodeIndex = 0; nodeIndex < nodes.length; nodeIndex++) {
		// Get the json object for each node and stores it into nodeItem 
		var nodeItem = nodes[nodeIndex];
		// Get the states of all connections
		var states = nodeItem.States;
		
		// Get the node id from json
		var nodeId = nodeItem.id;
		//alert("createTemplateConnections nodeID "+nodeId.toString());
		
		// Get the node object
		var nodeObject = workflow.getFigure(nodeId);
		//alert("createTemplateConnections nodeObject "+nodeObject.toString());
		console.log(nodeId);
		// Check if node object is null or not
		if (nodeObject == null) 
			return;
		var nodeName = nodeObject.name;
		console.log(nodeName);
		//alert(nodeName);
		var portIndex = 1;
		if( nodeName.toLowerCase() == "start" ) {
                portIndex = 0; 				              
		}
		
		// Check if states object is undefined or null
		if(states == undefined || states == null)
			return;
		
		console.log("states.length " + states.length);
		//alert("createConnections "+states.length);
		// states is an object but length is undefined. So it may have chance of json object 
		if(states.length == undefined) {
			this.sendConnectionDetails(states, nodeObject, portIndex);
		}


		// Iterate the list of state json obejcts present in JSON
		for (var stateIndex = 0; stateIndex < states.length; stateIndex++, portIndex++) {
			// Get the json object for each state and stores it into stateItem 
			var stateItem = states[stateIndex];
			console.log("createConnections inside for "+stateItem+" nodeObject"+nodeObject+" portIndex"+portIndex);
			this.sendConnectionDetails(stateItem, nodeObject, portIndex);
		}
	}
}


/*
 * Sends the details required to establishes the connection between the nodes.
 * @param {State} stateItem - represents the state json object. 
 */
JSONDeserializer.prototype.sendConnectionDetails = function (stateItem, nodeObject, portIndex) {

			var targetNodeId = null;
			var portObject = null;
			  // Iterate json
			  $.each(stateItem, function(key,value) {	
			  
			    //alert("sendConnectionDetails "+stateItem.toString());
			   	// alert("sendConnectionDetails "+"key "+key+" value"+value);		
              // Get the target node id from state json object.
			  if( value != "hangup" ) {
					targetNodeId = value;	
					// Vinay code starts
					if(nodeObject.isDynamicPorts == "yes")
						portObject = nodeObject.getPorts().get(portIndex);
					else
						portObject = nodeObject.getPort(key);
					// Vinay code ends
			  }
			});			
			// Establish the connection
			 //alert("portObject "+portObject +"  workflow.getFigure(targetNodeId)"+ workflow.getFigure(targetNodeId))
			this.establishConnection(portObject, workflow.getFigure(targetNodeId));

}
/*
 * establishes the connection between the nodes.
 * @param {port} attributePort - represents the output port object
 * @param {node} nextNode - represents the target node object 
 */
JSONDeserializer.prototype.establishConnection = function (attributePort, nextNode) {

	console.log("connection " + attributePort + "nextNode " + nextNode);
	if (nextNode == null || attributePort == null) return;
	// Get the source port of next node.
	sourcePort = nextNode.getPort("Source");
	// Check if the source port is null or not	
	if (sourcePort != null) {
		// Execute the command to establish the connection.
		
		var command = new CommandConnect(nextNode.getWorkflow(), attributePort, sourcePort, true);
	
		workflow.getCommandStack().execute(command);
	}
}

// This function is used to create the nodes
JSONDeserializer.prototype.initDraw2DNode = function (nodeItem, flag) {        
		initNode(nodeItem);
		//alert("nodeItem "+nodeItem +"flag "+flag);
	    if(flag)
	       this.createConnections(); 
}