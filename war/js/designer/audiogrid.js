// Generate Audio Grid
function generateAudioGrid(container, uiFieldDefinition) {

    var thead = "<thead><tr class='ui-widget-header '><th class='ui-corner-tl' style='width:15%'></th><th id='tts' class='invoxtable_header ui-corner-tr'>Prompt</th><th style='display:none;' id='url'>URL</th></tr></thead>";

   
    // Tbody
    var tbody = "";
    var audioTTSJSON = uiFieldDefinition.audio;
    if (audioTTSJSON != undefined) {
        for (var j = 0; j < audioTTSJSON.length; j++) {
            tbody += ("<tr>" + Edit_Delete_Column);
            // TTS					
            tbody += "<td class='ttstext'>" + audioTTSJSON[j].tts + "</td>";
            tbody += "<td style='display:none;' class='ttsurl'>" + audioTTSJSON[j].url + "</td>";
            tbody += "</tr>";
        }

    }

    // Add Play and Add TTS option
    var playId = uiFieldDefinition.name + '-play';
    var playHTML = "<button id='" + playId + "'>Play</button>";

    var addId = uiFieldDefinition.name + '-addtts';
    var addHTML = "<button id='" + addId + "'>Add Greeting</button>";

    var tableId = uiFieldDefinition.name + '-table';
    
    // Audio Grid table border changes (Yasin/3-09-10)
   var uiField = "<div class='invoxtable ui-widget-content ui-corner-all'><table class='ui-widget nodepopup' id='" + tableId + "'>" + thead + "<tbody class='ui-widget-content'>" + tbody + "</tbody></table></div>" + playHTML + addHTML;
    
    // Add name, definition to table
    $(uiField).appendTo(container).data('name', uiFieldDefinition.name).data('ui', uiFieldDefinition);	        

    // Store audioTTSJSON for JPlayer    
    $('#' + playId).button({
        icons: {
            primary: 'ui-icon-play'
        }
    }).click(function (e) {

        var options;
        e.preventDefault();
        
        // Get all the prompts and store it in json
        var mediaJSON = new Array();
        container.find("tbody tr").each(function()
        {		        	
        	console.log($(this).html());
        	var eachJSON = {};
        	// Find TTS
        	eachJSON.tts = $(this).find(".ttstext").text();
        	eachJSON.url = $(this).find(".ttsurl").text();
        	mediaJSON.push(eachJSON);
        });
           
        var json = $(this).data("audioTTS");            
        container.data('playId', playId);              
        if(mediaJSON.length > 0)  {        
           	//playMediaList(mediaJSON, container, 0);
         }
        else
        {
           	alert("Please add at least one media file.");
           	return;
        }
        

        // Toggle Play and Stop
        if ($(this).text() == 'Play') {
            options = {
                label: 'Stop',
                icons: {
                    primary: 'ui-icon-stop'
                }
            };
            
            	playMediaList(mediaJSON, container, 0);
                    	                           
            
        } else {
            options = {
                label: 'Play',
                icons: {
                    primary: 'ui-icon-play'
                }
            };
            stopMedia(container);
            // Remove the highlight
            $('#' + tableId).find("tbody .ui-state-highlight").removeClass("ui-state-highlight");

        }
        $(this).button('option', options);
    });

    // Add Greeting Option
    $('#' + addId).button({
        icons: {
            primary: 'ui-icon-circle-plus'
        }
    }).click(function (e) {
        
        $("#audiopicker").data('ui', uiFieldDefinition);
        
        // Remove row index as this is a new addition. Row Index is stored in edit.
    	$("#audiopicker").removeData('editRowIndex');
                        
        e.preventDefault();
        initAudioPicker();        
    });
}


function closeAudioPicker()
{
	$("#audiopicker").dialog('close');
}

function initAudioPicker()
{

	$('#ttspicker').button({
			  icons: {
			      primary: 'ui-icon-transferthick-e-w'
			     }
			 }).unbind('click').click(
		function(){
			closeAudioPicker();
			showTTSEditor();
		});
		
	$('#audiolibrary').button({
			  icons: {
			      primary: 'ui-icon-circle-check'
			     }
			 }).unbind('click').click(		
		function(){
			closeAudioPicker();
			downloadAudioLibraryPicker();
		});
	$('#uploadaudio').button({
			  icons: {
			      primary: 'ui-icon-arrowreturnthick-1-n'
			     }
			 }).unbind('click').click(
		function(){
			closeAudioPicker();
			showUploadAudio();
		});


	$("#audiopicker").dialog({
                title: 'Pick your selection',
				open: function(event, ui) {
					$(this).css({'max-height': 500, 'overflow-y': 'auto'}); 
				},                
                modal: true,
                position: 'top',
				width:800,
				resizable:false,
                buttons: {
                    Cancel: function () {
                        $(this).dialog('close');
                    }
                }
            });	
}


function showAudioLibraryPicker()
{

	$("#globalaudiolib").dialog({
                title: 'Audio Library',
                open: function(event, ui) {
			$(this).css({'max-height': 500, 'overflow-y': 'auto'}); 
			//check jquery player is added. if already added remove it.
			if($(this).find('#jquery_jplayer') != undefined)
				$(this).find('#jquery_jplayer').remove();
		},
                modal: true,
                position: 'top',
				width:700,
                buttons: {
                    Cancel: function () {
                        $(this).dialog('close');
                    }
                }
            });
}


