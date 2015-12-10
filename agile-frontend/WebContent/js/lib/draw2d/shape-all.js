shape = new Object();
shape.uml = new Object();

/* This notice must be untouched at all times.

Open-jACOB Draw2D
The latest version is available at
http://www.openjacob.org

Copyright (c) 2006 Andreas Herz. All rights reserved.
Created 5. 11. 2006 by Andreas Herz (Web: http://www.freegroup.de )

LICENSE: LGPL

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License (LGPL) as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public
License along with this library; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA,
or see http://www.gnu.org/copyleft/lesser.html
*/

// This inner HTML represents the line between two extensions present in extension node.
var extensionLineHTML = '<div class="extensionLine"/>';

/* 
 * This inner HTML represents the label of draw2d node. This innerHTML consists of tokens which
 * will be replaced by appropriate values. The tokens are
 * %GenerateNodeId% - This token should be replaced with node id. 
 * %NodeIcon% - This token should be replaced with node icon.
 * %className% - This token should be replace with class name.
 */
var draw2dNodeLabelInnerHTML = '<div class = "%className%" id="%GenerateNodeId%nodeImageDiv" style = "background : url(%NodeIcon%) no-repeat;"><div style="float:left;margin-left: -10px;display:none;" class="nodeedit"></div><div style="float:right;margin-right: -10px;display:none;" class="nodedelete"></div></div>';
/*
 * This inner HTML represents the port label of the node. It consists of %PortName% token which
 * is replaced with name of the port.
 */
var draw2dNodePortLabelInnerHTML = '<div align="center"><span class="style1">%PortName%</span></div>';

// This inner HTML is used to create line between dynamic node and its ports.
var lineBetweenDynamicNodeAndPorts = '<div class="extensionLinePorts"/>';

// This finction returns display name of the node


function getDisplayName(name) {

    var displayName = "";

    if (name.length > 25) displayName = name.substring(0, 23) + "...";
    else displayName = name;
    return displayName;

}
/*
 * @displayClassName - display name of node
 * @className - node backend name
 * @isInputPort - flag for input port. If it is true the input port will exist
 * @isDynamicPorts - flag for dynamic ports. If it is true the node should contain dynamic ports
 * @classId - Id of the node dom element
 * This function will create node object.
 */

shape.uml.Class = function ( /*:String*/ displayClassName, /*:String*/ className, /*boolean*/ isInputPort, /*String*/ isDynamicPorts, /*String*/ classId, /*String*/ nodeIcon) {

    // Required margin for alignment purpose
    this.requiredMarginTop = 6;
    // Table of the ports
    this.portTable == null;
    // Required for output port alignment
    this.outputPortAllign = 0;
    // Stores node icon
    this.nodeIcon = nodeIcon;
    // Stores internal name in node
    this.name = className;
    // Stores dom id nothing vxml form id in node
    this.classId = null;
    // If classId argument is not null then store it in node
    if (classId != null) this.classId = classId;
    // flag to indicate node dragging status
    this.dragStatus = false;
    // Get the display name. It may contain ellipsis 
    this.displayName = getDisplayName(displayClassName);
    // If source port exists , the variable isInputPort contains true
    this.isInputPort = isInputPort;
    // If Node have Dynamic Ports , the variable isDynamicPorts contains the String yes.
    this.isDynamicPorts = isDynamicPorts;
    Node.call(this);
    // Set dimension
    this.setDimension(50, 50);
    // Disable resizable
    this.setResizeable(false);
	// Disable dragging
	this.setCanDrag(true);
    // Enable selection
    this.setSelectable(false);
    // Stores no. of ports
    this.index = 0;
    // Port names array 
    this.names = new Array();
    // Port ids
    this.attributeIds = new Array();
    // Visibility of the ports
    this.attributeVisibilities = new Array();
}
shape.uml.Class.prototype = new Node; /** @private **/
shape.uml.Class.prototype.type = "shape.uml.Class";

