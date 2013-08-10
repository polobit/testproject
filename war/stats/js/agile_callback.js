function agile_json(URL, callback, data)
{
	var ud = 'json' + (Math.random() * 100).toString().replace(/\./g, '');
	window[ud] = function(o)
	{
		callback && callback(o);
	};
	document.getElementsByTagName('body')[0].appendChild((function()
	{
		var s = document.createElement('script');
		s.type = 'text/javascript';
		s.src = URL.replace('callback=?', 'callback=' + ud);
		return s;
	})());
	if (callback && typeof(callback) === "function"){
		callback(data);
	}
}