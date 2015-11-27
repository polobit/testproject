function initDesigner()
{
    workflow = new Workflow("paintarea");
    initStart();

	// Scroll area for workflow
	workflow.scrollArea = document.getElementById("designer").parentNode;
            
    // Disable Right Click on document    
	$(workflow).bind("contextmenu",function(e){
		return false;
	});

	disableTextSelection();            
}


/* 
 * Enable Selection in document. This should be called while opening popups 
 * so that it will enable the text selection. 
 *
 *
 *   This is not used currently
 */
function enableSelection() {
    var target1 = document.body;
    if (typeof target1.onselectstart != "undefined") { //IE route
        target1.onselectstart = function () {
            return true;
        };
    }
    else if (typeof target1.style.MozUserSelect != "undefined") {
        target1.style.MozUserSelect = "text";
    }
    else {
        target1.onmousedown = function () {
            return true;
        }
    }
    target1.style.cursor = "default";
}


// Disable selection in document.
  function disableTextSelection() {

    var target = document.body;
    if (typeof target.onselectstart != "undefined") //IE route
	    target.onselectstart = function () {
        return false
    }
    else if (typeof target.style.MozUserSelect != "undefined") //Firefox route
    	target.style.MozUserSelect = "none"
    else //All other route (ie: Opera)
    	target.onmousedown = function () 
    	{
        	return false
    	}
    
    target.style.cursor = "default"
}


function initStart() {        
     
	$.getJSON("json/nodes/common/start.js", function(data) {	
		addNode(data, "Start",[], 500, 10, "PBXNODE1", false); 
	  });
}

/*
 * This function is used to create node
 * 
 */ 
function initNode(nodeItem) {
	   	
       //console.log("jsondecode(nodeItem.NodeDefinition) "+eval('('+jsondecode(nodeItem.NodeDefinition)+')').name);
	   var nodeDefinition = eval('('+'nodeItem.NodeDefinition'+')');
	   //alert(nodeDefinition.name);
	   addNode(nodeDefinition,nodeItem.displayname,nodeItem.JsonValues,nodeItem.xPosition,nodeItem.yPosition,nodeItem.id);
 }


// Add node 
function addNode(nodeDefinition, uiFriendlyName, jsonFormValues, x, y, nodeid, isInputPort)
{

    var nodeName = nodeDefinition.name;
    var branches = nodeDefinition.branches;

    var icon = nodeDefinition.icon;
    
	// Added new variables for thumbnail image and extensions thumbnail image (Yasin(16-09-10))
	var thumbnail = nodeDefinition.thumbnail;
    var thumbnailLarge = nodeDefinition.thumbnailLarge;

    // Construct port names
    // For most of the nodes - you need one port only. It is set to success. For failure cases such as call forwarding, this is failure
    var ports = ["success"];

    // Tokenize Branches to get static ports
    if (branches != undefined)
    	if(branches.indexOf(",") != -1) 
    		ports = branches.split(","); // Splits the ports
    	else
			ports[0] = branches; 

    // Trim all branch names
    for (var i = 0; i < ports.length; i++)
    {
        ports[i] = ports[i];
    }


    // if nodeid is null, draw2d will generate an auto id for it
    if (nodeid == undefined) 
    	nodeid = null;

    // Source port (except for Start - all of them have it	
    if (isInputPort == undefined) 
    	isInputPort = true;
    	
    	    	
    	    
    // Construct node
    
    /*
    // Sample
    	var voicemailNode = 
    	{
    		displayName : 'VoiceMail',
    		name : 'VoiceMail',
    		isInputPort : true,
    		isDynamicPorts : 'no',
    		nodeid : null,
    		formValues : '{&quot;nodename&quot;:&quot;Voicemail 1&quot;,&quot;email&quot;:&quot;vinaybtech51@gmail.com&quot;,&quot;Transcribe&quot;:&quot;No&quot;,&quot;transProvider&quot;:&quot;Voicecloud&quot;,&quot;pager number&quot;:&quot;&quot;,&quot;Carrier&quot;:&quot;AT and T Wireless-txt.att.net&quot;,&quot;wavcheckbox1&quot;:&quot;false&quot;,&quot;voicemailurl&quot;:&quot;&quot;,&quot;methodtype&quot;:&quot;get&quot;}',
    		StaticPorts : ["success"]
    		x:
    		y:
	}
    */
    
    
    // For menu node 
	var isDynamicPorts = "no";
    if( nodeDefinition.dynamicports != undefined )
		isDynamicPorts = "yes";
    
    var node =
    {
        displayName: uiFriendlyName,
        name: nodeName,
        isInputPort: isInputPort,
        isDynamicPorts: isDynamicPorts,
        nodeid: nodeid,
        formValues: jsonFormValues,
        StaticPorts: ports,
        icon: icon,
        
		// Added new parameters for thumbnail image and extensions thumbnail image (Yasin(16-09-10))
		thumbnail: thumbnail,
        thumbnailLarge: thumbnailLarge,
        x: x,
        y: y,
        nodeDefinition: nodeDefinition
    };

    addNodeInternal(node);

}