// Set the node into workflow (this is called by draw2d while drawing the node to workflow - ports etc.)
shape.uml.Class.prototype.setWorkflow = function ( /*:Workflow*/ workflow) {


	// 3 cases - Static ports (single) - we do not show label, 
	// ports (yes, no etc.) - we show label
	// and dynamic ports (difference in ui - lines, each port is show as a seperate table type (not default)	 

    Node.prototype.setWorkflow.call(this, workflow);
    // Check if workflow is null or not.
    if (workflow != null) {
	/* 
	 * Check if input port for node is required or not	  
	 * If isInputPort variable contains the value as true  	  
	 * then create the input port.
	 */
        if (!this.isInputPort) {} else {
            this.sourcePortAllign = 1;
            // Create and Set the Properties for Source port		  
            portMiddle = new shape.uml.SourcePort();
            portMiddle.setSelectable(false);
            portMiddle.setCanDrag(false);
            portMiddle.setDimension(10, 10);
            portMiddle.setName("Source");
            portMiddle.setWorkflow(workflow);
            portMiddle.setColor(new Color(183, 84, 30));
            portMiddle.setBackgroundColor(new Color(255, 126, 0));

		   /*   
		    * If the styleSheetHeight is undefined then there is no extra row is added 
			* on top of node TR (Table Row). So the source port height is middle of the node TR (Table Row) 			
			* So the source port height is (Node TR Height)/2 .    			 
			*/
            var newtablewidth = this.getWidth() / 2;
            this.addPort(portMiddle, newtablewidth, this.requiredMarginTop);
        }

		/*
         * Add Output port to middle of the node (Bottom) if and only if isDynamicPorts is         
         * not set to yes (that means no dynamic ports exist) and  number of ports is 1.         
         */
        if (this.names.length == 1 && this.isDynamicPorts != 'yes') {

            // Create the Output port and set the properties
            attributePort = new shape.uml.AttributePort();
            attributePort.setMaxFanOut(1);
            attributePort.setName(this.names[0]);
            attributePort.setDimension(10, 10);
            attributePort.setLineWidth(1);
            attributePort.setWorkflow(workflow);
            x = this.getTableWidth() / 2;
            var y = this.getHeight();
            this.outputPortAllign = 0;

            // If the node name is not start then index for port is 1 because other nodes have source port
            if (this.name != 'Start') indexForport = 1;

            // Set color for output port
            attributePort.setColor(new Color(137, 159, 29));
            attributePort.setBackgroundColor(new Color(210, 255, 1));

            // Add port to the node
            this.addPort(attributePort, x + this.outputPortAllign, y);

            // Disable selection for port
            attributePort.setSelectable(false);

            // Set the Port Id useful in Deserialization
            if (this.attributeIds[0] != null) 
				attributePort.setId(this.attributeIds[0]);

            // Spacing for port bottom
            var bottomHeader = document.createElement("tr");
            this.tableBodyNode.appendChild(bottomHeader);
            bottomHeaderLabel = document.createElement("td");
            bottomHeaderLabel.className = "draw2dBottomMargin";
            bottomHeaderLabel.align = "left";
            bottomHeader.appendChild(bottomHeaderLabel);

        }

	   /*
        * This block of code is used to create two ports   
        *           _______________
		*		  |  yes  |  no   | or more static ports
		*         |_______|______ | 
        *  
	    */

        // Create DOM elements if the number of ports is greater than 1 i.e., two port node
        else if (this.names.length > 1 && this.isDynamicPorts != 'yes') {

            // Get the table width and recalculate the size
            var tableWidthGlobal = this.getTableWidth();
            this.recalculateSize();
            // Add row for ports
            var portTableTR = document.createElement("tr");
            // Create table
            this.tableBodyNode.appendChild(portTableTR);
            
			// Create td
            var portTableTd = document.createElement("td");
            portTableTd.width = "100%";
            portTableTd.align = "center";
            portTableTR.appendChild(portTableTd);
            
			// Create table
            var portTable = document.createElement("table");
            portTable.cellSpacing = "0";
            portTable.cellPadding = "0";
            portTable.align = "center";
            portTableTd.appendChild(portTable);

            // Craete tbody  
			var portTabletbody = document.createElement("tbody");
            portTable.appendChild(portTabletbody);
           
			// Craete tr  
            portTableTR = document.createElement("tr");
            portTabletbody.appendChild(portTableTR);

            // Create td for yes-no left image
            var portTableLeftTD = document.createElement("td");
            portTableLeftTD.align = "center";
            portTableLeftTD.className = "portLabelLeft";
            portTableTR.appendChild(portTableLeftTD);

            // Create td for middle dom object
            var portTableTD = document.createElement("td");
            portTableTD.className = "portLabelbgHeight";
            portTableTD.align = "center";
            portTableTR.appendChild(portTableTD);

            //Create table
            this.portTable = document.createElement("table");
            this.portTable.cellSpacing = "0px";
            this.portTable.cellPadding = "0px";
            this.portTable.className = "portLabelbgHeight";

            // Append table
            portTableTD.appendChild(this.portTable);
            var portTbody = document.createElement("tbody");
            this.portTable.appendChild(portTbody);
            var portTableTR = document.createElement("tr");
            portTbody.appendChild(portTableTR);

            // Port x position array
            this.portXPositionArray = new Array();

            // temp variable
            var x = 0;

            // Iterate the output port names array
            for (i = 0; i < this.names.length; i++) {

                this.outputPortAllign = -1;

                // Create each row for attribute
                // One column for each row
                var td = document.createElement("td");
                td.align = "center";
                td.className = "portLabelbg";
                // Set their names
                td.innerHTML = draw2dNodePortLabelInnerHTML.replace(/%PortName%/g, this.names[i]);
                // Add td to port row
                portTableTR.appendChild(td);
                // Store the width into port position array
                this.portXPositionArray[i] = td.clientWidth;

                // Check if the current port is last port of node or not
                if (i != this.names.length - 1) {
                    td = document.createElement("td");
                    td.className = "portLabelsSpacing";
                    td.innerHTML = "&nbsp;";
                    portTableTR.appendChild(td);

                }
                // Create new output port and set required properties  
                attributePort = new shape.uml.AttributePort();
                attributePort.setMaxFanOut(1);
                attributePort.setName(this.names[i]);
                attributePort.setWorkflow(workflow);
                attributePort.setColor(new Color(35, 141, 201));
                attributePort.setBackgroundColor(new Color(216, 255, 0));
                attributePort.setDimension(8, 8);
                // Get coordinates for the point
                var y = this.getHeight();
                // Add port to the node
                this.addPort(attributePort, x, y);
                attributePort.setSelectable(false); 
				// Set the Port Id while Deserialization If required
                if (this.attributeIds[i] != null) 
					attributePort.setId(this.attributeIds[i]);
                x = x + 45;
            }
            // Created td for right hand side image
            var portTableRightTD = document.createElement("td");
            portTableRightTD.align = "center";
            portTableTR.appendChild(portTableRightTD);
            this.setAlignment();
        }

        // If the node contains dynamic ports 
        else if (this.isDynamicPorts == 'yes') {
            // Create the DOM element
            var tableWidthGlobal = this.getTableWidth();
            var tr = document.createElement("tr");
            this.tableBodyNode.appendChild(tr);
            var td = document.createElement("td");
            tr.appendChild(td);
            td.align = "center";
            td.innerHTML = lineBetweenDynamicNodeAndPorts;

            // Create port table
            this.portTable = document.createElement("table");
            this.portTable.id = this.id + "portTable";
            this.portTable.cellSpacing = "0px";
            this.portTable.cellPadding = "0px";
            var tr = document.createElement("tr");
            this.tableBodyNode.appendChild(tr);

            var td = document.createElement("td");
            tr.appendChild(td);
            td.appendChild(this.portTable);
            this.portTbody = document.createElement("tbody");
            this.portTable.appendChild(this.portTbody);
            // Create port row
            var portTableTR = document.createElement("tr");
            this.portTbody.appendChild(portTableTR);
            var totalX = 0;
            // For each port
            for (i = 0; i < this.names.length; i++) {
                this.outputPortAllign = -1;
                // Create each row for attribute
                // One column for each row               
                var td = document.createElement("td");
                td.align = "center";
                td.className = "portLabelsSpacing";
                var portTDValue = this.names[i];
                // Set their names               
                 setPortTD(td, this.name, portTDValue);
               
                td.onselectstart = function () {
                    return false;
                };
                td.unselectable = "on";
                portTableTR.appendChild(td);
                // Calculate Sizes again
                this.recalculateSize();
                //Create output port and set reuired properties
                attributePort = new shape.uml.AttributePort();
                attributePort.setMaxFanOut(1);
                attributePort.setName(this.names[i]);
                attributePort.setWorkflow(workflow);
                attributePort.setColor(new Color(137, 159, 29));
                attributePort.setBackgroundColor(new Color(210, 255, 1));
                // Get width and coordinates for the point
                this.portWidth = attributePort.getWidth();
                // Alignment of the port
                this.portAllign = this.outputPortAllign;
                // x coordinate for port
                var x = td.clientWidth / 2;
                if (i > 0) totalX = totalX + 80;
                x = x + totalX;
                // Set the Y coordinate to middle of the td element	
                var y = this.getHeight();
                // Add port to the node	
                this.addPort(attributePort, x, y + 0.25);
                totalX = totalX + td.clientWidth;
                this.recalculateSize();
                attributePort.setSelectable(false); 
				// Set the Port Id while Deserialization
                if (this.attributeIds[i] != null) 
					attributePort.setId(this.attributeIds[i]);

                // Create td for link between ports if the port is not first port and no. of port is not equal to 1
                if (this.names.length != 1 && i != 0) {
                    var temptd = document.createElement("td");
                    temptd.align = "center";
                    temptd.innerHTML = extensionLineHTML;
                    portTableTR.insertBefore(temptd, td);
                }
            }
            // Set the first port position
            this.getPorts().get(0).setPosition(this.getWidth() / 2, this.requiredMarginTop);
            // Create div element for bottom spacing
            var diveElement = document.createElement("div");
            diveElement.className = "draw2dBottomMargin";
            diveElement.innerHTML = "&nbsp;";
            this.item.appendChild(diveElement);
        }

        // Recalculate the size of the node.
        this.recalculateSize();
    }
}

