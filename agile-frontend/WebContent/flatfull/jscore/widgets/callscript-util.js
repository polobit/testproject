var CSRCOLLECTION;

function initializeCallScriptListeners(){

    $('#prefs-tabs-content').off();
    $('#prefs-tabs-content #callscriptruleForm').off('click');
	$('#prefs-tabs-content').on('click', '#callscriptruleForm', function(e)
	 {
		 makeWidgetTabActive();
	 });
	
	// Filter Contacts- Clone Multiple
	$('#prefs-tabs-content .callscript-multiple-add').off('click');
	$('#prefs-tabs-content').on('click', '.callscript-multiple-add', function(e)
	{
		e.preventDefault();
		// To solve chaining issue when cloned
		var that = this;
		
		var  contact_fields = {};
		contact_fields['customFields'] = get_merge_fields();
		
		getTemplate('callscript-rule', contact_fields, undefined, function(template_ui){
			if(!template_ui)
				  return;

			var htmlContent = $(template_ui).find('tr').clone();
			scramble_input_names($(htmlContent));

			// boolean parameter to avoid contacts/not-contacts fields in form
			chainFilters(htmlContent, function()
			{

			}, false);

			// $(this).hide();
			// var htmlContent = $(this).closest("tr").clone();
			$(htmlContent).find("i.callscript-multiple-remove").css("display", "inline-block");
			$(that).siblings("table").find("tbody").append(htmlContent);


		}, null);
	});

	// Filter Contacts- Remove Multiple
	$('#prefs-tabs-content i.callscript-multiple-remove').off('click');
	$('#prefs-tabs-content').on('click', 'i.callscript-multiple-remove', function(e)
	{
		$(this).closest("tr").remove();
	});

	// Add rule from modal to widget form, show save btn , hide add rule btn
	$('#prefs-tabs-content .edit-callscriptrule').off('click');
	$('#prefs-tabs-content').on('click', '.edit-callscriptrule', function(e)
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
	$('#prefs-tabs-content .delete-callscriptrule').off('click');
	$('#prefs-tabs-content').on('click', '.delete-callscriptrule', function(e)
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
	$('#prefs-tabs-content .row-callscriptrule').off('mouseenter');
	$('#prefs-tabs-content').on('mouseenter', '.row-callscriptrule', function(e)
	{
		$(this).find(".callscriptrule-actions").css("visibility", "visible");
	});

	// Hide rule actions
	$('#prefs-tabs-content .row-callscriptrule').off('mouseleave');
	$('#prefs-tabs-content').on('mouseleave', '.row-callscriptrule', function(e)
	{
		$(this).find(".callscriptrule-actions").css("visibility", "hidden");
	});

	
	// On click of save button, check input and save details
	$('#prefs-tabs-content #save_prefs').off('click');
	$('#prefs-tabs-content').on('click', '#save_prefs', function(e)
	{	e.preventDefault();

		if ($(this).text() == "Saving..." || $(this).text() == "Loading...") {
			console.log("Do not hit me again " + $(this).text());
			return;
		}

		// Checks whether all input fields are given
		try {
			if (!isValidForm($("#callscriptruleForm"))) {
				return;
			}
		} catch (err) {
			return;
		}

		// Saves call script preferences in callscript widget object
		saveCallScriptWidgetPrefs();
	});
	
	$('#prefs-tabs-content').on('click', '#callscript-customField-li', function(e)
	{	
		e.preventDefault();
		var value = $(this).attr("value");
		insertValueInAt("#displaytext", value);	
	});
	
}

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
	initializeCallScriptListeners();
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
		getTemplate("callscript-table", callscriptPrefsJson.csrules, undefined, function(template_ui){
			if(!template_ui)
				  return;

			$("#prefs-tabs-content").html($(template_ui));
			initializeSubscriptionListeners();
			
			// Apply drag drop (sortable)
			setup_sortable_callscriptrules();

		}, null);
	}
	initializeCallScriptListeners();
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
	var  contact_fields = {};
	get_merge_fields(function(value){
		contact_fields['customFields'] = value;
		var add_csr = new Base_Model_View({ template : "callscript-rule", data : contact_fields,  isNew : "true", postRenderCallback : function(el)
			{
				
				head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js', function()
				{
					chainFilters(el, undefined, function()
					{
						$('#prefs-tabs-content').html(el);
						initializeSubscriptionListeners();

						// if this is first rule then set add-widget url on cancel btn
						if (!isCallScriptAdded())
						{
							$(".redirect-to-addwidget").show();
							$(".redirect-to-showrules").hide();
						}
					});
				})
			}
		
		});
		// Shows loading image until data gets ready for displaying
		$("#prefs-tabs-content").html(LOADING_HTML);
		initializeCallScriptListeners();
		add_csr.render();
	});






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
		var  contact_fields = {};
		contact_fields['customFields'] = get_merge_fields();

		$("#prefs-tabs-content").html(LOADING_HTML);
		initializeCallScriptListeners();
		
		head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js', function()
		{
					
			getTemplate('callscript-rule', contact_fields, undefined, function(template_ui){
				if(!template_ui)
					  return;
				$("#prefs-tabs-content").html($(template_ui));

				$("#prefs-tabs-content").find('#filter-settings').find("#loading-img-for-table").html(LOADING_HTML).show();
				$("#prefs-tabs-content").find('#filter-settings').find(".chained-table").hide();
				
				chainFilters($("#prefs-tabs-content"), csrule, function()
				{
					$("#prefs-tabs-content").find('#filter-settings').find("#loading-img-for-table").hide();
					$("#prefs-tabs-content").find('#filter-settings').find(".chained-table").show();
					initializeSubscriptionListeners();
					
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

			}, "#prefs-tabs-content");

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
		$('.csr-sortable').off("sortstop");
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
	$('#PrefsTab .select').removeClass('select');
	$('.add-widget-prefs-tab').addClass('select');	
}


// from widget-util.js



/**
 * Calls method in script API (agile_widget.js) to save CallScript preferences
 * in CallScript widget object
 */
function saveCallScriptWidgetPrefs() {
	$("#save_prefs").text("Saving...");
	$("#save_prefs").attr("disabled", true);

	// Retrieve and store the Sip preferences entered by the user as
	// JSON
	var callscript_prefs = makeRule();

	console.log(callscript_prefs);

	// Saves the preferences into widget with sip widget name
	save_widget_prefs("CallScript", JSON.stringify(callscript_prefs), function(
			data) {
		console.log('In call script save success');
		console.log(data);

		// Redirect to show call script rules page
		window.location.href = "#callscript/rules";
	});
}



/**
 * Shows setup if user adds call script widget for the first time or clicks on
 * reset icon on call script panel in the UI
 * 
 */
function callscript_save_widget_prefs() {
	
}



function build_custom_widget_form(el)
{
	var divClone;
	
    $('#prefs-tabs-content').off('click', '#add-custom-widget');
	$('#prefs-tabs-content').on('click', '#add-custom-widget', function(e)
	{
		$('#custom-widget-btn').removeClass('open');
		divClone = $("#custom-widget").clone();
		var widget_custom_view = new Base_Model_View({ url : "/core/api/widgets/custom", template : "add-custom-widget", isNew : true,
			postRenderCallback : function(el)
			{
				console.log('In post render callback');
				console.log(el);
                
				$('#custom-widget').off('change').on('change', '#script_type', function(e)
				{
					var script_type = $('#script_type').val();
					if (script_type == "script")
					{
						$('#script_div').show();
						$('#url_div').hide();
						return;
					}

					if (script_type == "url")
					{
						$('#script_div').hide();
						$('#url_div').show();
					}
				});

			}, saveCallback : function(model)
			{
				console.log('In save callback');

				console.log(model);

				if (model == null)
					alert("A widget with this name exists already. Please choose a different name");

				App_Widgets.Catalog_Widgets_View.collection.add(model);
				$("#custom-widget").replaceWith(divClone);
			} });

		$('#custom-widget', el).html(widget_custom_view.render(true).el);
		
		// Is Custom widget for all.
		if(!($(this).hasClass('add_to_all'))){
			isForAll = false;
		}

		$('#custom_isForAll').val(isForAll);
		
        $('#prefs-tabs-content').off('click', '#cancel_custom_widget');
		$('#prefs-tabs-content').on('click', '#cancel_custom_widget', function(e)
		{
			// Restore element back to original
			$("#custom-widget").replaceWith(divClone); 
		});
	});
}

//It will insert the value at the cursor point of the given element(textarea)
function insertValueInAt(element,text){
    var txtarea = $(element);
    
    var currentValue = txtarea.val();
    //javascript code to know the browser
    var browser = document.selection ? "ie" : "other" ;
    var scrollPos = txtarea.scrollTop;
    var strPos = 0;
    
    if (browser == "ie") { 
        txtarea.focus();
        var range = document.selection.createRange();
        range.moveStart ('character', -txtarea.value.length);
        strPos = range.text.length;
    }else{
    	strPos = txtarea.prop("selectionStart");
    }
    
    var front = (currentValue).substring(0,strPos);  
    var back = (currentValue).substring(strPos,currentValue.length); 
    var newValue = front+text+back;
    txtarea.val(newValue);
    
    strPos = strPos + text.length;
    
    if (browser == "ie") { 
        txtarea.focus();
        var range = document.selection.createRange();
        range.moveStart ('character', -txtarea.value.length);
        range.moveStart ('character', strPos);
        range.moveEnd ('character', 0);
        range.select();
    }else{
    	txtarea.prop("selectionStart",strPos);
    	txtarea.prop("selectionEnd",strPos);
        txtarea.focus();
    }
    txtarea.scrollTop = scrollPos;
    
	
}
