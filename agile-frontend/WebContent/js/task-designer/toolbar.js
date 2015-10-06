// Download nodes and construct toolbar
function downloadNodes(callback) {

	console.log(First_Nodes_Toolbar_Global);

	// Download the JSON files one by one
	$.each(First_Nodes_Toolbar_Global, function(index, url) {

		// Load Ajax Files
		$.ajaxq("toolbarnodes", {
			url : url,
			cache : true,
			dataType : 'json',
			success : function(data) {

				console.log(url);
				console.log(data);

				// Remove the template style and id
				var menuNode = $('#leftmenunodetemplate').clone();
				menuNode.removeAttr("id");
				menuNode.removeAttr("style");
				menuNode.attr("id", data.name);

				// Add hiddenid to show node when dropped. Any element can be
				// dropped. A hack to check if it is node.
				menuNode.attr("hiddenid", "node");

				// Add URL for translation
				data.url = url;

				menuNode.data("json", data);

				// Tooltip icons( bulb icon) for node info (Yasin/3-09-10)

				menuNode.attr("title",
						'<span class="ui-icon ui-icon-lightbulb" style="float:right;"></span>'
								+ data.info);

				// End Tooltip icons( bulb icon) for node info (Yasin/3-09-10)

				menuNode.find("#name").html(data.name);

				// Replace image src
				var image = menuNode.find("img");
				image.attr("src", data.thumbnail);

				menuNode.click(function() {
					if (!checkMaxNodesCount())
						return;
					if (!checkWorkflowSize())
						return;

					constructNodeFromDefinition(data);
				});

				// Append the template
				$(menuNode).appendTo($("#toolbar"));

				if ((index + 1) == First_Nodes_Toolbar_Global.length) {

					addDraggingCapability();

					// Add tooltips
					$("li[title]").tooltip({

						// place tooltip on the right edge
						position : "center right",

						// a little tweaking of the position
						offset : [ -2, 10 ],

						// use the built-in fadeIn/fadeOut effect
						effect : "toggle",

						delay : 0,

						// custom opacity setting
						opacity : 0.7

					});

					// Deserialize here
					if (callback)
						callback();

				}

			}
		});

	});
}

// download advanced nodes (Ramesh 24/09/2010)
function downloadAdvancedNodes() {

	// Download the JSON files one by one
	$.each(Second_Nodes_Toolbar_Global, function(index, url) {

		// Load Ajax Files
		$.ajaxq("toolbarnodes", {
			url : url,
			cache : true,
			dataType : 'json',
			success : function(data) {

				// Remove the template style and id
				var menuNode = $('#leftmenunodetemplatetab').clone();
				menuNode.removeAttr("id");
				menuNode.removeAttr("style");
				menuNode.attr("id", data.name);

				// Add hiddenid to show node when dropped. Any element can be
				// dropped. A hack to check if it is node.
				menuNode.attr("hiddenid", "node");

				// Add URL for translation
				data.url = url;

				menuNode.data("json", data);

				// Tooltip icons( bulb icon) for node info (Yasin/3-09-10)

				menuNode.attr("title",
						'<span class="ui-icon ui-icon-lightbulb" style="float:right;"></span>'
								+ data.info);

				// End Tooltip icons( bulb icon) for node info (Yasin/3-09-10)

				menuNode.find("#name").html(data.name);

				// Replace image src
				var image = menuNode.find("img");
				image.attr("src", data.thumbnail);

				menuNode.click(function() {
					if (!checkMaxNodesCount())
						return;
					if (!checkWorkflowSize())
						return;

					constructNodeFromDefinition(data);
				});

				// Append the template
				$(menuNode).appendTo("#advanced");

				if ((index + 1) == Second_Nodes_Toolbar_Global.length) {

					// alert(Second_Nodes_Toolbar_Global.length);
					addDraggingCapability();

					// Add tooltips
					$("li[title]").tooltip({

						// place tooltip on the right edge
						position : "center right",

						// a little tweaking of the position
						offset : [ -2, 10 ],

						// use the built-in fadeIn/fadeOut effect
						effect : "toggle",

						delay : 0,

						// custom opacity setting
						opacity : 0.7

					});

				}
			}
		});

	});
}

