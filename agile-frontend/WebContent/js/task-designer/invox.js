// Status text
function status(text) {
	$(".notification2").html(text);
	$(".notification2").slideDown("slow");
	setTimeout("$('.notification2').slideUp('slow')", 5000);
}

var debugging = true; // or true
if (!debugging || typeof console == "undefined")
	var console = {
		log : function() {
		}
	};

function deserialize() {

	if (parent != undefined && parentTaskDesignerJSON != undefined) {

		var designerJSON = parentTaskDesignerJSON;

		console.log("Deser");
		console.log(JSON.parse(designerJSON));
		deserializePhoneSystem(JSON.parse(designerJSON));
	}

}

function initUI() {

	// initLoading();
	initToolbar(deserialize);
	initDesigner();

	$("button").button();

	// Theme Switcher
	/*
	 * $('#switcher').themeswitcher({ loadTheme : "Flick" });
	 */

	// Show Catalog
	$("#showcatalog").click(function() {
		// showCatalog(Get_Node_Definations_Path,true,true,constructNodeFromDefinition);
		// show all nodes in tabs (Ramesh 12/10/2010)
		showAddonsTab();
	});

	// initTinyMCE();

}

function initTinyMCE() {

	tinyMCE.init({
		mode : "none",
		theme : "advanced"
	});
}

$(function() {

	initUI();
});

// Confirm when navigate away from this page(Yasin/28-09-10)
/*
 * window.onbeforeunload=unloadMess; var isloggedout=false; var newpopup=false;
 * function unloadMess(){ if(!newpopup&&!isloggedout) { var User_Message="You
 * will lose your data if you continue!" return User_Message; }else{} }
 */