/**
 @node - node object. Node object has below properties
 1.displayName - display name of the node.
 2.name - name of the draw2d node object.
 3.isInputPort - flag variable specifies whether input port exists or not.
 4.isDynamicPorts - flag variable specifies whether dynamic ports exist or not.
 5.nodeid - the value of this variable set into node if it is not null.
 6.formValues - draw2d node object json values.
 
 This function adds the node to the workflow
 
 */

function addNodeInternal(node)
{

    // "portTable" is added to Node name  in shape-all files
    
	// For creating new object for large thambnail after saving extensions node (Yasin(16-09-10)) 

	console.log(node);
	
   if(node.name.toLowerCase() == "extensions")
    var object = new shape.uml.Class(node.displayName, node.name, node.isInputPort, node.isDynamicPorts, node.nodeid, node.thumbnailLarge);
	
	// "portTable" is added to Node name  in shape-all files
	else 
	object = new shape.uml.Class(node.displayName, node.name, node.isInputPort, node.isDynamicPorts, node.nodeid, node.thumbnail);
	
    // Store JSON form values for UI to be rendered when double clicked.
    object.setProperty("JSON", node.formValues);

    // Store Node Name
    object.setProperty("JSFILENAME", node.name);

    // Store Node Definition
    object.setProperty("NodeDefinition", node.nodeDefinition);


    /**
     
     * This function is executed when on Double Click event is generated.
     
     * This function calls the handler function and handler.js 
     
     **/
    object.onDoubleClick = function ()
    {        
		console.log(this.getProperty("JSON"));
		if(!parent.App_Workflows.is_disabled)
		constructNodeFromDefinition(this.getProperty("NodeDefinition"), this.getProperty("JSON"), this.getId())
    }

    /**
     
     * This function is executed if and only if the on click event for 
     
     * edit image is generated. This function calls the handler function.
     
     */

    object.onEditImageClick = function ()
    {

        console.log("editing");
        this.onDoubleClick();

    }

	/*  
	 * This function creates the duplicate node.
	 */
	object.createDuplicateNode = function() {

		if(!checkMaxNodesCount())
	 		return;
		
		if(!checkWorkflowSize())
			return;
		
		var objectDisplayName = "Copy of " + this.displayName;
		
		var nodeDefinitionCopy = JSON.parse(JSON.stringify(this.getProperty("NodeDefinition")));
		var jsonValues =   JSON.parse(JSON.stringify(this.getProperty("JSON")));
				
		addNode(nodeDefinitionCopy, objectDisplayName, jsonValues, this.getX(), (this.getY() + this.getHeight()), null);		
	}
    
    // For menu, dynamic port is yes
    if (node.isDynamicPorts != 'yes')
    {
        var portArray = node.StaticPorts;
        var length = portArray.length;
        for (i = 0; i < length; i++)
        {

			/*
			* adding port to the node.
			*/
	         object.addAttribute(portArray[i], "String");
        }
	}
    else
    {
    		// Dynamic Ports
    		// If the node is dynamic node, we need to iterate the array and create the ports
			console.log(node.formValues);
										
			$.each(node.formValues, function(index, json){				
				
				$.each(json, function(key,  value){
					
					// Check which grid is dynamic - look for dynamicportkey
					if( key == node.nodeDefinition.dynamicportkey ) 
					{						
						// Iterate through dynamic grid
						$.each(value, function(index, portJSONObject){
							
							// Store the name 
							console.log(portJSONObject);									
							object.addAttribute(portJSONObject["dynamicgrid"], "String");								
								
						});
					}
				});

			});
		
    		
    
    }

	/*
	* add node to workflow(canvas).
	*/
	workflow.addFigure(object, node.x, node.y);
	
	initContextMenu();

	addMouseOver();
}