function addToAudioGrid(tts, url)
{
    // Create tr
    var td = Edit_Delete_Column;
    
    alert("tts "+tts+"url "+url);

    // TTS					
    td += "<td class='ttstext'>" + tts + "</td>";
    td += "<td style='display:none;' class='ttsurl'>" + url + "</td>";    

    // Find Table and append it
    var uiFieldDefinition = $("#audiopicker").data('ui');
    var tableId = uiFieldDefinition.name + '-table';    
    
    // Get row index (Check if it is edit option)
    var rowIndex = $("#audiopicker").data('editRowIndex');        		  
	if( rowIndex != null  && rowIndex != undefined )			
	{	
		// n-th child index starts from 1
    	rowIndex++;
		$('#' + tableId + ' tbody tr:nth-child(' + rowIndex + ')').empty().append($(td));			
	}
	else {		
		// Insert new row into table
		tbody = "<tr>" + td +  "</tr>";     
    	$(tbody).appendTo($('#' + tableId));
    }
        
}

function downloadAudioLibraryPicker()
{		
    

    if( $('#globalaudiolib table tbody tr').length == 0)
    {
	    $.getJSON(Audio_Lib_Path, function(data)
	    {

			$.each(data.audio, function(index, json)
			{
			
		// Dynamic append icons to the add and play buttons in Audio Library (Yasin/3-09-10)
			
			/*	var tr = '<tr><td class="audiolib_spacing">' + json.tts + ' - ' + json.language + ' ( ' + json.gender + ') </td><td style="display:none;"> ' + json.url + '</td>';
				tr += 	  '<td align="center" class="audiolib_buttons">';
				tr += '<button class="addaudiopicker ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon" role="button" aria-disabled="false" style="margin:5px;"><span class="ui-button-icon-primary ui-icon ui-icon-circle-plus"></span><span class="ui-button-text">Add</span></button>';
				tr += '<button class="playaudiopicker ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon" role="button" aria-disabled="false"><span class="ui-button-icon-primary ui-icon ui-icon-play"></span><span class="ui-button-text">Play</span></button>';
				tr += '</td></tr>';         		    		
			*/
				var tr = $('<tr><td class="audiolib_spacing">' + json.tts + ' - ' + json.language + ' ( ' + json.gender + ') </td><td style="display:none;"> ' + json.url + '</td><td align="center" class="audiolib_buttons"><button class="addaudiopicker " style="margin:5px;">Add</button><button class="playaudiopicker">Play</button></td></tr>');
				var $tr = $(tr); 
				// set icons to the add and play buttons
			    $tr.find('button:first').button({
			             icons: {
			                 primary: 'ui-icon-circle-plus'
			             }
			             }).next().button({
			             icons: {
			                 primary: 'ui-icon-play'
			                 }
			      });
				
				
		       // end of changes Audio Library (Yasin/3-09-10)

				$tr.appendTo('#globalaudiolib table tbody');    		    		
				$tr.data('json', json);    			
				
				if( (index + 1) == data.audio.length)
				{
					
					$(".addaudiopicker").click(function(){
						// Find parent (td), parent (tr)				
						var json = $(this).closest('tr').data('json');	
						console.log(json);				
						addToAudioGrid(json.tts, json.url);									
						$("#globalaudiolib").dialog('close');					
					});
					
					$(".playaudiopicker").click(function(){
						// Find parent (td), parent (tr)
									
						var json = $(this).closest('tr').data('json');
						console.log(json.url);
						
						//play(json.url);
						//playMediaList(json.url);
						//show audio player(Ramesh(07-10-2010))
						playMedia(json.url, $('#globalaudiolib'),function(){}); 																										
					});
					showAudioLibraryPicker();									
				}
			});    	    	    	
	    });
	    
	    
	    
       }
       else
       		showAudioLibraryPicker();			
		        
}


function showUploadAudio()
{

    //alert('showUploadAudio');
	var extension = "mp3"; 		
 	var fileName = new Date().getTime() + ".png";
 	
 	loadAndUploadFile(extension, Upload_Path_User_Wav_Greetings, '', function(data)
 	{ 			
 			//addToAudioGrid('Uploaded file', fileName); 		 	
 	});     
}


function playMediaList(json, container, index)
{
       		
	   if(index >= json.length)	
	   {	   	
	   	  	container.find("tbody .ui-state-highlight").removeClass("ui-state-highlight");
	   	  		   	
	        // Toggle state
	        var playId = container.data('playId');                        
	        if(playId != undefined)
	        container.find("#" + playId).button(
	        {
                   label: 'Play',
                   icons: 
                   {
	                    primary: 'ui-icon-play'
                   }
	        });
	   	
	   		return;
	   }
	   	   
       container.find("tbody .ui-state-highlight").removeClass("ui-state-highlight");
   	   container.find("tbody > tr:nth-child(" + (index + 1) + ")").addClass("ui-state-highlight");   
   	  
   	   playMedia(json[index].url, container,function(){playMediaList(json, container, index+1)});  	   
   	  
 }      