// Set internal node name explicitly if required
shape.uml.Class.prototype.setClassName = function ( /*:String*/ name) {
    this.headerLabel.innerHTML = name;
    this.headerLabel.title = name;
    this.recalculateSize();
}

/*
 * Add a new attribute to the UML Class figure. An attribute is a simple
 * table row ("tr").
 */
shape.uml.Class.prototype.addAttribute = function ( /*:String*/ name, /*:String*/ type, /*:String*/ attributeId, /*:String*/ visibility) {

    // Store port objects into array
    this.names[this.index] = name;
    // Check if output port id exists or not 
    if (typeof attributeId == 'undefined' || attributeId == null) {
        // Store the id as null if port id doesn't exists
        this.attributeIds[this.index] = null;
    } else {
        // Set the flag variable as true which id of port available
        this.isPortIdAvailable = true;
        // Store the port id - available in deserialization
        this.attributeIds[this.index] = attributeId;
    }
    // Check visibility and store it.
    if (visibility) 
		this.attributeVisibilities[this.index] = visibility;
    else 
		this.attributeVisibilities[this.index] = false;

    this.index++;
}

/* 
 * Adjust the ports if the user resize the element.
 */
shape.uml.Class.prototype.setDimension = function ( /*:int*/ w, /*:int*/ h) {

    Node.prototype.setDimension.call(this, w, h);
}

