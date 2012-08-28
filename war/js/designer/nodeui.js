
var templateNodes = new Array();
// Construct from path - is not used anymore
function constructNodeFromPath(nodeJSONPath, jsonData) {
    // Download JSON  	 
    $.getJSON(nodeJSONPath, function (data) {
        constructNodeFromDefinition(data, jsonData)

    });
}


// Construct node from definition. JsonData is deserialized. NodeId is used to pass to the designer (null/undefined if new node)
function constructNodeFromDefinition(nodeJSONDefinition, jsonData, nodeId) {

    console.log("constructNodeFromDefinition "+nodeId);
	console.log(nodeJSONDefinition);
   
    // Remove old data
    $("#nodeui").removeData();
    $("#nodeui").empty();

    // Store the json definition and values (deserialization)
    $("#nodeui").data('jsonDefinition', nodeJSONDefinition);
    $("#nodeui").data('jsonValues', jsonData);
    $("#nodeui").data('nodeId', nodeId);


    // Construct UI	
    var $nodeForm = $('#nodetemplate').clone();
    $nodeForm.appendTo($("#nodeui"));

    // Read language from cookie and translate it if the node definition is not same as user selected value
    var language = getTranslatorLanguage();    
    if (language != null && language != nodeJSONDefinition.language) {
			console.log("Language from cookie (" + language + ") node json language (" + nodeJSONDefinition.language + ")")
	        $("#nodeui .translate").val(language);
	        translateNode(language);
	        return;
    }
       

    // Change Grid default values in nodeJSONDefinition
    // Clone
    var newJSONDefinition = JSON.parse(JSON.stringify(nodeJSONDefinition));
    if(jsonData != undefined)
	    newJSONDefinition = changeDefaultValues(newJSONDefinition, jsonData);
        
    // Change Grid default values       
    constructUI($("#nodeui"), newJSONDefinition);
    
    
    // Deserialize form values
    if(jsonData != undefined)
	    $("#nodeui").deserialize(jsonData);
    
    
    // Set node name field
    if( nodeId == undefined || nodeId == null ) {    
  		$("#nodeui").find("[name=nodename]").val(nodeJSONDefinition.name);
     }
     else
     {
     	// Set node name
     	var node = workflow.getFigure(nodeId);
		if( node != null ) {
			console.log(node.displayName);
			$("#nodeui").find("[name=nodename]").val(node.displayName);
		}     	
     	
     }
            	    	        
    // Init validator
    initValidator($("#nodeui"), saveNode);
    
    // Clear Global Operations Queues (for dynamic edit)
    clearGridOperations();

    // Create a handler for button		
     $("#nodeui").dialog({
        title: nodeJSONDefinition.name,
        modal: true,        
        position: 'top',
		width:620,
        open: function(event, ui) {
			$(this).css({'max-height': 500, 'overflow-y': 'auto'}); 
		},
        autoOpen: true,        
        buttons: {
            'Save': function () {
                $(this).find("form").trigger('submit');
            }
        }
    });
    

    if (nodeJSONDefinition.language != undefined) 
    	$("#nodeui .translate").val(nodeJSONDefinition.language);

    // Add save icon to Save button (Yasin (20-09-10))
  /*  $(".ui-dialog-buttonpane button:first").addClass('ui-icon-save');
    $(".ui-dialog-buttonpane button:last").addClass('ui-icon-save'); */
    
   $(".ui-dialog-buttonpane button").button({
        icons: {
            primary: 'ui-icon-disk'
        }
    });
	
	//.removeClass('ui-button-text-only').addClass('ui-button-text-icon').append("<span class='ui-icon ui-icon-disk'></span>");        
	
}

function serializeNodeForm()
{
		// Get default values
		var jsonValues = $("#nodeui").find("form").serializeArray();        
        
        // Serialize table
        jsonValues = serializeTable($("#nodeui"), jsonValues);

		// jsonValues = getCheckBoxValues(jsonValues);
		
		return jsonValues;
}



