function constructGridPopup(uiFieldDefinition, callback, jsonValues, editRowIndex) {   
   
    // Clone the grid popup template
    var gridPopup = $('#gridpopup').clone();
    gridPopup.removeAttr('id');        

    // Store UIfielddefinition for add and edit for table definition
    gridPopup.data('ui', uiFieldDefinition);

    if(uiFieldDefinition.name == NODES_CONSTANTS.TERRITORIES)
    {
        var zones = get_zones($('#'+NODES_CONSTANTS.TERRITORIES+'-table'));

        gridPopup.data('zones', zones);

    }
        
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
                
    var $popup = gridPopup;

    // Construct dialog	
    gridPopup.dialog({
	autoOpen: true,
	title: uiFieldDefinition.label,
	open: function(event, ui) {
		$(this).css({'max-height': 500, 'overflow-y': 'auto'}); 

        // event handlers for zones
        zones_popup_handler($popup, editRowIndex, jsonValues);

	},
	modal: true,
	position: 'top',
	show: 'slide',	
	buttons: buttons	
    	});    
}


function editGrid(e, selector, rowIndex)
{

    var $form = selector.find('form');
    $form.find("[invisible=true]").attr('disabled', 'disabled');

    // Serialize the grid
    var jsonArray = $form.serializeArray();

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

    if(tableId == NODES_CONSTANTS.TERRITORIES+'-table')
    {
        var old_text = $('#' + tableId + ' tbody tr:nth-child(' + rowIndex + ')').find('td').eq(1).text();
        var updated_text = $(td).eq(1).text();

        // Update branches
        update_zones_ports($('#' + tableId), $(td), old_text, updated_text);
    }
    
    $('#' + tableId + ' tbody tr:nth-child(' + rowIndex + ')').empty().append($(td));
    
    // Hides zone condition operator - Territory node (Naresh - 03/15/2016)
    if(uiFieldDefinition.name == NODES_CONSTANTS.TERRITORIES)
    {
       hide_zone_comparator($('#'+ tableId));

       // Sort grid table
       sort_grid_table(tableId, 1, [NODES_CONSTANTS.NOMATCH]);
    }
    
    // Update global operations array so that it gets associated to ports - dynamic nodes
    /* ----------- CHECK THIS */
    if(uiFieldDefinition.type != "audiogrid")        
		addGridOperations("update", rowIndex, jsonArray, $("#nodeui").data('jsonDefinition'));	
  	
}


// Adds grid entered elements to the grid
function addToGrid(e, selector) {

    var $form = selector.find('form');

    $form.find("[invisible=true]").attr('disabled', 'disabled');

    // Serialize the grid
    var jsonArray = $form.serializeArray();
    console.log(jsonArray);

    // Create tr and add to parent table
    var tbody = "<tr>" + Edit_Delete_Column;
    
    $.each(jsonArray, function (index, json) {
        $.each(json, function (key, value) {
            if (key == "value") tbody += "<td>" + value + "</td>";
        });
    });
    tbody += "</tr>";

    selector.dialog('close');

    // Find Table and append it
    var uiFieldDefinition = selector.data('ui');
    var tableId = uiFieldDefinition.name + '-table';

    $(tbody).appendTo($('#' + tableId));

    // Row data is used to update Branches
    $('#' + tableId).find('tr:last').data("rowJson", jsonArray);

    // Hides zone condition operator - Territory node (Naresh - 03/15/2016)
    if(uiFieldDefinition.name == NODES_CONSTANTS.TERRITORIES)
    {
       hide_zone_comparator($('#'+ tableId));
       
       // Sort grid table
       sort_grid_table(tableId, 1, [NODES_CONSTANTS.NOMATCH]);
    }
    
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
        
        if(!uiElements[j].invisible)
        th += "<th class='grid_width' id='" + uiElements[j].name + "'>" + label + "</th>";


    }
    var thead = "<thead><tr class='ui-widget-header '><th style='width:12%'></th>" + th + "</tr></thead>"

    // Add and delete elements
    var addId = uiFieldDefinition.name + '-add';    
    var addHTML = "<button id='" + addId + "'>Add</button>";
    
