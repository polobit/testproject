// Array items to be translated
var nodesTranslations = new Array("name","info","help");
var nodesFields = new Array("label", "category");

// Init Translator
function translateNode(language)
{
	jQuery.getScript( Google_Translator_Path,
					 function()
					 {
							translate(language);
				      } );
}

function storeTranslatorLanguage(language)
{
	// Store it in cookie as next time, all translations will be done in this language by default
	createCookie('language', language, 365);			
}

function getTranslatorLanguage()
{

	var language = readCookie('language');
	return language;

}

function translate(selected)
{					
	var items = new Array();
	var itemCount = 0;
	
	// Read original JSON if present
	var nodeOriginalJSON = $("#nodeui").data('jsonDefinition');			
	if(nodeOriginalJSON.org != undefined)
		nodeOriginalJSON = nodeOriginalJSON.org;
	
	
	// If it is English, use the original one
	if(selected == "en")
	{
		if(nodeOriginalJSON != undefined)
		{
			showNewDialog(nodeOriginalJSON);			
			return;
		}
	}
			
	
	// Clone
	var nodeJSON = clone(nodeOriginalJSON);		
	nodeJSON.ui = new Array(); // Clone UI array too
	for(var i=0; i<nodeOriginalJSON.ui.length; i++)
	{		
		nodeJSON.ui[i] = clone(nodeOriginalJSON.ui[i]);
	}

	// Copy node json	
	if(nodeJSON.org == undefined)
		nodeJSON.org = 	nodeOriginalJSON;

	// Node translations
	for (var i = 0; i < nodesTranslations.length; i++)
	{
		// Get JSON value
		var itemName = nodesTranslations[i];
		var item = eval("nodeJSON." + itemName);		
		items[itemCount++] = item;
	}

	// UI elements
	var ui = nodeJSON.ui;
	var length = ui.length;
	for(var i=0; i<length; i++)
	{		
		for (var j=0; j<nodesFields.length;j++)
		{
			var itemName = nodesFields[j];
			var item = eval("nodeJSON.ui[" + i + "]." + itemName);						
			items[itemCount++] = item;
		}
	}

	console.log(items);
	
	//translate an array with `complete` callback, and source language:
	console.log("Translating to " + selected + " items " + items);
	$.translate( items, 'en', selected, {
	  complete: function(translation)
	  {
	  	console.log(translation + " <- selected" + selected);
	  	nodeJSON.language = selected;
	  	loadTranslatedContent(translation, nodeJSON);
	  }

	});

}


function clone(o) {
  function c(o) {
    for (var i in o) {
      this[i] = o[i];
    }
  }
 
  return new c(o);
}
 


function loadTranslatedContent(translations, translatedJSON)
{		
	var itemCount = 0;

	// node translations
	for (var i = 0; i < nodesTranslations.length; i++)
	{
		// Get JSON value
		var itemName = nodesTranslations[i];
		if(translations[itemCount++] != undefined)
		{		
			eval("translatedJSON." + itemName + "=\"" + translations[itemCount-1] + "\"");			
		}

	}

	// ui elements
	var ui = translatedJSON.ui;
	var length = ui.length;
	for(var i=0; i<length; i++)
	{
		for (var j=0; j<nodesFields.length;j++)
		{
			var itemName = nodesFields[j];

			if(translations[itemCount++] != undefined)
			{
				var item = eval("translatedJSON.ui[" + i + "]." + itemName + "=\"" + translations[itemCount-1] + "\"");
			}
		}
	}
		
	
	showNewDialog(translatedJSON);
	
}


function showNewDialog(json)
{
	
	if($("#nodeui").dialog( "isOpen" ))
	{
		var selected = $("#nodeui .translate").val();			
		$("#nodeui").dialog('close');
	}

	// Construct node again with new values		
	//constructNodeFromDefinition(json);	
	constructNodeFromDefinition(json, $("#nodeui").data('jsonValues'), $("#nodeui").data('nodeId'));							
					

}