/* 
 * Adjust the ports if the node contains more than static one port.
 */
shape.uml.Class.prototype.setAlignment = function () {

    // Calculate the difference between node width and port table width 
    var diff = this.getWidth() - this.getPortTableWidth();
    // Stores the x position of port
    var xPosition = 0;
    // Check if the difference is positive or not. If so, then get the appropriate position
    if (diff > 0) xPosition = (diff) / 2;
    // Iterate ports of node and set the appropriate position for each port
    for (var i = 0; i < this.names.length; i++) {
        var x = xPosition + this.portXPositionArray[i] / 2;
        this.getPorts().get(i + 1).setPosition(x, this.getHeight());
        xPosition = xPosition + this.portXPositionArray[i] + 1.50;
    }
    // Set the source port position
    this.getPorts().get(0).setPosition(this.getWidth() / 2, this.requiredMarginTop);
}

/*
 * Create the UML Class figure.
 * The figure is a simple HTML table with a "tr" for the header and
 * a "tr" for each attribute of the Class.
 * @private
 */
shape.uml.Class.prototype.createHTMLElement = function () {

	/* 
     * Apply the common style sheets for all nodes.     
     */

    // Indicates whether the node is common node or start node
    var classNameKey = "node";
    if (this.name.toLowerCase() == "start") classNameKey = "start";

    // Caclculate the z-index of node
    var lessZorder = 0;
	// Context menu for all nodes and extension is different. (removed extension context menu)
	var contextMenuKey = "contextMenuForNode";
	// Node image class name is different for all nodes and extension is different.
	var nodeImageClassName = "nodeIconClass";
    if (this.name.toLowerCase() == "extensions")  {
		lessZorder = 1;
		//contextMenuKey = "contextMenuForDyanmicNode";
		nodeImageClassName = "extensionIconClass";
	}
    var figurezindex = Figure.ZOrderBaseIndex - lessZorder;

    // Create the div element and set the styles
    this.item = document.createElement('div');
    this.item.id = this.id;
    this.item.style.left = this.x + "px";
    this.item.style.top = this.y + "px";
    this.item.style.height = this.width + "px";
    this.item.style.width = this.height + "px";
    this.item.style.zIndex = "" + figurezindex;
    this.item.className = contextMenuKey + " nodeItem";

    // Create table of node
    this.tableNode = document.createElement("table");
    this.tableNode.cellSpacing = "0px";
    this.tableNode.cellPadding = "0px";
    this.tableNode.className = "nodeTable";
    this.item.appendChild(this.tableNode);

    // Create tbody
    this.tableBodyNode = document.createElement("tbody");
    this.tableNode.appendChild(this.tableBodyNode);

    // Create tr
    this.header = document.createElement("tr");
    this.tableBodyNode.appendChild(this.header);

    // Create header label td which reperesents node image
    this.headerLabel = document.createElement("td");
    this.headerLabel.style.height = this.requiredMarginTop + "px";
    this.headerLabel.align = "center";
    this.header.appendChild(this.headerLabel);
    this.header = document.createElement("tr");
    this.tableBodyNode.appendChild(this.header);
    this.headerLabel = document.createElement("td");

    // Set inner html for label - %GenerateNodeId%, %NodeIcon% are replaced here.   
    this.headerLabel.innerHTML = draw2dNodeLabelInnerHTML.replace(/%GenerateNodeId%/g, this.id).replace(/%NodeIcon%/g, this.nodeIcon).replace(/%className%/g, nodeImageClassName);
    this.headerLabel.align = "center";
    this.header.appendChild(this.headerLabel);
    this.header = document.createElement("tr");
    this.tableBodyNode.appendChild(this.header);

    this.headerLabel = document.createElement("td");
    this.headerLabel.align = "center";
    this.header.appendChild(this.headerLabel);

    // Create table which represents node display name 
    this.table = document.createElement("table");
    // Set unique id for table
    this.table.id = this.id + "NodeTableUI";
    this.table.cellSpacing = "0";
    this.table.cellPadding = "0";
    this.headerLabel.appendChild(this.table);

    this.tableBody = document.createElement("tbody");
    this.table.appendChild(this.tableBody);
    this.header = document.createElement("tr");
    this.tableBody.appendChild(this.header);

    // Create td element which represent left part of node
    var tempNode = document.createElement("td");
    var tempNodeDiv = document.createElement("div");
    tempNodeDiv.className = classNameKey + "LabelLeft";
    tempNode.appendChild(tempNodeDiv);
    this.header.appendChild(tempNode);

	/*
	 * Create TD element for node name and apply the required styles which represent middle part of node
	 * which contains display name.		   
	 */
    this.headerLabelNode = document.createElement("td");
    this.headerLabelNode.className = "nodedisplaynamestyle " + classNameKey + "Labelbg";
    this.headerLabelNode.align = "center";
    this.headerLabelNode.title = this.displayName;
    this.headerLabelNode.innerHTML = "&nbsp;" + this.displayName + "&nbsp;";
    this.headerLabelNode.id = this.id + "headerLabelNode";
    this.header.appendChild(this.headerLabelNode);

    // Create TD element for node name and apply the required styles which represent right part of node.	
    var tempNode = document.createElement("td");
    var tempNodeDiv = document.createElement("div");
    tempNodeDiv.className = classNameKey + "LabelRight";
    this.header.appendChild(tempNode);
    tempNode.appendChild(tempNodeDiv);

    // Add the extension icon which is used to add single extension 
    if (this.name == "Extensions") {
		// Add extension image html
        var addExtensionTd = document.createElement("td");
        addExtensionTd.onclick = function () {
			// Open add an extension window
            getAddExtensionWindow(workflow.getFigure(this.id.replace("menunode", "")));           
        };
        addExtensionTd.className = "addExtension";
        addExtensionTd.id = this.id + "menunode";
        addExtensionTd.title = "Click here to add an extension";
        addExtensionTd.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        this.header.appendChild(addExtensionTd);
    }

    return this.item;
}