function checkMaxNodesCount() {
	var currentLimits = window.parent._billing_restriction.currentLimits;
	var campaignNodeLimit = currentLimits.campaignNodesLimit;
	if ($('#paintarea >div.contextMenuForNode').length > campaignNodeLimit) {
		window.parent.$("#workflow-edit-msg").hide();
		window.parent.$("#nodes-limit-reached").show();
		window.parent.campaignAlert("nodeLimit");
		return false;
	} else
		return true
}
// Add Dragging Capability for nodes and droppable for paintarea
function addDraggingCapability() {

	$('#designer').droppable(
			{

				drop : function(event, ui) {

					// Check if toolbar was dropped - even a modal dialog can be
					// dragged and dropped.
					// Suggested right way - add a hidden attribute for nodes
					// and check there
					if ($(ui.draggable).attr("hiddenid") == undefined
							|| $(ui.draggable).attr("hiddenid").length == 0)
						return;

					// Get jsonDefinition and add it
					var jsonDefinition = $(ui.draggable).data("json");

					if (!checkMaxNodesCount())
						return;
					if (!checkWorkflowSize())
						return;

					constructNodeFromDefinition(jsonDefinition);

				}
			});

	/*
	 * $('#toolbar') .draggable({ opacity:.5, containment: '#designer', stop:
	 * function (event, ui) { createCookie("toolbarX", ui.position.left, 100);
	 * createCookie("toolbarY", ui.position.top, 100); } });
	 */

	// Add tooltips for nodes
	$('.nodetitle').tooltip({
		// place tooltip on the right edge
		position : "center right",

		// a little tweaking of the position
		offset : [ -2, 10 ],
		delay : 0,

		// Tooltip css-style for node info (Yasin/3-09-10)

		tipClass : 'tooltip_style ui-state-highlight ui-corner-all'

	});

	// Add tooltips for nodes
	$('.nodetiletab').tooltip({
		// place tooltip on the right edge
		position : "center right",

		// a little tweaking of the position
		offset : [ -2, 10 ],
		delay : 0,

		// Tooltip css-style for node info (Yasin/3-09-10)

		tipClass : 'tooltip_style ui-state-highlight ui-corner-all'

	});

	// Add draggable for nodes
	$('.nodetitle').draggable({
		helper : 'clone',
		containment : '#designer',
		opacity : .5
	});

	// Add draggable for nodes
	$('.nodetiletab').draggable({
		helper : 'clone',
		containment : '#designer',
		opacity : .5
	});

}

// Init toolbar
function initToolbar(callback) {
	console.log("Downloading Nodes");
	// downloadNodes();
	// select tabs (Ramesh 24/09/2010)
	$('#toolbartabs').tabs({
		select : function(event, ui) {

			var id = $(ui.panel).attr('id');
			if (id == "advanced") {
				$('#toolbartabs').find('#advanced').html(" ");
				downloadAdvancedNodes();
				$('#toolbartabs').find('#advanced').css('position', '');
			}
		}
	});
	// Make it default as first tab
	$('#toolbartabs').tabs('select', 0);
	// Set to first tab
	downloadNodes(callback);
}

function checkWorkflowSize(workflowJSON) {

	if (workflowJSON == undefined)
		workflowJSON = window.frames.serializePhoneSystem();

	var bytes = [];

	var workflowLength = workflowJSON.length;

	for ( var i = 0; i < workflowLength; ++i) {
		bytes.push(workflowJSON.charCodeAt(i));
	}

	var dataSize = bytes.length / 1000000;

	if (dataSize > 0.95) {
		alert("Unable to save the campaign as it exceeds the limit of 1MB. Please consider splitting into multiple campaigns using the 'Transfer' property.");
		return false;
	} else
		return true;

}