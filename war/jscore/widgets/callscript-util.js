$(function()
{
	// Filter Contacts- Clone Multiple
	$(".callscript-multiple-add").die().live('click', function(e)
	{
		e.preventDefault();
		// To solve chaining issue when cloned
		var htmlContent = $(getTemplate("callscript-rule", {})).find('tr').clone();

		scramble_input_names($(htmlContent));

		// boolean parameter to avoid contacts/not-contacts fields in form
		chainFilters(htmlContent, function()
		{

		}, false);

		// $(this).hide();
		// var htmlContent = $(this).closest("tr").clone();
		$(htmlContent).find("i.callscript-multiple-remove").css("display", "inline-block");
		$(this).siblings("table").find("tbody").append(htmlContent);
	});

	// Filter Contacts- Remove Multiple
	$("i.callscript-multiple-remove").die().live('click', function(e)
	{
		$(this).closest("tr").remove();
	});

	// Add rule from modal to widget form, show save btn , hide add rule btn
	$('.edit-callscriptrule').die().live('click', function(e)
	{
		e.preventDefault();
		console.log("In edit-callscriptrule event");
		console.log($(this));

		// Shows loading image until data gets ready for displaying
		$('#prefs-tabs-content').html(LOADING_HTML);
		
		var editRuleIndex = $(this).attr("data");
		
		// Redirect to show call script rules page
		window.location.href = "#CallScript/editrules/" + editRuleIndex;
		
		// Shows loading image until data gets ready for displaying
		$('#prefs-tabs-content').html(LOADING_HTML);
	});

	// Delete event for call script rule
	$('.delete-callscriptrule').die().live('click', function(e)
	{
		e.preventDefault();

		console.log("In delete-callscriptrule event");
		console.log($(this));

		// If not confirmed to delete, return
		if (!confirm("Are you sure to delete a rule"))
			return;

		// Remove element
		$(this).closest("tr").remove();

		// Delete rule from widget
		deleteCallScriptRule($(this).attr("data"))
	});

	// Display rule actions
	$('.row-callscriptrule').live('mouseenter', function()
	{
		$(this).find(".callscriptrule-actions").css("visibility", "visible");
	});

	// Hide rule actions
	$('.row-callscriptrule').live('mouseleave', function()
	{
		$(this).find(".callscriptrule-actions").css("visibility", "hidden");
	});
});

// Get widget and make adjustment of buttons in widget form
function adjust_form()
{
	console.log("In adjust_form");

	// Disable add rule btn
	$("#add_csrule").text("Loading...");
	$("#add_csrule").attr("disabled", true);

	// if widget is already added so display showrules and hide add rule btn
	if (isCallScriptAdded())
	{
		var ruleCount = getCallScriptRuleCount();
		if(ruleCount >0)
		  {
			$(".rule-count").html(ruleCount);
			$("#add_csrule").hide();
			$(".rule-added").show();
			$("#show_csrules").show();
		  }		
		else
			$(".no-rule-added").show();
	}
	else
		$(".no-rule-added").show();

	// Enable add rule btn
	$("#add_csrule").text('Add Rule');
	$("#add_csrule").attr("disabled", false);
}

//Check call script widget is added or not
function isCallScriptAdded()
{
	console.log("In isCallScriptAdded");

	// Get call script widget
	var callscriptWidget = App_Widgets.Catalog_Widgets_View.collection.where({ name : "CallScript" });
	console.log(callscriptWidget);

	// call script widget not added
	if (callscriptWidget[0].get("is_added") == false)
		return false;

	// call script widget added
	return true;
}

// Get widget from collection and Convert prefs in json
function getCallScriptJSON()
{
	console.log("In getCallScriptJSON");

	// Get call scrip widget
	var callscriptWidget = App_Widgets.Catalog_Widgets_View.collection.where({ name : "CallScript" });
	console.log(callscriptWidget);

	if (callscriptWidget[0].get("is_added") == false)
		return null;

	console.log(callscriptWidget[0].get("prefs"));

	// Convert prefs in json
	var callscriptPrefsJson = JSON.parse(callscriptWidget[0].get("prefs"));
	console.log("callscriptPrefsJson");
	console.log(callscriptPrefsJson);

	return callscriptPrefsJson;
}