/*
 * Recalculate and set the real dimension of the element.
 * @private
 */
shape.uml.Class.prototype.recalculateSize = function ( /*:String*/ name) {
    this.setDimension(this.getWidth(), this.getHeight());
}

/*
 * The figures is not resizeable by the user. So - we calculate 
 * the real size of the figure. This depends on the content of the figure.
 * @private
 */
shape.uml.Class.prototype.getWidth = function () {
    // calculation is only possible if the element a member of
    // the window.document
    //
    if (this.workflow == null) return 10;
    if (this.tableNode.xgetBoundingClientRect) {
        var width = this.tableNode.getBoundingClientRect().right - this.tableNode.getBoundingClientRect().left;
        return width;
    } else if (document.getBoxObjectFor) {
        return document.getBoxObjectFor(this.tableNode).width;
    } else {
        return this.tableNode.offsetWidth;
    }
}

/*
 * The figures is not resizeable by the user. So - we calculate 
 * the real size of the figure. This depends on the content of the figure.
 * @private
 */
shape.uml.Class.prototype.getHeight = function () {
    // calculation is only possible if the element a member of
    // the window.document
    //
    if (this.workflow == null) return 10;
    var height = 0

    if (this.tableNode.xgetBoundingClientRect) return this.tableNode.getBoundingClientRect().bottom - this.tableNode.getBoundingClientRect().top;
    else if (document.getBoxObjectFor) return document.getBoxObjectFor(this.tableNode).height;
    else return this.tableNode.offsetHeight;
}

