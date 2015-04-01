
// Add extension window 
function getAddExtensionWindow(menunode) {
    
	 // Remove old data
	 resetUI($("#addextension"));
	 $("#addextension").removeData();
    		
	// Add menunode object (draw2d node object) and its ui object to nodeui data
	$("#addextension").data("menunode", menunode);	
	
	// Init validator
    initValidator($("#addextension"), addExtensionToNode);
       
	// Add an extension dialog	
	$("#addextension").dialog({
        title: "Add Extension",
        modal: true,
        position: 'top',
        width: 600,
        autoOpen: true,        
        buttons: {
            'Save': function () {
               $(this).find("form").trigger('submit');
            }
        }
	 });
}

// Add extension to grid data i.e., row and node ui i.e., port
function addExtensionToNode() {
     	 
	 // Get menu node draw2d node object
	 var menunode = $("#addextension").data("menunode");
	 
	 // Get json values
	var jsonValues = menunode.getProperty("JSON");

	// Extension data
	var extension = {};
	extension.dynamicgrid = $("#addextension").find("#name").val();
	extension.number = $("#addextension").find("#number").val();
    
	// Find index where it needs to be added (last)
	$.each(jsonValues, function(index, json) {
	
		// Check if this is menu grid
		if(json["menu"] != undefined)
		{
			json["menu"].push(extension);
			// Save new json in node 
			menunode.setProperty("JSON", jsonValues);
			// Add port to the extension
	   		addPort(extension.dynamicgrid, menunode);
		}
						
	});
			
    // Close the dialog  
	$("#addextension").dialog('close');

}


// This function is used to create and set the port label name for dynamic nodes
// nodeName - Extensions, Geographical etc.
// td - column for Draw2D node
// portTDValue - label (sales, support, etc.. for extensions)
// called from shapeall while creating nodes ()
function setPortTD(td, nodeName , portTDValue){

		// Table for port
		var tablePort = document.createElement("table");
		tablePort.cellSpacing = "0";
		tablePort.cellPadding = "0";
		tablePort.border = "0";
		td.appendChild(tablePort);

		// Tbody
		var tablePortTbody = document.createElement("tbody");
		tablePort.appendChild(tablePortTbody);

		if( nodeName.toLowerCase() =="extensions" ) {	

			// TR
			var tablePortTr = document.createElement("tr");
			tablePortTbody.appendChild(tablePortTr);
			
	          var tablePortTd = document.createElement("td");
			 // TD for extension image
			tablePortTd.innerHTML = "<div class=\"extension-small\"></div>";	
			tablePortTd.align = "center";
			tablePortTr.appendChild(tablePortTd);

		}
	
		tablePortTr = document.createElement("tr");
		tablePortTbody.appendChild(tablePortTr);

		var tablePortTd = document.createElement("td");
		tablePortTr.appendChild(tablePortTd);

		tablePort  = null;
        tablePortTbody = null;
        tablePortTr = null;

		// Table for port label			
        var tablePort = document.createElement("table");
		tablePort.cellSpacing = "0";
		tablePort.cellPadding = "0";
		tablePort.border = "0";
		tablePort.height= "24"
		tablePortTd.appendChild(tablePort);
        
		// Tbody for port label
		var tablePortTbody = document.createElement("tbody");
		tablePort.appendChild(tablePortTbody);
		
		// TR for port label
		var tablePortTr = document.createElement("tr");
		tablePortTbody.appendChild(tablePortTr);
		
		// Left TD for port label
		var tablePortTd = document.createElement("td");
		       
		tablePortTd.innerHTML = "&nbsp;&nbsp;&nbsp;";
		
		tablePortTd.align = "right"; 
			 
		tablePortTd.className = "style1 portStyle nodeLabelLeft";
		
		tablePortTr.appendChild(tablePortTd);
		
		tablePortTd = null;
		// Middle TD for port label
		var tablePortTd = document.createElement("td");
		      
		tablePortTd.innerHTML = portTDValue;
		         
		tablePortTd.align = "center"; 
			 
		tablePortTd.className = "style1 portStyle nodeLabelbg";
		       
		tablePortTr.appendChild(tablePortTd);
		
		tablePortTd = null;
		
		// Right TD for port label
		var tablePortTd = document.createElement("td");
		
		tablePortTd.innerHTML = "&nbsp;&nbsp;";
		  
		tablePortTd.align = "left"; 
			 
		tablePortTd.className = "style1 portStyle nodeLabelRight";
		
		tablePortTr.appendChild(tablePortTd);
         
}


var GridOperationsForDynamicPortsArray = new Array();

// 
function clearGridOperations()
{
	GridOperationsForDynamicPortsArray = new Array();	
}