function getCallScriptRuleCount()
{
	var prefs = getCallScriptJSON();
	return prefs.csrules.length;	
}

// Add rules in rules array to add same array in widget's prefs
function makeRule()
{
	console.log("in makeRule");

	// Get rule from form
	var json = serializeForm("callscriptruleForm");
	console.log(json);

	// Get index of edited rule
	var editRuleIndex = json.ruleindex;

	// Remove rule index from json
	delete json.ruleindex;
	console.log(json);

	// Get widget from collection and Convert prefs in json
	var callscriptPrefsJson = getCallScriptJSON();

	/*
	 * if widget is already added so get rules from widget and add new rules in
	 * array
	 */
	if (callscriptPrefsJson != null)
	{
		// Edit rule
		if (editRuleIndex != "")
			callscriptPrefsJson.csrules[editRuleIndex] = json;
		else
		// Add Rule
		{
			// Add position to rule
			json["position"] = callscriptPrefsJson.csrules.length;

			// Add rule in rules
			callscriptPrefsJson.csrules.push(json);
		}

		console.log(callscriptPrefsJson.csrules);

		return callscriptPrefsJson.csrules;
	}

	// Add position 0 to first rule
	json["position"] = 0;

	// First rule in widget
	return [json];
}

// Delete selected call script rule from widget
function deleteCallScriptRule(dltRuleIndex)
{
	console.log("deleteCallScriptRule :" + dltRuleIndex);

	// Get widget from collection and Convert prefs in json
	var callscriptPrefsJson = getCallScriptJSON();

	/*
	 * if widget is already added so get rules from widget and delete rules in
	 * array
	 */
	if (callscriptPrefsJson != null)
	{
		// Get rule from prefs
		console.log(callscriptPrefsJson.csrules[dltRuleIndex]);

		// Delete rule from widget
		callscriptPrefsJson.csrules.splice(dltRuleIndex, 1);

		console.log(callscriptPrefsJson.csrules);

		// Saves the preferences into widget with sip widget name
		save_widget_prefs("CallScript", JSON.stringify(callscriptPrefsJson), function(data)
		{
			console.log('In call script save success after delete');
			console.log(data);
		});
	}
}

// Get widget from collection and convert prefs to json before display in table.
function showCallScriptRule()
{
	console.log("in showCallScriptRule");

	// Shows loading image untill data gets ready for displaying
	$('#prefs-tabs-content').html(LOADING_HTML);

	// Get widget from collection and Convert prefs in json
	var callscriptPrefsJson = getCallScriptJSON();

	// if widget is already added so
	// Add rules to show rules page
	if (callscriptPrefsJson != null)
	{
		console.log("widget added");
		$("#prefs-tabs-content").html(getTemplate("callscript-table", callscriptPrefsJson.csrules));
		
		// Apply drag drop (sortable)
		setup_sortable_callscriptrules();
	}
}

// show add rule page with chaining
function addCallScriptRule()
{
	console.log("in addCallScriptRule");

	var contacts_filter = new Base_Model_View({ template : "callscript-rule", isNew : "true", postRenderCallback : function(el)
	{
		head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js', function()
		{
			chainFilters(el, undefined, function()
			{
				$('#prefs-tabs-content').html(el);

				// if this is first rule then set add-widget url on cancel btn
				if (!isCallScriptAdded())
				{
					$(".redirect-to-addwidget").show();
					$(".redirect-to-showrules").hide();
				}
			});
		})
	} });

	// Shows loading image until data gets ready for displaying
	$("#prefs-tabs-content").html(LOADING_HTML);
	contacts_filter.render();
}