//    if(uiFieldDefinition.name == "and_key_grid" ){
//    	addHTML +='<h1> And </h1>';
//    }
	

    // Populate Default values
    var defaultValues = uiFieldDefinition.defaultvalues;
    var tbody = "";
    if (defaultValues != undefined) {
        for (var j = 0; j < defaultValues.length; j++) {
            var row = defaultValues[j];
            // console.log(row);
            tbody += ("<tr>" + Edit_Delete_Column);
            
            $.each(row, function (key, value) {
                //if(typeof row.invisibleTd == "undefined" || !row.invisibleTd) {
                var input = "<td>" + value + "</td>";
                tbody += input;    
                //}
                
            });

            tbody += "</tr>";
        }
    }


    // Create table
    var tableId = uiFieldDefinition.name + '-table';
    if(tableId == "and_key_grid-table"|| tableId =="or_key_grid-table" ){
    	var uiFieldDiv = $("<div style='width:500px;height:100px;overflow-y:auto;margin-bottom:10px;' class='ui-widget-content ui-corner-all'></div>");
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
    else
    {
	var uiFieldDiv = $("<div style='width:550px;height:150px;overflow:auto;margin-bottom:10px;' class='ui-widget-content ui-corner-all'></div>");
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
    		constructGridPopup(uiFieldDefinition, addToGrid);           
    	});

    // Hides zones in Territory node (Naresh - 03/15/2016)
    if(uiFieldDefinition.name == NODES_CONSTANTS.TERRITORIES)
        hide_zone_comparator($('#' + tableId));

    }
}


function initGridHandlers(selector)
{

    // Delete Handler
    $(".deletegridrow").die().unbind().live('click', function(){
    
        // Verifies whether value deleted is default one
        if(isDefaultValue($(this)))
        {
            alert("Default values cannot be deleted.");
            return;
        }

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
			
            var $table = $(this).closest('table');

            // Deleted text
            var $deleted_td = $(this).closest('tr').find('td').eq(1);

			// Delete
		    $(this).closest('tr').fadeTo(400, 0, function () { 
			    $(this).remove();

                // Update ports for zones-table 
                if($table.attr('id') == NODES_CONSTANTS.TERRITORIES+'-table'){
              
                     hide_zone_comparator($table);

                     remove_deleted_port($table, $deleted_td);
                }

                
			});	
	     }
     
     });
     
     // Edit Handler
     $(".editgridrow").die().unbind().live('click', function(e){         
         
        // Verifies whether value deleted is default one
        if(isDefaultValue($(this)))
        {
            alert("Default values cannot be edited.");
            return;
        }

         var $tableId = $(this).closest('table');
	     var rowIndex = $(this).closest('tr').index();		 
	     var nodeUIDefinition = $tableId.data('ui');      
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
     	}, rowJSON, rowIndex);    
          
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
     			
                if($(eachTD).find('select').length > 0)
                {
                    columnJson["value"] = $(eachTD).find('select option:selected').val();
                }
                else
                    columnJson["value"] =  $(eachTD).text();
                
     			rowJson.push(columnJson);	     			
     		}     						 		 		
	});
	


   return rowJson;           
}

function isDefaultValue($el)
{
    var nodeUIDefinition = $el.closest('table').data('ui');

    if(nodeUIDefinition.name == NODES_CONSTANTS.TERRITORIES)
       return checkLocationDefaultValue($el);
        
}

function checkLocationDefaultValue($el)
{
    var nodeUIDefinition = $el.closest('table').data('ui');

        if(nodeUIDefinition.name == NODES_CONSTANTS.TERRITORIES)
        {
            var rowIndex = $el.closest('tr').index();

            if(rowIndex == 0)
            {
                var row_text = $el.closest('tr').find('td:nth-child(2)').text();

                if(row_text == "Nomatch")
                {
                   return true;
                }
            }
        }

    return false;
}

function hide_zone_comparator($table)
{
     var trArr = $table.find('tr');

    var cacheKeys = {};
    try
    {
        for(var i=0; i< trArr.length; i++){

            // Skip headers
            if($(trArr[i]).find('td').length == 0)
                continue;

            var txt = $(trArr[i]).find('td').eq(1).text();
            var $last_td = $(trArr[i]).find('td').eq(5);

            if(!cacheKeys[txt])
            {
                cacheKeys[txt] = true;
                
                if($last_td.find('input').length > 0)
                    $last_td.html($last_td.find('input').attr('comparator'));

                continue;
            }

            if(txt == 'Nomatch')
                continue;

            
            var zone_comparator = $last_td.text();
            $last_td.html("<input type='text' style='display:none;' comparator=\""+zone_comparator+"\" value =\""+zone_comparator+"\">");
        }
    }
    catch(err)
    {
        
    }
}

function get_zones($table)
{
    var zones = {};

   try
   {
        $table.find("tbody tr").each(function (rowIndex, eachTR) {

                var zone = $(eachTR).find('td').eq(1).text();

                if(!zones[zone])
                {
                    var condition = $(eachTR).find('td').eq(5).text();

                    zones[zone]=condition;
                }
       });
    }
   catch(err)
   {

   }

   return zones;
}

