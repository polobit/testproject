// Add tab to tabs id in selector with tabName and tabID (anchor tag in li)
function addTab(selector, tabName, tabID) {

    // Find tabs element if already present
    var tabsSelector = selector.find('.tabs');
    if ((tabsSelector == undefined) || (tabsSelector.length == 0)) {
        return;
    }


    // Add div for this tab	
    var div = "<div id='" + tabID + "'></div";
    $(div).appendTo(tabsSelector);

    // Add tab - "tab" is added to id automatically with the name.
    var tabsUISelector = selector.find('.tabs ul');
    if ((tabsUISelector == undefined) || (tabsUISelector.length == 0)) {
        return;
    }

    // Add li to ul (tab element)
    var tabLi = "<li id=\"" + tabName + "-li\"><a href=\"#" + tabID + "\">" + tabName + "</a></li>";
    $(tabLi).appendTo(tabsUISelector);

}

// Return tab - if not present adds tab
function getTab(selector, tabName, originalTabName) {

    if(tabName == undefined) tabName = "Settings";
    
    // Get Tab	
    if (originalTabName == undefined) originalTabName = tabName
    
    // Replace spaces with _ as id doesn't allow spaces. Naresh 28/10/2013
    originalTabName = originalTabName.replace(/\s/g, '_');
    
    var actualTabID = originalTabName + '-tab';
    
    

    // Find Tab
    var tabObject = selector.find('#' + actualTabID);

    // add tab if not present
    if ((tabObject == undefined) || (tabObject.length == 0)) {
        //console.log("Adding tab with " + selector.attr("id"), tabName, actualTabID);
        addTab(selector, tabName, actualTabID);
        tabObject = selector.find('#' + actualTabID);

    }

    // console.log("Tab object " + tabObject.attr("id"));	
    return tabObject;
}


// Generates Radio UI
function generateRadioUI(uiFieldDefinition) {

    // Select options will be json pairs (key,values)	
    var options = uiFieldDefinition.options;

    // Add all elements defined
    var selectOptionAttributes = "";
    $.each(
    options, function (key, value) {

        var input = "<input type=\"radio\" name=\"" + uiFieldDefinition.name + "\" value=\"" + key + " >" + value + "</input>";
        selectOptionAttributes += input;
    });

    return selectOptionAttributes;
}


function constructUITemplatesFromURL(url, name, template, container, callback)
{       	
    getExternalJSON(url, function(data){
          
        // Iterate through all agents
        var dataArray = data[name];
        
       if(dataArray instanceof Array)                
        $.each(dataArray, function (index, json) {
        
            // Get Template
            template = template.clone();
            template.data('json', json);
            template.removeAttr('style');
            
            // Fill the catalogtemplate with values
            constructUI(template, json);
            
            // Add to container
            template.appendTo(container);
            
            if (index + 1 == dataArray.length) {
            	  if(callback != undefined)            
                  	callback();                  
            }
        
        });
     
     });

}


function generateDynamicSelectUI(uiFieldDefinition, url, keyField, valField)
{
	
	var url = uiFieldDefinition.url;
	var keyField = uiFieldDefinition.dynamicName;
	var valField = uiFieldDefinition.dynamicValue;
	var appendNameField = uiFieldDefinition.appendToDynamicName;
	var type = uiFieldDefinition.type;

	// Append or prepend
	var arrange_type = uiFieldDefinition.arrange_type;
	

	// Select events
	var eventHandler = uiFieldDefinition.eventHandler;
	var event = uiFieldDefinition.event;

	var selectContainer = $("<select name='" + uiFieldDefinition.name + "' title='" + uiFieldDefinition.title + "'> " + "</select>");

	if(event && eventHandler)
		selectContainer = $("<select id='"+uiFieldDefinition.id+"' "+getStyleAttribute(uiFieldDefinition.style)+" name='" + uiFieldDefinition.name + "' title='" + uiFieldDefinition.title + "'" + event +"='"+eventHandler+"' type='"+(type == undefined ? 'select' : type)+"'></select>");
	
	// For From Email select, options need to rearranged
	if(uiFieldDefinition.id == "from_email" && uiFieldDefinition.name == "from_email")
	{
		// Remove Contact's owner
		delete uiFieldDefinition.options["Contact's Owner"];

		fetchAndFillSelect(url,keyField, valField, appendNameField, uiFieldDefinition.options, selectContainer, arrange_type, function($selectContainer, data){

		  		$selectContainer.find("option:first").before("<option value='{{owner.email}}'>Contact's Owner</option>");

				// Make Contact's owner selected
				 $selectContainer.val("Contact's Owner").attr('selected', 'selected');
				
				// Rearranges options
				rearrange_from_email_options($selectContainer, data);				
		});

		return selectContainer;
	}

	// Fetches data and fill select
	fetchAndFillSelect(url,keyField, valField, appendNameField, uiFieldDefinition.options, selectContainer, arrange_type)
	
	return selectContainer;
}

