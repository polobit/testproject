var $addTTSButton, $convertTTSButton, $ttsField, $ttsContainer, $ttsStatus, $ttsPlayer;

String.prototype.endsWith = function(str) {return (this.match(str+"$")==str)}


// Get External JSON - YQL way
function getExternalJSON(url, callback, failurecallback) {
    
   if((url.indexOf(YQL_Filter) != -1) || (url.indexOf("/") == 0))
   {  
   	// Local URL, don't use YQL
   	$.getJSON(url, function (data) {	
		
		console.log(data);
   		callback(data);
   	});
   	
   	return;   	
   } 
    
   if(url.indexOf("?") != -1) 
   		url = url+"&timestamp=" + new Date().getTime();	

    // Query     
    var query = encodeURIComponent('select * from json where url="' + url + '"');    
    
    console.log(query);
    
    // All of them are hardcoded to JSON
    var yql = "http://query.yahooapis.com/v1/public/yql?q=" + query + "&format=json&callback=?";
    
    
    $.getJSON(yql, function (data) {

	
	console.log(data);
	
	// Check callback
        if (data.query.results != undefined) {                   
            if (failurecallback) 
            	failurecallback(data.query.results.error);
        }

        if (data.query.results && data.query.results.json && typeof(data.query.results.json)) {
            if (callback) 
            	callback(data.query.results.json);
        }
        else if (data.query.results && typeof(data.query.results)) {
            if (callback) 
            	callback(data.query.results);
        }
        else {
            if (failurecallback) 
            failurecallback("Unknown error");
        }
    });
}
function addFilter(filter) {
    
    // Create filter option if not present
    var $option = $("#catalog").find("option[value='" + filter + "']");
    if (($option == undefined) || ($option.length == 0)) {
        $option = $('<option value="' + filter + '">' + filter + '</option>');
        $option.appendTo($("#catalog").find("select"));
    }
}


function showCatalog(jsonsPath, callback, filter, showCustomURL) {

    // Shows Category Filter on top right - populates the array automatically
    var categoryFilter = new Array();

    // Initialize the count
    var downloadedNodesCount = 0;

    // Clear old elements	
    $("#catalog").find('ul').remove();
    $("#catalog").find('option').remove();

    // Add All option first
    $option = $('<option value="All">All</option>');
    $option.appendTo($("#catalogfilter"));

    $("#catalog").remove('option');

    $("#catalogfilter").unbind('change').change(function () {

        // Read the selected element
        var selected = $("#catalogfilter").val();
        if (selected == 'All') selected = undefined;
        showCatalog(jsonsPath, callback, selected, showCustomURL);
    });
        
    // Search Filter
    $('#catalogsearchbutton').unbind().click(function(){
    	showCatalog(jsonsPath, callback, filter, showCustomURL);
     });
    
    // Download all items
    $.getJSON(jsonsPath, function (catalogdata) {

        $.each(catalogdata, function (index, json) {

            // Download each json
            $.ajaxq("catalog", {
                url: json.url,
                cache: true,
                dataType: 'json',
                success: function (data) {
                                               
                    // By default - do not show element
                    var showElement = false;

                    // If no filter is present, show
                    if (filter == undefined) showElement = true;

                    // Strip filters
                    if (data.category != undefined) {

                        var filters = data.category.split(",");
                        for (var i = 0; i < filters.length; i++) {
                            addFilter(filters[i].trim());
                            if (filters[i].trim().indexOf(filter) != -1) showElement = true;
                        }
                    }
                    
                    
                    // Check if it matches the search element
                    var catalogSearchValue = $('#catalogsearch').val();
                    if(showElement && catalogSearchValue.length > 0)
                    {                    	
                    	showElement = false;
                    	if(data.name.indexOf(catalogSearchValue) !=-1)
                    		showElement = true;
                    	if(data.info.indexOf(catalogSearchValue) !=-1)
                    		showElement = true;
                    	if(data.help.indexOf(catalogSearchValue) !=-1)
                    		showElement = true;                    
                    }                    

                    // Filter filter elements
                    if (showElement) {
						addCatalogTemplate(data, json.url, callback);						
                    }


                    // Last Catalog Option - draw it
                    if ((index + 1) == catalogdata.length) {


                        // Add a new option for custom Url
                        if (showCustomURL == undefined) {

 							addCustomURLTemplate(callback);
                        }



                        if (filter != undefined) 
                        	$("#catalogfilter").val(filter);

                        // Create a handler for button		
                        $("#catalog").dialog({
                            autoOpen: true,
                            title: 'Catalog',
                            resizable: true,
                            modal: true,
                            position: 'center',
                            width: 770,
                            open: function (event, ui) {
                                $(this).css({
                                    'max-height': 500,
                                    'overflow-y': 'auto'
                                });
                            }

                        });

                    }

                }
            });

        });
    });

}


function addCatalogTemplate(data, url, callback, uidata)
{

		// Check if translations are required
		/*var language = readCookie('language');
    	if (uidata == undefined && language != null && language != 'en') {
    	
    		var items = new Array();
    		items.push(data.name);
    		items.push(data.info);
			jQuery.getScript( Google_Translator_Path, function()
			{    	    	    	
				$.translate( items, 'en', language, {
		  			complete: function(translation)
		  			{
		  				console.log(translation + " <- selected " + language);	  				
		  				var uidata = {};
		  				uidata.name = translation[0];
		  				uidata.info = translation[1];		  				
		  				addCatalogTemplate(data, url, callback, uidata);
		  			}
				});
			});
			
			return;
		}*/
		

         var catalogTemplate = $('#catalogtemplate').clone();
         catalogTemplate.removeAttr('style');

         // Fill the catalogtemplate with values. Override them with translated values if available
         constructUI(catalogTemplate, data);
         if(uidata != undefined)
         	constructUI(catalogTemplate, uidata);
         
         // Add JSON and JSONSrc URL both. Some of them require JSON and some of them selected source
         catalogTemplate.find('#add').data('json', data);
         catalogTemplate.find('#add').data('jsonsrc', url);


         // Add handler for add this                        
         catalogTemplate.find('#add').click(function () {

             // Get JSON and JSONSrc
             var json = $(this).data('json');

             var jsonsrc = $(this).data('jsonsrc');

             // Close the dialog
             $('#catalog').dialog('close');

             // Call the callback with json and jsonsrc                            
             callback(json, jsonsrc);
         });

         // Append this element to catalog
         catalogTemplate.appendTo('#catalog');

}

function addCustomURLTemplate(callback)
{
            var catalogTemplate = $('#catalogurltemplate').clone();
             catalogTemplate.removeAttr('style');

             // Add handler for add this                        
             catalogTemplate.find('#add').click(function () {

                 // Find URL                        	                        	
                 var url = $(this).parent().find('input').val();
                 if (url == undefined || url.length == 0) {
                     alert("URL cannot be empty");
                 }
                 else {
                     getExternalJSON(url, function (data) {
                         callback(data, url);
                     }, function () {
                         alert("The specified URL cannot be downloaded at this time");
                     });
                 }

             });

             // Append this element to catalog
             catalogTemplate.appendTo('#catalog');
}


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