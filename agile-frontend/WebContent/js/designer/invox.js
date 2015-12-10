// Status text
function status(text)
{
	$(".notification2").html(text);
	$(".notification2").slideDown("slow");
	setTimeout("$('.notification2').slideUp('slow')", 5000);
}

// Init Loading
function initLoading()
{

	// Ajax Start Stop
	/*$(document)
			.ajaxStart(
					function()
					{

						// Block UI Changes (Yasin/3-09-10)

						$
								.blockUI({
									// showOverlay: false,
									centerY : true,
									overlayCSS : {
										backgroundColor : '#ffffff'
									},
									css : {
										width : '100px',
										height : '25px',
										border : 'none',
										'padding' : '10px 10px 10px 10px',
										top : ($(window).height() - 100) / 2
												+ 'px',
										left : ($(window).width() - 100) / 2
												+ 'px',
										backgroundColor : '#000',
										'-webkit-border-radius' : '10px',
										'-moz-border-radius' : '10px',
										opacity : .6,
										color : '#fff'
									},
									message : '<center><div style="padding-top:5px;" ><span style="font-weight:bold;margin-left:15px;float:left;">Loading</span><img src="ajax-loader1.gif"></img></div></center>'
								});
					}).ajaxStop($.unblockUI);*/

	// End of Block UI Changes (Yasin/3-09-10)
}

var debugging = true; // or true
if (!debugging || typeof console == "undefined")
	var console = {
		log : function()
		{
		}
	};



function deserialize()
{

		if (parent != undefined && parent.App_Workflows.workflow_json != undefined) 
		{
			var designerJSON = parent.App_Workflows.workflow_json;
			console.log("Deser");
			console.log(JSON.parse(designerJSON));
			deserializePhoneSystem(JSON.parse(designerJSON));
			
			if(parent.App_Workflows.is_disabled){
			$('#paintarea .nodeItem table>tbody').addClass("disable-iframe").removeClass("enable-iframe");
			$('#paintarea').addClass("disable-iframe").removeClass("enable-iframe");
			$('#toolbartabs').addClass("disable-iframe").removeClass("enable-iframe");
			}
		}
	
}

function initUI()
{

	initLoading();
	initToolbar(deserialize);
	initDesigner();
	
	
	$("button").button();
	


	// Theme Switcher
	/*
	 * $('#switcher').themeswitcher({ loadTheme : "Flick" });
	 */
	
	// Show Catalog
	$("#showcatalog").click(function () {
	        //showCatalog(Get_Node_Definations_Path,true,true,constructNodeFromDefinition); 
			//show all nodes in tabs (Ramesh 12/10/2010)
			showAddonsTab(); 
	    });
	
	// initTinyMCE();
	
}

function initTinyMCE()
{
	
	    tinyMCE.init({
	        mode : "none",
	        theme : "advanced"
	    });
}

$(function()
{

	initUI();
});

// Confirm when navigate away from this page(Yasin/28-09-10)
/*
 * window.onbeforeunload=unloadMess; var isloggedout=false; var newpopup=false;
 * function unloadMess(){ if(!newpopup&&!isloggedout) { var User_Message="You
 * will lose your data if you continue!" return User_Message; }else{} }
 */