function fetchAndFillSelect(url, keyField, valField, appendNameField, options, selectContainer, arrange_type, callback)
{

	var selectOptionAttributes ="";
	
	
	// Populate Options - Naresh 23/04/2014
	if(options !== undefined)
	{
		$.each(
				options, function (key, value) {
					
					if(key.indexOf("*") == 0)
					{
						key  = key.substr(1);
						selectOptionAttributes += "<option selected='selected' value='" + value + "'>" + key + "</option>";
					}
					else
						selectOptionAttributes += "<option value='" + value + "'>" + key + "</option>";
				});
	 }

	$.ajax({
		  url: url,
		  async: false,
		  dataType: "json",
		  success: function(data)
		  {	    			
	    
			// Append given options
			if(selectOptionAttributes !== undefined)
	    	$(selectOptionAttributes).appendTo(selectContainer);
	    
		var array = eval (data);	      
		$.each(array, function( index, json )
		{				
				var key = eval("json." + keyField);			
				var value = eval("json." + valField);
				
				var appendName = eval("json."+ appendNameField);
				
				// Append name to email like Naresh <naresh@agilecrm.com>
				if(key!= undefined && appendName != undefined)
					key = appendName + " &lt;"+key+"&gt;";
				
				if(key != undefined && value != undefined)
				{
					console.log(key);
					if(key.indexOf("*") == 0)
					{
						key  = key.substr(1);
						
						option = "<option selected value='" + value + "'>" + key + "</option>";
    				}
    				else
    				    option = "<option value='" + value + "'>" + key + "</option>";
        				
    				if(arrange_type && arrange_type == "prepend")
    					$(option).prependTo(selectContainer);
    				else
    				{	
    					// Append to container	
        				$(option).appendTo(selectContainer);	        				        								
        			}
				}											   	   	   	  	   	  				
		});

		  if(callback && typeof (callback) === "function")
		  	callback(selectContainer, data);
		  }
	});
}