//Add mouse hover to the node
function addMouseOver() {
  
  var hoverHandlerOut = function() {      
	 
	 removeNodeSelection();
  }

   $(".contextMenuForNode").mouseout(hoverHandlerOut);

   mouseOverForNode();

 }

// Add mouse hover to the node
function mouseOverForNode(){
	
	// Add hover effect to each node 
	  $(".contextMenuForNode").mouseover(function(){
	     	$(this).find('.nodedelete').show();
	     	$(this).find('.nodeedit').show();
	    }).mouseout(function(){
	      	$(this).find('.nodedelete').hide();
	      	$(this).find('.nodeedit').hide();
	    });
   // Add delete effect to each node 
	 $(".nodedelete").unbind().bind('click',function(){
	  	
	  		var html = $(this).parents("div.contextMenuForNode");
	  		showContextMenu("delete", html, '');
	  })
	 // Add edit effect to each node  
	  $(".nodeedit").unbind().bind('click',function(){
	  	
	  		var html = $(this).parents("div.contextMenuForNode");
	  		showContextMenu("edit", html, '');
	  })

}



// Add right click menu to the node
function initContextMenu() {
    
	/*$(".contextMenuForNode").mouseover(function(){
		 console.log('mouse over');
		 showContextMenu(action, el, pos);
		});*/
	
	// Node has class as contextMenuForNode
	$(".contextMenuForNode").contextMenu({ menu: 'myMenu' }, function(action, el, pos) { 
		showContextMenu(action, el, pos);
	});
}


// Execute the required function according to the action triggered by user.
function showContextMenu(action, el, pos)
{

	// Get draw2d node object from element id
	var node = workflow.getFigure($(el).attr("id"));
	
	// If node is null then show error message to users
	if(node == null) {

		alert("Unable to perform operations.")
		return false;
	}
	
    switch (action)
    {

    case 'edit':
    	if (node.name.toLowerCase() == "start")
        {
            alert("Start option cannot be edited.");
            return;
        }
    	node.onEditImageClick();
        break;

    case 'delete':
        if (node.name.toLowerCase() == "start")
        {
            alert("Start option cannot be deleted.");
            return;
        }
        node.remove();
        break;

    case 'duplicate':

        if (node.name.toLowerCase() == "start")
        {
            alert("Duplicate option is not allowed for Start");
            return;
        }

        // Create duplicate node1
        node.createDuplicateNode();
        break;

    }

}


// This function clear all nodes in the workflow  except start
function clearWorkflowExceptStart()
{

    for (var i = 0; i < workflow.getFigures().getSize();)
    {
        var figure = workflow.getFigures().get(i);

        // Delete the command - i is not incremented as deleting will change the array size
        if (figure != null && figure.name != "Start" && figure.type == "shape.uml.Class") 
			workflow.commandStack.execute(new CommandDelete(figure));
        else 
			i++;
    }
}

	 
function deserializePhoneSystem(json)
{
	clearWorkflowExceptStart();	
	new JSONDeserializer().fromJSON(workflow.getDocument(), json);
}


function deserializePhoneSystemTemplate(json)
{
	clearWorkflowExceptStart();	
	new JSONDeserializer().fromJSONTemplate(workflow.getDocument(), json);
}

function serializePhoneSystem() {
	
	var workflowJSON = new JSONSerializer().toJSON(workflow.getDocument());
	return 	JSON.stringify(workflowJSON);
}

function removeNodeSelection() {

	workflow.setCurrentSelection(null);

}

$("#button_email").die().live("click", function(e){
    e.preventDefault();
    testMailButton("#button_email");
        });

