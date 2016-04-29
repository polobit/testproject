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