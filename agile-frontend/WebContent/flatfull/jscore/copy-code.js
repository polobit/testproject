function initZeroClipboard(id, source) {

	 try {
	
		  ZeroClipboard.setDefaults({
		   moviePath : '/lib/zeroclipboard/ZeroClipboard.swf',
		   allowScriptAccess : "always"
		  });
		
	 } catch (e) {
		  // TODO: handle exception
		  console.log(e);
		  return false;
	 }
	
	 // Script code
	 var scriptCode = $('#' + source).text();
	
	 var clip = new ZeroClipboard();
	 clip.glue(document.getElementById(id));
	
	 clip.setText(scriptCode);
	
	 // Set id
	 clip.options.id = id;
	
	 // Set data to clickable element
	 $("#" + id).attr("data-clipboard-text", scriptCode);
	
	 clip.on('complete', function(client, args) {
		 
		  var id = $(this).attr("id");
		  
		  var script_tooltip_timing = function() {
			  $("#" + id).tooltip('hide').removeAttr('data-original-title');
		  };
		  
		  var timeOutHandler = setTimeout(script_tooltip_timing, 500);
		  
		  window.clearTimeout(timeOutHandler);
		  if (!id) {
		   return false;
		  }
		
		  var title = getTitleForClip(id);
		
		  // Show tooltip on complete
		  $("#" + id).attr({
		   "data-placement" : 'bottom',
		   "data-original-title" : title
		  });
		
		  $("#" + id).tooltip('show').off('mouseenter mouseleave');
		
		  timeOutHandler = setTimeout(script_tooltip_timing, 2000);
	
	 });

}


function initZeroClipboard2($id, $source){

	var clip = new ZeroClipboard($id);
 
    clip.on("ready", function(e) {
        $id.data("placement", "top").attr("title", "Copy to clipboard").tooltip();
    });
 
    clip.on("copy", function(e) {
        clip.setText($source.attr("data-clipboard-text"));
    });
 
    clip.on("aftercopy", function(e) {

    	var txt = $id.attr("data-copied-text") ? $id.attr("data-copied-text") : 'Copied!';
    	
        $id.attr("title", txt).tooltip("fixTitle").tooltip("show").attr("title", "Copy to clipboard").tooltip("fixTitle");
    });
 
    clip.on("error", function(e) {
        $id.attr("title", e.message).tooltip("fixTitle").tooltip("show");
    });
}

function getTitleForClip(id) {

 var title = "Code copied to clipboard";
 switch (id) {
 case "copy_email_to_clip_button":
  title = "Email copied to clipboard";
  break;
 case "api_key_code_icon":
  title = "Key copied to clipboard";
  break;
 case "popup_clip_button":
  title = "Code copied to clipboard";
  break;
 case "url_clip_button":
  title = "URl copied to clipboard";
  break;
 }

 return title;

}