// This function is used to add edited port details
// jsonArr - Grid popup json (Individual element)
// 
function addGridOperations( action, rowIndex, jsonArr, uiFieldDefinition ) {

	      

	if( uiFieldDefinition.dynamicportkey == undefined )
		 return;

	var value = jsonArr;	
	
	// Find Port values
	if( jsonArr != null ) {		
			$.each(jsonArr, function(index, json) 
			{				
				if( json.name == "dynamicgrid" )
					value = json.value;			
			});
	}

	var eachPortDeatils = new Array();    		 
	
	// Action - insert, delete or update
	eachPortDeatils[eachPortDeatils.length] = action;
	
	// Row index - The psotion of the port which is modified
	eachPortDeatils[eachPortDeatils.length] = rowIndex;
	
	// Modified value
	eachPortDeatils[eachPortDeatils.length] = value;
	
	// Push to array
	GridOperationsForDynamicPortsArray[GridOperationsForDynamicPortsArray.length] = eachPortDeatils;
}
 
// Edit the extensions i.e. add, delete, update the existing extension					 
function editDynamicNode(nodeObject) {

	// dynamicPortDetailsArray - action (insert, update, delete), rowIndex, label (update)	
	for(var i = 0; i < GridOperationsForDynamicPortsArray.length; i++){

		var temp = GridOperationsForDynamicPortsArray[i];
		
		// Insert operation
		if(temp[0] == 'insert')
			addPort(temp[2], nodeObject);

		// Edit operation
		else if(temp[0] == 'update')
			editPort(nodeObject, temp[1], temp[2]);

		// Delete operation 
		else if(temp[0] == 'delete')
			removePort(nodeObject, temp[1]);

		alignDynamicNodePorts(nodeObject);
		
		// Draw2D (based on the ports)
		nodeObject.allignDynamicNode();

	}
	
}


// This function aligns all the ports of dynamic node
// Dynamic Nodes
// Called from  - 
function alignDynamicNodePorts(node) {

	node.recalculateSize(node.name);

	// Get port table
	var nodediv = document.getElementById(node.id + "portTable");
	
	// Total width of node
	var totalwidth = 0;
	
	// Get row object
	var rowObject = nodediv.childNodes[0].childNodes[0];
	
	// Iterate all ports
	 for(var i = 1; i < node.getPorts().getSize(); i++) {
		    // Child index i.e., port label
			var childIndex  = (2*i) - 2;
			// Get each child width i.e., port label width
			var width =  rowObject.childNodes[childIndex].clientWidth;
			// Get port
			var port = node.getPorts().get(i);
			// Here 80 means line width between each extension
			if(i > 1)
				totalwidth = totalwidth + 80;
			// Get x position
			var xPosition = totalwidth + (width/2); 
			// Set port position
			port.setPosition(xPosition, port.getY());
			// Total width
			totalwidth = totalwidth + width;
	 }

}
/**
 @portName - name of the port
 @node - draw2d node object
 This function adds the port to the node dynamically - for extensions
 */

function addPort(portName, node)
{

    attributePort = new shape.uml.AttributePort();

    attributePort.setMaxFanOut(1);
    attributePort.setName(portName);
    attributePort.setSelectable(false);
    attributePort.setWorkflow(workflow);
    attributePort.setColor(new Color(137, 159, 29));
    attributePort.setBackgroundColor(new Color(210, 255, 1));

    // Send the command to add the port to the existing node in the workflow
    CommandAddPort = new CommandAddDynamicPort(workflow, attributePort, null, null, node, portName);
    CommandAddPort.execute();
    node.recalculateSize(node.name);
    return;
}

/**
 @node - draw2d node object
 @index - index number of the port
 @value - edited name of the port
 This function edit the port name of the node
 */

function editPort(node, index, value)
{

  	this.id = node.id + "portTable";	
    var portTDValue = value;		
    var labelNodes = $("#" + this.id).find(".nodeLabelbg");		
    $(labelNodes[index-1]).html(portTDValue);
    node.getPorts().get(index).setName(value);
    node.recalculateSize(node.name);
}

/**
 
 @node - draw2d node object
 @index - index number of the port
 This function removes the port of the node - mostly called by menu node when an extension is deleted
 */

function removePort(node, index)
{

    var portList = node.getPorts();
    var port = portList.get(index + 1);

    var childIndex = 2 * (index + 1) - 2;
    var requiredChildLineIndex = -1;
    var isRemoveNextLineRequired = true;

    if ((index + 2) == portList.getSize()) isRemoveNextLineRequired = false;

    this.id = document.getElementById(node.id + "portTable");
    var rowObject = this.id.childNodes[0].childNodes[0];

    if (port != null)
    {

        if (port.getConnections().getSize() > 0) node.getWorkflow().removeFigure(port.getConnections().get(0));
        node.removePort(port);

        if (isRemoveNextLineRequired)
        {
            requiredChildLineIndex = childIndex;
        }

        else
        {
            requiredChildLineIndex = childIndex - 1;
        }

        rowObject.removeChild(rowObject.childNodes[childIndex]);

        if (requiredChildLineIndex > -1 && rowObject.childNodes.length > requiredChildLineIndex)
        {

            rowObject.childNodes[requiredChildLineIndex].innerHTML = "";
            rowObject.removeChild(rowObject.childNodes[requiredChildLineIndex]);

        }

        node.recalculateSize(node.name);

    }

}