// Get call script rule from widget and display in edit rule page
function editCallScriptRule(id)
{
	console.log("in editCallScriptRule: " + id);

	// Shows loading image until data gets ready for displaying
	$('#prefs-tabs-content').html(LOADING_HTML);

	// Get widget from collection and Convert prefs in json
	var callscriptPrefsJson = getCallScriptJSON();

	// if widget is already added
	if (callscriptPrefsJson != null)
	{
		var csrule = callscriptPrefsJson.csrules[id];

		console.log(csrule);

		csrule["ruleindex"] = id;

		console.log(csrule);

		$("#prefs-tabs-content").html(LOADING_HTML);
		head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js', function()
		{
			$("#prefs-tabs-content").html(getTemplate("callscript-rule"));
			$("#prefs-tabs-content").find('#filter-settings').find("#loading-img-for-table").html(LOADING_HTML).show();
			$("#prefs-tabs-content").find('#filter-settings').find(".chained-table").hide();
			
			chainFilters($("#prefs-tabs-content"), csrule, function()
			{
				$("#prefs-tabs-content").find('#filter-settings').find("#loading-img-for-table").hide();
				$("#prefs-tabs-content").find('#filter-settings').find(".chained-table").show();
			});
			scramble_input_names($("#prefs-tabs-content").find('#filter-settings'));

			// Change heading
			$(".addLable").html(" Edit Call Script Rule");

			// Fill input tags
			$("#name").val(csrule.name);
			$("#displaytext").val(csrule.displaytext);
			$("#position").val(csrule.position);
			$("#ruleindex").val(csrule.ruleindex);			
		});
	}
}



/**
 * Sets call script rules as sortable list.
 */
function setup_sortable_callscriptrules()
{	
	$(".csr-sortable").append("<tr class='pseduo-row' style='border:none!important;'><td></td><td></td><td></td></tr>");
	// Loads jquery-ui to get sortable functionality on widgets
	head.js(LIB_PATH + 'lib/jquery-ui.min.js', function()
	{
		$(".csr-sortable").sortable(
				{		
					axis: "y" ,
					forcePlaceholderSize: true,
					placeholder:'<tr><td></td></tr>',
					handle: ".icon-move",
					containment: ".csr-sortable",
					cursor: "move",
					forceHelperSize: true,
					scroll: false,
					items: "> tr",
					helper: function(e, tr)
					{
					    var $originals = tr.children();
					    var $helper = tr.clone();
					    $helper.children().each(function(index)
					    {
					      // Set helper cell sizes to match the original sizes
					      $(this).width($originals.eq(index).width());
					    });
					    return $helper;
					}
				}).disableSelection();
				
		/*
		 * This event is called after sorting stops to save new positions of
		 * rules
		 */
		$('.csr-sortable').on("sortstop", function(event, ui) {
					
			// Get new array of rule
			getRulesNewPosition(function(newRules){
				
				// Saves new positions in widget
				saveAfterDrop(newRules);
			});			
		});		
	});
}

// Get new positioned array of rule
function getRulesNewPosition(callback)
{
	console.log("In getRulesNewPosition");
	
	var newRules = [];
	
	// Get widget from collection and Convert prefs in json
	var callscriptPrefsJson = getCallScriptJSON();

	/*
	 * Iterate through each all the rules and set each rule
	 * position and store it in array
	 */
	$('.csr-sortable > tr').each(function(index, element)
	{
		if(!$(element).hasClass("pseduo-row")){

			var old_rule_index = $(element).attr('data');
			
			console.log("old_rule_index:"+old_rule_index);

			// Get Model, model is set as data to widget element
			var rule = callscriptPrefsJson.csrules[old_rule_index];

			console.log("rule:"+rule);					
			rule["position"] = index;
			console.log("rule:"+rule);
			
			newRules.push(rule);
			console.log("newRules:"+newRules);
			
			$(element).attr('data',index);
		}
	});
	
	if (callback && typeof (callback) === "function")
		callback(newRules);	
}

// Save rules after dropped 
function saveAfterDrop(newRules)
{
 console.log("In saveAfterDrop");	
 
//Get widget from collection and Convert prefs in json
var callscriptPrefsJson = getCallScriptJSON();
 
//Add rule to pref
 callscriptPrefsJson["csrules"] = newRules;
 
 console.log("callscriptPrefsJson:"+callscriptPrefsJson);
 
 //Saves the preferences into widget with sip widget name
 save_widget_prefs("CallScript", JSON.stringify(callscriptPrefsJson), function(data)
	{
		console.log('In call script save success after drag-drop');
		console.log(data);
	});
 
}