// Save Node - serializes and constructs designer node
function saveNode(e) {
      
       console.log(e);
       var jsonValues = serializeNodeForm();
        
        // Get Node definition
        var jsonDefinition = $("#nodeui").data('jsonDefinition');
        
        // Check if original is present (translated nodes override jsonDefinition)
        if(jsonDefinition.org != undefined)
        	jsonDefinition = jsonDefinition.org;
        
        // Get Display name
        var displayName = $("#nodeui").find("[name=nodename]").val();
                       
        
        // Get the node id and update the old node id
		var nodeId = $("#nodeui").data('nodeId');
	
		// Check if node id is undefined or not 
		if( nodeId == undefined || nodeId == null ) {
			// Add designer 
			addNode(jsonDefinition, displayName, jsonValues, 200, 200);
		}
		else {					
	
				// Get the node object for corresponding node id
		        var nodeObject = workflow.getFigure(nodeId);
		
		      	// If node object is not null then set the form values into property.
		     	if( nodeObject != null )
		     	{
			  		nodeObject.setProperty("JSON", jsonValues);
			  		nodeObject.setNodeName(displayName);			  		
			  	}
			  	
			  	// If Dynamic Extensions or Dynamic Ports (Geographical Routing) looking at Global Queue
			  	// Connects to older ports automatically
			  	if( nodeObject.isDynamicPorts == "yes" )
			  	{
					editDynamicNode(nodeObject);
					
				}	  
			  				  	
		}
		 templateContinue(nodeId);				
        // close the dialog after the node is constructed			
        $("#nodeui").dialog('close');
       
		        

}


function checkIsTemplateNode(nodeID,saveFlag){

        alert("nodeID "+nodeID +"saveFlag"+saveFlag);
     	if(saveFlag)
         templateNodes.push(nodeID);
         
        console.log(templateNodes);
         
     


}

function templateContinue(nodeID){
    console.log("templateContinue "+templateNodes);
   console.log("nodeID "+nodeID);
    console.log(templateNodes.indexOf(nodeID));
    //return true;

}

function serializeTable(selector, jsonValues)
{        	    	
    	
    	// Iterate each table 
	selector.find("table").each(function (tableIndex, eachTable) {
    	    	
	// Iterate each header for keys
	var keys = [];		
	$(eachTable).find("th").each(function (index, eachTH) {		   		 
		 
		 // Index 0 is edit, delete		 
		 keys[index] = eachTH.id;		 				 		 		 
	});
	
		
	var gridJSONObject = [];	
    	// Iterate each row for row json
	$(eachTable).find("tbody tr").each(function (rowIndex, eachTR) {							
		
		var eachRowJSON = {};
		// Iterate each td for column data (we will store as key & value i.e., column data pair)
		$(eachTR).find("td").each(function (index, eachTD) {
		
		 	// Index 0 is edit, delete
			if(index != 0)
				eachRowJSON[keys[index]] = $(eachTD).text();
			
	  });
		 gridJSONObject.push(eachRowJSON);
	});	
	
	var gridJSON = {};
	
	var name = eachTable.id;
	// Remove -table
	if(name.indexOf("table") != -1)
	{		
		name = name.replace("-table", "");
	}
	
	gridJSON[name] = gridJSONObject;										
	jsonValues.push(gridJSON);
	
	
	});
	
	// return all grids data
	return jsonValues;
}


function changeDefaultValues(nodeJSONDefinition, jsonValues)
{

	 var ui = nodeJSONDefinition.ui;		  
	 
	 if(ui == undefined)
	 	return;
	
	// Itearate ui definition
	var length = ui.length;
	for(var i=0; i<length; i++)
	{
		// Field
		var uiFieldDefinition = ui[i];
		if(uiFieldDefinition == undefined)
			continue;	
			
		// Field type
		var uiFieldType = uiFieldDefinition.type;
		if(uiFieldType == undefined)
			continue;
		
       		// Check if field type is Grid or not
		if(uiFieldType == "audiogrid" || uiFieldType == "grid")
		{	
			
			// Name of grid
			var name = uiFieldDefinition.name;
			
			// Change default values to values
			
			$.each(jsonValues, function(index, json){
			
			if(eval("json." + name) != undefined)
			{
			
				if(uiFieldType != "audiogrid")
					uiFieldDefinition.defaultvalues = eval("json." + name);	
				else
					uiFieldDefinition.audio = eval("json." + name);	
			}
						
			
			});
			
			
		}
	}
	  
	 return nodeJSONDefinition;

}


// This function retrives all checkbox values present in the node ui and append those values to the json.
// Not used
/*
function getCheckBoxValues(formJSONObject) {
$(":checkbox").each(
  function()
  {      
	    formJSONObject = setValueIntoJSONArray( formJSONObject, this.name, this.checked)
        console.log("name = " + this.name);
		console.log("checked = " + this.checked);
        
  });
   
   return formJSONObject;
}

// This function sets the required values into json array.
function setCheckboxValueIntoJSONArray(jsonArray, key, value) {
    
	var array = new Array();

	$.each(jsonArray, function(index, json) {
		
		if( json.name == key ) {
			if(!value) 
				json.value = '';
			else 
				json.value = 'on';
				console.log("key " + key);
			}
		
		array.push(json);
		
	});

	return array;

}
*/