function agile_enable_console_logging()
{
	// Added debug dummy function

	var debugging = false; // or true
	if (typeof console === "undefined" || !debugging)
	{
		console = { log : function()
		{
		}, error : function()
		{
		} };
	}
	if (typeof (console.log) === "undefined" || !debugging)
	{
		console.log = function()
		{
			return 0;
		};
	}
	if (typeof (console.error) === "undefined" || !debugging)
	{
		console.error = function()
		{
			return 0;
		};
	}
}