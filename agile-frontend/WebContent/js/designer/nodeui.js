
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

	$("#nodeui").find("#errorsdiv").html("").removeClass('ui-state-highlight');

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
    
    // Deserialize form values. 2nd condition is needed to avoid deserialize 
    // for Send Email node in addons.
    //Select defult emty in merged field select box
    if(jsonData != undefined && jsonData != "/json/nodes/email/send_email.jsp"){
	    $("#nodeui").deserialize(jsonData);
    }
    
    //Select default empty in selecte merged filed
     if(jsonData != undefined && nodeJSONDefinition.name == "Send Email"){
	      $("#nodeui").find("[name=merge_fields]").val("");
    }

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
            	    
    // Init SendEmail from name and email with current user details
    if(nodeJSONDefinition["name"] == "Send Email" && (jsonData == undefined || jsonData == "/json/nodes/email/send_email.jsp"))
    {
    	 // prefills from params of send email node with current username and email
        var current_user = prefill_from_details(newJSONDefinition);
         
        $("#nodeui").find("[name=from_name]").val(current_user["from_name"]);
        $("#nodeui").find("[name=from_email]").val(current_user["from_email"]);
    }

    // Init validator
    initValidator($("#nodeui"), saveNode);
    
    // Init tags typeahead for Tags or Check Tags node. Naresh 30/10/2013
    if(nodeJSONDefinition.name === "Tags" || nodeJSONDefinition.name === "Check Tags")
    {
    	init_tags_typeahead("#tag_names, #tag_value", "tags");
    }
    
    // Init labels typeahead for labels or Check labels node. Vaishnavi 24/11/15
    if(nodeJSONDefinition.name === "Labels" || nodeJSONDefinition.name === "Check Labels")
    {
    	init_tags_typeahead("#label_names, #label_value", "labels");
    }
    
    if(nodeJSONDefinition["name"] == "Send Message" && (jsonData == undefined || jsonData == "json/nodes/sms/sendmessage.js"))
        $("#nodeui").find("[name=to]").val("{{phone}}");
    
    //for set property node
    if(nodeJSONDefinition["name"] == "Set Property"){
    		setPropertyNode(jsonData);
    }

    // Clear Global Operations Queues (for dynamic edit)
    clearGridOperations();

    // Create a handler for button		
     $("#nodeui").dialog({
        title: nodeJSONDefinition.name,
        modal: true,        
        position: 'top',
		width:620,
        open: function(event, ui) {
			$(this).css({'max-height': 610, 'overflow-y': 'auto'}); 
			if(($(this).find('.inbound-help-text').length) > 0)
			{
				loadForwardingEmail($(this));
			}
		},
        autoOpen: true,        
        buttons: {
            'Save': function () {
            	
            	// Triggers change events of of URL Visited select
            	$(this).find("form #type-select").trigger('change');
            	
            	// Disables 'text' required property if html is given and text is empty 
            	disable_text_required_property($(this));
            	
            	// Disables multi select required if merge field is given
            	disable_owner_multiselect($(this));
                
            	var $form = $(this).find('form');
            	
            	// Check Validity
            	if($form.data("validator").checkValidity())
            		$form.trigger('submit');


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
	
	// Treat as opened second time, So trigger the events attached to ui
	// elements
	$.each(nodeJSONDefinition.ui, function(index, data) {
		try {
			if (data.triggerEventOnLoad)
				window[data.eventHandlerOnLoad]($("*[name='" + data.name + "']"),
						jsonData);
		} catch (e) {
			console.log(e);
		}
	});
}

function loadForwardingEmail(element)
{	
	$.ajax({url : '/core/api/api-key',
		type : 'GET',
		async : true,
		dataType : 'json',
		success : function(agile_api)
		{
			var inbound_email = window.location.hostname.split('.')[0] + "-" + agile_api.api_key + "@agle.cc";
			element.find('.inbound-help-text').text(inbound_email);
		},
		error : function(response)
		{
		} 
	});
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
      	var nodeName = jsonDefinition.name;
        
        // Check if original is present (translated nodes override jsonDefinition)
        if(jsonDefinition.org != undefined)
        	jsonDefinition = jsonDefinition.org;
        
        // Get Display name
        var displayName = $("#nodeui").find("[name=nodename]").val();

        // Node Level validation for some Nodes, if it will return true then all validation fine, if false then the Node will not save
        nodeLevelValidation(nodeName, function(isValid){
        	if(isValid == false){    	   
        		return;
        	}
        	else
        	{
        		// Get the node id and update the old node id
				var nodeId = $("#nodeui").data('nodeId');
				// Check if node id is undefined or not 
				if( nodeId == undefined || nodeId == null ) {
					// Add designer at given location
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
					  		if(nodeObject.name == NODES_CONSTANTS.TERRITORY)
					  			update_location_ports(nodeObject, jsonValues);
					  		else
								editDynamicNode(nodeObject);
						}	  
					  				  	
				}
				
				
				 //templateContinue(nodeId);
				 
				 var $save_info = '<span id="workflow-edit-msg" style="color: red;">You have unsaved changes. Click on &lsquo;Save Campaign&rsquo; to save.</span>';
				 
				 // Shows 'Save Campaign' message. Naresh (21/02/2014)
				 window.parent.$("#workflow-msg").html($save_info).fadeIn(1000);
				 
				 delete jsonDefinition["x"];
				 delete jsonDefinition["y"];
				 
				 if(!checkWorkflowSize())
						return;

				 showNodeConnectPopup(nodeId);

		        // close the dialog after the node is constructed			
		        $("#nodeui").dialog('close');
        	}
        });                    
              
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
			if(index != 0){

				if($(eachTD).find('select').length > 0)
                    eachRowJSON[keys[index]] = $(eachTD).find('select option:selected').val();
                else if($(eachTD).find('input').length > 0)
                	eachRowJSON[keys[index]] = $(eachTD).find('input').val();
                else
					eachRowJSON[keys[index]] = $(eachTD).text();
			}

			
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


/**Updates Branches for Zones**/
function update_location_ports(nodeObject, jsonValues)
{

	var formValues = jsonValues[1][NODES_CONSTANTS.TERRITORIES];
  	var formValuesJson  = {};

  	// Converts array to json
  	for(var i=0;i<formValues.length;i++)
  		formValuesJson[formValues[i]["dynamicgrid"]] = true;

	// array of ports
	var ports = getPorts(nodeObject);

	$.each(formValuesJson, function(key, value){

		// If key doesn't exists in ports, add new port
		if(ports.indexOf(key) == -1)
			addPort(key, nodeObject);
		else
			editPort(nodeObject, ports.indexOf(key), key);

		alignDynamicNodePorts(nodeObject);

		// Draw2D (based on the ports)
		nodeObject.allignDynamicNode();
		
	});
}

//show popup -- how to connect one node to another node 

function showNodeConnectPopup(nodeId){
    var campaignCount=0;
	 $.ajax({ 
	 	url : '/core/api/workflows/count' ,
	 	type : 'GET',
	 	async : false,
	 	dataType : 'text',
	 	 success : function(data){
	 	 	campaignCount=data;
	 	 },
	 	error : function(response)
			{
					campaignCount=response;
				
			}
	 	});
	var firstNode=$('#paintarea >div.contextMenuForNode').length;
	if(firstNode==2 && nodeId===undefined && campaignCount==0)
	{
		window.parent.workflow_alerts("Message", "Title", "show-connect-node-popup-modal", null);
	}
}

// Node Level validation, based on Nodename validation happens
function nodeLevelValidation(nodeName, callbackFunction){
	var validation_nodes = ['URL Visited?','Replied?','Clicked?','Opened?'];

	if(!nodeName || validation_nodes.indexOf(nodeName) == -1)
		return callbackFunction(true);

	// Validation for URL Visited Node, It will check Tracking code is there or not in website.		
	if(nodeName == 'URL Visited?'){
				
		get_dynamic_data('core/api/web-stats/JSAPI-status', function(data){
			if(data == 0)
         	{
         		// Display error message
         		$("#nodeui").find("#errorsdiv").html("<p class='fa fa-times icon-1x' style='color:red'><i>Web Tracking is not enabled for the web pages. Please click <a href='http://"+window.location.host+"/#api-analytics' target = '_blank' style='color: #19a9d5;!important ;text-decoration: none;'>here</a> to enable.</i></p>").addClass('ui-state-highlight');
         		return callbackFunction(false);    		
         	}
         	else
         		return callbackFunction(true);
		});
	}

	// Replied Node alert message while saving
  	if(nodeName == 'Replied?'){ 
  		getInboundMail(function(inbound_email){
  			window.parent.showModalConfirmation("Things to check",
            "1. Agile CRM to recognize your emails, please setup <span style='user-select:all;' title='Click to copy' onclick='document.execCommand(&#39;copy&#39;)'><a style='border-bottom: 1px dashed'>" +inbound_email+ "</a></span> as forwarding email at your email server.</br>2. Reply To email address should be the one for which you have done the forwarding setup.</br>3. Email content should be in HTML.",
            null,null,null                      
            ,"Close", ""); 

		    callbackFunction(true);
		    return;
  		});	    
  	}

  	// Clicked Node alert message while saving
  	if(nodeName == 'Clicked?'){ 
  		window.parent.showModalConfirmation("Things to check",
            '1. Clicked node should not be connected to “Wait” or “Wait Till” Nodes.<br/>2. If you want to track email link clicks, the Email template must have HTML Content & also in the Send Email Node Settings, Yes or Yes & Push Option should be enabled.',
            null,null,null                      
            ,"Close", ""); 

		    callbackFunction(true);
		    return;    
  	}

  	// Opened Node alert message while saving
  	if(nodeName == 'Opened?'){ 
  		window.parent.showModalConfirmation("Things to check",
            '1. Opened node should not be connected to “Wait” or “Wait Till” Nodes.<br/>2. If you want to track email opens, the Email template must have HTML Content in the Send Email Node.',
            null,null,null                      
            ,"Close", ""); 

		    callbackFunction(true);
		    return;    
  	}

}	
// Ajax call
function get_dynamic_data(url, callback)
{
  window.parent.accessUrlUsingAjax(url, 
              		function(data){               			
              			if(callback && typeof (callback) == "function")
              				callback(data);
              		});     	
}
// Get InboundMail
function getInboundMail(callback){
	window.parent.setGlobalAPIKey(function(){
		var inbound_email = window.location.hostname.split('.')[0] + "-" + window.parent._AGILE_API_KEY + "@agle.cc";
		callback(inbound_email);
	});
}