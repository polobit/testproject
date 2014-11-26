$(function()
{
	// Need to call openTwitter function in ui.js for Oauth.
	head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js', function()
	{
	});	
	
	// Add ule from modal to widget form, show save btn , hide add rule btn
	$("#add_callscriptrule").die().live('click', function(e)
	{
		e.preventDefault();
		console.log("In add_callscriptrule event");

		// Checks whether all input fields are given
		if (!isValidForm($("#callscriptruleForm")))
		{
			return;
		}

		// Get data from form elements
		var formData = jQuery(callscriptruleForm).serializeArray();
		var json = {};

		// Convert into JSON
		jQuery.each(formData, function()
		{
			json[this.name] = this.value || '';
		});

		console.log("json: ");
		console.log(json);

		// Hide csr modal
		$('#callscriptruleModal').modal('hide');

		// If editing rule so hide old rule from table
		if (json.rule_index != "")
			$('.row-callscriptrule[data=' + json.rule_index + ']').hide();

		$("#csr_fields").show();
		$("#csr_name").val(json.name);
		$("#csr_display_text").val(json.displaytext);
		$("#edit_rule_index").val(json.rule_index);

		// Show save btn
		$("#add_rules").hide();
		$("#save_prefs").show();
	});

	// Add rule from modal to widget form, show save btn , hide add rule btn
	$('.edit-callscriptrule').die().live('click', function(e)
	{
		e.preventDefault();
		console.log("In edit-callscriptrule event");
		console.log($(this));

		/*
		 * One time user can edit only one rule. Already edited one rule and
		 * without saving that trying to edit another rule, so make visible
		 * previous rule.
		 */
		$('.row-callscriptrule').show();

		// Hide deleted rules
		$('.deleted-callscriptrule').hide();

		var ruleIndex = $(this).attr("data");

		// If rule index is there for edit
		if (ruleIndex)
		{
			// Get widget from collection and Convert prefs in json
			var callscriptPrefsJson = getCallScriptJSON();

			// if widget is already added
			if (callscriptPrefsJson != null)
			{
				console.log(callscriptPrefsJson.rules[ruleIndex]);

				// Fill form
				deserializeForm(callscriptPrefsJson.rules[ruleIndex], $("#callscriptruleForm"));

				$("#rule_index").val(ruleIndex);

				// Show modal
				$("#callscriptruleModal").modal('show');
			}
		}
	});

	// Delete rule
	$('.delete-callscriptrule').die().live('click', function(e)
	{
		e.preventDefault();

		console.log("In delete-callscriptrule event");
		console.log($(this));

		// If not confirmed to delete, return
		if (!confirm("Are you sure to delete a rule"))
			return;

		// Add delete class
		$(this).closest("tr").addClass("deleted-callscriptrule");

		// Hide element
		$(this).closest("tr").hide();

		// Show save btn
		$("#add_rules").hide();
		$("#save_prefs").show();
	});

	// Display rule actions
	$('.row-callscriptrule').live('mouseenter', function()
	{
		$(this).find(".callscriptrule-actions").css("visibility","visible");
	});

	// Hide rule actions
	$('.row-callscriptrule').live('mouseleave', function()
	{
		$(this).find(".callscriptrule-actions").css("visibility","hidden");
	});

	// On modal hide reset the form
	$('#callscriptruleModal').live('hidden.bs.modal', 'show.bs.modal', function(e)
	{
		console.log("in callscriptruleModal hidden.bs.modal");
		// Reset all fields
		$('#callscriptruleForm').each(function()
		{
			this.reset();
		});	
	});
	
	// On modal hide reset the form
	$('#callscriptruleModal').live('shown.bs.modal', function(e)
	{
		console.log("in callscriptruleModal shown.bs.modal");		
		$("#series").chained("#mark");
		$("#CONDITION").chained("#LHS");	
		/*$("#RHS_NEW").chained("#CONDITION");	
		$("#NESTED_CONDITION").chained("#LHS");
		$("#NESTED_LHS").chained("#NESTED_CONDITION");
		$("#NESTED_RHS").chained("#NESTED_CONDITION");	*/			
	});
});

// Get widget and fill widget form
function fill_rules()
{
	console.log("In fill_rules");

	// Disable add rule btn
	$("#add_rules").text("Loading...");
	$("#add_rules").attr("disabled", true);

	// Get widget from collection and Convert prefs in json
	var callscriptPrefsJson = getCallScriptJSON();

	// if widget is already added so
	// Add rules to widget form
	if (callscriptPrefsJson != null)
		addRulesInForm(callscriptPrefsJson);

	// Enable add rule btn
	$("#add_rules").text('Add Rule');
	$("#add_rules").attr("disabled", false);
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

// Add rules in setting form
function addRulesInForm(callscriptPrefsJson)
{
	console.log("In addRulesInForm");

	$("#csr_table").show();
	$("#csr_table").html(getTemplate("callscript-table", callscriptPrefsJson.rules));
}

// Add rules in rules array to add same array in widget's prefs
function makeRule()
{
	console.log("in makeRule");

	// If editing rule so get rule index
	var editRuleIndex = $("#edit_rule_index").val();
	console.log("editRuleIndex: " + editRuleIndex);

	// Get rule from form
	var rule = { "name" : $("#csr_name").val(), "displaytext" : $("#csr_display_text").val() };
	console.log("rule");
	console.log(rule);

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
		{
			callscriptPrefsJson.rules[editRuleIndex] = rule;
			$("#rule_index").val("");
		}
		else if (rule.name != "")
			// Add Rule
			callscriptPrefsJson.rules.push(rule);

		// Check for rule deletion
		var v = $(".deleted-callscriptrule");

		if (v.length > 0)
		{			
			// How many elements removed from rules array
			var removeCounter = 0;

			// Get deleted index
			for ( var i = 0; i < v.length; i++)
			{
				// Get index from deleted rule
				var dltRuleIndex = $(v[i]).attr("data");
				console.log("dltRuleIndex: " + dltRuleIndex);

				/*
				 * Minus removed counter from index of rule to be deleted,
				 * because after each delete indexes are changed.
				 */
				dltRuleIndex -= removeCounter;
				console.log("dltRuleIndex: " + dltRuleIndex);

				// Get rule from prefs
				console.log(callscriptPrefsJson.rules[dltRuleIndex]);

				// Delete rule from widget
				callscriptPrefsJson.rules.splice(dltRuleIndex, 1);
				removeCounter++;
			}
		}

		console.log(callscriptPrefsJson.rules);
		return callscriptPrefsJson.rules;
	}
	else
		return [rule];
}