// Generate Select UI
function generateSelectUI(uiFieldDefinition, selectEventHandler) {

    // Select options will be json pairs (key,values)	
    var options = uiFieldDefinition.options;
    var selectOptionAttributes = "";

    // Gets MergeFields Option object
    if(uiFieldDefinition.fieldType == "merge_fields")
    	 return getMergeFieldsWithOptGroups(uiFieldDefinition, selectEventHandler);
    	
    if(uiFieldDefinition.fieldType == "update_field")
    {
    	options = getUpdateFields("update_field");
    }
    
    
    if(uiFieldDefinition.fieldType == "incoming_list")
    {
    	options = getTwilioIncomingList("incoming_list");
    }
    
    if(uiFieldDefinition.fieldType == "twilio_incoming_list")
    {
    	options = getTwilioIncomingList("twilio_incoming_list");
    }
    
    
    if(uiFieldDefinition.fieldType == "campaign_list")
    {
    	options = getCampaignList("campaign_list");
    	
    }
    
    if(uiFieldDefinition.fieldType == "categories")
    {
    	options = getTaskCategories("categories");
    }

    if(options == null)
    	options = "";
    
    // Populate Options
    $.each(
    options, function (key, value) {
    	if(key.indexOf("*") == 0)
    	{
    		key  = key.substr(1);
    		selectOptionAttributes += "<option selected value='" + value + "'>" + key + "</option>";
    	}
    	else
        	selectOptionAttributes += "<option value='" + value + "'>" + key + "</option>";
    });
    
    //(uiFieldDefinition.required ? ("required =" + uiFieldDefinition.required) : "" )
    // Returns select option with onchange EventHandler - Naresh
    if(selectEventHandler && selectEventHandler.indexOf("insertSelectedMergeField") === 0)
    	{
           // Needed right align for Text and Html tab of Send Email node.
    	   return "<select style='position:relative;float:right;cursor:pointer;width: 116px;margin-right: -5px' onchange="+ selectEventHandler + "(this,'"+ uiFieldDefinition.target_type +"') +  name='" + uiFieldDefinition.name + "' title='" + uiFieldDefinition.title + "'" + (uiFieldDefinition.required ? ("required =" + uiFieldDefinition.required) : "" )+"> " + selectOptionAttributes + "</select>";
    	}
    
    
    if(selectEventHandler)
    	return "<select onchange="+ selectEventHandler + "(this,'"+ uiFieldDefinition.target_type +"') +  name='" + uiFieldDefinition.name + "' title='" + uiFieldDefinition.title + "' id='" + uiFieldDefinition.id + "'"+(uiFieldDefinition.required ? ("required =" + uiFieldDefinition.required) : "" )+"> " + selectOptionAttributes + "</select>";
    
  
    if(uiFieldDefinition.fieldType == "campaign_list")
    return "<select multiple name='" + uiFieldDefinition.name + "' title='" + uiFieldDefinition.title + "'"+getStyleAttribute(uiFieldDefinition.style)+(uiFieldDefinition.required ? ("required =" + uiFieldDefinition.required) : "" )+"> " + selectOptionAttributes +  "</select>";
     
	  // retun select field with name and title attributes(Yasin(14-09-10)) 
    return "<select name='" + uiFieldDefinition.name + "' title='" + uiFieldDefinition.title + "'"+(uiFieldDefinition.required ? ("required =" + uiFieldDefinition.required) : "" )+"> " + selectOptionAttributes + "</select>";
           
}

function generateMilestonesSelectUI(uiFieldDefinition)
{
	var selectContainer = $("<select name='" + uiFieldDefinition.name + "' title='" + uiFieldDefinition.title + "'> " + "</select>");
	var options = uiFieldDefinition.options;
	var selectOptionAttributes ="";
	
	// Populate Options - Naresh 29/04/2014
	if(options !== undefined)
	{
		$.each(
				options, function (key, value) {
					if(key.indexOf("*") == 0)
					{
						key  = key.substr(1);
						selectOptionAttributes += "<option selected value='" + value + "'>" + key + "</option>";
					}
					else
						selectOptionAttributes += "<option value='" + value + "'>" + key + "</option>";
				});
	 }
	
	$.ajax({
		  url: 'core/api/milestone/pipelines',
		  async: false,
		  dataType: "json",
		  success: function(data)
		  {	    			
			  // Append given options
			if(selectOptionAttributes !== undefined)
				$(selectOptionAttributes).appendTo(selectContainer);
			
			/*  var array = data["milestones"].split(',');
		$.each(array, function( index, milestone )
		{				
				if(milestone != undefined || milestone != "")
				{
    				option = "<option value='" + milestone + "'>" + milestone + "</option>";
        			// Append to container	
        			$(option).appendTo(selectContainer);	        				        								
				}											   	   	   	  	   	  				
		});*/

			//Code for Tracks -  Bhasuri 2/25/210
			//By default selects the Default track based on isTrue element
			if(options !== undefined)
				selectContainer=	selectDefaultMilestone(true,selectContainer,data);
			else 
				selectContainer=	selectDefaultMilestone(false,selectContainer,data)
		  }
	});
	
	return selectContainer;
}

//Generate milestone options - Select Any or default
function selectDefaultMilestone(isTrue,selectOptionContainer,data){
	var option = '';
	$.each(data,function(index,mile){
		var array = [];
		option+='<optgroup label="'+mile.name+'">';
		$.each(mile.milestones.split(","), function(index,milestone){
			array.push($.trim(this));
			if(isTrue)
			option+='<option value="'+mile.id+'_'+milestone+'">'+mile.name+' - '+milestone+'</option>';
			else
				{// Gets the first track of default milestone
				if(mile.isDefault && index == 0)
					option+='<option value="'+mile.id+'_'+milestone+'" selected>'+mile.name+' - '+milestone+'</option>';
				else
				option+='<option value="'+mile.id+'_'+milestone+'">'+mile.name+' - '+milestone+'</option>';
				}
		});
		option+='</optgroup>';
		$(option).appendTo(selectOptionContainer);
		option ='';
	}); 
	
	return selectOptionContainer;
}

