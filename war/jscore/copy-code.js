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

 var script_tooltip_timing = function() {
  $("#" + id).tooltip('hide').removeAttr('data-original-title');
 };

 var timeOutHandler = setTimeout(script_tooltip_timing, 500);
 clip.on('complete', function(client, args) {
  var id = client.options.id;
  window.clearTimeout(timeOutHandler);
  if (!id) {
   return false;
  }

  var title = getTitleForClip(id);

  // Show tooltip on complete
  $("#" + id).attr({
   "data-placement" : 'right',
   "data-original-title" : title
  });

  $("#" + id).tooltip('show').off('mouseenter mouseleave');

  timeOutHandler = setTimeout(script_tooltip_timing, 2000);

 });

}

function getTitleForClip(id) {

 var title = "Code copied to clipboard";
 switch (id) {
 case "copy_email_to_clip_button":
  title = "Email id copied to clipboard";
  break;
 case "d_clip_button":
  title = "Code copied to clipboard";
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
