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
		
	var selectContainer = $("<select name='" + uiFieldDefinition.name + "' title='" + uiFieldDefinition.title + "'> " + "</select>");
    
	$.ajax({
		  url: url,
		  async: false,
		  success: function(data)
		  {	    			
	    
		var array = eval (data);	      
		$.each(array, function( index, json )
		{				
				var key = eval("json." + keyField);			
				var value = eval("json." + valField);
				
				if(key != undefined && value != undefined)
				{
					var option;
					if(key.indexOf("*") == 0)
					{
						key  = key.substr(1);
    					option = "<option selected value='" + value + "'>" + key + "</option>";
    				}
    				else
        				option = "<option value='" + value + "'>" + key + "</option>";
        				
        			// Append to container	
        			$(option).appendTo(selectContainer);	        				        								
				}											   	   	   	  	   	  				
		});
		  }
	});
	
	return selectContainer;
}


// Generate Select UI
function generateSelectUI(uiFieldDefinition, selectEventHandler) {

    // Select options will be json pairs (key,values)	
    var options = uiFieldDefinition.options;
    var selectOptionAttributes = "";

    // Gets MergeFields Option object
    if(selectEventHandler !== undefined && selectEventHandler.indexOf("insertSelectedMergeField") === 0)
    	options = getMergeFields();
    	
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
    
    // Returns select option with onchange EventHandler
    if(selectEventHandler && selectEventHandler.indexOf("insertSelectedMergeField") === 0)
    	return "<select style='position:relative;float:right;cursor:pointer' onchange="+ selectEventHandler + "(this,'"+ uiFieldDefinition.target_type +"') +  name='" + uiFieldDefinition.name + "' title='" + uiFieldDefinition.title + "'> " + selectOptionAttributes + "</select>";
     
    if(selectEventHandler)
    	return "<select onchange="+ selectEventHandler + "(this,'"+ uiFieldDefinition.target_type +"') +  name='" + uiFieldDefinition.name + "' title='" + uiFieldDefinition.title + "' id='" + uiFieldDefinition.id + "'> " + selectOptionAttributes + "</select>";
    
	  // retun select field with name and title attributes(Yasin(14-09-10)) 
    return "<select name='" + uiFieldDefinition.name + "' title='" + uiFieldDefinition.title + "'> " + selectOptionAttributes + "</select>";
           
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
		 return ("<" + tagName + " " + attributes + " />");
	}else

    return ("<" + tagName + " " + attributes + " style='width:75%'/>");
}