// Generate Default UI - input, textarea and other elements
function generateDefaultUI(uiFieldDefinition) {

    var tagName = uiFieldDefinition.fieldType;

    // Attributes
    var attributes = "";
    
    //Initially checked is false(yasin(13-09-10))
    var isChecked = "false";

    // Iterate through all attributes
    for (var key in uiFieldDefinition) {
        if (uiFieldDefinition.hasOwnProperty(key)) {
        
        	if( key == "checked") {
		    	 	isChecked = "true";
	
		 //Added checked to the attributes.(yasin(13-09-10))
		    	 	attributes += " checked "; 		    	 	
					continue;
		 	}
        	
        	//style is appended at the end. Refer getStyleAttribute(styleAttributes)
        	if( key == "style")
        		continue;

        	
            attributes += (key + "=\"" + uiFieldDefinition[key] + "\" ");
        }
    }
    
    // Add checked
      /* 
	  //This is appended 'checked' for all attributes.( commented by yasin(13-09-10))
	
	  if(isChecked)
	  attributes += " checked";
	 
	  */ 
    
    // alert(tagName +":" + attributes);
    // Adds tag and attributes
	if (tagName == 'textarea')
	{
		if("text_email" == uiFieldDefinition.id )
			return ("<" + tagName + " " + attributes + " style = 'width:100%' />");
		 return ("<" + tagName + " " + attributes + " />");
	}else

    return "<" + tagName + " " + attributes + getStyleAttribute(uiFieldDefinition.style)+"/>";

}
//Bhasuri 
function getStyleAttribute(styleAttributes)
{
	if(styleAttributes == undefined)
		return " style='width:75%'";
	
	var style=" style='";
	$.each(
			styleAttributes, function (key, value){
				style+=key+":"+value+";";
			} );
	
		return style+"'";
	}

function loadTinyMCE(name)
{
	var strWindowFeatures = "height=650, width=800,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes";
	var newwindow = window.open('cd_tiny_mce.jsp?id=' + name,'name',strWindowFeatures);
	if (window.focus)
	{
		newwindow.focus();
	}
	return false;
	
}

function load_email_templates(subtype)
{
	// If not empty, redirect to tinymce
	if($('#tinyMCEhtml_email').val() !== "")
	{
		loadTinyMCE("tinyMCEhtml_email");
		return;
	}
	
	var strWindowFeatures = "height=650, width=800,menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes";
	var new_window;
	if(subtype != undefined)
		new_window = window.open('templates.jsp?id=tinyMCEhtml_email&t=email&subtype='+subtype, 'name',strWindowFeatures);
	
	else
		new_window = window.open('templates.jsp?id=tinyMCEhtml_email&t=email', 'name',strWindowFeatures);
	
	if(window.focus)
		{
		new_window.focus();
		}
	
	return false;
}

function tinyMCECallBack(name, htmlVal)
{
	$('#' + name).val(htmlVal);
}

//Generate Select UI
function generateHTMLEditor(uiFieldDefinition, container) {
		
	var textAreaName = uiFieldDefinition.name;
	
	var value = "";
	if(uiFieldDefinition.value != undefined)
		value = uiFieldDefinition.value;

	var htmlDiv = "<label>HTML: <a href='#' onclick='load_email_templates(); return false;'>(Select a Template / Load from Editor)</a></label><br/><br/> ";
	
	htmlDiv += "<textarea  id='tinyMCE" + textAreaName +"' name='" + textAreaName + "' style='width:100%' rows='13' cols='75'>" + value + "</textarea> ";		
	htmlDiv += "<div style='clear:both;'></div><br/><p style='margin: 0;position: relative;top: 20px;'><i>You can leave empty if you do not wish to send html emails. Plain text emails would be sent. Only HTML emails would be tracked.</i></p>";	

	$(htmlDiv).appendTo(container);	
}

