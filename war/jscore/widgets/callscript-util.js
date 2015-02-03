var CSRCOLLECTION;

$(function()
{
	$("#callscriptruleForm").live('click', function(e)
	 {
		 makeWidgetTabActive();
	 });
	
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

		// Shows loading image until data gets ready for displaying
		$('#prefs-tabs-content').html(LOADING_HTML);
		
		var editRuleCount = $(this).attr("data");
		
		// Redirect to show call script rules page
		window.location.href = "#callscript/editrules/" + editRuleCount;
		
		// Shows loading image until data gets ready for displaying
		$('#prefs-tabs-content').html(LOADING_HTML);
	});

	// Delete event for call script rule
	$('.delete-callscriptrule').die().live('click', function(e)
	{
		e.preventDefault();
		
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
	// If Widgets collection is not defined, navigates to add widget
	if (!App_Widgets || !App_Widgets.Catalog_Widgets_View || !App_Widgets.Catalog_Widgets_View.collection)
	{	
		window.location.href = "#add-widget";
		return;
	}	
	
	// Get call script widget
	var callscriptWidget = App_Widgets.Catalog_Widgets_View.collection.where({ name : "CallScript" });

	if (callscriptWidget[0].get("is_added") == false)
		return null;

	// Convert prefs in json
	var callscriptPrefsJson = JSON.parse(callscriptWidget[0].get("prefs"));

	return callscriptPrefsJson;
}

function getCallScriptRuleCount()
{
	var prefs = getCallScriptJSON();
	return prefs.csrules.length;	
}

function createCSRCollection()
{
	var csr = getCallScriptJSON();
	CSRCOLLECTION = new Base_Collection_View({data: csr.csrules});
}

// Add rules in rules array to add same array in widget's prefs
function makeRule()
{
	// Get rule from form
	var json = serializeForm("callscriptruleForm");

	// Get index of edited rule
	var editRuleCount = json.rulecount;
	
	// Get widget from collection and Convert prefs in json
	var callscriptPrefsJson = getCallScriptJSON();

	/*
	 * if widget is already added so get rules from widget and add new rules in
	 * array
	 */
	if (callscriptPrefsJson != null)
	{
		// Edit rule
		if (editRuleCount != "")
		  {
			// Get rule index from rulecount			
			callscriptPrefsJson.csrules[getRuleIndex(callscriptPrefsJson,editRuleCount)] = json;
		  }			
		else
		// Add Rule
		{
			// Add position to rule
			json["position"] = callscriptPrefsJson.csrules.length;

			// Increment csr count
			callscriptPrefsJson["csrcount"]= callscriptPrefsJson.csrcount + 1;

			// Add csr count to rule
			json["rulecount"] = callscriptPrefsJson.csrcount;
			
			// Add rule in rules
			callscriptPrefsJson.csrules.push(json);			
		}

		return callscriptPrefsJson;
	}

	// Add position 0 to first rule
	json["position"] = 0;
	
	// Add csr count to rule
	json["rulecount"] = 1;

	// Make it define
	callscriptPrefsJson = {}; 
	
	// First rule in widget
	callscriptPrefsJson["csrules"]= [json];
	
	// First csr count
	callscriptPrefsJson["csrcount"]= 1;
	
	return callscriptPrefsJson;
}

// Delete selected call script rule from widget
function deleteCallScriptRule(dltRuleIndex)
{
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

		// Saves the preferences into widget with sip widget name
		save_widget_prefs("CallScript", JSON.stringify(callscriptPrefsJson), function(data)
		{
			console.log('In call script save success after delete');
			console.log(data);
		});
	}
	
	makeWidgetTabActive();
}

// Get widget from collection and convert prefs to json before display in table.
function showCallScriptRule()
{
	makeWidgetTabActive();

	// Shows loading image untill data gets ready for displaying
	$('#prefs-tabs-content').html(LOADING_HTML);

	// Get widget from collection and Convert prefs in json
	var callscriptPrefsJson = getCallScriptJSON();

	// if widget is already added so
	// Add rules to show rules page
	if (callscriptPrefsJson != null)
	{
		$("#prefs-tabs-content").html(getTemplate("callscript-table", callscriptPrefsJson.csrules));
		
		// Apply drag drop (sortable)
		setup_sortable_callscriptrules();
	}
}

// show add rule page with chaining
function addCallScriptRule()
{
	// If Widgets collection is not defined, navigates to add widget
	if (!App_Widgets || !App_Widgets.Catalog_Widgets_View || !App_Widgets.Catalog_Widgets_View.collection)
	{	
		window.location.href = "#add-widget";
		return;
	}
	
	makeWidgetTabActive();

	var add_csr = new Base_Model_View({ template : "callscript-rule", isNew : "true", postRenderCallback : function(el)
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
	add_csr.render();
}

// Get call script rule from widget and display in edit rule page
function editCallScriptRule(ruleCount)
{
	makeWidgetTabActive();

	// Shows loading image until data gets ready for displaying
	$('#prefs-tabs-content').html(LOADING_HTML);

	// Get widget from collection and Convert prefs in json
	var callscriptPrefsJson = getCallScriptJSON();

	// if widget is already added
	if (callscriptPrefsJson != null)
	{
		// get rule from id as in rulecount of rule
		var csrule = getRule(callscriptPrefsJson,ruleCount);

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
				
				$(".callscript-multiple-remove").show();
				$(".callscript-multiple-remove")[0].style.display = "none";
			});
			scramble_input_names($("#prefs-tabs-content").find('#filter-settings'));

			// Change heading
			$(".addLable").html(" Edit Call Script Rule");

			// Fill input tags
			$("#name").val(csrule.name);
			$("#displaytext").val(csrule.displaytext);
			$("#position").val(csrule.position);
			$("#rulecount").val(csrule.rulecount);			
		});
	}
}

//Get rule from csrules array by rulecount
function getRule(callscriptPrefsJson,ruleCount)
{
	var rules = callscriptPrefsJson.csrules;
	
	for(var i=0;i<rules.length;i++)
		{		
		 if( rules[i].rulecount == ruleCount)
			 {
			   return rules[i];
			 }
		}
}

// Get rule index from csrules array by rulecount 
function getRuleIndex(callscriptPrefsJson,ruleCount)
{
  var rules = callscriptPrefsJson.csrules;
	
  for(var i=0;i<rules.length;i++)
		{
		 if( rules[i].rulecount == ruleCount)
			 {
			   return i;
			 }
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
				saveCSRAfterDrop(newRules);
			});			
		});		
	});
}

// Get new positioned array of rule
function getRulesNewPosition(callback)
{
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
			
			// Get Model, model is set as data to widget element
			var rule = callscriptPrefsJson.csrules[old_rule_index];
			
			if(old_rule_index != index)
			  {									
				rule["position"] = index;				
				$(element).attr('data',index);					
			  }
			
			newRules.push(rule);			
		}
	});
	
	if (callback && typeof (callback) === "function")
		callback(newRules);	
}

// Save rules after dropped 
function saveCSRAfterDrop(newRules)
{
//Get widget from collection and Convert prefs in json
var callscriptPrefsJson = getCallScriptJSON();
 
//Add rule to pref
 callscriptPrefsJson["csrules"] = newRules;
 
 //Saves the preferences into widget with sip widget name
 save_widget_prefs("CallScript", JSON.stringify(callscriptPrefsJson), function(data)
	{
		console.log('In call script save success after drag-drop');
		console.log(data);
	}); 
}

// Make widget tab active
function makeWidgetTabActive()
{
	$('#PrefsTab .active').removeClass('active');
	$('.add-widget-prefs-tab').addClass('active');	
}