$("#button_email_html").die().live("click", function(e){
    e.preventDefault();
   
    testMailButton("#button_email_html");
        });


function testMailButton(button){
    
    if($(button).is(':disabled'))
    return;

    $(button).css('color','gray');
    $(button).attr('disabled', 'disabled');
    
    var fromEmailValidator = $("#from_email").validator({effect : 'wall',container: '#errorsdiv'});  
    if(!fromEmailValidator.data("validator").checkValidity()){
    	 $(button).removeAttr('disabled', 'disabled');
    	 $(button).css('color','');
    	return;
    }
    
    var subjectValidator = $("#subject").validator({effect : 'wall',container: '#errorsdiv'});
    if(!subjectValidator.data("validator").checkValidity()){
			  $(button).removeAttr('disabled', 'disabled');
			  $(button).css('color','');
    	return;
    }
/*
 * 
 * <span id="confirmation-text" style="margin: 5px 2px 0px; display: inline-block; text-align: center; float: left; width: 75%; color: red; font-style: italic; opacity: 0.316546890625;">Email has been sent to bhasuri@invox.com</span>*/
    if($('#tinyMCEhtml_email').val() != "" && $('#text_email').val() == "")
		$('#text_email').removeProp("required");
    
    var texValidator = $("#text_email").validator({effect : 'wall',container: '#errorsdiv'});
    var htmlEmailValidator = $("#tinyMCEhtml_email").validator({effect : 'wall',container: '#errorsdiv'});
    
    	 if(!htmlEmailValidator.data("validator").checkValidity() || !texValidator.data("validator").checkValidity() ){
    				  $(button).removeAttr('disabled', 'disabled');
    				  $(button).css('color','');
    	    	return;
    	    }
    	 
    // Verify email message
    if($("#from_email").val() == "{{owner.email}}")
    {
    	if(button == "#button_email")
    		margin = "margin:-6px 24px;";
    	else
    	    margin = "margin:-44px 29px 0px;";

    	$(button).before("<span class='clearfix' id='confirmation-text'style='top: -49px;"+margin+"display: inline-block;text-align: center;float: left;width: 75%; color: red;font-style: italic;'>Test email cannot be sent to Contact's Owner. Please select any verified email.</span>");
    	
    	// Hide message
    	$("#confirmation-text").fadeOut(15000,function(){
				
				  $("#confirmation-text").remove();
				  $(button).removeAttr('disabled', 'disabled');
				$(button).css('color','');
    	});
    	
    	return;
    }
    	 
    window.parent.workflow_alerts("Send Test Email", "Please observe that the merge fields in test emails would not be replaced. You can however run this campaign on your test contacts." , "workflow-alert-modal"

        ,function(modal){

        var $a = $(modal).find("a");

        $a.off("click");

        $a.on("click", function(e){
                    e.preventDefault();

                    var margin;
                    var jsonValues = serializeNodeForm();
                    $(button).css('color','gray');

                    // Disable and change text
                    $(this).attr('disabled', 'disabled').text("Sending");

                    $.ajax({
                          url: 'core/api/emails/send-test-email',
                          type: "POST",
                          data:jsonValues,
                          async:false,
                          success: function (email) {//top": "-44px
                             
                             $('#errorsdiv').text("sfasd"+email);
                             if(button == "#button_email")
                                 margin = "margin:-6px 24px;";
                                 else
                                 margin = "margin:-44px 29px 0px;";
                                                 
                             $(button).before("<span class='clearfix' id='confirmation-text'style='top: -49px;"+margin+"display: inline-block;text-align: center;float: left;width: 75%; color: red;font-style: italic;'>Email has been sent to "+email+"</span>");
                         
                              $("#confirmation-text").fadeOut(8000,function(){
                            
                              $("#confirmation-text").remove();
                              $(button).removeAttr('disabled', 'disabled');
                            $(button).css('color','');
                          });
                        },
                        error: function(Error){
                            console.log(Error);
                            $(button).css('color','');
                        }
                    });

                });

        // On hidden
        modal.on('hidden.bs.modal', function (e) {

            $(button).removeAttr('disabled', 'disabled');
            $(button).css('color','');
        });
    }); 
}