function generatrTemplates(uiFieldDefinition, container) {
	
	var textAreaName = uiFieldDefinition.name;
	
	var value = "";
	if(uiFieldDefinition.value != undefined)
		value = uiFieldDefinition.value;

	var htmlDiv = "<select style='position:relative;float:right;cursor:pointer;margin-right: 10px;'><option value='agile_templates'>Agile Templates</option><option value='user_templates'>User Templates</option><option value='campaign_templates'>Agile Templates</option></select>";
	
	/*if(uiFieldDefinition.style)
		htmlDiv += "<textarea  id='tinyMCE" + textAreaName +"' style='width:100%' name='" + textAreaName + "' rows='13' cols='75'>" + value + "</textarea>";		
	else*/
	$(htmlDiv).appendTo(container);	
}


function addLabel(text, container, inputType)
{
    
	if(text == undefined || text == '')
		return;
		
	// Add colon if 'dot' does not exist.(yasin(13-09-10))	
	if(text.indexOf(".") == -1)
	
	// Add colon if does not exist.(yasin(13-09-10))	
			if(text.indexOf(":") == -1)
				text += ": "; 
	
	// Original text is stored for later translation		
     
	// Apply style to textarea label(Yasin(14-09-10))  
    if(inputType=="textarea")
    
     var label = "<label>" + text + " </label>";
    

   // Apply style to checkbox & radio label(Yasin(14-09-10)) 
     else if(inputType=="checkbox" ||inputType=="radio")
	    {
	    	text = text.replace(":"," ");
	    	
	    	label = "<label style='padding-left:5px;'>" + text + " </label>";
	    }
	else  
           label = "<label>" + text + " </label>";
   
			$(label + "<br/>").appendTo(container);
}


// Twitter has popup
function openTwitter()
{
	var newwindow = window.open('cd_twitter.jsp','twitter','height=700,width=700,location=1');
	if (window.focus)
	{
		newwindow.focus();
	}

	// to work in firefox, commented return false statement.
	//return false;
}

function popupTwitterCallback(token, tokenSecret, account, profileImgUrl)
{
	$('#twitter_token_secret').val(tokenSecret);
	$('#twitter_token').val(token);
	$('#twitter_account').val(account);
	$('#twitter_profile_img_url').attr("src",profileImgUrl);
}