function loadTinyMCE(name)
{
	var newwindow = window.open('cd_tiny_mce.jsp?id=' + name,'name','status=1, height=900,width=800');
	if (window.focus)
	{
		newwindow.focus();
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

	var htmlDiv = "<label>HTML: <a href='#' onclick='loadTinyMCE(\"tinyMCE" + textAreaName + "\")'>(Load in HTML Editor)</a></label><br/><br/>";	
	htmlDiv += "<textarea  id='tinyMCE" + textAreaName + "' name='" + textAreaName + "' rows='13' cols='75'>" + value + "</textarea>";		
	htmlDiv += "<br/><p><i>You can leave empty if you do not wish to send html emails. Plain text emails would be sent. Only HTML emails would be tracked.</i></p>";	

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

function popupTwitterCallback(token, tokenSecret, account)
{
	$('#twitter_token_secret').val(tokenSecret);
	$('#twitter_token').val(token);
	$('#twitter_account').val(account);
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
        if (uiFieldType == "select") {
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

        // DatePicker				
        if (uiFieldType == "datepicker") {

            continue;
        }

        // Slider				
        if (uiFieldType == "slider") {
            continue;
        }
        
      // MergeFields Select Option
        if(uiFieldType == "merge_fields")
        {
           addLabel(uiFieldDefinition.label, container);
           uiField = generateSelectUI(uiFieldDefinition,"insertSelectedMergeField");
           $(uiField).appendTo(container);
           continue;
        }
        
        // Checkbox
        
        // if (uiFieldType == "input" && uiFieldDefinition.checked != undefined) {
        
        //Checking the Checkbox and Radio buttons.(yasin(13-09-10))
        
         if (uiFieldType == "input" && (uiInputType == "checkbox" || uiInputType == "radio")) {
        	// Else Input, textarea,		                	        
	        if (uiField == undefined) 
	        
	        uiField = generateDefaultUI(uiFieldDefinition);
	      
        	  $(uiField).appendTo(container);
        	 
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
        
        // Else Input, textarea,		                
        addLabel(uiFieldDefinition.label, container);
        if (uiField == undefined) 
        uiField = 	generateDefaultUI(uiFieldDefinition);

        $(uiField).appendTo(container);


    }

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

/**
 * Inserts selected value of merge-fields into target-id field.
 * 
 * @param ele - select element.
 * @param target_id - id of target field where value should be inserted.
 * 
 **/
function insertSelectedMergeField(ele,target_id)
{
	// current value
	var curValue = $(ele).find(':selected').val();
	
	// inserts text based on cursor.
	insertAtCaret(target_id, curValue)
}

/**
 * MergeFields function to fetch all available merge-fields.
 **/
function getMergeFields()
{
	var options=
	{
		"*Add Merge Field": "",
		"First Name": "{{first_name}}",
		"Last Name": "{{last_name}}",
		"Score": "{{score}}",
		"Created Date": "{{created_date}}",
		"Modified Date": "{{modified_date}}",
		"Email": "{{email}}",
		"Company": "{{company}}",
		"Title": "{{title}}",
		"Website": "{{website}}",
		"Phone":"{{phone}}",
		"City": "{{location.city}}",
		"State":"{{location.state}}",
		"Country":"{{location.country}}",
		"Twitter Id":"{{twitter_id}}",
		"LinkedIn Id":"{{linkedin_id}}",
		"Owner Name":"{{owner.name}}",
		"Owner Email":"{{owner.email}}"
	};
	return options;
}

/**
 * Function to insert text on cursor position in textarea. It inserts 
 * the supplied text into the textarea of given id. 
 * 
 * @param textareaId - Id of textarea.
 * 
 * @param text - text to be inserted, here like merge field
 **/
function insertAtCaret(textareaId,text) {
    var txtarea = document.getElementById(textareaId);
    var scrollPos = txtarea.scrollTop;
    var strPos = 0;
    var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ? 
    	"ff" : (document.selection ? "ie" : false ) );
    if (br == "ie") { 
    	txtarea.focus();
    	var range = document.selection.createRange();
    	range.moveStart ('character', -txtarea.value.length);
    	strPos = range.text.length;
    }
    else if (br == "ff") strPos = txtarea.selectionStart;

    var front = (txtarea.value).substring(0,strPos);  
    var back = (txtarea.value).substring(strPos,txtarea.value.length); 
    txtarea.value=front+text+back;
    strPos = strPos + text.length;
    if (br == "ie") { 
    	txtarea.focus();
    	var range = document.selection.createRange();
    	range.moveStart ('character', -txtarea.value.length);
    	range.moveStart ('character', strPos);
    	range.moveEnd ('character', 0);
    	range.select();
    }
    else if (br == "ff") {
    	txtarea.selectionStart = strPos;
    	txtarea.selectionEnd = strPos;
    	txtarea.focus();
    }
    txtarea.scrollTop = scrollPos;
}


/**
 * It is onchange event callback for Url Visited url-type select option.
 * Based on two options available:
 * 1. Contains - It allows part of the text of url, the type should be text.
 * 2. Exact Match - It allows complete url.
 * 
 * @param ele - select element
 * @param target_id - id of target element where changes should affect.
 */
function url_visited_select_callback(ele, target_id)
{
    // current value
    var curValue = $(ele).find(':selected').val();
    
    var tempObj = $('<span />').insertBefore('#' + target_id);
	 
    // if 'contains' selected, make type attribute 'text'
	if(curValue === 'contains')
    {
		// replacing type attribute from url to text
		$('#' + target_id).detach().attr('type', 'text').insertAfter(tempObj).focus();
    }
     
    // if 'exact_match' selected, make type attribute 'url'
	if(curValue === 'exact_match')
    {
		// replacing type attribute to url.
		$('#' + target_id).detach().attr('type', 'url').insertAfter(tempObj).focus();
    }
	
	tempObj.remove();
}