function zones_popup_handler($popup, edit_row_index, jsonValues){
    
   try
   {
        var value = jsonValues[1].value;

        if(value)
        {
            if(value != '{{location.country}}' && value != '{{location.state}}' && value != '{{location.city}}')
                value = 'CUSTOM_FIELD';

            // Make merge fields value selected
            $popup.find('[name="undefined"]').val(value).attr('selected', 'selected');

            // For New Territory node, Zone comparator is removed
            if($popup.find('[name="in_zone_compare"]').length == 0)
                return;
        }
   }
   catch(err)
   {
        console.log("Error occured in zones popup handler" + err);
   }

    var $zone_comparator = $popup.find('[name="in_zone_compare"]');
    var options = $zone_comparator.find('option');

    var $territory = $popup.find('input:first');
    var zones = $popup.data('zones');

    var first_row = true;

    $('#territories-table tbody tr').each(function(index, tr){

        if(index != 0 && index < edit_row_index)
        {
            if($territory.val() == $(tr).find('td').eq(1).text())
            {    
                first_row = false;
                return false;
            }
        }

    });


    // Make zones operator selected
    if(!first_row && zones[$territory.val()])
    {
        $zone_comparator.val(zones[$territory.val()]).attr('disabled', 'disabled');
        $zone_comparator.parent().append('<input type="hidden" name="in_zone_compare" value='+zones[$territory.val()]+'>')
    }


    $territory.focusout(function(e){
            e.preventDefault();

            var given_value = $(this).val();

            if(zones[given_value])
            {
                $zone_comparator.val(zones[given_value]).attr('disabled', 'disabled');
            }
            else
            {
                $zone_comparator.removeAttr('disabled');
                $zone_comparator.parent().find('input').remove();

                $zone_comparator.find('option').remove();
                $zone_comparator.html(options);
            }

            if($zone_comparator.attr('disabled'))
                $zone_comparator.parent().append('<input type="hidden" name="in_zone_compare" value='+zones[given_value]+'>');  
        });
}

function getPorts(nodeObject)
{

    var portsJSON = [];
    
    if(!nodeObject)
        return portsJSON;

    var ports = nodeObject.getPorts();
    
    // Removes all ports except Source
    for(var i=0; i < ports.size; i++){

        var portName = ports.get(i).properties.name;

        portsJSON.push(portName);
    }

    return portsJSON;
}

function remove_deleted_port($table, $deleted_td){
    var remove_port = true;

     var nodeId = $("#nodeui").data('nodeId');
     var nodeObject = workflow.getFigure(nodeId);

     // Returns ports
    var ports = getPorts(nodeObject);

    $table.find('tbody tr').each(function(index, tr){

            var td_text = $(tr).find('td').eq(1).text();

            if($deleted_td.text() == td_text)
            {
                remove_port = false;
                return true;
            }

    });

    if(remove_port)
    {
        removePort(nodeObject, ports.indexOf($deleted_td.text())-1);
        
        alignDynamicNodePorts(nodeObject);

        // Draw2D (based on the ports)
        nodeObject.allignDynamicNode();
    }
}

function update_zones_ports($zones_tbl, $updated_td, old_text, updated_text)
{

    if(old_text == updated_text)
        return;
    var territories = {};

    // Update text for all other rows
    $($zones_tbl).find('tbody tr').each(function(index, tr){

        var td_text = $(tr).find('td').eq(1).text();

        if(td_text == old_text)
        {
            $(tr).find('td').eq(1).text(updated_text);
        }

        // Add table's old territories
        territories[td_text] = true;
    });

    var nodeId = $("#nodeui").data('nodeId');
    var nodeObject = workflow.getFigure(nodeId);
    var ports = getPorts(nodeObject);

    // If renamed with already existing names, then remove port
    if(!territories[updated_text])
        editPort(nodeObject, ports.indexOf(old_text), updated_text);
    else
        removePort(nodeObject, ports.indexOf(old_text) - 1);

    alignDynamicNodePorts(nodeObject);

    // Draw2D (based on the ports)
    nodeObject.allignDynamicNode();
}

function sort_grid_table(table_id, sort_td_index, skip_rows)
{
    var $tbody = $('#' + table_id + ' tbody');

    $tbody.find('tr').sort(function (tr1, tr2) {
        
        var td1 = $(tr1).find('td:eq('+sort_td_index+')').text();

        // Skip sorting
        if(skip_rows.indexOf(td1) != -1)
            return 0;

        var td2 = $(tr2).find('td:eq('+sort_td_index+')').text();

        return td1 > td2 ? 1 : (td1 < td2 ? -1 : 0);

    }).appendTo($tbody);
}