// Iteratator for generating UI Fields
function _generateUIFields(selector, ui) {

	// Original Definition
	var originalDefinition = ui["org"];

	ui = ui["ui"];
    // Build each field
    var length = ui.length;
    for (var i = 0; i < length; i++) {

        // Field
        var uiFieldDefinition = ui[i];
        if (uiFieldDefinition == undefined) continue;

		
        var tab;
         
        if(originalDefinition != undefined)
        	tab = getTab(selector, uiFieldDefinition.category, originalDefinition["ui"][i].category);
        else
        	tab = getTab(selector, uiFieldDefinition.category);

        // Add a container
        var containerID = "container" + i;
        var container = "<div id=\"" + containerID + "\" class='uicontainer'></div>";
        $(container).appendTo(tab);
        var container = tab.find("#" + containerID);
                        
        
        // Label
        if (uiFieldDefinition.fieldType == "label") {
        	addLabel(uiFieldDefinition.label, container);
            continue;
        }

        if (uiFieldDefinition.fieldType == "button") {
            continue;
        }

        var uiField = undefined;
        var uiFieldType = uiFieldDefinition.fieldType;
        var uiInputType = uiFieldDefinition.type; 
       
        if (uiFieldType == undefined) uiFieldType = uiFieldDefinition.type;


        // Grid
        if (uiFieldType == "audiogrid") {
             addLabel(uiFieldDefinition.label, container);
            uiField = generateAudioGrid(container, uiFieldDefinition);
            continue;
        }


        // Audio Grid
        if (uiFieldType == "grid") {
		    addLabel(uiFieldDefinition.label, container);
            uiField = generateGridUI(container, uiFieldDefinition);
            continue;
        }

        // Options
        if (uiFieldType == "select" || uiFieldType == "timezone") {
            addLabel(uiFieldDefinition.label, container);
            uiField = generateSelectUI(uiFieldDefinition,uiFieldDefinition.select_event_callback);
            $(uiField).appendTo(container);
            continue;
        }
        
        // Options
        if (uiFieldType == "dynamicselect") {
            addLabel(uiFieldDefinition.label, container);
            uiField = generateDynamicSelectUI(uiFieldDefinition);
            //console.log(uiField);
            uiField.appendTo(container);
            continue;
        }
        
        // HTML Grid
        if (uiFieldType == "html") {
            //addLabel(uiFieldDefinition.label, container);
            
            generateHTMLEditor(uiFieldDefinition, container);
            continue;
        }

        // Radio
        if (uiFieldType == "radio") {
	    
            continue;
        }

        // Slider				
        if (uiFieldType == "slider") {
            continue;
        }
        // MergeFields Select Option - Naresh
        if(uiFieldType == "merge_fields")
        {
           addLabel(uiFieldDefinition.label, container);
          
           // Target element to insert merge field on option selected
           if("target_type" in uiFieldDefinition)
        	   uiField = generateSelectUI(uiFieldDefinition,"insertSelectedMergeField");
           
           else
        	   uiField = generateSelectUI(uiFieldDefinition);
           
           $(uiField).appendTo(container);
           continue;
        }
        
        //update contacts
        if(uiFieldType == "update_field")
        {
           addLabel(uiFieldDefinition.label, container);
          
           
           uiField = generateSelectUI(uiFieldDefinition);
           
           $(uiField).appendTo(container);
           continue;
        }
        
        if(uiFieldType == "html_template")
        {
        	generatrTemplates (uiFieldDefinition, container);
            continue;
        }
        
        if(uiFieldType == "milestones")
        {
        	addLabel(uiFieldDefinition.label, container);
        	
        	uiField = generateMilestonesSelectUI(uiFieldDefinition);
        	$(uiField).appendTo(container);
        	
        	continue;
        }
        
        // Checkbox
        
        // if (uiFieldType == "input" && uiFieldDefinition.checked != undefined) {
        
        //Checking the Checkbox and Radio buttons.(yasin(13-09-10))
        
         if (uiFieldType == "input" && (uiInputType == "checkbox" || uiInputType == "radio" || uiInputType == "button")) {
        	// Else Input, textarea, button
        	 if(uiFieldDefinition.id == "button_email")
        		 $("<br>").appendTo(container);
	        if (uiField == undefined) 
	        
	        uiField = generateDefaultUI(uiFieldDefinition);
	      
        	  $(uiField).appendTo(container);
        	  
        	if(uiFieldDefinition.id == "button_email" || uiFieldDefinition.id == "button_email_html") 
        		 $("<div style='clear:both'></div>").appendTo(container);
			 //Add label to the checkbox and radio buttons(yasin(13-09-10))
        	
             addLabel(uiFieldDefinition.label, container,uiInputType);   
            continue;        
        }
        
        // Textarea
        if (uiFieldType == "textarea") {
        
			addLabel(uiFieldDefinition.label, container,uiFieldType);
			if (uiField == undefined) 
        		uiField = 	generateDefaultUI(uiFieldDefinition);
        		
			// Adding default value to textarea (Yasin(14-09-10))
        		 uiField = uiField.replace("/","");
        	     
        		 if(uiFieldDefinition.value != undefined)
        			 uiField += uiFieldDefinition.value+"</textarea>";
        		 else
        			 uiField += "</textarea>";
        	             
        	         // container.append(uiField); 
        	      $(uiField).appendTo(container);
			
			//$(uiField).removeAttr('value').text(uiFieldDefinition.value).appendTo(container);				                                                               
            continue;               
                
        }
        
        if(uiFieldType == "incoming_list")
        {
           addLabel(uiFieldDefinition.label, container);
          
           
           uiField = generateSelectUI(uiFieldDefinition);
           
           $(uiField).appendTo(container);
           continue;
        }
        
        if(uiFieldType == "twilio_incoming_list")
        {
           addLabel(uiFieldDefinition.label, container);
          
           
           uiField = generateSelectUI(uiFieldDefinition);
           
           $(uiField).appendTo(container);
           continue;
        }
        
        if(uiFieldType == "campaign_list")
        {
           addLabel(uiFieldDefinition.label, container);
          
           
           uiField = generateSelectUI(uiFieldDefinition);
           
           $(uiField).appendTo(container);
           continue;
        }
        
        if(uiFieldType == "datePicker")
        {
           addLabel(uiFieldDefinition.label, container);
          
           uiField = generateSelectUI(uiFieldDefinition);
           
           $(uiField).appendTo(container);
           continue;
        }
        
        if(uiFieldType == "anchor")
        {
        	uiField = generateAnchorUI(uiFieldDefinition);
        	
        	$(uiField).appendTo(container)
        	continue;
        }
        
        if(uiFieldType == "categories")
        {
           addLabel(uiFieldDefinition.label, container);
          
           
           uiField = generateSelectUI(uiFieldDefinition);
           
           $(uiField).appendTo(container);
           continue;
        }

        
        // Else Input, textarea,		                
        addLabel(uiFieldDefinition.label, container);
        if (uiField == undefined) 
        uiField = 	generateDefaultUI(uiFieldDefinition);

        $(uiField).appendTo(container);


    }

}