/*
 * returns node name
 * @private
 */

shape.uml.Class.prototype.getClassName = function ( /*:String*/ name) {
    return this.name;
}

/*
 * This function is executed if and only if the delete event on 
 * node is generated. This function sends the command to delete the node.
 */
shape.uml.Class.prototype.remove = function () {
    if (!this) {
        //do nothing
    } else {
        //Sends the command to remove figure from workflow
        if (confirm("Delete this item?")) {
            workflow.commandStack.execute(new CommandDelete(this));
        }
    }
}
// This function handles the delete key stroke on node.
shape.uml.Class.prototype.onKeyDown = function ( /*:int*/ keyCode, /*:boolean*/ ctrl) {
    if (keyCode == 46 && this.isDeleteable() == true) {
        this.remove();
    }
}

/* 
 * If Node is Dragged after selecting the connection line , then the connection is still shows as 
 * selected. To remove the bug I added onDrag event. 
 */
shape.uml.Class.prototype.onDrag = function () {
    Figure.prototype.onDrag.call(this);
    
    // This code adds the contamination functionality to the node.
    var center = document.getElementById("paintarea");
    this.areaWidth = parseFloat(center.style.width.replace("px", ""));
    var areaHeight = parseFloat(center.style.height.replace("px", ""));
    if (this.x < 0) {
        this.setPosition(0, this.y);
        this.leftError = true;
    }
    if (this.y < 0) {
        this.setPosition(this.x, 0);
        this.topError = true;
    }
}

/* 
 * Set the drag status of node 
 */
shape.uml.Class.prototype.setDragStatus = function (status) {
    this.dragStatus = status;
}

/* 
 * Get the drag status of node
 */
shape.uml.Class.prototype.getDragStatus = function () {
    return this.dragStatus;
}

