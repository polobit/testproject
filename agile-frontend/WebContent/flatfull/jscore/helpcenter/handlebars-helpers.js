/**
 * Helper function to return date string from epoch time
 */
Handlebars.registerHelper('epochToHumanDate', function(format, date)
{

	if (!format)
		format = "mmm dd yyyy HH:MM:ss";

	if (!date)
		return;

	if ((date / 100000000000) > 1)
		return new Date(parseInt(date)).format(format, 0);
	
	return new Date(parseInt(date) * 1000).format(format);
});

Handlebars.registerHelper('is_user_logged_in', function(options){

	if(IS_USER_LOGGED_IN)
		return options.fn(this);

	return options.inverse(this);
}); 

Handlebars.registerHelper('Commented_user', function(hc_user,options){
     
     if(!hc_user)
    	return options.fn(this);

 	if(!USERINFO)
 		return options.inverse(this);

 	if(hc_user.id == USERINFO.userId)    	
		
		return options.fn(this);
	
	return options.inverse(this);
});

Handlebars.registerHelper('Admin_Commented_user', function(hc_user,options){
     
 	if(!hc_user)
    	return options.fn(this);

 	if(!USERINFO)
 		return options.inverse(this);

 	if(hc_user.id == USERINFO.userId || USERINFO.role == "ADMIN")    	
		
		return options.fn(this);
	
	return options.inverse(this);
});

Handlebars.registerHelper('replace_newline_with_br', function(str, options) {

	if(!str)
		return "";

	str = str.trim();

	str = str.replace(/(?:\r\n|\r|\n)/g, '<br />');
    return str;
});
Handlebars.registerHelper('getFromName', function(fromname){
	console.log(fromname)
	var retVal = "";
	if(fromname && fromname.indexOf("<") > -1)
		retVal = fromname.replace("\"","").replace("\"","").split("<")[0];
	else
		retVal = fromname;

	return retVal;
});


