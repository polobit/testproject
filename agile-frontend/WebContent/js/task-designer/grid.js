function constructGridPopup(uiFieldDefinition, callback, jsonValues) {   
   
    // Clone the grid popup template
    var gridPopup = $('#gridpopup').clone();
    gridPopup.removeAttr('id');        

    // Store UIfielddefinition for add and edit for table definition
    gridPopup.data('ui', uiFieldDefinition);
        
    // Construct UI dialog from node defonition
    constructUI(gridPopup, uiFieldDefinition);
    
    gridPopup.appendTo($(this).parent());
        
    // Associate a callback    
    initValidator(gridPopup, callback);         	    	    
    
    var buttonName = "Add";    
    if(jsonValues != undefined)    
    {        
    	buttonName = "Update";    	
    	
    	// Deserialize    	
    	gridPopup.find("form").deserialize(jsonValues);
    	
    }
        
    var buttons = {};    
    buttons[buttonName] = function(){ $(this).find("form").trigger('submit'); }    
    buttons['Cancel'] = function(){ $(this).dialog('close'); } 
                
    // Construct dialog	
    gridPopup.dialog({
	autoOpen: true,
	title: uiFieldDefinition.label,
	open: function(event, ui) {
		$(this).css({'max-height': 500, 'overflow-y': 'auto'}); 
	},
	modal: true,
	position: 'top',
	show: 'slide',	
	buttons: buttons	
    	});    
}


function editGrid(e, selector, rowIndex)
{

    // Serialize the grid
    var jsonArray = selector.find('form').serializeArray();

    // Create td
    var td = Edit_Delete_Column;
    $.each(jsonArray, function (index, json) {
        $.each(json, function (key, value) {
            if (key == "value") td += "<td>" + value + "</td>";
        })
    });
    
    selector.dialog('close');
        
    // Find Table and append it
    var uiFieldDefinition = selector.data('ui');    
    var tableId = uiFieldDefinition.name + '-table';
    
    // n-th child index starts from 1
    rowIndex++;
    
   // alert($('#' + tableId + ' tbody tr:nth-child(' + rowIndex + ')').html());
    
    $('#' + tableId + ' tbody tr:nth-child(' + rowIndex + ')').empty().append($(td));
        
    // Update global operations array so that it gets associated to ports - dynamic nodes
    /* ----------- CHECK THIS */
    if(uiFieldDefinition.type != "audiogrid")        
		addGridOperations("update", rowIndex, jsonArray, $("#nodeui").data('jsonDefinition'));	
  	
}


// Adds grid entered elements to the grid
function addToGrid(e, selector) {

    // Serialize the grid
    var jsonArray = selector.find('form').serializeArray();
    console.log(jsonArray);

    // Create tr and add to parent table
    var tbody = "<tr>" + Edit_Delete_Column
    ;
    $.each(jsonArray, function (index, json) {
        $.each(json, function (key, value) {
            if (key == "value") tbody += "<td>" + value + "</td>";
        })
    });
    tbody += "</tr>";

    selector.dialog('close');

    // Find Table and append it
    var uiFieldDefinition = selector.data('ui');
    var tableId = uiFieldDefinition.name + '-table';
    $(tbody).appendTo($('#' + tableId));
    
    
    // Update global operations array so that it gets associated to ports - dynamic nodes
    /* ----------- CHECK THIS */
    if(uiFieldDefinition.type != "audiogrid")        
		addGridOperations("insert", -1, jsonArray, $("#nodeui").data('jsonDefinition'));
}