/* 
 *  Perform set of action when user starts dragging 
 *  the node.
 */
shape.uml.Class.prototype.onDragstart = function () {
    return Figure.prototype.onDragstart.call(this);
}

/* 
 * Set the drag status as false when user stops dragging
 */
shape.uml.Class.prototype.onDragend = function () {
    Figure.prototype.onDragend.call(this);
    this.setDragStatus(false);
}

shape.uml.Class.prototype.onResize = function () {
    return;
}

// This function returns the node table width
shape.uml.Class.prototype.getTableWidth = function () {
    // calculation is only possible if the element a member of
    // the window.document
    //
    if (this.table == null) return 0;

    if (this.table.xgetBoundingClientRect) return this.table.getBoundingClientRect().right - this.table.getBoundingClientRect().left;

    else if (document.getBoxObjectFor) return document.getBoxObjectFor(this.table).width;

    else return this.table.offsetWidth;
}

// This function returns the node table height
shape.uml.Class.prototype.getTableHeight = function () {
    // calculation is only possible if the element a member of
    // the window.document
    //
    if (this.table == null) return 0;

    if (this.table.xgetBoundingClientRect) return this.table.getBoundingClientRect().bottom - this.table.getBoundingClientRect().top;

    else if (document.getBoxObjectFor) return document.getBoxObjectFor(this.table).height;

    else if (this.table.getClientRects) return this.table.offsetHeight;

    else return this.table.offsetHeight;
}

// This function returns port table width of node
shape.uml.Class.prototype.getPortTableWidth = function () {
    // calculation is only possible if the element a member of
    // the window.document
    //
    if (this.portTable == null) return 0;

    if (this.portTable.xgetBoundingClientRect) return this.portTable.getBoundingClientRect().right - this.portTable.getBoundingClientRect().left;

    else if (document.getBoxObjectFor) return document.getBoxObjectFor(this.portTable).width;

    else return this.portTable.offsetWidth;
}

// This function returns port table height of node
shape.uml.Class.prototype.getPortTableHeight = function () {

    if (this.portTable == null) return 0;

    else if (this.portTable.xgetBoundingClientRect) return this.portTable.getBoundingClientRect().bottom - this.portTable.getBoundingClientRect().top;

    else if (document.getBoxObjectFor) return document.getBoxObjectFor(this.portTable).height;

    else return this.portTable.offsetHeight;
}

// This function is used to align the dynamic node
shape.uml.Class.prototype.allignDynamicNode = function () {

    this.getPorts().get(0).setPosition(this.getWidth() / 2, this.requiredMarginTop);

}

//This function sets the postion of node
shape.uml.Class.prototype.setPosition = function ( /*:int*/ xPos, /*:int*/ yPos) {
   
    
    this.x = Math.max(0, xPos);
    this.y = Math.max(0, yPos);

    // If the item was never drawn, then you do not exclude the HTML
    // be updated
    //
    if (this.html == null) return;

    this.html.style.left = this.x + "px";
    this.html.style.top = this.y + "px";
    this.fireMoveEvent();

    // Update the resize handles if the user change the position of the element via an API call.
    //
    if (this.workflow != null && this.workflow.getCurrentSelection() == this) 
		this.workflow.showResizeHandles(this);

			
			this.recalculateSize();		
}

// This function sets the node display name
shape.uml.Class.prototype.setNodeName = function (nodename) {

    // If the node backend name is Start then don't set the display name
    if (this.name == "Start") return;

    // Get the node display name and set into html
    this.displayName = getDisplayName(nodename);
    this.headerLabelNode.innerHTML = "&nbsp;" + this.displayName + "&nbsp;";
    this.headerLabelNode.title = this.displayName;
    this.recalculateSize();

    // Set the alignment of node depending upon the category.
    if (this.isDynamicPorts != 'yes' && this.names.length == 1) 
		this.getPorts().get(1).setPosition(this.getWidth() / 2, this.getPorts().get(1).getY());

    else if (this.isDynamicPorts != 'yes') 
		this.setAlignment();

    this.getPorts().get(0).setPosition(this.getWidth() / 2, this.requiredMarginTop);

}

/*
 * @private
 * @returns String
 */