function generateAnchorUI(uiFieldDefinition)
{
	var style = "style=''", href="#";

	if(uiFieldDefinition.href)
		href = uiFieldDefinition.href;
	
	if(uiFieldDefinition.style)
		style = getStyleAttribute(uiFieldDefinition.style);

	if(uiFieldDefinition.event)
		return "<a href='"+href+"'" + " " + style + " " + uiFieldDefinition.event+"='"+uiFieldDefinition.callback+";return;'>"+uiFieldDefinition.text+"</a>";

	return "<a href='"+href+"'"  + " " + style+">"+uiFieldDefinition.text+"</a>";
}

// Constructs the UI elements from nodeDefinition. IF UI key is elements, it constructs tabs based on categories and add elements 
// Automatically


function constructUI(selector, uiDefinition) {

    // Iterate through all json keys
    for (var key in uiDefinition) {
        if (uiDefinition.hasOwnProperty(key)) {

            // JSON value			
            var value = uiDefinition[key];

            // Check if UI 
            if (key == "ui") {
                _generateUIFields(selector, uiDefinition);
                continue;
            }
            
            // Top level
            // Replace all #key text values			
            var field = selector.find('#' + key);
            // if not found, skip
            if ((field == undefined) || (field.length == 0)) {
                continue;
            }

            if (field.is('img')) field.attr('src', value);
            else if (field.is('input') || field.is('select')) field.val(value);
            else if(field.is('a')) field.attr('href', value);
            else if(field.is('textarea')) field.val(value);
            else field.text(value);            
        }
    }

    initGridHandlers(selector);

	//check tab count Ramesh 01/10/2010
	  
	  

  // var tabCount = selector.find(".tabs > ul > li").size();

  /*  if(tabCount ==1){

        selector.find(".tabs >ul >li").hide(); 
   } */

    // Generate Tabs
	

	 selector.find(".tabs").tabs();
    
 
  

   // select all desired input fields and attach tooltips to them``
   selector.find("input").tooltip({

       // place tooltip on the right edge
       position: "center right",

       // a little tweaking of the position
       offset: [-2, 10],

       // use the built-in fadeIn/fadeOut effect
       effect: "fade",

       // custom opacity setting
       opacity: 0.7

   }); 
   
 
  // select all desired textarea fields and attach tooltips to them(Yasin(14-09-10))
  selector.find("textarea").tooltip({

       position: "center right",

       offset: [-2, 10],

      effect: "fade",

       opacity: 0.7

   }); 
   
 // select all desired "select" fields and attach tooltips to them(Yasin(14-09-10))
   selector.find("select").tooltip({

       position: "center right",

       offset: [-2, 10],

       effect: "fade",

       opacity: 0.7

   }); 
   
  
    return;
}

// Reset UI
function resetUI(selector)
{
	     
	selector.find("input").val("");
	selector.find("select").val("");
	selector.find("textarea").val("");
	
}

//checks if the given string contains a string
function contains(string, substring){
	
	if(string == undefined || string.length == 0)
		return false;
		
	if(string.indexOf(substring) != -1)
		return true;
	return false;
}