// Generate Grid UI
function generateGridUI(container, uiFieldDefinition) {

    var uiElements = uiFieldDefinition.ui;

    // Let's construct header
    var th = "";
    for (var j = 0; j < uiElements.length; j++) {
        // console.log("Grid[" + j + "] = " + uiElements[j].label);
        var label = uiElements[j].label;
        th += "<th class='grid_width' id='" + uiElements[j].name + "'>" + label + "</th>";
    }
    var thead = "<thead><tr class='ui-widget-header '><th style='width:12%'></th>" + th + "</tr></thead>"

    // Add and delete elements
    var addId = uiFieldDefinition.name + '-add';    
    var addHTML = "<button id='" + addId + "'>Add</button>";


	

    // Populate Default values
    var defaultValues = uiFieldDefinition.defaultvalues;
    var tbody = "";
    if (defaultValues != undefined) {
        for (var j = 0; j < defaultValues.length; j++) {
            var row = defaultValues[j];
            // console.log(row);
            tbody += ("<tr>" + Edit_Delete_Column);
            
            $.each(row, function (key, value) {
                var input = "<td>" + value + "</td>";
                tbody += input;
            });
            tbody += "</tr>";
        }
    }


    // Create table
    var tableId = uiFieldDefinition.name + '-table';
	var uiFieldDiv = $("<div style='width:500px;height:150px;overflow:auto;margin-bottom:10px;' class='ui-widget-content ui-corner-all'></div>");
	uiFieldDiv.appendTo(container);

    var uiField = $("<table class='ui-widget ' id='" + tableId + "'>" + thead + "<tbody>" + tbody + "</tbody></table>");
	uiField.appendTo(uiFieldDiv);

	// Add button & icon (Yasin (20-09-10))
	$(addHTML).button({
			             icons: {
			                 primary: 'ui-icon-circle-plus'
			             }
			             }).appendTo(uiFieldDiv.parent());
	

    // Add name and data to table. This will used while editing and adding
    uiField.data('name', uiFieldDefinition.name);
    uiField.data('ui', uiFieldDefinition);

    // Add handler
    $('#' + addId).click(function(e)
    	{
    		e.preventDefault();    	    
    		var uiFieldDefinition = $('#' + tableId).data('ui')
    		//alert(uiFieldDefinition);
    		constructGridPopup(uiFieldDefinition, addToGrid)
    	});
}


function initGridHandlers(selector)
{


    // Delete Handler
    $(".deletegridrow").die().unbind().live('click', function(){
    
	    if(confirm('Are you sure to delete this item?'))
	    {	
			// Update global operations array so that it gets associated to ports - dynamic nodes
			var rowIndex = $(this).closest('tr').index();
			
			// Check if it is not audio grid - global grid operations need not be stored
			/* ISSUE - FIX THIS LATER */
			/* ----------- */
			var nodeUIDefinition = $(this).closest('table').data('ui');
			if(nodeUIDefinition.type == "audiogrid") 									 							      
				addGridOperations("delete", rowIndex, null, $("#nodeui").data('jsonDefinition'));
			/* ----------- */
			
			// Delete
		    $(this).closest('tr').fadeTo(400, 0, function () { 
			    $(this).remove();
			});	

	     }
     
     });
     
     // Edit Handler
     $(".editgridrow").die().unbind().live('click', function(e){         
         
	     var rowIndex = $(this).closest('tr').index();		 
	     var nodeUIDefinition = $(this).closest('table').data('ui');      
	     var selectedTR = $(this).closest('tr'); 
	     
	     var rowJSON = serializeRow(selectedTR);
	     
	     
	    // Editing audio picker
	 	if(nodeUIDefinition.type == "audiogrid") {
			$("#audiopicker").data('ui', nodeUIDefinition);
		  	$("#audiopicker").data('editRowIndex', rowIndex);
		  	initAudioPicker();          
		  	return;
		}
     
     	constructGridPopup(nodeUIDefinition, function(e, selector){                    
     		editGrid(e, selector, rowIndex);     
     	}, rowJSON);    
          
     });
     

}




function serializeRow($row)
{


    $table = $row.closest('table');
     

     // Get Keys
     var keys = [];
     $table.find("th").each(function (index, eachTH) {		   		      		 
     		 // Index 0 is edit, delete		 
     		 keys[index] = eachTH.id;		 				 		 		 
	});
	
     
	
     // Get Column Values for deserilization	
     var rowJson = [];	
     $row.find("td").each(function (index, eachTD) {		   		      		
     		if( index != 0 ) {
     			
     			var columnJson = {};
     			columnJson["name"] =  keys[index];
     			columnJson["value"] =  $(eachTD).text();
     			rowJson.push(columnJson);	     			
     		}     						 		 		
	});
	


   return rowJson;           
}