shape.uml.Class.prototype.generateUId = function () {

    // If the dynamic id is already generated then don't do any operations
    if (this.classId != null) return this.classId;

    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = 10;
    var maxTry = 10;
    nbTry = 0;
    while (nbTry < 1000) {
        var id = 'PBX';

        // generate string
        for (var i = 0; i < string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            id += chars.substring(rnum, rnum + 1);
        }

        // check if there
        elem = document.getElementById(id);
        if (!elem) return id;
        nbTry += 1;
    }
    return null;
}
shape.uml.SourcePort = function () {
    InputPort.call(this)
};
shape.uml.SourcePort.prototype = new InputPort;
shape.uml.SourcePort.prototype.type = "SourcePort";
shape.uml.SourcePort.prototype.onDrop = function (a) {
    if (this.parentNode.id == a.parentNode.id) {} else {
        if ((a.getName() == "Source") && (this.getName() !== "Source")) {
            var b = new CommandConnect(this.parentNode.workflow, this, a);
            b.setConnection(new shape.uml.InheritanceConnection());
            this.parentNode.workflow.getCommandStack().execute(b)
        }
    }
};
shape.uml.SourcePort.prototype.onDragEnter2 = function (a) {
    if ((this.parentNode.id == a.parentNode.id) || (this.getName() == "Source")) {
        this.parentNode.workflow.connectionLine.setColor(new Color(150, 0, 0));
        this.parentNode.workflow.connectionLine.setLineWidth(3)
    } else {
        this.parentNode.workflow.connectionLine.setColor(new Color(0, 150, 0));
        this.parentNode.workflow.connectionLine.setLineWidth(3)
    }
    this.showCorona(true)
};
shape.uml.AttributePort = function () {
    this.invisible = false;
    OutputPort.call(this)
};
shape.uml.AttributePort.prototype = new OutputPort;
shape.uml.AttributePort.prototype.type = "AttributePort";
shape.uml.AttributePort.prototype.onDrop = function (a) {
    if (this.parentNode.id == a.parentNode.id) {} else {
        if ((a.getName() == "Source") && (this.getName() !== "Source")) {
            var b = new CommandConnect(this.parentNode.workflow, this, a);
            b.setConnection(new shape.uml.InheritanceConnection());
            this.parentNode.workflow.getCommandStack().execute(b)
        }
    }
};
shape.uml.AttributePort.prototype.onDragEnter2 = function (a) {
    if ((this.parentNode.id == a.parentNode.id)) {
        this.parentNode.workflow.connectionLine.setColor(new Color(150, 0, 0));
        this.parentNode.workflow.connectionLine.setLineWidth(3)
    } else {
        this.parentNode.workflow.connectionLine.setColor(new Color(0, 150, 0));
        this.parentNode.workflow.connectionLine.setLineWidth(3)
    }
    this.showCorona(true)
};
shape.uml.AttributePort.prototype.setInvisible = function (invisible) {
    this.invisible = invisible;
};
shape.uml.AttributePort.prototype.getInvisible = function () {
    return this.invisible;
};
shape.uml.InheritanceConnectionDecorator = function () {
    this.setBackgroundColor(new Color(255, 255, 255))
};
shape.uml.InheritanceConnectionDecorator.prototype = new ConnectionDecorator;
shape.uml.InheritanceConnectionDecorator.prototype.type = "shape.uml.InheritanceConnectionDecorator";
shape.uml.InheritanceConnectionDecorator.prototype.paint = function (a) {
    if (this.backgroundColor != null) {
        a.setStroke(1);
        a.setColor(new Color(35, 141, 201));
        a.fillPolygon([6, 10, 8, 8, 10, 6], [-1, -5, -3, 1, 3, -1])
    }
    a.setColor(new Color(35, 141, 201));
    a.setStroke(1);
    a.drawPolygon([6, 10, 8, 8, 10, 6], [-1, -5, -3, 1, 3, -1])
};
shape.uml.InheritanceConnection = function () {
    Connection.call(this);
    this.setTargetDecorator(new shape.uml.InheritanceConnectionDecorator());
    this.setRouter(new ManhattanConnectionRouter())
};
shape.uml.InheritanceConnection.prototype = new Connection();