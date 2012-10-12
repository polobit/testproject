function createCookie(name, value, days)
{ 
 if (days) {
  var date = new Date();
  date.setTime(date.getTime()+(days*24*60*60*1000));
  var expires = "; expires="+date.toGMTString();
 }
 else var expires = "";
 document.cookie = name+"="+escape(value)+expires+"; path=/";
}

// Reads Cookie
function readCookie(name) {

 
 var nameEQ = name + "=";
 var ca = document.cookie.split(';');
 for(var i=0;i < ca.length;i++) {
  var c = ca[i];
  while (c.charAt(0)==' ') c = c.substring(1,c.length);
  if (c.indexOf(nameEQ) == 0) return unescape(c.substring(nameEQ.length,c.length));
 }
 return null;
}

// Delete Cookie
function eraseCookie(name) {
//name = WidgetId + "-" + name; // Not required as ceratetcookie is called again.
	createCookie(name,"",-1);
}