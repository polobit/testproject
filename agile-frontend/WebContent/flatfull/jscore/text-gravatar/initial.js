$(function ($) {
	
    $.fn.initial = function (options) {

        // Defining Colors
        var colors = ["#1abc9c", "#16a085", "#f1c40f", "#f39c12", "#2ecc71", "#27ae60", "#e67e22", "#d35400", "#3498db", "#2980b9", "#e74c3c", "#c0392b", "#9b59b6", "#8e44ad", "#bdc3c7", "#34495e", "#2c3e50", "#95a5a6", "#7f8c8d", "#ec87bf", "#d870ad", "#f69785", "#9ba37e", "#b49255", "#b49255", "#a94136"];

        return this.each(function () {

            var e = $(this);
            var settings = $.extend({
                // Default settings
                name: 'Name',
                charCount: 1,
                textColor: '#ffffff',
                height: 100,
                width: 100,
                fontSize: 60,
                fontWeight: 400,
                fontFamily: 'HelveticaNeue-Light,Helvetica Neue Light,Helvetica Neue,Helvetica, Arial,Lucida Grande, sans-serif'
            }, options);

            // overriding from data attributes
            settings = $.extend(settings, e.data());

            settings.name = "" + settings.name;
            // making the text object
            var c = settings.name.substr(0, settings.charCount).toUpperCase();
            var cobj = $('<text text-anchor="middle"></text>').attr({
                'y': '50%',
                'x': '50%',
                'dy' : '0.35em',
                'pointer-events':'auto',
                'fill': settings.textColor,
                'font-family': settings.fontFamily
            }).html(c).css({
                'font-weight': settings.fontWeight,
                'font-size': settings.fontSize+'px',
            });

            var colorIndex = null;
            if(c.length > 1)
            	colorIndex = Math.abs(Math.floor((((c.charCodeAt(0) - 65) + (c.charCodeAt(1) - 65))/2)  % colors.length));
            else
            	colorIndex = Math.abs(Math.floor((c.charCodeAt(0) - 65) % colors.length));

            var svg = $('<svg></svg>').attr({
                'xmlns': 'http://www.w3.org/2000/svg',
                'pointer-events':'none',
                'width': settings.width,
                'height': settings.height
            }).css({
                'background-color': colors[colorIndex],
                'width': settings.width+'px',
                'height': settings.height+'px'
            });

            svg.append(cobj);
           // svg.append(group);
            var svgHtml = window.btoa(unescape(encodeURIComponent($('<div>').append(svg.clone()).html())));

            e.attr("src", 'data:image/svg+xml;base64,' + svgHtml);

        })
    };

});


function image_error(element)
{
		var name = $(element).attr("_data-name");
		
		if(!name)
			return;
		$(element).attr("data-name", name);
		$(element).initial({charCount: 2, fontWeight : 'normal'});
}

function image_load(element)
{
	//alert(element);
	var name = $(element).attr("_data-name");
	var src = $(element).attr('src');
	
	if(!src)
		{
			$(element).attr('src', DEFAULT_GRAVATAR_url);
			return;
		}
	
	if(src.indexOf(DEFAULT_GRAVATAR_url) >= 0)
		{
			$(element).attr("data-name", name);
			$(element).removeAttr("onLoad");
			//$(element).initial({charCount: 2, fontWeight : 'normal'});
		}
}

